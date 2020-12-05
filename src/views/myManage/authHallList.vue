<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <!-- 搜索 -->
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <div style="display:flex;align-items: center;justify-content: space-between;">
          <div style="display:flex;align-items: center;justify-content: space-between;">
          <el-form-item label="关键字查询">
          <el-input
              @keyup.enter.native="search"
              size="mini"
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
            size="mini"
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
        </div>
        <div class="btnList">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </div>
        </div>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="headerStyle"
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
        <el-table-column prop="handset" label="联系电话" sortable>
          <!-- <el-table-column
          width="200"
          align="center"
          prop="handset"
          label="相同电话：17603033458">
        </el-table-column> -->
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
         ref="pageRef"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
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
// 获取重复手机号封装
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      hallList: [],
      clientTypeList: [],
      searchForm: {
        keyword: '',
        hallNumber: '',
        companyType: '',
        isRepeat: null,
        isInstall: false
      }
    }
  },
  methods: {
    // 表头类名
    headerStyle ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex) {
        return 'background-color:#1989fa;color:#fff;font-weight:400;'
      }
      var list = [
        { id: 0 }
      ]
    },
    // 列表查询
    search () {
      this.currentPage = 1
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
        this.searchForm.hallNumber = this.hallList[0].companyNumber
        this.getLittleBearInstall()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取列表
    async getLittleBearInstall   () {
      const fd = {
        keyword: this.searchForm.keyword,
        hallNumber: this.searchForm.hallNumber,
        companyType: this.searchForm.companyType,
        skipCount: this.currentPage,
        isInstall: this.searchForm.isInstall,
        maxResultCount: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      let url = '/api/LittleBearInstall'
      if (this.searchForm.isRepeat) {
        url = '/api/LittleBearInstallRepeat'
      }
      const res = await this.$http.post(url, fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
        if (fd.hallNumber) this.$message.error(res.data.result.msg)
        else this.$message.error('请选择展厅')
      }
    },
    // 表格排序
    sortMethod (a, b) {
      return Number(a.handset) - Number(b.handset)
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
    },
    // 初始化饼状图
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.querySelector('.statisticsContent'))
      myChart.on('click', function (params) {
        console.log(params.data)
      })
      // 绘制图表
      const options = {
        title: {
          text: '手机数据统计',
          subtext: '重复手机统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#f56c6c', '#5fadff'],
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['重复手机号', '正常手机号']
        },
        series: [
          {
            name: '手机数据统计',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 100, name: '重复手机号' },
              { value: 310, name: '正常手机号' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      myChart.setOption(options)
    }
  },
  watch: {
  },
  mounted () {
    this.getOrgCompanyList()
    this.getClientTypeList()
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
  .el-form{
    .el-form-item{
      margin: 0;
    }
  }
}
.tableContent {
  padding: 20px 0;
}
</style>
