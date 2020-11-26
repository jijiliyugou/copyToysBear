<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="选择展厅">
          <el-select size="mini" style="width: 90%" v-model="formInline.hallNumber" clearable placeholder="请选择展厅">
            <el-option
              v-for="(item, index) in [{companyName: '全部', companyNumber: ''},...hallList]"
              :key="index"
              :label="item.companyName"
              :value="item.companyNumber">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字查询">
          <el-input
          clearable
            size="mini"
            v-model="formInline.name"
            placeholder="输入关键字"
            style="width: 90%"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态查询">
          <el-select
              clearable
              size="mini"
              v-model="formInline.isEntry"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '', label: '全部' },
                  { value: true, label: '已审核' },
                  { value: false, label: '未审核' },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="下架时间">
          <el-date-picker
          size="mini"
          :clearable='false'
          :unlink-panels='true'
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="productList" style="width: 100%">
        <!-- <el-table-column class="productImg" label="产品图片" prop="img">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row.img" fit="cover" :preview-src-list="[scope.row.img && scope.row.img.replace(/_MiddlePic/gi, '_Photo')]">
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
            </el-image>
          </template>
        </el-table-column> -->
        <el-table-column prop="hallName" label="展厅名称"></el-table-column>
        <el-table-column prop="ma_na" label="厂商名称"></el-table-column>
          <el-table-column prop="ma_ph_1" label="厂商电话" sortable>
            <template slot-scope="scope">
              {{ scope.row.ma_ph_1 ? scope.row.ma_ph_1 : scope.row.ma_ph_2 ? scope.row.ma_ph_2 : scope.row.ma_ph_3 }}
            </template>
          </el-table-column>
        <el-table-column prop="linkman" label="联系人">
          <template slot-scope="scope">
              {{ scope.row.linkman ? scope.row.linkman : scope.row.linkman1 ? scope.row.linkman1 : scope.row.linkman2 }}
            </template>
        </el-table-column>
        <el-table-column prop="isExistCompany" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isExistCompany === 1" type="success">已审核</el-tag>
            <el-tag v-else-if="scope.row.isExistCompany === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdOn" label="下架时间" sortable>
          <template slot-scope="scope">
            {{ scope.row.createdOn.split("T")[0] }}</template>
        </el-table-column>
        <el-table-column prop="verifyRemark" label="审核意见"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              >审核</el-button>
            <el-button
              :disabled="scope.row.isExistCompany !== 1"
              size="mini"
              style="margin-right: 10px"
              type="success"
              @click="handleProduct(scope.row)"
              >上架产品</el-button>
            <el-popconfirm
              title="确定要删除这条信息吗？"
              @onConfirm="handleDelete(scope.row)"
            >
            <el-button size="mini" slot="reference" type="danger"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 审核dialog -->
    <el-dialog
      :title="productDialogOptions.productDialogTitle"
      :visible.sync="productDialogOptions.openProductDialog"
      destroy-on-close
      class="productDialog"
    >
    <el-form
        ref="addVersionForm"
        label-width="100px"
        :model="hallFormData"
      >
        <el-form-item label="展厅名称" prop="hallName">
          <el-input v-model="hallFormData.hallName" disabled></el-input>
        </el-form-item>
        <el-form-item label="厂商名称" prop="ma_na">
           <el-input v-model="hallFormData.ma_na" disabled></el-input>
        </el-form-item>
        <el-form-item label="厂商电话" prop="ma_ph_1">
          <div style="display:flex;justify-content: space-between;">
            <el-input type="textarea" autosize resize="none" v-model="hallFormData.ma_ph_1" disabled></el-input>
            <el-input style="margin:0 20px;" type="textarea" autosize resize="none" v-model="hallFormData.ma_ph_2" disabled></el-input>
            <el-input type="textarea" autosize resize="none" v-model="hallFormData.ma_ph_3" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <div style="display:flex;justify-content: space-between;">
            <el-input type="textarea" autosize resize="none" v-model="hallFormData.linkman" disabled></el-input>
            <el-input style="margin:0 20px;" type="textarea" autosize resize="none" v-model="hallFormData.linkman1" disabled></el-input>
            <el-input type="textarea" autosize resize="none" v-model="hallFormData.linkman2" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item label="下架时间" prop="createdOn">
          <el-input type="textarea" autosize resize="none" v-model="hallFormData.createdOn" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核意见" prop="verifyRemark">
          <el-input type="textarea" placeholder="请输入审核意见" :rows="3" resize="none" v-model="hallFormData.verifyRemark"></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="subAddProduct(1)">审核通过</el-button>
            <el-button type="danger" @click="subAddProduct(2)">拒绝</el-button>
          </template>
        </center>
      </el-form>
    </el-dialog>
    <!-- 上架产品dialog -->
    <el-dialog
      :title="productDialogOptions.shelfTitle"
      :visible.sync="productDialogOptions.openShelfDialog"
      destroy-on-close
      class="productDialog"
    >
    </el-dialog>
  </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
     </el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      hallFormData: {
        hallName: null,
        ma_na: null,
        ma_ph_1: null,
        ma_ph_2: null,
        ma_ph_3: null,
        linkman: null,
        linkman1: null,
        linkman2: null,
        createdOn: null,
        verifyRemark: null
      },
      hallList: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      productList: [],
      formInline: {
        hallNumber: '',
        // 查询角色表单
        keyword: '',
        state: null,
        dateTile: null
      },
      productDialogOptions: {
        productDialogTitle: '审核',
        openProductDialog: false,
        shelfTitle: '上架产品',
        openShelfDialog: false
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
      }
    }
  },
  methods: {
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
      this.getManufacturerOffPage()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getManufacturerOffPage()
    },
    // 搜索
    search () {
      this.currentPage = 1
      this.getManufacturerOffPage()
    },
    // 获取下架厂商列表
    async getManufacturerOffPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.formInline.keyword,
        hallNumber: this.formInline.hallNumber,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/Manufacturer_OffPage', fd)
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items || []
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
    },
    // 删除下架厂商
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteManufacturer_Off', { id: row.id })
      if (res.data.result.code === 200) {
        this.$message.success('删除厂商成功')
        this.getManufacturerOffPage()
      } else {
        this.$message.success(res.data.result.msg)
      }
    },
    // 打开审核厂商
    handleEdit (row) {
      console.log(row)
      this.hallFormData = row
      this.productDialogOptions.openProductDialog = true
    },
    // 打开商家产品
    handleProduct (row) {
      console.log(row)
    },
    // 提交审核厂商
    async subAddProduct (flag) {
      this.hallFormData.isExistCompany = flag
      console.log(this.hallFormData)
      const res = await this.$http.post('/api/UpdateManufacturer_Off', this.hallFormData)
      if (res.data.result.code === 200) {
        this.getManufacturerOffPage()
        this.$message.success('审核成功')
        this.productDialogOptions.openProductDialog = false
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取一年的时间
    /* 获取过去时间，并传值给现在时间 */
    getPassYearFormatDate () {
      var nowDate = new Date()
      var date = new Date(nowDate)
      date.setDate(date.getDate() - 365)
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var formatDate = year + seperator1 + month + seperator1 + strDate + 'T00:00:00'
      this.getNowFormatDate(formatDate)
    },
    /* 获取现在时间，并接受过去时间的值 */
    getNowFormatDate (formatDate) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var nowData = year + seperator1 + month + seperator1 + strDate + 'T23:59:59'
      this.formInline.dateTile = [formatDate, nowData] // 默认赋值一年时间
    }
  },
  created () {
    this.getPassYearFormatDate()
    this.getOrgCompanyList()
  },
  mounted () {
    this.getManufacturerOffPage()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.addProductDialog {
  .el-image{
    width: 100px;
    height: 100px;
  }
  .formItems {
    display: flex;
    justify-content: space-between;
  }
  .productName {
    display: flex;
    @{deep} .el-form-item__content {
      flex: 1;
    }
  }
  .formItemSan {
    .el-input {
      width: 60px;
    }
    .laiyuan {
      width: 100%;
    }
    .itemX {
      margin-left: 10px;
    }
  }
}
.tableContent {
  margin-bottom: 20px;
  @{deep} .img {
    width: 50px;
    height: 50px;
  }
  img{
    width: 50px;
    height: 50px;
  }
}
.textareaLength {
  font-size: 12px;
  height: 30px;
  span {
    color: #ff6600;
  }
}

.productCu_de{
  @{deep} .el-input__inner {
    width: 70px;
  }
   @{deep} .el-select {
    width: 120px;
    .el-input__inner{
      width: 120px;
        text-align: center;
      }
    }
}
.productDialog {
    @{deep} .el-dialog {
      width: 40%;
    }
  }
@media screen and (max-width: 1700px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 50%;
    }
  }
}
@media screen and (max-width: 1400px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 60%;
    }
  }
}
</style>
