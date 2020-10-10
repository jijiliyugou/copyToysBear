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
          <el-button type="primary" @click="openAdd"
            >新增产品</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="allCateList" style="width: 100%">
        <el-table-column class="productName" label="产品图片" prop="img">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.img" fit="cover">
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 150px; margin: 0 auto"
              >
                <img class="errorImg" src="~@/assets/images/暂无图片.png" alt />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 150px; margin: 0 auto"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/图片加载失败.png"
                  alt
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" label="产品名称"></el-table-column>
        <el-table-column prop="orderNumber" label="产品编号"></el-table-column>
        <el-table-column prop="hall_na" label="来源"></el-table-column>
        <el-table-column
          prop="toCompanyName"
          label="公司名称"
        ></el-table-column>
        <el-table-column prop="createdOn" label="发布时间" sortable>
          <template slot-scope="scope">{{
            scope.row.createdOn.replace(/t/gi, " ")
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
    <!-- 新增产品dialog -->
    <el-dialog
      :title="productDialogOptions.productDialogTitle + '类目'"
      :visible.sync="productDialogOptions.openProductDialog"
      class="productDialog"
    >
      <el-form
        :inline="true"
        class="addProductDialog"
        :model="addProductForm"
        :rules="addProductRules"
        ref="addProductRulesForm"
        label-width="100px"
      >
        <el-form-item class="productName" label="产品名称" prop="name">
          <el-input v-model="addProductForm.name"></el-input>
        </el-form-item>
        <div class="formItems">
          <el-form-item label="出厂货号">
            <el-input v-model="addProductForm.fa_no"></el-input>
          </el-form-item>
          <el-form-item label="包装">
            <el-input v-model="addProductForm.ch_pa"></el-input>
          </el-form-item>
        </div>

        <div class="formItems formItemSan">
          <div>
            <el-form-item label="样品规格">
              <el-input v-model="addProductForm.pr_le"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_wi"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_hi"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="装箱量">
              <el-input v-model="addProductForm.in_en"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_lo"></el-input
            ></el-form-item>
          </div>
        </div>

        <div class="formItems formItemSan">
          <div>
            <el-form-item label="外箱规格">
              <el-input v-model="addProductForm.ou_le"></el-input
              ><span class="itemX">X</span></el-form-item
            >
            <el-form-item
              ><el-input v-model="addProductForm.ou_wi"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_hi"></el-input
            ></el-form-item>
          </div>
          <div>
            <el-form-item label="体积/材积">
              <el-input v-model="addProductForm.bulk_stere"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.bulk_feet"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <el-form-item label="来源">
            <el-input
              class="laiyuan"
              v-model="addProductForm.supplierName"
            ></el-input>
          </el-form-item>
          <div>
            <el-form-item label="毛重/净重">
              <el-input v-model="addProductForm.ne_we"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.gr_we"></el-input
            ></el-form-item>
          </div>
        </div>
      </el-form>
      <center>
        <el-button type="primary" @click="subAddProduct">确认</el-button>
        <el-button @click="productDialogOptions.openProductDialog = false"
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
      productDialogOptions: {
        productDialogTitle: '新增',
        openProductDialog: false
      },
      addProductForm: {
        name: '',
        img: '',
        fa_no: null,
        ch_pa: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        bulk_stere: null,
        feet: null,
        supplierName: null
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
      addProductRules: {
        name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
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
    // 编辑产品
    async updateBearProduct () {
      const res = await this.$http.post('/api/UpdateBearProduct', this.addProductForm)
      if (res.data.result.code === 200) {
        console.log(res)
      }
    },
    // 新增产品
    async createProduct () {
      const obj = {
        companyNumber: 'string',
        productNumber: 'string',
        productID: 0,
        number: 'string',
        unit: 'string',
        name: 'string',
        ename: 'string',
        supplierID: 'string',
        supplierNumber: 'string',
        ma_ID: 'string',
        ma_nu: 'string',
        categoryNumber: 'string',
        categoryName: 'string',
        cl_nu: 'string',
        cl_na: 'string',
        pa_nu: 'string',
        price: 0,
        cost: 0,
        ch_pa: 'string',
        en_pa: 'string',
        pr_le: 0,
        pr_wi: 0,
        pr_hi: 0,
        ou_le: 0,
        ou_wi: 0,
        ou_hi: 0,
        bulk_feet: 0,
        bulk_stere: 0,
        in_en: 0,
        ou_lo: 0,
        gr_we: 0,
        ne_we: 0,
        in_le: 0,
        in_wi: 0,
        in_hi: 0,
        remark: 'string',
        hits: 0,
        fa_no: 'string',
        attestation: 'string',
        cloud_platform_date: '2020-10-10T05:37:46.158Z',
        showMicroWeb: 0,
        isUpLoadFromMember: 0,
        is_Confirm: 0,
        isStop: 0,
        pr_Language: 'string',
        keyword_ch_na: 'string',
        keyword_en_na: 'string',
        keyword_ch_pa: 'string',
        isTort: 0,
        isOpen: true,
        keyGuid: 'string',
        makeyGuid: 'string',
        isUpInsetImg: true,
        certificateAddress: 'string',
        videoAddress: 'string',
        createdBy: 'string',
        createdOn: '2020-10-10T05:37:46.158Z',
        modifyBy: 'string',
        modifyOn: '2020-10-10T05:37:46.158Z',
        isDelete: true,
        deleteBy: 'string',
        deleteTime: '2020-10-10T05:37:46.158Z',
        id: 'string'
      }
      const res = await this.$http.post('/api/CreateBearProduct', this.addProductForm)
      if (res.data.result.code === 200) {
        console.log(res)
      }
    },
    // 打开父级新增产品列表窗口
    openAdd () {
      this.addCateForm = {
        name: '',
        img: '',
        fa_no: null,
        ch_pa: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        bulk_stere: null,
        feet: null,
        supplierName: null
      }
      this.productDialogOptions.productDialogTitle = '新增'
      this.productDialogOptions.openProductDialog = true
    },
    // 确认新增产品
    async subAddProduct () {
      // const res = await this.$http.post('api/CreateProductCategory', {
      //   ...this.addCateForm,
      //   skipCount: this.currentPage,
      //   maxResultCount: this.pageSize
      // })
      // console.log(res)
    }
  },
  created () {},
  mounted () {}
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
@media screen and (max-width: 1300px) {
  body{
    background-color: red;
  }
  .productDialog{
  @{deep} .el-dialog{
    width:80%;
    }
  }
}
</style>
