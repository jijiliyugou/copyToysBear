<template>
  <div class="productSearchIndex">
    <bsTop></bsTop>
    <productSearchTop :showColl="true"></productSearchTop>
    <div class="searchWraps">
      <div class="searchSidebar">
        <h4 class="title el-icon-menu">产品目录</h4>
        <div class="treeContent">
          <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="searchContent">
        <!-- <div class="productFilter">
          <el-button size="small" @click="priceSort">
            价格排序
            <i class="iconfont icon-xiangshang" style="vertical-align: middle;" v-show="isPriceSort"></i>
            <i class="iconfont icon-xiangxia" v-show="!isPriceSort" style="vertical-align: middle;"></i>
          </el-button>
          <el-button size="small" @click="dateSort">
            时间排序
            <i class="iconfont icon-xiangshang" style="vertical-align: middle;" v-show="isDateSort"></i>
            <i class="iconfont icon-xiangxia" style="vertical-align: middle;" v-show="!isDateSort"></i>
          </el-button>
          <div class="priceFilter">
            <p>价格筛选</p>
            <el-input class="priceInput"></el-input>
            <span></span>
            <el-input class="priceInput"></el-input>
          </div>
          <div class="searchBtnBox">
            <el-button size="small" class="searchBtn">搜索</el-button>
            <p>
              总记录共
              <span class="count">{{ totalCount }}</span>条
            </p>
          </div>
          <div class="more">
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>-->
        <div class="filterTitle">
          <div class="dataFilters">
            资料筛选：
            <span style="color:#fc8a26;"
              >玩具宝上传产品资料(产品图片质量较好)</span
            >
            <div class="factoryFilters">
              <span>厂家自传产品资料(产品图片质量可能较差)</span>
            </div>
            <div class="myTotal">
              <p>
                总记录共
                <span class="count">{{ totalCount }}</span
                >条
              </p>
            </div>
          </div>

          <!-- <div class="more">更多筛选</div> -->
        </div>
        <template v-if="!dataList || dataList.length === 0">
          <div class="zanwuchanpin"></div>
        </template>
        <template v-else>
          <div>
            <ul class="productList" v-show="!isDetail">
              <li
                class="productItems"
                v-for="(item, i) in dataList"
                :key="i"
                @click="productDetail(item.productNumber)"
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
                    class="iconClient iconfont icon--wujiaoxing"
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
                          : item.in_en + "/" + item.ou_lo + "(PSC)"
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
            <div class="productList" v-if="isDetail">
              <productDetail
                :number="datailNumber"
                @changeIsDetail="changeIsDetail"
              ></productDetail>
            </div>
            <center
              style="margin:20px auto 0 auto;"
              v-show="totalCount > 10 && !isDetail"
            >
              <el-pagination
                layout="prev, pager, next"
                background
                :total="totalCount"
                :page-size="pageSize"
                @current-change="changePage"
              ></el-pagination>
            </center>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
import productSearchTop from '@/components/productSearchTop'
import productDetail from '@/components/productDetail'
export default {
  components: { bsTop, productSearchTop, productDetail },
  data () {
    return {
      isDateSort: false,
      isPriceSort: false,
      isDetail: false,
      datailNumber: null,
      loading: false,
      currentPage: 1,
      pageSize: 60,
      totalCount: 0,
      dataList: [],
      count: 0,
      data: [
        {
          label: '电动玩具(38888)',
          id: 1,
          children: [
            {
              label: '二级 1-1',
              id: '1-1',
              children: [
                {
                  label: '三级 1-1-1',
                  id: '1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          id: 2,
          children: [
            {
              label: '二级 2-1',
              id: '2-1',
              children: [
                {
                  label: '三级 2-1-1',
                  id: '2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              d: '2-2',
              children: [
                {
                  label: '三级 2-2-1',
                  id: '2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          id: '3',
          children: [
            {
              label: '二级 3-1',
              id: '3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  id: '3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              id: '3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  id: '3-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 价格排序
    priceSort () {
      this.isPriceSort = !this.isPriceSort
      // 数组排序
      this.dataList.sort((a, b) => {
        console.log(a, b)
      })
    },
    // 时间排序
    dateSort () {
      this.isDateSort = !this.isDateSort
    },
    // 收藏
    async addCollect (item) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: item.productNumber
      })
      if (res.data.result.code === 200) {
        this.$message.success('收藏成功')
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    successUpload (response, file, fileList) {
      this.$store.commit('searchValues', response)
      this.$store.commit('updateAppLoading', false)
    },
    // 文字搜索
    async getProduct () {
      this.loading = true
      try {
        const res = await this.$http.post('/api/SearchBearProductPage', {
          name: this.$store.state.searchValue,
          skipCount: this.currentPage,
          maxResultCount: this.pageSize
        })
        if (res.data.result.code === 200 && res.data.result.item) {
          this.dataList = res.data.result.item.items
          this.totalCount = res.data.result.item.totalCount
        } else {
          this.totalCount = 0
        }
        $('#app').animate({ scrollTop: 0 }) // 滚到顶部
        this.loading = false
      } catch (error) {
        this.loading = false
        this.totalCount = 0
      }
      this.isDetail = false
    },
    // 显示产品详情
    productDetail (productNumber) {
      this.isDetail = true // 打开详情页
      this.datailNumber = productNumber
    },
    // 回退事件
    changeIsDetail (val) {
      this.isDetail = val
    },
    changePage (page) {
      this.currentPage = page
      this.getProduct()
    }
  },
  watch: {
    '$store.state.imageSearchValue' (newVal) {
      console.log('newVal', newVal)
      if (newVal) {
        this.dataList = newVal
        this.totalCount = newVal.length
        this.isDetail = false
        this.$nextTick(() => {
          this.$store.commit('clearSearch')
        })
      }
    },
    '$store.state.beforeSearch' (newval) {
      this.search = newval
    }
  },
  mounted () {
    if (this.$store.state.imageSearchValue instanceof Array) {
      this.isDetail = false
      this.dataList = this.$store.state.imageSearchValue
      this.totalCount = this.dataList.length
      this.$store.commit('clearSearch')
    } else {
      this.getProduct()
    }
    this.$root.eventHub.$on('toSearchIndex', () => {
      this.currentPage = 1
      this.pageSize = 60
      this.totalCount = 0
      this.dataList = []
      this.search = this.$store.state.searchValues
      this.getProduct(true)
    })
    if (this.$route.query.id) {
      this.productDetail(this.$route.query.id)
    }
  },
  beforeDestroy () {
    this.$root.eventHub.$off('toSearchIndex')
    this.$store.commit('searchTxtValues', null)
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.productSearchIndex {
  position: relative;
  min-height: 757px;
  .searchTops {
    width: 100%;
    text-align: center;
    margin: 30px 0;
    .myCamera {
      color: black;
      font-size: 22px;
      cursor: pointer;
    }
  }
  .searchWraps {
    width: 1200px;
    margin: 20px auto;
    box-sizing: border-box;
    display: flex;
    .searchSidebar {
      width: 200px;
      height: 100%;
      background-color: #e2f1ff;
      .treeContent {
        min-height: 580px;
        padding: 10px;
      }
      .title {
        background-color: #4b8fc0;
        color: white;
        width: 100%;
        text-align: center;
        padding: 10px 0;
      }
    }
    .searchContent {
      flex: 1;
      padding: 0 20px;
      font-weight: 500;
      font-size: 12px;
      .productFilter {
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
        ::v-deep .el-button {
          height: 100%;
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
          .priceInput,
          ::v-deep .el-input__inner {
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
        .searchBtnBox {
          height: 100%;
          display: flex;
          align-items: center;
          margin-left: 20px;
          .searchBtn {
            width: 50px;
            height: 30px;
          }
          p {
            height: 100%;
            width: 150px;
            display: flex;
            align-items: center;
            justify-content: left;
            padding-left: 10px;
          }
          .count {
            color: red;
            margin: 0 5px;
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
        justify-content: space-between;
        box-sizing: border-box;
        .dataFilters {
          display: flex;
          box-sizing: border-box;
          .factoryFilters {
            margin-left: 50px;
          }
          .myTotal {
            display: flex;
            align-items: center;
            margin-left: 20px;
            p {
              width: 150px;
              display: flex;
              align-items: center;
              justify-content: left;
              padding-left: 10px;
            }
            .count {
              color: red;
              margin: 0 5px;
            }
          }
        }
      }
      .productList {
        display: flex;
        flex-wrap: wrap;
        font-size: 10px;
        .productItems {
          width: 230px;
          margin: 5px;
          cursor: pointer;
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
          .img {
            width: 100%;
            height: 150px;
            border-bottom: 1px solid #ccc;
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
                transition: all 1s;
                width: 100%;
                height: 150px;
              }
            }
          }
          .title {
            color: #7990bd;
            padding: 5px 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            border-bottom: 1px dotted #ccc;
          }
          .details {
            padding: 0 10px;

            ul {
              li {
                padding-top: 5px;
              }
              @{deep} .el-tag {
                margin: 5px 0;
              }
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
  ::v-deep .el-tree {
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
  .myFooter {
    // margin-top: 50px;
    position: absolute;
    width: 100%;
    bottom: -160px;
    left: 0;
    background-color: #fff;
  }
}
</style>
