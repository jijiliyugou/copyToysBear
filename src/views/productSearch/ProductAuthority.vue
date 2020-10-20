<template>
  <div style="position:relative;min-height:757px;">
    <bsTop></bsTop>
    <div style="width:1200px;margin:0 auto;">
      <template v-if="!tableData || tableData.length === 0">
      <div class="zanwuchanpin"></div>
    </template>
    <template v-else>
      <productTop></productTop>
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
                >查看</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="handleDelete(scope.$index, scope.row)"
                >开启</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <center style="margin-top:20px;">
          <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30, 60]"
              background
              :total="total"
              :page-size="pageSize"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
        </center>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
import productTop from '@/components/productTop'
export default {
  components: { bsTop, productTop },
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
      ]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    // 修改当前页
    currentChange (currentPage) {
      console.log(currentPage)
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      console.log(pageSize)
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
</style>
