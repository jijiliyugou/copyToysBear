<template>
  <div style="min-height:757px;">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.CompanyName"
            @keyup.enter.native="search"
            placeholder="输入关键字"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型查询">
          <el-select
            clearable
            v-model="formInline.CompanyType"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="item in [
                { itemCode: null, itemText: '全部' },
                ...clientTypeList
              ]"
              :key="item.itemCode"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
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
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="companyNumber" label="客户头像">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row.companyLogo" fit="cover">
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
              >
                {{ scope.row.companyName }}
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyNumber"
          label="客户编码"
        ></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="e_mail" label="邮箱"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
        <el-table-column prop="companyType" label="公司类型">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.companyType === 'Sales'"
              type="success"
              effect="plain"
              >销售公司</el-tag
            >
            <el-tag
              v-else-if="scope.row.companyType === 'Supplier'"
              type="danger"
              effect="plain"
              >供应商</el-tag
            >
            <el-tag
              v-else-if="scope.row.companyType === 'Exhibition'"
              effect="plain"
              >展厅</el-tag
            >
            <el-tag
              v-else-if="scope.row.companyType === 'Admin'"
              type="warning"
              effect="plain"
              >管理员</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="audit_state" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.audit_state === 1" type="success"
              >已审核</el-tag
            >
            <el-tag v-else-if="scope.row.audit_state === 2" type="danger"
              >拒绝</el-tag
            >
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="新增日期" prop="createdOn" sortable>
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="openEmployeeMan(scope.row)"
              >员工管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;" v-show="tableDataConfig.totalCount > 10">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="tableDataConfig.totalCount"
          :page-size="tableDataConfig.pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 员工管理dialog -->
    <el-dialog
      :title="employeeMan.title"
      :visible.sync="employeeMan.dialog"
      width="90%"
      :close-on-click-modal="true"
      destroy-on-close
    >
      <!-- 嵌套新增员工 -->
      <el-dialog
        width="50%"
        :title="employeeMan.employeeTitle"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form
          :model="addEmployeeForm"
          ref="addEmployeeRef"
          :rules="addRules"
        >
          <el-form-item label="员工头像" label-width="100px" prop="userImage">
            <el-upload
              :action="baseAPI + '/api/File/InsertPic'"
              list-type="picture-card"
              ref="upload"
              :auto-upload="false"
              :on-change="changeUpload"
              :on-preview="handlePictureCardPreview"
              :http-request="successUpload"
              :file-list="editImages"
              accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogUpload" :modal="false">
              <img width="100%" :src="LogoUrl" alt />
            </el-dialog>
          </el-form-item>

          <div class="flexLayout">
            <el-form-item
              label="员工账号"
              label-width="100px"
              prop="phoneNumber"
            >
              <el-input
                v-model="addEmployeeForm.phoneNumber"
                :disabled="employeeMan.employeeTitle === '员工编辑'"
              ></el-input>
            </el-form-item>
            <el-form-item label="昵称" label-width="100px" prop="linkman">
              <el-input v-model="addEmployeeForm.linkman"></el-input>
            </el-form-item>
            <!-- <el-form-item label="密码" v-if="employeeMan.employeeTitle === '编辑员工'" label-width="100px">
              <el-input v-model="addEmployeeForm.newPassword"></el-input>
            </el-form-item>-->
            <el-form-item
              label="密码"
              label-width="100px"
              :prop="employeeMan.employeeTitle === '员工编辑' ? '' : 'password'"
            >
              <el-input v-model="addEmployeeForm.password"></el-input>
            </el-form-item>
          </div>
          <div class="flexLayout">
            <el-form-item label="性别" label-width="100px" prop="sex">
              <el-radio-group v-model="addEmployeeForm.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否主账号" label-width="100px" prop="isMain">
              <el-radio-group v-model="addEmployeeForm.isMain">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否激活" label-width="100px" prop="enabled">
              <el-radio-group v-model="addEmployeeForm.enabled">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="生日" label-width="100px">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="addEmployeeForm.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input
              type="textarea"
              v-model="addEmployeeForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <center>
          <el-button type="primary" @click="addEmployee">保存</el-button>
          <el-button type="danger" @click="resetForm('addEmployeeRef')"
            >取消</el-button
          >
        </center>
      </el-dialog>
      <div class="addBtn">
        <el-button type="primary" style="float:right" @click="openAddemployee"
          >新增</el-button
        >
      </div>
      <el-table
        :data="employeeList"
        style="width: 100%;min-height:300px;font-size:12px;"
        :default-sort="{ prop: 'createdOn', order: 'descending' }"
      >
        <!-- v-loading="$store.state.vueElementLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" -->
        <el-table-column
          prop="userImage"
          label="头像"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-avatar
              style="background-color:#165af7"
              :size="50"
              v-if="scope.row.userImage"
              :src="scope.row.userImage"
              :key="scope.row.userImage"
            >
              {{ scope.row.linkman }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="员工账号"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="linkman"
          label="昵称"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column
          prop="isMain"
          label="是否主账号"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.isMain ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center">
          <template slot-scope="scope">{{
            scope.row.sex === 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="生日"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="enabled"
          label="是否激活"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.enabled ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="openBindEmployees(scope.row)"
              >绑定员工</el-button
            >
            <!-- <el-button size="mini" type="warning" @click="bindEmployees(scope.row,2)">解绑</el-button> -->
            <el-button
              size="mini"
              type="primary"
              @click="editEmployees(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteEmployees(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;" v-if="employeeList.length > 10">
        <el-pagination
          layout="prev, pager, next"
          background
          :page-size="employeeMan.pageSize"
          :total="employeeMan.employeeManTotalCount"
          @current-change="employeeManCurrentChange"
        ></el-pagination>
      </center>
      <!-- 嵌套员工关联dialog -->
      <el-dialog
        :title="relatedConfig.title"
        :visible.sync="relatedConfig.relatedDialog"
        width="70%"
        append-to-body
      >
        <el-table
          :data="relatedConfig.relatedDataList"
          style="width: 100%;min-height:300px;"
          :default-sort="{ prop: 'createdOn', order: 'descending' }"
        >
          <el-table-column
            prop="client_acc_nu"
            label="员工账号"
          ></el-table-column>
          <el-table-column prop="client_nu" label="员工编号"></el-table-column>
          <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
          <el-table-column prop="linkman" label="联系人"></el-table-column>
          <el-table-column
            label="新增日期"
            prop="createdOn"
            sortable
            width="180"
          >
            <template slot-scope="scope">
              {{
                scope.row.createdOn
                  ? scope.row.createdOn.replace(/T/gi, " ")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="personnelNo"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-success"
                v-if="scope.row.personnelNo"
                style="color:#85ce61"
              ></i>
              <i class="el-icon-error" v-else style="color:#f581b0"></i>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" min-width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="!scope.row.personnelNo"
                @click="bindEmployee(scope.row, 1)"
                >绑定</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-else
                @click="bindEmployee(scope.row, 2)"
                >取消绑定</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <center
          style="margin-top:20px;"
          v-if="relatedConfig.relatedDataList.length > 10"
        >
          <el-pagination
            layout="prev, pager, next"
            background
            :total="relatedConfig.totalCount"
            :page-size="relatedConfig.pageSize"
            @current-change="relatedCurrentChange"
          ></el-pagination>
        </center> -->
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
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
      clientTypeList: [],
      tableData: [],
      relatedConfig: {
        title: '员工绑定',
        relatedDialog: false,
        relatedDataList: [],
        totalCount: 10,
        currentPage: 1,
        pageSize: 10,
        id: null,
        phoneNumber: null
      },
      isEdit: null, // 是否是编辑员工
      editImages: [], // 编辑员工时的头像预览
      innerVisible: false, // 新增员工dialog
      employeeList: [],
      employeeMan: {
        title: '员工管理',
        dialog: false,
        employeeManTotalCount: 100,
        employeeManCurrentPage: 1,
        pageSize: 10,
        companyNumber: null,
        phoneNumber: null,
        id: null,
        employeeTitle: '新增员工'
      },
      file: '',
      fileList: [],
      dialogUpload: false,
      LogoUrl: '',
      addEmployeeForm: {
        // 新增员工表单
        personnelNo: null,
        phoneNumber: '',
        password: '',
        sex: 1,
        isMain: false,
        enabled: false,
        remark: '',
        birthday: '',
        userImage: '',
        weCharUserJson: null,
        wecharName: null,
        wecharNo: null,
        wecharOpenID: null,
        linkman: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      },
      tableDataConfig: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 100
      },
      formInline: {
        // 搜索表单
        CompanyName: null,
        CompanyType: null,
        dateTile: null
      },
      addRules: {
        userImage: [
          { required: true, message: '请选择员工头像', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '请输入员工账号', trigger: 'blur' },
          {
            pattern: /^1[2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ],
        linkman: [
          { required: true, message: '请输入员工昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, max: 20, message: '最少输入6-20个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择员工性别', trigger: 'change' }],
        isMain: [
          { required: true, message: '请选择是否主账号', trigger: 'change' }
        ],
        enabled: [
          { required: true, message: '请选择是否激活', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 获取客户管理列表
    async getClientList () {
      const fd = {
        skipCount: this.tableDataConfig.currentPage,
        maxResultCount: this.tableDataConfig.pageSize,
        CompanyName: this.formInline.CompanyName,
        CompanyType: this.formInline.CompanyType,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      if (!this.formInline.dateTile) {
        delete fd.StartTime
        delete fd.EndTime
      }
      const res = await this.$http.post('/api/CompanyManagementPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.tableDataConfig.totalCount = res.data.result.item.totalCount
      }
    },
    // 获取员工列表
    async getEmployeeList (id) {
      try {
        const res = await this.$http.post('/api/CompanyUserPage', {
          orgCompanyID: id,
          skipCount: this.employeeMan.employeeManCurrentPage,
          maxResultCount: this.employeeMan.pageSize
        })
        if (res.data.result.code === 200) {
          this.employeeList = res.data.result.item.items || []
          this.employeeMan.employeeManTotalCount =
            res.data.result.item.totalCount
        }
        this.$store.commit('updateLoading', false)
      } catch (error) {
        this.$store.commit('updateLoading', false)
      }
    },
    // 切换当前页
    currentChange (currentPage) {
      this.tableDataConfig.currentPage = currentPage
      this.getClientList()
    },
    // 打开员工管理
    openEmployeeMan (row) {
      this.employeeList = []
      this.$store.commit('updateLoading', true)
      this.employeeMan.companyNumber = row.companyNumber
      this.employeeMan.phoneNumber = row.phoneNumber
      this.employeeMan.id = row.id
      this.getEmployeeList(row.id)
      this.employeeMan.dialog = true
    },
    // 头像加载失败
    errorHandler () {
      return true
    },
    // 修改当前页
    employeeManCurrentChange (currentPage) {
      console.log(currentPage)
      this.employeeMan.employeeManCurrentPage = currentPage
      this.getEmployeeList(this.employeeMan.id)
    },
    // 打开新增员工
    openAddemployee () {
      this.isEdit = false
      this.employeeMan.employeeTitle = '新增员工'
      this.editImages = []
      this.addEmployeeForm = {
        personnelNo: null,
        phoneNumber: '',
        password: '',
        sex: 1,
        isMain: false,
        enabled: false,
        remark: '',
        birthday: '',
        userImage: '',
        weCharUserJson: null,
        wecharName: null,
        wecharNo: null,
        wecharOpenID: null,
        linkman: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      }
      this.getCurrentDate()
      this.innerVisible = true
    },
    // 新增员工
    async addEmployee () {
      this.addEmployeeForm.CompanyId = this.employeeMan.id
      const imgRes = await this.successUpload()
      if (imgRes.data.result.code === 200) {
        this.addEmployeeForm.userImage =
          imgRes.data.result.object[0] && imgRes.data.result.object[0].filePath
            ? imgRes.data.result.object[0].filePath
            : this.addEmployeeForm.userImage
      } else {
        this.$message.error(imgRes.data.result.message)
      }
      if (this.isEdit) {
        this.$refs.addEmployeeRef.validate(async valid => {
          if (valid) {
            this.addEmployeeForm.password = this.addEmployeeForm.password
              ? this.$md5('LitterBear' + this.addEmployeeForm.password)
              : this.addEmployeeForm.newPassword
            const res = await this.$http.post(
              '/api/UpdateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.getCurrentDate()
              this.innerVisible = false
              this.$message.success('员工编辑成功')
              this.getEmployeeList(this.employeeMan.id)
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = null
            }
          }
        })
      } else {
        this.$refs.addEmployeeRef.validate(async valid => {
          if (valid) {
            this.addEmployeeForm.password = this.$md5(
              'LitterBear' + this.addEmployeeForm.password
            )
            console.log(this.addEmployeeForm)
            const res = await this.$http.post(
              '/api/CreateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.getCurrentDate()
              this.innerVisible = false
              this.$message.success('员工编辑成功')
              this.getEmployeeList(this.employeeMan.id)
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = ''
            }
          }
        })
      }
    },
    // 删除员工
    async deleteEmployees (row) {
      const res = await this.$http.post('/api/DeleteCompanyUser', {
        OrgCompanyID: this.employeeMan.id,
        OrgPersonnelID: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getEmployeeList(this.employeeMan.id)
      }
    },
    // 打开编辑员工
    editEmployees (row) {
      console.log(123, row)
      this.isEdit = true
      this.editImages = []
      this.employeeMan.employeeTitle = '员工编辑'
      this.innerVisible = true
      for (const key in this.addEmployeeForm) {
        this.addEmployeeForm[key] = row[key]
        this.addEmployeeForm.newPassword = row.password
        this.addEmployeeForm.password = null
      }
      this.editImages[0] = { url: row.userImage }
      this.addEmployeeForm.id = row.id
      this.addEmployeeForm.weCharUserJson = row.weCharUserJson
      this.addEmployeeForm.wecharName = row.wecharName
      this.addEmployeeForm.wecharNo = row.wecharNo
      this.addEmployeeForm.wecharOpenID = row.wecharOpenID
    },
    // 取消新增员工
    resetForm (formName) {
      this.addEmployeeForm = {
        // 新增员工表单
        personnelNo: null,
        phoneNumber: '',
        password: '',
        sex: 1,
        isMain: 2,
        enabled: 2,
        remark: '',
        birthday: '',
        userImage: '',
        linkman: null,
        weCharUserJson: null,
        wecharName: null,
        wecharNo: null,
        wecharOpenID: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      }
      this.getCurrentDate()
      this.innerVisible = false
    },
    // 选择头像
    changeUpload (file, fileList) {
      this.file = file.raw
      this.fileList = fileList
      if (this.$_.size(fileList) > 1) {
        fileList.shift()
      }
    },
    // 上传头像
    async successUpload () {
      const fd = new FormData()
      fd.append('BusinessType', 'Head')
      fd.append('file', this.file)
      return await this.$http.post('/api/File/InsertPic', fd)
    },
    // 预览头像
    handlePictureCardPreview (file, fileList) {
      this.LogoUrl = file.url
      this.dialogUpload = true
    },
    // 获取弹出员工列表
    async getPersinnelList (phoneNumber) {
      const res = await this.$http.post('/api/SearchPersinnel', {
        Client_acc_nu: phoneNumber,
        CompantNumber: this.employeeMan.companyNumber
      })
      if (res.data.result.code === 200) {
        this.relatedConfig.relatedDataList = res.data.result.item
      }
    },
    // 获取当前日期
    getCurrentDate () {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      this.$set(this.addEmployeeForm, 'birthday', defaultDate)
    },
    // 打开绑定员工
    async openBindEmployees (row, code) {
      this.relatedConfig.id = row.id
      this.relatedConfig.phoneNumber = row.phoneNumber
      this.relatedConfig.relatedDialog = true
      this.getPersinnelList(row.phoneNumber)
    },
    // 绑定员工
    async bindEmployee (row, code) {
      console.log(code)
      const res = await this.$http.post('/api/BindPersinnel', {
        personnelNo: code === 1 ? this.relatedConfig.id : null,
        id: row.id
      })
      this.getPersinnelList(this.relatedConfig.phoneNumber)
      console.log(res)
    },
    relatedCurrentChange (page) {
      console.log(page)
    },
    // 搜索
    search () {
      this.tableDataConfig.currentPage = 1
      this.tableDataConfig.pageSize = 10
      this.getClientList()
    },
    // 获取公司类型列表
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        switch (type) {
          case 'CompanyType':
            this.clientTypeList = res.data.result.item
            break
          case 'ExecutionWay':
            this.yearMonthDayList = res.data.result.item
            break
        }
      }
    }
  },
  mounted () {
    this.getClientList()
    this.getCurrentDate()
  },
  created () {
    this.getClientTypeList('CompanyType')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
.addBtn {
  padding: 0 50px 50px;
}
.flexLayout {
  display: flex;
  justify-content: space-between;
}
@{deep} .el-upload-list__item {
  // 上传组件动画效果
  transition: none !important;
}
@{deep} .img {
  width: 50px;
  height: 50px;
  background-color: #165af7;
  color: #fff;
}
</style>
