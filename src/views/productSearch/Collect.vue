<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="货物编号">
          <el-input
            v-model="formInline.code"
            placeholder="输入货物编号"
            style="width: 70%;"
          ></el-input>
        </el-form-item>

        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.keyWord"
            placeholder="输入关键字"
            style="width: 90%;"
          ></el-input>
        </el-form-item>

        <el-form-item label="来源查询">
          <el-select
            v-model="formInline.source"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="batchExport">批量导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template v-if="!tableData || tableData.length === 0">
      <div class="zanwuchanpin"></div>
    </template>
    <div class="tableContent" v-else>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          label="选择"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="收藏货号"
        ></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column prop="exhibitionName" label="来源"> </el-table-column>
        <el-table-column prop="isOpen" label="开放状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isOpen">开放</el-tag>
            <el-tag type="warning" v-else>待开放</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collecTime" label="收藏时间" width="180">
          <template slot-scope="scope">
            {{
              scope.row.collecTime
                ? scope.row.collecTime.replace(/t/gi, " ")
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="spplierName"
          label="供应商名称"
        ></el-table-column>
        <el-table-column prop="price" label="底价" width="100">
          <template slot-scope="scope">
            <span style="color:#f56c6c">
              {{ scope.row.cu_de + scope.row.price.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="right"
          width="170"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="!scope.row.isOpen"
              @click="handleEdit(scope.row)"
              >申请开放</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
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
          @current-change="handleCurrentChange"
        ></el-pagination>
      </center>
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
        keyWord: '',
        code: '',
        source: ''
      },
      options: [
        {
          value: '选项1',
          label: '展厅'
        },
        {
          value: '选项2',
          label: '公司'
        },
        {
          value: '选项3',
          label: '供应商'
        }
      ],
      tableData: []
    }
  },
  methods: {
    async getCollectList () {
      const res = await this.$http.post('/api/ProductCollectionPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.tableData = res.data.result.item.items
      }
    },
    search () {},
    addData () {},
    // 禁选
    disableSelect (row, i) {
      return row.isOpen
    },
    // 导出
    batchExport () {
      console.log(this.exportTable)
    },
    handleSelectionChange (val) {
      this.exportTable = val
    },
    // 申请开放
    async handleEdit (row) {
      console.log(row)
      const res = await this.$http.post('/api/UpdateProductCollectionOpen', {
        ProductNumber: row.productNumber
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.$message.success('申请开放成功')
        this.getCollectList()
      }
    },
    async handleDelete (row) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: row.productNumber
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除收藏成功')
        this.getCollectList()
      }
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getCollectList()
    }
  },
  mounted () {
    this.getCollectList()
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
