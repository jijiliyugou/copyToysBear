<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div style="width:1200px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.ItemText"
            clearable
            @keyup.enter.native="search"
            placeholder="输入关键字"
            style="width: 90%;"
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
          <el-button type="primary" @click="openAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column
          prop="basisParameters"
          label="订单类别"
        ></el-table-column>
        <el-table-column prop="itemText" label="参数名称"></el-table-column>
        <el-table-column prop="itemCode" label="参数编号"></el-table-column>
        <el-table-column prop="createdOn" label="新增日期" sortable width="180">
          <template slot-scope="scope" v-if="scope.row.createdOn">{{
            scope.row.createdOn.replace(/T/g, " ")
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
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
    </div>
    <!-- 新增参数dialog -->
    <el-dialog
      :title="systemDialogTitle"
      :visible.sync="systemDialog"
      v-if="systemDialog"
      width="50%"
    >
      <el-tabs v-model="addType" type="card">
        <el-tab-pane
          label="添加类别"
          name="type"
          :disabled="systemDialogTitle === '编辑系统参数'"
        >
          <el-form
            ref="formNameRef"
            :model="addCate"
            :rules="rulesFormName"
            label-width="100px"
          >
            <el-form-item label="名称" prop="basisExplainName">
              <el-input v-model="addCate.basisExplainName"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="basisExplainCode">
              <el-input v-model="addCate.basisExplainCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSystem">确认</el-button>
              <el-button @click="systemDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="添加系统参数" name="params">
          <el-form
            ref="formSystem"
            :model="addSystemForm"
            :rules="rulesSystemForm"
            label-width="100px"
          >
            <el-form-item label="类别" prop="basisParameters">
              <el-select
                v-model="addSystemForm.basisParameters"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.id"
                  :label="item.basisExplainName"
                  :value="item.basisExplainCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="itemText">
              <el-input v-model="addSystemForm.itemText"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="itemCode">
              <el-input v-model="addSystemForm.itemCode"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="orderIndex">
              <el-input
                type="number"
                v-model="addSystemForm.orderIndex"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                v-model="addSystemForm.remark"
                maxlength="500"
              ></el-input>
              <p class="textareaLength">
                最多可输入
                <span>500</span>字，当前输入
                <span>{{
                  addSystemForm.remark && addSystemForm.remark.length
                }}</span
                >，还可输入
                <span>{{
                  500 - (addSystemForm.remark && addSystemForm.remark.length)
                }}</span>
              </p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSystem">确认</el-button>
              <el-button @click="systemDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
      addCate: {
        basisExplainCode: '',
        basisExplainName: ''
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
      addType: 'params',
      cateList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: null,
      addSystemForm: {
        // 新增表单
        basisParameters: '',
        itemText: '',
        itemCode: '',
        orderIndex: null,
        remark: '',
        isEnabled: true
      },
      formInline: {
        // 搜索表单
        ItemText: null,
        dateTile: null
      },
      systemDialog: false,
      systemDialogTitle: '新增系统参数',
      tableData: [],
      rulesSystemForm: {
        basisParameters: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        itemText: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        itemCode: [
          { required: true, message: '请输入参数', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        orderIndex: [
          { required: true, message: '排序为必填项' },
          {
            min: 1,
            max: 100,
            validator (r, v, b) {
              /^[\d]*$/.test(v) ? b() : b(new Error('请填写数字'))
            },
            message: '长度在 1 到 100 个字符'
          }
        ]
      },
      rulesFormName: {
        basisExplainName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        basisExplainCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 新增页面
    async addSystem () {
      if (this.addType === 'params') {
        this.$refs.formSystem.validate(async valid => {
          console.log(this.addSystemForm)
          if (valid) {
            let sysUrl
            if (this.systemDialogTitle === '新增系统参数') {
              sysUrl = '/api/CreateServiceConfiguration'
            } else if (this.systemDialogTitle === '编辑系统参数') {
              sysUrl = '/api/UpdateServiceConfiguration'
            }
            const res = await this.$http.post(sysUrl, this.addSystemForm)
            if (res.data.result.code === 200) {
              this.$message.success('编辑参数成功')
              this.getSysList()
              this.systemDialog = false
            } else {
              this.$message.error('编辑参数成功，参数错误')
            }
          }
        })
      } else {
        this.$refs.formNameRef.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(
              '/api/CreateServiceConfigurationName',
              this.addCate
            )
            if (res.data.result.code === 200) {
              this.getCateList()
              this.$message.success('添加类别成功')
            }
          }
        })
      }
    },
    // 打开新增页面
    openAdd () {
      this.systemDialog = true
      this.systemDialogTitle = '新增系统参数'
      this.addSystemForm = {
        basisParameters: '',
        itemText: '',
        itemCode: '',
        orderIndex: null,
        remark: '',
        isEnabled: true
      }
    },
    // 获取类型列表
    async getCateList () {
      const res = await this.$http.post('/api/ServiceConfigurationNameList', {})
      if (res.data.result.code === 200) {
        this.cateList = res.data.result.item
      }
    },
    // 获取系统参数列表
    async getSysList () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        ItemText: this.formInline.ItemText,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/ServiceConfigurationPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 搜索
    search () {
      this.getSysList()
    },
    // 编辑系统参数
    handleEdit (row) {
      this.systemDialog = true
      this.systemDialogTitle = '编辑系统参数'
      for (const key in row) {
        this.addSystemForm[key] = row[key]
      }
      this.addSystemForm.id = row.id
    },
    // 删除系统参数
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteServiceConfiguration', {
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.getSysList()
        this.$message.success('删除数据成功')
      } else {
        this.$message.error('删除数据失败')
      }
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getSysList()
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getSysList()
    }
  },
  mounted () {
    this.getSysList()
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.searchBox {
  padding-top: 50px;
  box-sizing: border-box;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
  box-sizing: border-box;
}
.textareaLength {
  span {
    color: #ff6600;
  }
}
</style>
