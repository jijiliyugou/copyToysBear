<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <!-- 搜索 -->
    <div style="maxWidth:1200px;minWidth:900px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="关键字查询">
         <el-input
              @keyup.enter.native="search"
              clearable
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 90%"
            ></el-input>
        </el-form-item>
        <el-form-item label="展厅查询">
          <el-select
          clearable
            v-model="searchForm.hallNumber"
            placeholder="请选择展厅"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in hallList"
              :key="i"
              :label="item.companyName"
              :value="item.companyNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
          clearable
            v-model="searchForm.clientType"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in clientTypeList"
              :key="i"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="hallName" label="展厅名称"></el-table-column>
        <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
        <el-table-column prop="client_na" label="公司名称" width="300"></el-table-column>
        <el-table-column prop="client_nu" label="公司编号"></el-table-column>
        <el-table-column prop="linkman" label="联系人">
          <template slot-scope="scope">
           {{ scope.row.linkman?scope.row.linkman:scope.row.linkman1?scope.row.linkman1:scope.row.linkman2}}
          </template>
        </el-table-column>
        <el-table-column prop="handset" label="联系电话">
          <template slot-scope="scope">
           {{ scope.row.handset?scope.row.handset:scope.row.handset1?scope.row.handset1:scope.row.handset2}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="是否安装" align="right" width="100">
          <template slot-scope="scope">
           <el-tag :type="scope.row.isInstall?'success':'danger'">{{scope.row.isInstall?'已安装':'未安装'}}</el-tag>
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
  </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
     </el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/Footer'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      totalCount: 0,
      currentPage: 0,
      pageSize: 10,
      tableData: [],
      hallList: [],
      clientTypeList: [],
      searchForm: {
        keyword: '',
        hallNumber: '',
        clientType: ''
      }
    }
  },
  methods: {
    // 列表查询
    search () {
      this.currentPage = 0
      this.getLittleBearInstall()
    },
    // 获取公司类型
    async getClientTypeList () {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: 'CompanyType'
      })
      if (res.data.result.code === 200) {
        this.clientTypeList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取列表
    async getLittleBearInstall   () {
      const fd = {
        keyword: this.searchForm.keyword,
        hallNumber: this.searchForm.hallNumber,
        clientType: this.searchForm.clientType,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/LittleBearInstall  ', fd)
      console.log(res)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item
        // this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getLittleBearInstall()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getLittleBearInstall()
    }
  },
  watch: {
  },
  mounted () {
    this.getOrgCompanyList()
    this.getClientTypeList()
    this.getLittleBearInstall()
  },
  created () {}
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
</style>
