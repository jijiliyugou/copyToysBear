<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            @keyup.enter.native="search"
            v-model="formInline.CompanyName"
            placeholder="输入关键字"
            size="mini"
            style="width: 70%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="datetimerange"
            size="mini"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="openAddClient">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="code" label="模块编码"></el-table-column>
        <el-table-column prop="code" label="上级模块"></el-table-column>
        <el-table-column prop="code" label="链接地址"></el-table-column>
        <el-table-column prop="code" label="是否菜单"></el-table-column>
        <el-table-column prop="code" label="是否激活"></el-table-column>
        <el-table-column
          prop="date"
          label="新增日期"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >审核</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleDelete(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="total"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
      pageSize: 10,
      total: 100,
      tableData: [
        {
          category: '订单状态',
          date: '2016-05-02',
          code: '是',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          remarks: 'hehe'
        },
        {
          category: '订单状态',
          date: '2016-05-04',
          code: '否',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          category: '订单状态',
          date: '2016-05-01',
          code: '是',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          category: '订单状态',
          date: '2016-05-03',
          code: '是',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      formInline: {
        // 查询角色表单
        CompanyName: '',
        state: null,
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
      }
    }
  },
  methods: {
    // 新增
    openAddClient () {},
    // 搜索
    search () {
      console.log(this.formInline)
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    currentChange (currentPage) {
      console.log(currentPage)
    }
  }
}
</script>

<style lang="less" scoped>
.myFooter {
  position: absolute;
  width: 100%;
  bottom: -160px;
  left: 0;
  background-color: #fff;
}
.searchBox {
  margin-top: 50px;
  .btnList {
    float: right;
  }
}
</style>
