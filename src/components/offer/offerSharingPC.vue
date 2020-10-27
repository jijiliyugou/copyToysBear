<template>
  <div class="productSearchIndex">
    <div class="offerInfo">
      <div class="navBar">
      <div class="navBarTitle">
        <span class="title">报价信息</span>
      </div>
    </div>
    </div>
    <div class="offerInfoContent">
      <el-card class="offerCard">
        <p>报价主题：{{ productInfo && productInfo.title }}</p>
        <p>报价参数：{{ productInfo && productInfo.bidPrice }}</p>
        <p>报价员：{{ productInfo && productInfo.linkman }}</p>
      </el-card>
    </div>
     <div class="offerInfo">
      <div class="navBar">
      <div class="navBarTitle">
        <span class="title">报价商品 (2)</span>
      </div>
    </div>
    </div>
    <div class="searchWraps">
      <div class="searchSidebar" v-show="!isDetail">
        <h4 class="title el-icon-search"><span class="titleText">分类搜索</span></h4>
        <el-select v-model="value" placeholder="请输入或选择"  @change="handleChange" clearable filterable>
          <el-option
            v-for="item in [{categoryName: '全部', categoryNumber: ''}, ...categoryList]"
            :key="item.value"
            :label="item.categoryName"
            :value="item.categoryNumber">
          </el-option>
        </el-select>
      </div>
      <div class="searchContent">
        <div class="filterTitle" v-show="!isDetail">
            <div class="keywrodSearch">
              <el-input placeholder="请输入搜索内容" size="mini" @keyup.enter.native="search" clearable v-model="keyword" class="input-with-select">
                <el-button slot="append" size="mini" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
            <div class="sortSearch">
              <el-button type="primary" plain size="mini" @click="priceSort">
                价格排序
                <i class="el-icon-arrow-down el-icon--right" v-show="!isPriceSort"></i>
                <i class="el-icon-arrow-up el-icon--right" v-show="isPriceSort"></i>
                </el-button>
              <el-button type="primary" plain size="mini" @click="dateSort">
                时间排序
                <i class="el-icon-arrow-down el-icon--right" v-show="!isDateSort"></i>
                <i class="el-icon-arrow-up el-icon--right" v-show="isDateSort"></i>
                </el-button>
            </div>
            <div class="downloads">
              <el-button type="primary" @click="downloadDocument('PDF')" plain size="mini">下载PDF<i class="el-icon-download el-icon--right"></i></el-button>
              <el-button type="primary" @click="downloadDocument('Excel')" plain size="mini">下载Excel<i class="el-icon-download el-icon--right"></i></el-button>
            </div>
          <!-- <div class="more">更多筛选</div> -->
        </div>
        <template v-if="!dataList || dataList.length === 0">
          <div class="zanwuchanpin"></div>
        </template>
        <template v-else>
          <div  v-show="!isDetail">
            <ul class="productList">
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
                        src="~@/assets/images/imgError.jpg"
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
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                  </el-image>
                  <!-- <i
                    class="iconClient iconfont icon--wujiaoxing"
                    @click.stop="addCollect(item)"
                  ></i> -->
                </div>
                <div class="title">产品名称：{{ item.name }}</div>
                <div class="details">
                  <ul>
                    <li>
                      <!-- 出厂货号：{{ item.fa_no }} -->
                      产品货号：{{ item.fa_no }}
                    </li>
                    <li>
                      毛重/净重：{{
                        item.ne_we + "/" + item.gr_we + "(kg)"
                      }}
                    </li>
                    <li>
                      报价：<span>{{item.cu_de + (item.unitPrice.toFixed(2))}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <center
              style="margin:20px auto 0 auto;"
              v-show="!isDetail"
            >
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="totalCount"
                :page-size="pageSize"
                :page-sizes="[6, 9, 15, 30]"
                @current-change="changePage"
                @size-change="handleSizeChange"
              ></el-pagination>
            </center>
          </div>
          <div class="productDetail" v-if="isDetail">
              <productDetail
                :number="datailNumber"
                :pid="$route.query.id"
                @changeIsDetail="changeIsDetail"
              ></productDetail>
            </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import productDetail from '@/components/offer/offerDetailPC'
export default {
  components: { productDetail },
  data () {
    return {
      value: '',
      keyword: '',
      productInfo: null,
      categoryNumber: null,
      isDateSort: false,
      isPriceSort: false,
      isDetail: false,
      datailNumber: null,
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      dataList: [],
      categoryList: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  methods: {
    // 下载
    downloadDocument (document) {
      console.log('下载了' + document)
    },
    // 关键字搜索
    search () {
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 价格排序
    priceSort () {
      // 数组排序
      this.dataList.sort((a, b) => {
        if (this.isPriceSort) {
          return a.unitPrice - b.unitPrice
        } else {
          return b.unitPrice - a.unitPrice
        }
      })
      this.isPriceSort = !this.isPriceSort
    },
    // // 时间排序
    dateSort () {
      this.dataList.sort((a, b) => {
        if (this.isDateSort) {
          return Date.parse(a.createdOn) - Date.parse(b.createdOn)
        } else {
          return Date.parse(b.createdOn) - Date.parse(a.createdOn)
        }
      })
      this.isDateSort = !this.isDateSort
    },
    // 点击分类事件
    handleNodeClick (data) {
      this.categoryNumber = data.id
      this.currentPage = 1
      this.getProductOfferDetailPage()
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
    // 修改产品当前页
    changePage (page) {
      this.currentPage = page
      this.getProductOfferDetailPage()
    },
    // 修改产品当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return
      this.getProductOfferDetailPage()
    },
    // 获取产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/GetProductCategoryList', { offerNumber: this.$route.query.id })
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 分类搜索产品
    handleChange (value) {
      // 重新搜索产品列表
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 获取报价头部信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.query.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息产品列表
    async getProductOfferDetailPage (flag) {
      const fd = { skipCount: this.currentPage, maxResultCount: this.pageSize, offerNumber: this.$route.query.id, categoryNumber: this.value, keyword: this.keyword }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductCategoryList()
    this.getProductOfferByNumber()
    this.getProductOfferDetailPage()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) this.$router.push('/offerSharing?id=' + this.$route.query.id)
  },
  watch: {
    '$store.state.screenWidth' (val) { // 监听屏幕宽度变化
      if (val <= 1024) this.$router.push('/offerSharing?id=' + this.$route.query.id)
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.productSearchIndex {
  .navBar {
  background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
  .navBarTitle {
    height: 50px;
    display: flex;
    width: 800px;
    text-indent: 10px;
    margin: 0 auto;
    align-items: center;
    .title{
    position: relative;
    font-weight: 600;
     &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          height: 70%;
          width: 4px;
          background-color: #165af7;
          transform: translate(0, -50%);
          border-radius: 0 5px 5px 0;
        }
    }
  }
}
.offerInfoContent{
  width: 800px;
  margin: 0 auto;
  .offerCard{
    margin: 10px 0;
    p{
      padding: 5px 0;
    }
  }
}
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
    width: 800px;
    margin: 20px auto;
    box-sizing: border-box;
    display: flex;
    .searchSidebar {
      width: 150px;
      height: 100%;
      background-color: #e2f1ff;
      .treeContent {
        padding: 10px;
      }
      .title {
        background-color: #4b8fc0;
        color: white;
        width: 100%;
        text-align: center;
        padding: 10px 0;
        .titleText{
          padding-left: 5px;
        }
      }
    }
    .searchContent {
      flex: 1;
      font-weight: 500;
      font-size: 12px;
      .productFilter {
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
      }
      .filterTitle {
          margin-left: 15px;
          display: flex;
          height: 40px;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          position: relative;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 5px 0;
          .keywrodSearch,.sortSearch,.downloads{
            flex: 1;
            box-sizing: border-box;
            margin-left: 20px;
          }
          .keywrodSearch{
            flex: 0.8;
            margin-left: 0;
          }
          .sortSearch{
            margin-left: 25px;
          }
          .downloads{
            margin-right: 0;
          }
        }
      .productList {
        margin-left: 10px;
        margin-top: 10px;
        width: 650px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: 10px;
        &::after{
          content: "";
          display: block;
          width: 200px;
        }
        .productItems {
          width: 200px;
          margin: 5px;
          box-sizing: border-box;
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
            padding: 0 10px 10px 10px;

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
}
</style>
