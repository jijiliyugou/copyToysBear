<template>
  <div style="position: relative; min-height: 765px">
    <bsTop></bsTop>
    <div class="custom-tree-container">
      <div class="submitTree">
        <div class="left">小竹熊分类：</div>
        <div class="right">
          <div class="selectExc">
            展厅分类：<el-select v-model="value" clearable placeholder="请选择展厅分类">
            <el-option
              v-for="item in companyList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </div>
        <el-button type="primary">保存</el-button>
        </div>
      </div>
      <div class="block">
        <div style="display:flex;justify-content:space-between;">
          <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" clearable v-model="filterTextOne"></el-input>
          <!-- <el-button type="danger" @click="resetCheckedOne">重置</el-button> -->
        </div>
        <el-tree
          :data="myCategoryList"
          show-checkbox
          ref="treeOne"
          :filter-node-method="filterNodeOne"
          expand-on-click-node
          :check-on-click-node="false"
          :check-strictly="true"
          node-key="id"
          :props="props"
          @check="handleCheckChangeOne"
          :render-content="renderContent">
        </el-tree>
          <!-- default-expand-all -->
      </div>
      <div class="block">
        <div style="display:flex;justify-content:space-between;">
          <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" clearable v-model="filterTextTwo"></el-input>
          <!-- <el-button type="danger" @click="resetCheckedTwo">重置</el-button> -->
        </div>
        <el-tree
          :data="dataTwo"
          ref="treeTwo"
           :filter-node-method="filterNodeTwo"
          show-checkbox
          :props="props"
          node-key="id"
          @check="handleCheckChangeTwo"
          @node-click="treeNodeClick"
          :check-on-click-node="false"
          :check-strictly="true"
          expand-on-click-node>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-popconfirm title="确定要重置已分配好的分类吗？" :ref="'myPopconfirm' + data.id" @onConfirm="remove(data)">
                <el-button
                @click.stop="removes('myPopconfirm' + data.id)"
                type="danger"
                plain
                size="mini"
                slot="reference">
                重置
              </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
export default {
  components: { bsTop },
  data () {
    return {
      removeName: null,
      myCategoryList: null, // 小竹熊类目
      companyList: null,
      filterTextOne: null,
      filterTextTwo: null,
      options: [{
        value: '选项1',
        label: '新悦翔展厅'
      }, {
        value: '选项2',
        label: '耀升展厅'
      }, {
        value: '选项3',
        label: '黄金糕'
      }, {
        value: '选项4',
        label: '双皮奶'
      }, {
        value: '选项6',
        label: '北京烤鸭'
      }],
      value: null,
      props: {
        label: 'name',
        value: 'id'
      },
      dataTwo: [{
        id: 11,
        name: '一级 金刚芭比',
        children: [{
          id: 44,
          name: '二级 金刚芭比',
          children: [{
            id: 99,
            name: '三级 金刚芭比1'
          }, {
            id: 1010,
            name: '三级 金刚芭比2'
          }]
        }]
      }, {
        id: 22,
        name: '一级 电动玩具',
        children: [{
          id: 55,
          name: '二级 电动玩具1'
        }, {
          id: 66,
          name: '二级 电动玩具2'
        }]
      }, {
        id: 33,
        name: '一级 奥特曼',
        children: [{
          id: 77,
          name: '二级 奥特曼1'
        }, {
          id: 88,
          name: '二级 奥特曼2'
        }]
      }],
      id: 1000
    }
  },
  methods: {
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { oppositeRole: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.companyList = res.data.result.item.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取小竹熊产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/ProductCategoryList', {})
      if (res.data.result.code === 200) {
        this.myCategoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 单选
    handleCheckChangeOne (data, nodes) {
      if (nodes.checkedKeys.length > 0) {
        this.$refs.treeOne.setCheckedKeys([data.id])
      }
    },
    handleCheckChangeTwo (data, nodes) {
      if (nodes.checkedKeys.length > 0) {
        this.$refs.treeTwo.setCheckedKeys([data.id])
        this.removeName && this.$refs[this.removeName].cancel()
      }
    },
    // 清空已选
    // resetCheckedOne () {
    //   this.$refs.treeOne.setCheckedKeys([])
    // },
    // 清空已选
    // resetCheckedTwo () {
    //   this.$refs.treeTwo.setCheckedKeys([])
    // },
    treeNodeClick () {
      this.removeName && this.$refs[this.removeName].cancel()
    },
    removes (name) {
      this.removeName && this.$refs[this.removeName].cancel()
      this.removeName = name
    },
    // 删除按钮
    remove (data) {
      console.log(data)
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },
    filterNodeOne (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterNodeTwo (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>)
    }
  },
  created () {
    this.getProductCategoryList()
    this.getOrgCompanyList()
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
.custom-tree-container {
    width:1200px;
    margin:50px auto;
    min-width: 900px;
    position: relative;
    flex: 1;
    display: flex;
    align-items: top;
    justify-content: space-evenly;
    font-size: 14px;
    .submitTree{
      position: absolute;
      right: 0;
      top: -50px;
      height: 50px;
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-weight: 600;
      .left,.right {
        flex: 1;
      }
      .right {
        display: flex;
        justify-content: space-between;
      }
    }
    .block{
      flex: 1;
      border: 1px solid #eff2f6;
      padding-bottom: 10px;
    }
  }
  @{deep} .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  @{deep} .el-tree-node{
      margin-top: 10px;
      padding-bottom:1px;
    }
</style>
