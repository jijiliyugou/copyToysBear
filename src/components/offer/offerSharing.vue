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
          <el-image fit="contain" style="width:0.533333rem;height:0.533333rem;" :src="productInfo && productInfo.companyLogo" lazy>
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
        <el-col :span="12"><div class="grid-content bg-purple conText">{{(productInfo && productInfo.companyName) || '小竹熊'}}的分享</div></el-col>
         <el-col :span="6">
          <el-popover
          placement="bottom"
          title="复制链接地址"
          trigger="click">
           <div style="display:flex;align-items:center;">
            <div id="copyUrl" style="height:30px;border:1px solid #DCDFE6;line-height:30px;overflow: hidden;fontSize:0.16rem;white-space: nowrap;text-overflow:ellipsis;maxWidth: 5.333333rem" disabled>{{url}}</div><el-button size="small" @click="copyUrl">复制</el-button>
          </div>
          <el-button class="grid-content bg-purple offterBtn" slot="reference"><i class="offterShare el-icon-share"></i> 分享</el-button>
          </el-popover>
          </el-col>
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
            productInfo && productInfo.linkman || "小竹熊为您服务咯"
          }}</span>
          </p>
        </div>
        <div class="dates">
          <p class="dateIconBox"><i class="dateIcon"></i>{{ productInfo && productInfo.createdOn && productInfo.createdOn.split('T')[0] }}</p>
          <a @click="toContact" class="lookInfo">查看联系方式></a>
        </div>
      </div>
    </el-card>
  </div>
  <div class="boxTwo">
    <div class="keyWordSearch">
      <el-input v-model="keyword" clearable @keyup.enter.native="search" placeholder="请输入搜索关键字"></el-input>
      <el-button type="primary" @click="search" round>搜索</el-button>
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
        <p :class="{'priceFilter': true, 'active': sortOrder === 1}" @click="sortPrice(1)">产品单价 <i v-show="isPrice === 0" class="iconfont icon-paixu"></i><i v-show="isPrice === 1" class="el-icon-arrow-down"></i><i v-show="isPrice === 2" class="el-icon-arrow-up"></i></p>
        <p :class="{'priceFilter': true, 'active': sortOrder === 2}" @click="sortDate(2)">新增时间  <i v-show="isDate === 0" class="iconfont icon-paixu"></i><i class="el-icon-arrow-down" v-show="isDate === 1"></i><i v-show="isDate === 2" class="el-icon-arrow-up"></i></p>
        <p :class="{'priceFilter': true, 'active': sortOrder === 3}" @click="sortHot(3)">产品热度  <i v-show="isHot === 0" class="iconfont icon-paixu"></i><i class="el-icon-arrow-down" v-show="isHot === 1"></i><i v-show="isHot === 2" class="el-icon-arrow-up"></i></p>
        <div class="more">
          <i v-show="isList" class="list" @click="checkList"></i>
          <i v-show="!isList" class="square" @click="checkList"></i>
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
          @click.stop.native="productDetail(item.id)"
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
              出厂价：<span class="price">{{
                item.cu_de + item.unitPrice.toFixed(2)
              }}</span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.offerAmount.toFixed(2)
              }}</span>
            </p>
          </div>
          </div>
          <div class="createDate"><i class="dateIcon"></i>{{ item && item.createdOn && item.createdOn.split('T')[0] }}</div>
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
              出厂价：<span class="price">{{
                item.cu_de + item.unitPrice.toFixed(2)
              }}</span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.offerAmount.toFixed(2)
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
      url: window.location.href,
      keyword: null,
      productInfo: null,
      productList: [],
      currentPage: 1,
      pageSize: 10,
      categoryList: [],
      categoryNumber: '',
      totalCount: 0,
      isList: true,
      isDate: 0,
      isHot: 0,
      isPrice: 0,
      sortOrder: 0,
      sortType: null
    }
  },
  methods: {
    // 关键字搜索
    search () {
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 复制
    copyUrl () {
      var div = document.getElementById('copyUrl')
      var range
      if (document.body.createTextRange) {
        range = document.body.createTextRange()
        range.moveToElementText(div)
        range.select()
      } else if (window.getSelection) {
        var selection = window.getSelection()
        range = document.createRange()
        range.selectNodeContents(div)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        console.warn('none')
      }
      document.execCommand('Copy') // 执行浏览器复制命令
      // console.warn('none')
      this.$message.success('已复制好，可贴粘。')
    },
    // 查看联系方式
    toContact (e) {
      this.$router.push({ name: 'offerContact', params: { id: this.$route.query.id } })
    },
    // 切换列表
    checkList () {
      this.isList = !this.isList
    },
    // 价格排序
    sortPrice (number) {
      this.sortOrder = number
      this.sortType = this.isPrice = this.isPrice === 1 ? 2 : 1
      this.isHot = this.isDate = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 时间排序
    sortDate (number) {
      this.sortOrder = number
      this.sortType = this.isDate = this.isDate === 1 ? 2 : 1
      this.isHot = this.isPrice = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 热度排序
    sortHot (number) {
      this.sortOrder = number
      this.sortType = this.isHot = this.isHot === 1 ? 2 : 1
      this.isDate = this.isPrice = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
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
        categoryNumber: this.categoryNumber,
        keyword: this.keyword,
        sortOrder: this.sortOrder,
        sortType: this.sortType
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      console.log(fd)
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.productList = flag
          ? this.productList.concat(res.data.result.item.items)
          : res.data.result.item.items
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
  font-size: 0.32rem;
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
      border: none;
      .offterShare{
        font-size: 0.466667rem;
      }
    }
    .el-popover__reference{
      background-color: transparent;
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
      display: flex;
      flex-direction:column;
      justify-content: space-around;
      padding:10px 0;
      .top{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        min-height: 1.066667rem;
        p{
          flex: 1;
        }
      }
      .dates{
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #626262;
      .dateIconBox{
        display: flex;
        align-items: center;
        .dateIcon{
        width: 0.266667rem;
        height: 0.266667rem;
        margin-right: 0.066667rem;
        border-radius: 50%;
        overflow: hidden;
        background:url('~@/assets/images/报价分享时间.png') no-repeat center;
        background-size: contain;
        }
      }
      .lookInfo{
          color: #165af7;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
    }
    }
  }
  .keyWordSearch {
    width: 95%;
    margin: 0.266667rem auto;
    height: 0.8rem;
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
        // font-size: 0.346667rem;
        font-size: 0.32rem;
        text-indent: 0.266667rem;
      }
    }
    .el-button{
      width: 1.866667rem;
      height: 100%;
      border-radius: 0.5rem;
      // font-size: 0.346667rem;
      font-size: 0.32rem;
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
      padding-bottom: 0.133333rem;
      // font-size: 0.266667rem;
      border-bottom: 1px solid #ebeef5;
      .cates {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @{deep} .el-input__inner {
          width: 2.666667rem;
          font-size: 0.266667rem;
          padding-right: 0.4rem;
          height: 0.666667rem;
          line-height: 0.666667rem;
        }
         @{deep} .el-select__caret {
          position: relative;
          &::before, &::after {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
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
      font-size: 0.293333rem;
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
            align-items: center;
            .left {
            margin-right: 0.133333rem;
            border-radius: 0.133333rem;
            box-sizing: border-box;
            display:flex;
            align-items:center;
            width: 2rem;
            height: 2rem;
            // border: 1px solid #000;
            .el-image{
              width: 100%;
              height: 100%;
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
            // border: 1px solid #000;
            // font-size: 0.266667rem;
            font-size: 0.32rem;
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
            margin-top: 0.133333rem;
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
          color: #626262;
          p {
            padding-top: 0.133333rem;
            &.productName{
              color: #000;
              font-weight: 500;
            }
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

.el-select-dropdown__wrap {
    max-height: 3.653333rem;
    .el-select-dropdown__list {
    padding: 0.08rem 0;
    .el-select-dropdown__item{
      font-size: 0.266667rem;
      padding: 0 0.266667rem;
      height: 0.666667rem;
      line-height: 0.666667rem;
    }
  }
}
</style>
