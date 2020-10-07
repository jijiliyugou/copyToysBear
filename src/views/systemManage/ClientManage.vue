<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询" size="mini">
          <el-input
            @keyup.enter.native="search"
            v-model="formInline.CompanyName"
            placeholder="输入关键字"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型查询" size="mini">
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
        <el-form-item label="时间段搜索" size="mini">
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
        <el-form-item class="btnList" size="mini">
          <el-button type="primary" size="small" @click="search"
            >查询</el-button
          >
          <el-button type="primary" size="small" @click="openAddClient"
            >新增</el-button
          >
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
        <el-table-column prop="companyNumber" label="客户编码">
          <template slot-scope="scope">
            <el-link type="primary" @click="openEdit(scope.row)">
              <i class="el-icon-edit" style="margin-right:5px;"></i>
              {{ scope.row.companyNumber }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="e_mail" label="邮箱"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
        <el-table-column prop="companyType" label="公司类型" align="center">
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
        <el-table-column
          label="新增日期"
          prop="createdOn"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="openUserMan(scope.row)"
              >绑定公司</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="openByAudit(scope.row)"
              >审核</el-button
            >
            <el-button size="mini" type="success" @click="openAuth(scope.row)"
              >授权</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;" v-show="totalCount > 10">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
    <!-- 新增编辑审核客户dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="clientDialog"
      top="20px"
      width="50%"
    >
      <el-form
        ref="ClientForm"
        label-width="100px"
        :model="addClientForm"
        :rules="addRules"
      >
        <el-form-item
          label="公司类型"
          v-if="dialogTitle  !==  '审核'"
          prop="companyType"
        >
          <el-select
            v-model="addClientForm.companyType"
            placeholder="请选择"
            :disabled="dialogTitle === '审核'"
          >
            <el-option
              v-for="(item, i) in clientTypeList"
              :key="i"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="twoBox" v-else>
          <el-form-item>
            <el-image class="img" :src="addClientForm.companyLogo" fit="cover">
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                {{ addClientForm.companyName }}
              </div>
            </el-image>
          </el-form-item>
          <el-form-item label="公司类型" prop="companyType">
            <el-select
              v-model="addClientForm.companyType"
              placeholder="请选择"
              :disabled="dialogTitle === '审核'"
            >
              <el-option
                v-for="(item, i) in clientTypeList"
                :key="i"
                :label="item.itemText"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model="addClientForm.companyName"
            :disabled="dialogTitle === '审核'"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公司头像"
          style="postion:"
          prop="companyLogo"
          v-if="dialogTitle  !==  '审核'"
        >
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
            <img width="100%" :src="companyLogoUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input
            v-model="addClientForm.address"
            :disabled="dialogTitle === '审核'"
          ></el-input>
        </el-form-item>
        <div class="threeBox">
          <el-form-item label="联系人" prop="contactsMan">
            <el-input
              v-model="addClientForm.contactsMan"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="e_mail">
            <el-input
              v-model="addClientForm.e_mail"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phoneNumber">
            <el-input
              v-model="addClientForm.phoneNumber"
              :disabled="dialogTitle === '审核' || dialogTitle === '用户编辑'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="threeBox">
          <el-form-item label="联系电话" prop="telephoneNumber">
            <el-input
              v-model="addClientForm.telephoneNumber"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>

          <el-form-item label="传真号码" prop="fax">
            <el-input
              v-model="addClientForm.fax"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
          <el-form-item label="qq" prop="qq">
            <el-input
              v-model="addClientForm.qq"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="threeBox">
          <el-form-item label="msn" prop="msn">
            <el-input
              v-model="addClientForm.msn"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
          <el-form-item label="skype" prop="skype">
            <el-input
              v-model="addClientForm.skype"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司KeyCode" prop="companyKeyCode">
            <el-input
              type="text"
              v-model="addClientForm.companyKeyCode"
              :disabled="dialogTitle === '审核'"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="公司API" prop="api">
          <el-input
            type="text"
            v-model="addClientForm.companyAPI"
            :disabled="dialogTitle === '审核'"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司介绍" prop="homepage">
          <el-input
            type="textarea"
            v-model="addClientForm.homepage"
            :disabled="dialogTitle === '审核'"
            :maxlength="
              $store.state.globalJson.Json.CompanyRestrictions[1].itemCode
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="addClientForm.remark"
            :disabled="dialogTitle === '审核'"
            :maxlength="
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            "
          ></el-input>
          <p class="textareaLength">
            最多可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            }}</span
            >字，当前输入
            <span>{{
              addClientForm.remark && addClientForm.remark.length
            }}</span
            >，还可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode -
                (addClientForm.remark && addClientForm.remark.length)
            }}</span>
          </p>
        </el-form-item>
        <center>
          <template v-if="dialogTitle === '新增客户'">
            <el-button type="primary" @click="addClient" :icon="andClientIcon"
              >确认</el-button
            >
            <el-button @click="clientDialog = false">取消</el-button>
          </template>
          <template v-else-if="dialogTitle === '审核'">
            <el-button type="primary" @click="byAudit(1)">审核通过</el-button>
            <el-button @click="byAudit(2)" type="danger">审核不通过</el-button>
          </template>
          <template v-else-if="dialogTitle === '用户编辑'">
            <el-button type="primary" @click="handlerEdit">保存</el-button>
            <el-button @click="clientDialog = false">取消</el-button>
          </template>
        </center>
      </el-form>
    </el-dialog>
    <!-- 用户管理dialog -->
    <el-dialog
      :title="UserManConfig.title"
      :visible.sync="UserManConfig.userManDialog"
      width="70%"
    >
      <el-table
        :data="userManList"
        style="width: 100%;min-height:300px;"
        :default-sort="{ prop: 'createdOn', order: 'descending' }"
      >
        <el-table-column
          v-if="userManList.companyNumber"
          prop="companyNumber"
          label="公司编码"
        ></el-table-column>
        <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
        <el-table-column prop="client_nu" label="客户编号"></el-table-column>
        <el-table-column prop="client_na" label="客户名称"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="handset" label="联系电话"></el-table-column>
        <el-table-column label="新增日期" prop="createdOn" sortable width="180">
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="关联"
          prop="companyNumber"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.companyNumber"
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
              v-if="!scope.row.companyNumber"
              @click="Related(scope.row, 1)"
              >关联</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-else
              @click="Related(scope.row, 2)"
              >取消关联</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <center style="margin-top:20px;" v-if="userManList.length > 10">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="userManTotalCount"
          :page-size="userManPageSize"
          @current-change="userManCurrentChange"
        ></el-pagination>
      </center> -->
    </el-dialog>
    <!-- 授权dialog -->
    <el-dialog
      :title="authDialogConfig.title"
      :visible.sync="authDialogConfig.show"
      width="30%"
    >
      <el-form label-width="100px" :model="authForm">
        <el-form-item label="图文公告数" prop="generalNotice">
          <el-input
            type="number"
            v-model.number="authForm.generalNotice"
          ></el-input>
        </el-form-item>
        <el-form-item label="采购公告数" prop="purchaseNotice">
          <el-input
            type="number"
            v-model.number="authForm.purchaseNotice"
          ></el-input>
        </el-form-item>
        <el-form-item label="供货公告数" prop="deliveryNotice">
          <el-input
            type="number"
            v-model.number="authForm.deliveryNotice"
          ></el-input>
        </el-form-item>
        <el-form-item label="新品推荐次数" prop="newArrivals">
          <el-input
            type="number"
            v-model.number="authForm.newArrivals"
          ></el-input>
        </el-form-item>
        <el-form-item label="新品推荐条数" prop="newProductNumber">
          <el-input
            type="number"
            v-model.number="authForm.newProductNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="广播次数" prop="broadcastNumber">
          <el-input
            type="number"
            v-model.number="authForm.broadcastNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="执行方式" prop="runMode">
          <el-radio-group v-model="authForm.runMode" size="small">
            <el-radio
              :label="item.itemCode"
              border
              v-for="(item, i) in yearMonthDayList"
              :key="i"
              >{{ item.itemText }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否开启" prop="isUnseal">
          <el-radio-group v-model="authForm.isUnseal" size="small">
            <el-radio :label="true" border>是</el-radio>
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAuth">授权</el-button>
          <el-button type="danger" @click="authDialogConfig.show = false"
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
      companyConfig: {},
      searchCount: 0,
      editImages: [],
      userManTotalCount: 100,
      userManCurrentPage: 1,
      userManPageSize: 10,
      authForm: {
        companyID: '',
        generalNotice: 0,
        purchaseNotice: 0,
        deliveryNotice: 0,
        newArrivals: 0,
        newProductNumber: 0,
        broadcastNumber: 0,
        runMode: 'ByYear',
        isUnseal: false
      },
      authDialogConfig: {
        show: false,
        title: '权限设置'
      },
      UserManConfig: {
        userManDialog: false,
        title: '用户管理',
        CompantNumber: null
      },
      dialogTitle: '新增客户',
      addRules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入 1-20 个字符', trigger: 'blur' }
        ],
        companyType: [
          { required: true, message: '请选择公司类型', trigger: 'change' }
        ],
        companyLogo: [
          { required: true, message: '请选择公司头像', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入 1-100 个字符', trigger: 'blur' }
        ],
        contactsMan: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入 1-20 个字符', trigger: 'blur' }
        ],
        e_mail: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z]|[0-9])([._\\-]*[a-z0-9])*@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系手机', trigger: 'blur' },
          {
            pattern: /^1[2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ]
      },
      yearMonthDayList: [],
      clientTypeList: [],
      file: null,
      dialogUpload: false,
      companyLogoUrl: '',
      andClientIcon: '',
      addClientForm: {
        // 新增客户表单
        companyName: '',
        contactsMan: '',
        address: '',
        e_mail: '',
        fax: '',
        qq: '',
        msn: '',
        skype: '',
        homepage: '',
        phoneNumber: '',
        telephoneNumber: '',
        companyAPI: '',
        companyKeyCode: '',
        remark: '',
        companyType: '',
        audit_state: 0,
        companyLogo: '',
        appLoginCount: 0,
        erpLoginCount: 0
      },
      formInline: {
        // 搜索表单
        CompanyName: null,
        CompanyType: null,
        dateTile: null
      },
      clientDialog: false,
      totalCount: null,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      userManList: [], // 用户管理列表
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
      }
    }
  },
  methods: {
    // 审核
    async byAudit (id) {
      this.addClientForm.audit_state = id
      const res = await this.$http.post(
        '/api/UpdateOrgCompany',
        this.addClientForm
      )
      if (res.data.result.code === 200) {
        this.getClientList()
        this.$message.success('审核成功')
      } else {
        this.$message.error('审核失败')
      }
      this.clientDialog = false
    },
    // 打开新增面板
    openAddClient () {
      this.clientDialog = true
      this.dialogTitle = '新增客户'
      this.editImages = []
      this.addClientForm = {
        // 新增客户表单
        companyName: '',
        contactsMan: '',
        address: '',
        e_mail: '',
        fax: '',
        qq: '',
        msn: '',
        skype: '',
        homepage: '',
        phoneNumber: '',
        telephoneNumber: '',
        companyAPI: '',
        companyKeyCode: '',
        remark: '',
        companyType: '',
        companyLogo: '',
        audit_state: 0,
        appLoginCount: 0,
        erpLoginCount: 0
      }
      this.file = null
    },
    // 上传头像
    async successUpload () {
      const fd = new FormData()
      fd.append('BusinessType', 'Logo')
      fd.append('file', this.file)
      return await this.$http.post('/api/File/InsertPic', fd)
    },
    // 选择头像
    changeUpload (file, fileList) {
      if (
        file.size >
        this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode
      ) {
        this.$message.error(
          '上传图片大小不能超过 ' +
            this.Json.NoticeRestrictions[5].itemCode / 1024 / 1024 +
            'MB'
        )
        fileList.pop()
        return false
      }
      this.file = file.raw
      this.fileList = fileList
      if (this.$_.size(fileList) > 1) {
        fileList.shift()
      }
    },
    // 预览头像
    handlePictureCardPreview (file, fileList) {
      this.companyLogoUrl = file.url
      this.dialogUpload = true
    },
    // 提交新增用户
    async addClient () {
      const imgRes = await this.successUpload()
      if (imgRes.data.result.code === 200 && imgRes.data.result.object[0]) {
        this.addClientForm.companyLogo = imgRes.data.result.object[0].filePath
      } else {
        console.log(imgRes.data.result.message)
        this.$message.error(imgRes.data.result.message)
      }
      this.$refs.ClientForm.validate(async valid => {
        if (valid) {
          this.andClientIcon = 'el-icon-loading'
          const res = await this.$http.post(
            '/api/CreateOrgCompany',
            this.addClientForm
          )
          if (res.data.result.code === 200) {
            this.$message.success('新增客户成功')
            this.andClientIcon = ''
            this.addClientForm = {
              // 新增客户表单
              companyName: '',
              contactsMan: '',
              address: '',
              e_mail: '',
              fax: '',
              qq: '',
              msn: '',
              skype: '',
              homepage: '',
              phoneNumber: '',
              telephoneNumber: '',
              companyAPI: '',
              companyKeyCode: '',
              remark: '',
              companyType: '',
              companyLogo: '',
              audit_state: 0,
              appLoginCount: 0,
              erpLoginCount: 0
            }
            this.file = null
            this.clientDialog = false
            this.getClientList()
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    search () {
      this.currentPage = 1
      this.pageSize = 10
      this.getClientList()
    },
    // 获取客户管理列表
    async getClientList () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
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
        this.totalCount = res.data.result.item.totalCount
      }
      // this.formInline = {
      //   // 搜索表单
      //   CompanyName: null,
      //   CompanyType: null,
      //   dateTile: null
      // };
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
        console.log(this.yearMonthDayList)
      }
    },
    // 打开审核列表
    openByAudit (row) {
      this.dialogTitle = '审核'
      this.clientDialog = true
      for (const key in row) {
        this.addClientForm[key] = row[key]
      }
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getClientList()
    },
    // 头像加载失败
    errorHandler () {
      return true
    },
    // 打开用户管理
    openUserMan (row) {
      // this.UserManConfig.CompantNumber = null;
      this.UserManConfig.userManDialog = true
      this.UserManConfig.CompantNumber = row.companyNumber
      this.UserManConfig.phoneNumber = row.phoneNumber
      this.getUserMan(row.phoneNumber, row.companyType)
    },
    // 根据公司id查授权信息
    async getCompanyConfigureById (id) {
      return await this.$http.post('/api/CompanyConfigureById', {
        companyID: id
      })
    },
    // 打开授权面板
    async openAuth (row) {
      const res = await this.getCompanyConfigureById(row.id)
      console.log(res)
      try {
        if (res.data.result.code === 200) {
          this.companyConfig = res.data.result.item
          for (const key in this.companyConfig) {
            this.authForm[key] = this.companyConfig[key]
          }
        } else {
          this.$message.error('您是非正常添加的公司，没有默认授权值哦')
        }
      } catch (error) {
        this.$message.error('您是非正常添加的公司，没有默认授权值哦')
      }
      this.authDialogConfig.show = true
    },
    // 授权
    async addAuth () {
      for (const key in this.authForm) {
        this.companyConfig[key] = this.authForm[key]
      }
      const res = await this.$http.post(
        '/api/UpdateCompanyConfigure',
        this.companyConfig
      )
      if (res.data.result.code === 200) {
        this.$message.success('授权成功')
        this.authDialogConfig.show = false
      } else {
        this.$message.success('授权失败')
      }
    },
    // 获取用户管理列表
    async getUserMan (phoneNumber, companyType) {
      const res = await this.$http.post('/api/SearchCompany', {
        Handset: phoneNumber,
        companyType: companyType
      })
      if (res.data.result.code === 200) {
        this.userManList = res.data.result.item
      }
    },
    // 用户管理分页事件
    userManCurrentChange (currentPage) {
      this.userManCurrentPage = currentPage
      this.getUserMan(this.UserManConfig.CompantNumber)
    },
    // 打开编辑客户列表
    openEdit (row) {
      this.editImages = []
      this.dialogTitle = '用户编辑'
      for (const key in row) {
        this.addClientForm[key] = row[key]
      }
      this.editImages[0] = { url: row.companyLogo }
      this.clientDialog = true
    },
    // 编辑客户列表
    async handlerEdit () {
      const imgRes = await this.successUpload()
      if (imgRes.data.result.code === 200 && imgRes.data.result.object[0]) {
        this.addClientForm.companyLogo = imgRes.data.result.object[0]
          ? imgRes.data.result.object[0].filePath
          : this.addClientForm.companyLogo
      }
      this.$refs.ClientForm.validate(async valid => {
        if (valid) {
          this.andClientIcon = 'el-icon-loading'
          const res = await this.$http.post(
            '/api/UpdateOrgCompany',
            this.addClientForm
          )
          if (res.data.result.code === 200) {
            this.$message.success('编辑客户成功')
          } else {
            this.$message.error(res.data.result.msg)
          }
          this.andClientIcon = ''
          this.addClientForm = {
            // 新增客户表单
            companyName: '',
            contactsMan: '',
            address: '',
            e_mail: '',
            fax: '',
            qq: '',
            msn: '',
            skype: '',
            homepage: '',
            phoneNumber: '',
            telephoneNumber: '',
            companyAPI: '',
            companyKeyCode: '',
            remark: '',
            companyType: '',
            companyLogo: '',
            audit_state: 0,
            appLoginCount: 0,
            erpLoginCount: 0
          }
          this.file = null
          this.clientDialog = false
          this.getClientList()
        }
      })
    },
    // 点击关联
    async Related (row, code) {
      if (code === 1) {
        const res = await this.$http.post('/api/BindCompany', {
          companyNumber: this.UserManConfig.CompantNumber,
          id: row.id,
          CompanyType: row.companyType
        })
        console.log(res)
        if (res.data.result.code === 200) {
          this.$message.success('关联成功')
        } else {
          this.$message.error(res.data.result.msg)
        }
        this.getUserMan(this.UserManConfig.phoneNumber, row.companyType)
      } else {
        const res = await this.$http.post('/api/BindCompany', {
          companyNumber: null,
          id: row.id
        })
        console.log(res)
        if (res.data.result.code === 200) {
          this.$message.success('取消关联成功')
        } else {
          this.$message.error(res.data.result.msg)
        }
        this.getUserMan(this.UserManConfig.phoneNumber, row.companyType)
      }
    }
  },
  mounted () {
    this.getClientList()
    this.getClientTypeList('CompanyType')
    this.getClientTypeList('ExecutionWay')
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
.companyLogoDiv {
  height: 100px;
}
.threeBox {
  display: flex;
  justify-content: space-between;
}
.twoBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @{deep} .img {
    width: 80px;
    height: 80px;
    background-color: #165af7;
    color: #fff;
  }
  &::after {
    content: "";
    width: 190px;
  }
}
.tableContent {
  padding: 20px 0;
  @{deep} .img {
    width: 50px;
    height: 50px;
    background-color: #165af7;
    color: #fff;
  }
  @{deep} tbody,
  tbody a {
    font-size: 12px;
  }
}
@{deep} .el-upload-list__item {
  // 上传组件动画效果
  transition: none !important;
}
.textareaLength {
  font-size: 12px;
  span {
    color: #ff6600;
  }
}
</style>
