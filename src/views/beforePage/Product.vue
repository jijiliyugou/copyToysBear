<template>
  <div style="position:relative;">
    <div class="productwrap">
      <div class="productMenu">
        <h4 class="title el-icon-menu">产品目录</h4>
        <div class="treeContent">
          <el-tree
            :data="categoryList"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="content">
        <div class="filterTitle">
          <div class="searchOptions"><p>搜索内容： <span class="colorGreen">{{ $store.state.beforeSearch.value }}</span> </p> <p>用时： <span class="colorGreen">{{ httpTime | dataFormat }} </span>  秒</p></div>
          <p class="totalCountBox">总记录共 <span class="count">{{ totalCount }}</span>条</p>
        </div>
        <template
          v-if="!productList || (productList && productList.length < 1)"
        >
          <div class="zanwuchanpin"></div>
        </template>
        <template v-else>
          <ul class="productList">
            <li
              class="productItems"
              v-for="(item, index) in productList"
              :key="index"
              @click="toProductDetail(item)"
            >
              <div class="img">
                <el-image fit="contain" :src="item.img">
                  <div
                    slot="placeholder"
                    class="image-slot"
                    style="width:150px;margin:0 auto;"
                  >
                    <img
                      class="errorImg"
                      src="~@/assets/images/暂无图片.png"
                      alt
                    />
                  </div>
                  <div
                    slot="error"
                    class="image-slot"
                    style="width:150px;margin:0 auto;"
                  >
                    <img
                      class="errorImg"
                      src="~@/assets/images/图片加载失败.png"
                      alt
                    />
                  </div>
                </el-image>
                <i
                  v-show="item.isFavorite"
                    class="iconClient iconfont icon-wujiaoxing-"
                    @click.stop="addCollect(item)"
                  ></i>
                  <i
                  v-show="!item.isFavorite"
                    class="iconClient iconfont icon-wujiaoxingkong"
                    @click.stop="addCollect(item)"
                  ></i>
              </div>
              <div class="title">产品名称：{{ item.name }}</div>
              <div class="details">
                <ul>
                  <li>
                    <!-- 出厂货号：{{ item.fa_no }} -->
                    出厂货号：{{ item.fa_no === 0 ? "???" : item.fa_no }}
                  </li>
                  <li>包装：{{ item.fa_no === 0 ? "???" : item.ch_pa }}</li>
                  <li>
                    样品规格：{{
                      item.fa_no === 0
                        ? "???"
                        : item.pr_le +
                          " X " +
                          item.pr_wi +
                          " X " +
                          item.pr_hi +
                          "(CM)"
                    }}
                  </li>
                  <li>
                    外箱规格：{{
                      item.fa_no === 0
                        ? "???"
                        : item.ou_le +
                          " X " +
                          item.ou_wi +
                          " X " +
                          item.ou_hi +
                          "(CM)"
                    }}
                  </li>
                  <li>
                    装箱量：{{
                      item.fa_no === 0
                        ? "???"
                        : item.in_en + "/" + item.ou_lo + "(PCS)"
                    }}
                  </li>
                  <li>
                    体积/材积：{{
                      item.fa_no === 0
                        ? "???"
                        : item.bulk_stere +
                          "(CBM)" +
                          "/" +
                          item.bulk_feet +
                          "(CUFT)"
                    }}
                  </li>
                  <li>
                    毛重/净重：{{
                      item.fa_no === 0
                        ? "???"
                        : item.ne_we + "/" + item.gr_we + "(kg)"
                    }}
                  </li>
                  <el-tag type="success"
                    >来源：{{
                      $store.state.userInfo.commparnyList &&
                      $store.state.userInfo.commparnyList[0] &&
                      $store.state.userInfo.commparnyList[0].companyType ==
                        "Exhibition"
                        ? item.supplierName
                        : item.exhibitionName
                    }}</el-tag
                  >
                </ul>
              </div>
            </li>
          </ul>
          <center style="margin:20px;">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              :page-sizes="[10, 30, 60, 100]"
              :page-size="pageSize"
              @current-change="changePage"
              @size-change="handleSizeChange"
            ></el-pagination>
          </center>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      httpTime: null,
      currentPage: 1,
      pageSize: 60,
      totalCount: 0,
      productList: null, // 产品列表
      categoryList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  methods: {
    // 产品收藏
    async addCollect (item) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: item.productNumber
      })
      if (res.data.result.code === 200) {
        this.$message.closeAll()
        if (item.isFavorite) {
          this.$message.success('取消收藏成功')
        } else {
          this.$message.success('收藏成功')
        }
        item.isFavorite = !item.isFavorite
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    toProductDetail (item) {
      if (!item.productNumber) {
        this.$message.error('该产品没有产品编号')
        return false
      }
      this.$router.push({
        name: 'ProductDetail',
        params: { id: item.productNumber }
      })
    },
    // 获取产品列表
    // 默认搜索产品
    async getProductList (search) {
      try {
        var start = Date.now()
        const res = await this.$http.post('/api/SearchBearProductPage', {
          [this.name]: search,
          skipCount: this.currentPage,
          maxResultCount: this.pageSize
        })
        this.httpTime = Date.now() - start
        if (res.data.result.code === 200 && res.data.result.item) {
          this.productList = res.data.result.item.items
          this.totalCount = res.data.result.item.totalCount
          // this.$store.commit('updateLoading', false)
        } else {
          this.totalCount = 0
          this.productList = []
          // this.$store.commit('updateLoading', false)
          this.$message.error(res.data.result.msg + '，请登录后查看')
        }
        $('#app').animate({ scrollTop: 0 }) // 滚到顶部
      } catch (error) {
        // this.$store.commit('updateLoading', false)
        this.totalCount = 0
      }
    },
    // 用户管理分页事件
    changePage (currentPage) {
      this.currentPage = currentPage
      this.getProductList(this.search)
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductList(this.search)
    },
    // 清除监听
    clearEventHub () {
      this.$root.eventHub.$off('searchBeforeProduct')
      this.$store.commit('handlerBeforeSearch', { value: '', type: 'name' })
    },
    // 获取产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/ProductCategoryList', {})
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductCategoryList()
  },
  mounted () {
    this.$root.eventHub.$on('searchBeforeProduct', () => {
      this.currentPage = 1
      this.pageSize = 60
      this.productList = []
      this.getProductList(this.search)
    })
    if (this.$store.state.beforeSearchImg) {
      this.productList = this.$store.state.beforeSearchImg
      this.totalCount = this.productList.length
      this.$store.commit('handlerBeforeSearchImg', '')
    } else this.getProductList(this.search)
  },
  computed: {
    loading () {
      return this.$store.state.vueElementLoading
    },
    search () {
      return this.$store.state.beforeSearch.value
    },
    name () {
      return this.$store.state.beforeSearch.type
    }
  },
  filters: {
    dataFormat (value) {
      return value / 1000
    }
  },
  watch: {
    '$store.state.beforeSearchImg' (value) {
      if (value) {
        this.productList = value
        this.totalCount = value.length
      }
    }
  },
  beforeDestroy () {
    this.clearEventHub()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.search {
  text-align: center;
  margin: 30px 0;
  .myCamera {
    color: black;
    font-size: 22px;
    cursor: pointer;
  }
}
.productwrap {
  width: 100%;
  max-width: 1200px;
min-width: 700px;
  margin: 0 auto;
  min-height: 569px;
  box-sizing: border-box;
  display: flex;
  .productMenu {
    width: 200px;
    .title {
      background-color: #165af7;
      color: white;
      width: 100%;
      text-align: center;
      padding: 10px 0;
    }
    .treeContent {
      min-height: 533px;
      padding: 10px;
      background-color: #e4f3ff;
    }
  }
  .content {
    flex: 1;
    padding: 0 20px;
    font-weight: 500;
    font-size: 12px;
    .productFilter {
      display: flex;
      height: 34px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      position: relative;
      align-items: center;
      .el-button {
        height: 95%;
        i {
          font-size: 14px;
          margin-left: 10px;
        }
      }
      .priceFilter {
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 20px;
        p {
          width: 50px;
        }
        @{deep} .priceInput,
        @{deep} .el-input__inner {
          width: 50px;
          height: 30px;
        }
        span {
          width: 5px;
          height: 2px;
          margin: 0 5px;
          background-color: #aaa;
        }
      }
      .more {
        position: absolute;
        right: 10px;
        top: 10px;
        i {
          font-weight: 700;
          font-size: 20;
          cursor: pointer;
        }
      }
    }
    .filterTitle {
        margin-top: 5px;
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
        align-items: center;
        justify-content:space-between;
        box-sizing: border-box;
        &:after {
          display: block;
          content:'';
          flex:1
        }
        .totalCountBox {
          flex:1;
          text-align: center;
          .count {
          color: red;
          margin: 0 5px;
          }
        }
        .searchOptions{
          display: flex;
          box-sizing:border-box;
          p{
            margin-right:20px;
          }
          .colorGreen{
            color: #66b1ff;
          }
        }
      }
    .productList {
      display: flex;
      flex-wrap: wrap;
      font-size: 10px;
      position: relative;
      .productItems {
        width: 230px;
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
        margin: 5px;
        box-sizing: border-box;
        cursor: pointer;
        .img {
          width: 100%;
          height: 150px;
          position: relative;
           .iconClient {
              position: absolute;
              right: 5px;
              bottom: 5px;
              color: #fb6055;
              cursor: pointer;
            }
          @{deep} .el-image {
            width: 100%;
            height: 150px;
            img {
              width: 100%;
              height: 150px;
              transition: all 1s;
            }
          }
        }
        .title {
          color: #7990bd;
          padding: 5px 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom: 1px dotted #f5f7fa;
        }
        .details {
          ul > li {
            padding: 5px 10px;
          }
          @{deep} .el-tag {
            margin: 5px 10px;
            max-width: 210px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p {
            float: right;
            color: #cb9348;
            font-weight: 700;
          }
        }
        &:hover {
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
          .img {
            @{deep} .el-image {
              img {
                -webkit-transform: scale(1.1);
                -moz-transform: scale(1.1);
                -ms-transform: scale(1.1);
                transform: scale(1.1);
              }
            }
          }
        }
      }
    }
  }
}
@{deep} .el-tree {
  // color: white;
  background-color: transparent;
  .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
  .el-tree-node:hover > .el-tree-node__content {
    background-color: transparent;
  }
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg) !important;
    transform: rotate(0deg) !important;
  }
  .el-icon-caret-right:before {
    // 加号图片
    content: "\e723" !important;
    font-size: 16px;
    color: black;
  }
  .expanded:before {
    // 减号图片
    content: "\e722" !important;
    font-size: 16px;
  }
  // 叶子类目不要图标
  .is-leaf.el-tree-node__expand-icon.el-icon-caret-right:before {
    content: "" !important;
    font-size: 16px;
  }
}
.meiyoule {
  padding: 10px 0;
  background-color: #eeeeed;
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
