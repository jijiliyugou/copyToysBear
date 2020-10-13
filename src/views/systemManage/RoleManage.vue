<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="searchForm.keyWord"
            placeholder="输入关键字"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="激活状态搜索">
          {{ searchForm.state }}
          <el-select
            v-model="searchForm.state"
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
            v-model="searchForm.dateTile"
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
          <el-button type="primary" @click="openAddRole">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="dataList"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="enabled" label="是否激活">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="switchState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createdOn" label="新增日期" sortable>
          <template slot-scope="scope">
            {{ scope.row.createdOn.replace(/T/, " ") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              style="margin-right:10px;"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除此角色吗？"
              @onConfirm="handleDelete(scope.$index, scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;" v-show="totalCount > 10">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :total="totalCount"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 新增角色dialog -->
    <el-dialog
      :title="roleDialogOptions.roleDialogTitle"
      :visible.sync="roleDialogOptions.openRoleDialog"
      width="50%"
    >
      <el-form
        ref="form"
        style="max-height:500px;overflow: auto;"
        :rules="roleRules"
        :model="addRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="addRoleForm.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员" prop="isAdmin">
          <el-radio-group v-model="addRoleForm.isAdmin">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否激活" prop="enabled">
          <el-radio-group v-model="addRoleForm.enabled">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 拥有权限 -->
        <el-form-item label="拥有权限">
          <el-tree
            ref="refRole"
            :data="allAuthList"
            default-expand-all
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultChecked"
          ></el-tree>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="addRoleForm.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="addRoles">确认</el-button>
        <el-button @click="roleDialogOptions.openRoleDialog = false"
          >取消</el-button
        >
      </center>
    </el-dialog>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
      totalCount: null,
      currentPage: 1,
      pageSize: 10,
      setRoleRid: null, // 设置权限的id
      defaultChecked: [], // 默认选中项
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
      roleRules: {
        // 新增规则
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, message: '长度在 1 个字符以上', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        isAdmin: [
          { required: true, message: '请选择是不是超级管理员', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择是否激活', trigger: 'blur' }
        ]
      },
      defaultProps: {
        // tree配置项
        children: 'children',
        label: 'name'
      },
      searchForm: {
        // 查询角色表单
        keyWord: '',
        state: null,
        dateTile: null
      },
      addRoleForm: {
        // 新增角色表单
        isAdmin: null,
        roleName: null,
        roleCode: null,
        enabled: null,
        moduleIdList: [],
        description: null
      },
      allAuthList: [], // 所有权限列表
      dataList: [],
      roleDialogOptions: {
        // 新增角色面板配置
        openRoleDialog: false, // 新增角色dialog
        roleDialogTitle: '新增角色' // 新增/编辑 角色标题
      }
    }
  },
  methods: {
    // 修改角色状态
    async switchState (row) {
      const res = await this.$http.post('/api/UpdateRoleState', {
        id: row.id,
        enabled: row.enabled
      })
      if (res.data.result.code === 200) {
        this.$message.success('修改状态成功')
      } else {
        this.$message.error('修改状态失败，请检查网络')
      }
      this.getRoleList()
    },
    // 获取系统角色列表
    async getRoleList () {
      const fd = {
        state: this.searchForm.state,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyWord: this.searchForm.keyWord,
        CompanyType: this.searchForm.CompanyType,
        StartTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        EndTime: this.searchForm.dateTile && this.searchForm.dateTile[1]
      }
      if (!this.searchForm.dateTile) {
        delete fd.StartTime
        delete fd.EndTime
      }
      const res = await this.$http.post('/api/Auth_RolePage', fd)
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 列表查询
    search () {
      this.getRoleList()
    },
    // 打开新增角色
    openAddRole () {
      this.defaultChecked = []
      this.$nextTick(() => {
        this.$refs.refRole.setCheckedKeys([])
      })
      this.roleDialogOptions.openRoleDialog = true
      this.roleDialogOptions.roleDialogTitle = '新增角色'
      this.addRoleForm = {
        // 新增角色表单
        isAdmin: null,
        roleName: null,
        enabled: null,
        moduleIdList: [],
        description: null
      }
    },
    // 新增角色 | 编辑角色
    async addRoles () {
      const checkedKeys = this.$refs.refRole.getCheckedKeys()
      const halfCheckedKeys = this.$refs.refRole.getHalfCheckedKeys()
      this.addRoleForm.moduleIdList = [...checkedKeys, ...halfCheckedKeys]
      if (this.roleDialogOptions.roleDialogTitle === '新增角色') {
        const res = await this.$http.post(
          '/api/CreateAuth_Role',
          this.addRoleForm
        )
        if (res.data.result.code === 200) {
          this.getRoleList()
          this.$message.success('新增角色成功')
        } else {
          this.$message.error('新增角色失败')
        }
      } else {
        const res = await this.$http.post('/api/UpdateUserRoleMenu', {
          ...this.addRoleForm,
          id: this.setRoleRid
        })
        if (res.data.result.code === 200) {
          this.getRoleList()
          this.$message.success('编辑角色成功')
        } else {
          this.$message.error('编辑角色失败')
        }
      }

      this.roleDialogOptions.openRoleDialog = false
    },
    // 获取所有权限
    async getAllAuth () {
      const res = await this.$http.post('/api/Auth_ModuleList', {})
      if (res.data.result.code === 200) {
        this.allAuthList = res.data.result.item.map(val => {
          return {
            ...val.parent,
            children: val.children
          }
        })
      } else {
        this.$message.error('获取权限列表失败，请检查网络')
      }
    },
    // 获取当前角色的所有权限子ids
    async getCurrentMenuList (id) {
      return await this.$http.post('/api/GetUserRoleMenuById', { id })
    },
    // 打开编辑列表
    async handleEdit (row) {
      this.defaultChecked = [] // 重定项
      this.setRoleRid = row.id // 当前角色id
      this.roleDialogOptions.roleDialogTitle = '角色编辑'
      for (const key in row) {
        this.addRoleForm[key] = row[key]
      }

      this.roleDialogOptions.openRoleDialog = true
      const res = await this.getCurrentMenuList(row.id)
      if (
        res.data.result.code === 200 &&
        res.data.result.item.moduleIdList &&
        res.data.result.item.moduleIdList.length > 1
      ) {
        this.defaultChecked = res.data.result.item.moduleIdList
      }
      this.$refs.refRole.setCheckedKeys(this.defaultChecked)
    },
    // 删除列表
    async handleDelete (index, row) {
      const res = await this.$http.post('/api/DeleteUserRoleMenu', {
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getRoleList()
      } else {
        this.$message.error('删除失败')
      }
    },
    // 修改页码当前页
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getRoleList()
    },
    // 修改页码当前页
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getRoleList()
    }
  },
  mounted () {
    this.getRoleList()
    this.getAllAuth()
  },
  created () {}
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
