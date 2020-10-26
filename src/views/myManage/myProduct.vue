<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div style="width:1200px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
          clearable
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%;"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="formInline.dateTile"
            value-format="yyyy-MM-dd HH:mm:ss"
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
    <div class="tableContent" v-if="tableData && tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="collecTable">
        <el-table-column prop="name" label="产品图片">
          <template slot-scope="scope">
            <el-image
              fit="contain"
              :src="scope.row.imageUrl"
              :key="scope.row.imageUrl"
              :preview-src-list="[
                scope.row.imageUrl &&
                  scope.row.imageUrl.replace(/_SmallPic/, '_Photo')
              ]"
              style="width:80px;height:80px;margin:0 auto;cursor: pointer;"
            >
              <div slot="placeholder" class="image-slot">
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                  style="width:80px;height:80px;margin:0 auto;"
                />
              </div>
              <div slot="error" class="image-slot">
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                  style="width:80px;height:80px;margin:0 auto;"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column
          prop="fa_no"
          label="出厂货号"
          align="center"
        ></el-table-column>
        <el-table-column prop="isOpen" label="开放状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isOpen">开放</el-tag>
            <el-tag type="warning" v-else>待开放</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="底价" align="center">
          <template slot-scope="scope">
            <span style="color:#f56c6c">
              {{ scope.row.price.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="产品备注"> </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
        <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30, 60]"
              background
              :total="totalCount"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
      </center>
    </div>
    <div class="zanwuchanpin" v-else></div>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
import Footer from '@/components/Footer'
export default {
  components: { bsTop },
  data () {
    return {
      exportTable: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      formInline: {
        keyword: '',
        dateTile: null
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
      tableData: []
    }
  },
  methods: {
    async getSupplierProduct () {
      const fd = {
        endTime: this.formInline.dateTile && this.formInline.dateTile[1],
        startTime: this.formInline.dateTile && this.formInline.dateTile[0],
        keyword: this.formInline.keyword,
        PageIndex: this.currentPage,
        PageSize: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/SupplierProduct', fd)
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.tableData = res.data.result.item.items
      }
    },
    search () {
      this.currentPage = 1
      this.getSupplierProduct()
    },
    // 修改当前页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getSupplierProduct()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getSupplierProduct()
    }
  },
  mounted () {
    this.getSupplierProduct()
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
</style>
