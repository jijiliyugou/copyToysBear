<template>
<el-container>
  <el-header style="padding:0;">
    <bsTop></bsTop>
  </el-header>
  <el-main>
    <div class="blockBox">
          <!-- 父表格 -->
      <div class="tableBox">
        <div class="searchBox">
          <el-form :inline="true" :model="searchTableOne" class="demo-form-inline">
            <el-form-item label="关键字查询">
              <el-input
              clearable
                @keyup.enter.native="search"
                v-model="searchTableOne.keyword"
                placeholder="输入关键字"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary">搜索</el-button>
            <el-button type="primary">新增</el-button>
          </div>
        </div>
      <el-table
      :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
      :header-row-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
      highlight-current-row
      @current-change="handleCurrentChange"
      :data="tableDataOne"
      border
      height="700px"
      class="tableOne"
      >
      <el-table-column
      type="index"
      label="序号"
      width="50"
      align="center">
    </el-table-column>
      <el-table-column
       align="center"
        prop="basisExplainName"
        label="名称">
      </el-table-column>
      <el-table-column
       align="center"
        prop="basisExplainCode"
        label="参数">
      </el-table-column>
      <el-table-column
       align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openFatherEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      </div>
      <!-- 子表格 -->
      <div class="tableBox">
        <div class="searchBox">
          <el-form :inline="true" :model="searchTableOne" class="demo-form-inline">
            <el-form-item label="关键字查询">
              <el-input
              clearable
                @keyup.enter.native="search"
                v-model="searchTableOne.keyword"
                placeholder="输入关键字"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary">搜索</el-button>
            <el-button type="primary">新增</el-button>
          </div>
        </div>
        <el-table
        :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        :header-row-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        class="tableTwo"
        :data="tableDataTwo"
        height="700px"
        border>
        <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center">
      </el-table-column>
        <el-table-column
         align="center"
          prop="itemText"
          label="名称">
        </el-table-column>
        <el-table-column
         align="center"
          prop="itemCode"
          label="参数">
        </el-table-column>
        <el-table-column
        align="center"
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
       align="center"
       width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openChildrenEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
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
      tableDataOne: null,
      tableDataTwo: null,
      searchTableOne: {
        keyword: ''
      }
    }
  },
  methods: {
    // 打开父级编辑
    openFatherEdit (row) {
      console.log(row)
    },
    // 打开子级编辑
    openChildrenEdit (row) {
      console.log(row)
    },
    // 点击父级显示子级
    handleCurrentChange (row) {
      this.getChildrenSysList(row.basisExplainCode)
    },
    // 获取子级系统参数列表
    async getChildrenSysList (val) {
      const res = await this.$http.post('/api/ServiceConfigurationList', { basisParameters: val })
      if (res.data.result.code === 200) {
        this.tableDataTwo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取父级系统参数
    async getServiceConfigurationNameList () {
      const res = await this.$http.post('/api/ServiceConfigurationNameList', {})
      if (res.data.result.code === 200) {
        this.tableDataOne = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getServiceConfigurationNameList()
  },
  mounted () {
  },
  watch: {
    filterTextOne (val) {
      this.$refs.treeOne.filter(val)
    },
    filterTextTwo (val) {
      this.$refs.treeTwo.filter(val)
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.el-main{
  padding:0 20px;
  overflow:visible;
    .blockBox{
      min-width: 1024px;
      max-width: 1200px;
      box-sizing: border-box;
      margin:0 auto;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tableBox{
        flex: 1;
        .searchBox{
          border: 1px solid #ebeef5;
          display: flex;
          padding: 10px 5px;
          justify-content: space-between;
          .el-form{
            .el-form-item {
              margin: 0;
            }
          }
        }
      }
    }
}
@{deep} .el-table th, @{deep} .el-table tr {
  background-color: transparent;
}
</style>
