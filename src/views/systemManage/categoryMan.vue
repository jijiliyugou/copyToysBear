<template>
  <div style="position: relative; min-height: 757px">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%"
          ></el-input>
        </el-form-item>
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
          <el-button type="primary" @click="openAdd(undefined)">新增类目</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="allCateList" style="width: 100%">
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
              Number(scope.row.parentId) === 0 ? "一级菜单" : "二级菜单"
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="success"
              @click="openAdd(scope.row)"
              >新增子级</el-button
            >
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除这条菜单吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top: 20px" v-show="totalCount > pageSize">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 新增类目dialog -->
    <el-dialog
      :title="cateDialogOptions.cateDialogTitle + '类目'"
      :visible.sync="cateDialogOptions.openCateDialog"
      width="50%"
    >
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRulesForm" label-width="100px">
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="addCateForm.eName"></el-input>
        </el-form-item>
        <el-form-item label="层级">
          <el-input v-model="addCateForm.level"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addCateForm.orderSort"></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-radio-group v-model="addCateForm.enabled">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addcates">确认</el-button>
          <el-button @click="cateDialogOptions.openCateDialog = false"
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
      totalCount: 0,
      pageSize: 10,
      allCateList: [],
      formInline: {
        // 查询角色表单
        keyword: '',
        state: null,
        dateTile: null
      },
      cateDialogOptions: {
        cateDialogTitle: '新增',
        openCateDialog: false
      },
      addCateForm: {
        parentId: 0,
        name: '',
        eName: '',
        enabled: 'false',
        level: null,
        orderSort: ''
      },
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
      addCateRules: {
        name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    currentChange (page) {
      this.currentPage = page
    },
    search () {
      console.log('查询')
    },
    // 打开父级新增类目列表窗口
    openAdd (row) {
      this.addCateForm = {
        parentId: 0,
        name: '',
        eName: '',
        enabled: 'false',
        level: null,
        orderSort: ''
      }
      this.addCateForm.parentId = row ? row.id : 0
      this.cateDialogOptions.cateDialogTitle = '新增'
      this.cateDialogOptions.openCateDialog = true
    },
    // 确认新增
    async addcates () {
      const res = await this.$http.post('api/CreateProductCategory', {
        ...this.addCateForm,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      console.log(res)
    }
  },
  created () {},
  mounted () {}
}
</script>
<style scoped lang='less'>
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
</style>
