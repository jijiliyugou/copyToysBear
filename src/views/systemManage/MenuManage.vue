<template>
  <div style="position: relative; min-height: 757px">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.CompanyName"
            placeholder="输入关键字"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="激活状态搜索">
          {{ formInline.state }}
          <el-select
            v-model="formInline.state"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [
                { label: '全部', value: null },
                { label: '已激活', value: true },
                { label: '未激活', value: false }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="openAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="allAuthList" style="width: 100%">
        <el-table-tree-column
          treeKey="id"
          parentKey="parentId"
          prop="name"
          label="分类名称"
          levelKey="level"
          file-icon="icon icon-file"
          :indentSize="50"
          folder-icon="icon icon-folder"
        ></el-table-tree-column>
        <el-table-column label="级别">
          <template slot-scope="scope">
            <el-tag>{{
              scope.row.parentId === 0 ? "一级菜单" : "二级菜单"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否激活">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @click.native="switchStatus(scope.row.id)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="显示路径" prop="linkUrl"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除这条菜单吗？"
              @onConfirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top: 20px" v-show="totalCount > 10">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 新增菜单dialog -->
    <el-dialog
      :title="menuDialogOptions.menuDialogTitle + '菜单'"
      :visible.sync="menuDialogOptions.openMenuDialog"
      width="50%"
    >
      <el-form ref="form" :model="addMenuForm" label-width="100px">
        <el-form-item :label="menuDialogOptions.menuDialogTitle + '类型'">
          <el-radio-group v-model="addType" size="small">
            <el-radio label="1" border
              >{{ menuDialogOptions.menuDialogTitle }}父级</el-radio
            >
            <el-radio label="2" border
              >{{ menuDialogOptions.menuDialogTitle }}子级</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级">
          <el-select
            v-model="addMenuForm.parentId"
            placeholder="请选择"
            :disabled="addType  !==  2"
          >
            <el-option
              v-for="item in allAuthList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="addMenuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="addMenuForm.linkUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addMenuForm.orderSort"></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-radio-group v-model="addMenuForm.enabled">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMenus">确认</el-button>
          <el-button @click="menuDialogOptions.openMenuDialog = false"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      totalCount: null,
      data: [
        {
          levelKey: 1,
          parentKey: 0,
          treeKey: 1,
          'child-key': [
            {
              levelKey: 2,
              parentKey: 1,
              treeKey: 2,
              'child-key': [{ levelKey: 2 }, { parentKey: 2 }, { treeKey: 3 }]
            }
          ]
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      allAuthList: [],
      parentValue: '',
      menuPath: [],
      nameProps: {
        value: 'name',
        label: 'name'
      },
      pathProps: {
        value: 'path',
        label: 'path'
      },
      menuDialogOptions: {
        // 新增角色面板配置
        openMenuDialog: false, // 新增角色dialog
        menuDialogTitle: '新增' // 新增/编辑 角色标题
      },
      addType: '1',
      addMenuForm: {
        parentId: '',
        name: '',
        enabled: 'false',
        linkUrl: '',
        orderSort: ''
      },
      formInline: {
        // 查询角色表单
        CompanyName: '',
        state: null,
        dateTile: null
      }
    }
  },
  methods: {
    // 切换状态
    async switchStatus (id) {
      const res = await this.$http.post('/api/UpdateMenuStatus', { id })
      if (res.data.result.code === 200) {
        this.getAuth()
        this.$message.success('修改状态成功')
      } else {
        this.$message.error('修改状态失败')
      }
    },
    // 获取菜单
    async getAuth () {
      const res = await this.$http.post('/api/Auth_ModulePage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        console.log(res.data.result.item.items)
        this.allAuthList = res.data.result.item.items.map((val) => {
          return {
            ...val.parent,
            level: 0,
            children:
              val.children &&
              val.children.map((va) => {
                return {
                  ...va,
                  level: 1
                }
              })
          }
        })
        console.log(this.allAuthList)
      } else {
        this.$message.error('获取权限列表失败，请检查网络')
      }
    },
    // 新增菜单
    async addMenus () {
      var AuthUrl
      if (this.addType === 1) {
        this.addMenuForm.parentId = 0
      }
      if (this.menuDialogOptions.menuDialogTitle === '新增') {
        AuthUrl = '/api/CreateAuth_Module'
      } else if (this.menuDialogOptions.menuDialogTitle === '编辑') {
        AuthUrl = '/api/UpdateAuth_Module'
      }
      await this.$http.post(AuthUrl, this.addMenuForm)
      this.addType = '1'
      this.addMenuForm = {
        parentId: '',
        name: '',
        enabled: 'false',
        linkUrl: '',
        orderSort: ''
      }
      this.getAuth()
      this.menuDialogOptions.openMenuDialog = false
    },
    search () {},
    openAdd () {
      this.menuDialogOptions.menuDialogTitle = '新增'
      this.menuDialogOptions.openMenuDialog = true
      this.addType = '1'
      this.addMenuForm = {
        parentId: '',
        name: '',
        enabled: 'false',
        linkUrl: '',
        orderSort: ''
      }
    },
    // 编辑表格
    handleEdit (index, row) {
      this.menuDialogOptions.menuDialogTitle = '编辑'
      this.menuDialogOptions.openMenuDialog = true
      this.addType = row.parentId === '0' ? '1' : '2'
      this.addMenuForm.parentId = row.parentId
      this.addMenuForm.name = row.name
      this.addMenuForm.linkUrl = row.linkUrl
      this.addMenuForm.orderSort = row.orderSort
      this.addMenuForm.enabled = row.enabled ? 'true' : 'false'
      this.addMenuForm.id = row.id
    },
    async handleDelete (index, row) {
      const res = await this.$http.post('/api/DeleteAuth_Module', {
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除菜单成功')
        this.getAuth()
      }
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getAuth()
    }
  },
  mounted () {
    this.getAuth()
  }
}
</script>

<style lang="less" scoped>
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
</style>
