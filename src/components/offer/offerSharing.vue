<template>
  <div
    class="baojia"
    @scroll="baojiaScroll"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
  >
  <div class="boxOne">
    <div class="topLayout">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-image fit="contain"  style="width:0.533333rem;height:0.533333rem;" src="~@/assets/images/imgError.jpg" lazy>
                    <div
                      slot="placeholder"
                      class="image-slot"
                      style="width:0.533333rem;height:0.533333rem; margin: 0 auto"
                    >
                      <img
                        class="errorImg"
                        style="width:0.533333rem;height:0.533333rem;"
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                    <div
                      slot="error"
                      class="image-slot"
                      style="width:0.533333rem;height:0.533333rem; margin: 0 auto"
                    >
                      <img
                        class="errorImg"
                        style="width:0.533333rem;height:0.533333rem;"
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                  </el-image>
        </el-col>
        <el-col :span="12"><div class="grid-content bg-purple conText">玩具厂分享</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple offterBtn"><i class="offterShare el-icon-share"></i> 分享</div></el-col>
      </el-row>
    </div>
    <el-card class="box-card">
      <div class="textContent">
        <div class="top">
          <p>
            报价参数：<span class="content">{{
            productInfo && productInfo.title
          }}</span>
          </p>
          <p>
            联系人：<span class="content">{{
            productInfo && productInfo.linkman
          }}</span>
          </p>
        </div>
        <div class="lookInfo">
          <a @click="toContact">查看联系方式></a>
        </div>
      </div>
    </el-card>
  </div>
  <div class="boxTwo">
    <div class="keyWordSearch">
      <el-input v-model="keyword" placeholder="请输入搜索关键字"></el-input>
      <el-button type="primary" round>搜索</el-button>
    </div>
    <div class="floatSearch">
      <div class="categoryList">
        <div class="cates">
          <!-- 分类：<el-cascader
            clearable
            :show-all-levels="false"
            placeholder="请输入分类"
            filterable
            v-model="categoryNumber"
            size="small"
            ref="clearSelect"
            :props="{
              checkStrictly: true,
              emitPath: false,
              label: 'name',
              value: 'id',
              children: 'children',
            }"
            :options="categoryList"
            @visible-change="resetSelect"
            class="myCate"
            @change="handleChange"
          ></el-cascader> -->
          分类：<el-select v-model="categoryNumber" @change="handleChange" placeholder="请输入或选择" clearable filterable>
          <el-option
            v-for="item in [{categoryName: '全部', categoryNumber: ''}, ...categoryList]"
            :key="item.value"
            :label="item.categoryName"
            :value="item.categoryNumber">
          </el-option>
        </el-select>
        </div>
        <div class="total">总数：{{ totalCount }}</div>
      </div>
      <div class="listTitle">
        <span class="listTitleTXT">报价商品 ({{ totalCount }})</span>
        <div class="downloads">
        </div>
      </div>
      <div class="filterProduct">
        <p :class="{'priceFilter': true, 'active': isFilterActive === 0}" @click="sortPrice(0)">产品单价 <i v-show="isPrice === null" style="font-size:0.32rem;" class="iconfont icon-paixu"></i><i v-show="isPrice === true" class="el-icon-arrow-up"></i><i v-show="isPrice === false" class="el-icon-arrow-down"></i></p>
        <p :class="{'priceFilter': true, 'active': isFilterActive === 1}" @click="sortDate(1)">新增时间  <i v-show="isDate === null" style="font-size:0.32rem;" class="iconfont icon-paixu"></i><i class="el-icon-arrow-up" v-show="isDate"></i><i v-show="isDate===false" class="el-icon-arrow-down"></i></p>
        <p :class="{'priceFilter': true, 'active': isFilterActive === 2}" @click="sortHot(2)">产品热度  <i v-show="isHot === null" style="font-size:0.32rem;" class="iconfont icon-paixu"></i><i class="el-icon-arrow-up" v-show="isHot"></i><i v-show="isHot===false" class="el-icon-arrow-down"></i></p>
        <div :class="{'more': true, 'active': isFilterActive === 3}">
          <i v-show="isList" class="list" @click="checkList(3)"></i>
          <i v-show="!isList" class="square" @click="checkList(3)"></i>
        </div>
      </div>
    </div>
  </div>
    <div class="productList">
      <template v-if="totalCount > 0">
      <div class="listItems" v-show="isList">
          <el-card
          class="listItem"
          v-for="(item, i) in productList"
          :key="i"
          @click.stop.native="productDetail(item.productNumber)"
        >
          <div class="contentBox">
            <div class="left">
            <el-image
              style="position: static"
              :src="item.imageUrl"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
            </el-image>
          </div>
          <div class="right">
            <p class="productName">{{ item.name }}</p>
            <p class="productCode">
              出厂货号：<span>{{ item.fa_no }}</span>
            </p>
            <p>
              装箱量：<span>{{item.in_en + "/" + item.ou_lo + "(PCS)"}}</span>
            </p>
            <p>
              体积/材积：<span>{{ item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)" }}</span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.unitPrice.toFixed(2)
              }}</span>
            </p>
          </div>
          </div>
          <div class="createDate"><i class="dateIcon"></i> 2020-10-10</div>
        </el-card>
      </div>
      <div class="squareItems" v-show="!isList">
          <el-card
          class="squareItem"
          v-for="(item, i) in productList"
          :key="i"
          @click.stop.native="productDetail(item.productNumber)"
        >
          <div class="top">
            <el-image
              style="position: static"
              :src="item.imageUrl"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
            </el-image>
          </div>
          <div class="bottom">
            <p class="productName">{{ item.name }}</p>
            <p class="productCode">
              出厂货号：<span>{{ item.fa_no }}</span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.unitPrice.toFixed(2)
              }}</span>
            </p>
          </div>
        </el-card>
      </div>
      </template>
      <el-image
        v-else
        style="width: 100%; position: static"
        :src="require('@/assets/images/暂无产品.png')"
        fit="contain"
      ></el-image>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: null,
      productInfo: null,
      productList: [],
      currentPage: 1,
      pageSize: 10,
      categoryList: [],
      categoryNumber: '',
      totalCount: 0,
      isFilterActive: null,
      isList: true,
      isDate: null,
      isHot: null,
      isPrice: null
    }
  },
  methods: {
    // 查看联系方式
    toContact () {
      this.$router.push({ name: 'offerContact', params: { id: this.$route.query.id } })
    },
    // 切换列表
    checkList (number) {
      this.isList = !this.isList
      this.isFilterActive = number
      // this.isPrice = true
      // this.isDate = true
      // this.isHot = true
    },
    // 价格排序
    sortPrice (number) {
      this.isFilterActive = number
      this.isPrice = !this.isPrice
    },
    // 时间排序
    sortDate (number) {
      this.isFilterActive = number
      this.isDate = !this.isDate
    },
    // 热度排序
    sortHot (number) {
      this.isFilterActive = number
      this.isHot = !this.isHot
    },
    // 下载
    downloadDocument (document) {
      console.log('下载了' + document)
    },
    // 下拉加载更多
    load () {
      this.currentPage++
      this.getProductOfferDetailPage(true)
    },
    handleChange (value) {
      // 重新搜索产品列表
      this.currentPage = 1
      this.getProductOfferDetailPage()
      // this.$refs.clearSelect.panel.activePath = []
      // this.$refs.clearSelect.panel.syncActivePath()
      // this.$refs.clearSelect.dropDownVisible = false
    },
    resetSelect (flag) {
      if (flag && this.$refs.clearSelect.getCheckedNodes().length === 0) {
        // 重置激活路径，级联下拉框恢复默认，收起展开节点路径面板
        this.$refs.clearSelect.panel.activePath = []
        this.$refs.clearSelect.panel.syncActivePath()
      }
    },
    // 滚动事件
    baojiaScroll (e) {
      const top = e.target.scrollTop
      const boxOne = $('.boxOne').outerHeight(true)
      const item = document.getElementsByClassName('boxTwo')[0]
      const itemHeight = $('.boxTwo').outerHeight(true)
      const box = $('.productList')[0]
      if (top >= boxOne) {
        item.style.position = 'fixed'
        item.style.left = '0'
        item.style.top = '0'
        box.style.paddingTop = itemHeight + 'px'
      } else {
        item.style.position = 'static'
        box.style.paddingTop = 0 + 'px'
      }
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
    // 获取报价信息产品列表
    async getProductOfferDetailPage (flag) {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        offerNumber: this.$route.query.id,
        categoryNumber: this.categoryNumber
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.productList = flag
          ? this.productList.concat(res.data.result.item.items)
          : [...res.data.result.item.items, ...res.data.result.item.items, ...res.data.result.item.items]
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息
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
    // 点击列表进入详情页
    productDetail (number) {
      if (!number) {
        this.$message.error('该产品没有产品编号')
        return false
      }
      this.$router.push({ name: 'offerDetail', params: { id: number, pid: this.$route.query.id } })
    }
  },
  created () {
    this.getProductCategoryList()
    this.getProductOfferByNumber()
    this.getProductOfferDetailPage()
  },
  computed: {
    noMore () {
      return this.totalCount <= this.productList.length
    },
    disabled () {
      return this.$store.state.vueElementLoading || this.noMore
    }
  },
  mounted () {
    if (this.$store.state.screenWidth > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
  },
  watch: {
    '$store.state.screenWidth' (val) {
      if (val > 1024) {
        this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
      }
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.baojia {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  font-size: 0.346667rem;
  &::-webkit-scrollbar {
    display: none;
  }
  .boxTwo{
    width: 100%;
    background-color: #fff;
  }
  .topLayout{
  width: 95%;
  margin: 0 auto;
  .el-row {
    height: 0.933333rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .conText{
      text-align: center;
      color: #165BF7;
      font-size: 0.4rem;
    }
    .offterBtn{
      color: #F7BA24;
      font-size: 0.293333rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      .offterShare{
        font-size: 0.466667rem;
      }
    }
  }
}
  .text {
    font-size: 0.186667rem;
  }

  .item {
    margin-bottom: 0.24rem;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .box-card {
    width: 95%;
    margin: 0 auto;
    border-radius: 0.133333rem;
    @{deep} .el-card__body{
      padding: 0 0.24rem;
    }
    .textContent {
      .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.066667rem;
        p{
          flex: 1;
        }
      }
      .lookInfo{
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 0.826667rem;
        a{
          color: #165af7;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
  .keyWordSearch {
    width: 95%;
    margin: 0.16rem auto;
    height: 0.906667rem;
    background: #eceeef;
    border-radius: 0.453333rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .el-input{
      height: 100%;
      background-color: transparent;
      flex: 1;
      @{deep} input{
        height: 100%;
        background-color: transparent;
        width: 100%;
        border: none;
        font-size: 0.346667rem;
        text-indent: 0.266667rem;
      }
    }
    .el-button{
      width: 1.866667rem;
      height: 100%;
      border-radius: 0.5rem;
      font-size: 0.346667rem;
      background-color: #165AF7;
    }
  }
  .floatSearch {
    width: 95%;
    margin: 0 auto;
    background-color: #fff;
    .categoryList {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      padding: 0.133333rem 0px;
      border-bottom: 1px solid #ebeef5;
      .cates {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @{deep} .el-input__inner {
          width: 2.666667rem;
          padding-right: 0.4rem;
          line-height: 0.533333rem;
        }
      }
    }
    .listTitle {
      width: 100%;
      height: 0.933333rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      border-bottom: 1px solid #ebeef5;
      .listTitleTXT {
        position: relative;
        text-indent: 0.133333rem;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          height: 70%;
          width: 0.066667rem;
          background-color: #165af7;
          transform: translate(0, -50%);
          border-radius: 0 0.066667rem 0.066667rem 0;
        }
      }
      .downloads {
        .el-button {
          font-size: 0.16rem;
          border-radius: 0.266667rem;
          padding: 0.12rem 0.2rem;
          border: 0.013333rem solid #b3d8ff;
        }
      }
    }
    .filterProduct{
      width: 100%;
      display: flex;
      height: 0.8rem;
      align-items: center;
      font-size: 0.32rem;
      color: #707070;
      .priceFilter{
        margin-right: 0.533333rem;
        &:last-of-type {
          margin-right: 0;
        }
      }
      .more{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        i.list{
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          background: url('~@/assets/images/格式化列表.png') no-repeat center;
          background-size: contain;
        }
        i.square{
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          background: url('~@/assets/images/liebiao2.png') no-repeat center;
          background-size: contain;
        }
      }
      .active {
        color: #165AF7;
      }
    }
  }
  .productList {
    width: 95%;
    margin: 0 auto;
    .listItems {
      .listItem {
        margin-bottom: 0.266667rem;
        border-radius: 0.133333rem;
        &:first-of-type {
          margin-top: 0.266667rem;
        }
        @{deep} .el-card__body {
          padding: 0.133333rem;
          .contentBox {
            display: flex;
            justify-content: space-between;
            .left {
            margin-right: 0.133333rem;
            border-radius: 0.133333rem;
            box-sizing: border-box;
            display:flex;
            align-items:center;
            width: 2rem;
            height: 2rem;
            .el-image{
              width: 100%;
              img{
                width: 100%;
              }
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 0.266667rem;
            color: #626262;
              p{
                padding: 2px 0;
                &.productName {
                font-weight: 600;
                color: #000;
              }
              &.productPrice {
                .price {
                  color: #f54d35;
                  font-weight: 500;
                }
              }
            }
          }
          }
          .createDate{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 0.266667rem;
            color: #626262;
            .dateIcon {
              display: block;
              width: 0.266667rem;
              height: 0.266667rem;
              background: url('~@/assets/images/报价分享时间.png') no-repeat center;
              background-size:contain;
              margin-right: 0.066667rem;
            }
          }
        }
      }
    }
    .squareItems{
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .squareItem{
        width: 48%;
        margin-top: 0.24rem;
        @{deep} .el-card__body{
          padding: 0.133333rem;
        }
        .top{
          width: 100%;
          height: 2.32rem;
          .el-image{
            width: 100%;
            height: 2.32rem;
            img {
              width: 100%;
              height: 2.32rem;
            }
          }
        }
        .bottom{
          padding-bottom: 0.066667rem;
          p {
            padding-top: 0.133333rem;
            .price{
              color: #f54d35;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}
</style>
