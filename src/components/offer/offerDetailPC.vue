
<template>
  <div class="offerDetailBox">
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
        <span class="title">商品详情</span>
      </div>
    </div>
    </div>
    <div class="Graphic">
      <div class="left">
        <div class="swiperList">
          <el-image
            fit="contain"
            :src="productDetail && productDetail.imageUrl"
            :preview-src-list="imagesList">
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="cententText">
          <p class="textItem name">产品名称：{{productDetail && productDetail.name}}</p>
          <p class="textItem">出厂货号：{{productDetail && productDetail.fa_no}}</p>
          <p class="textItem">包装方式：{{productDetail && productDetail.ch_pa}}</p>
          <p class="textItem">样品规格：{{productDetail && productDetail.pr_le + " X " + productDetail && productDetail.pr_wi + " X " + productDetail && productDetail.pr_hi + "(CM)"}}</p>
          <p class="textItem">外箱规格：{{productDetail && productDetail.ou_le + " X " + productDetail && productDetail.ou_wi + " X " + productDetail && productDetail.ou_hi + "(CM)"}}</p>
          <p class="textItem">装箱量：{{productDetail && productDetail.in_en + "/" + productDetail && productDetail.ou_lo + "(PCS)"}}</p>
          <p class="textItem">体积/材积：{{productDetail && productDetail.bulk_stere + "(CBM)" + "/" + productDetail && productDetail.bulk_feet + "(CUFT)"}}</p>
          <p class="textItem">毛重/净重：{{productDetail && productDetail.ne_we + "/" + productDetail && productDetail.gr_we + "(kg)"}}</p>
          <p class="textItem">报价：<span class="price">{{productDetail && productDetail.cu_de + (productDetail && productDetail.price && productDetail.price.toFixed(2))}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    number: String,
    pid: String
  },
  data () {
    return {
      isShowSourceDetail: false,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      productDetail: null,
      productInfo: null,
      imagesList: null,
      companyData: null
    }
  },
  methods: {
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', { offerNumber: this.$route.params.pid })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取产品明细
    async getProductByNumber () {
      const res = await this.$http.post('/api/GetProductByProductNumber', {
        productNumber: this.$route.params.id
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item.bearProduct
        this.imagesList = res.data.result.item.imglist.map(val => val && (val.imgUrl.replace(/_MiddlePic/, '_Photo')))
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    changeIsDetail () {
      this.$emit('changeIsDetail', false)
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) this.$router.push({ name: 'offerDetail', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
  },
  watch: {
    '$store.state.screenWidth' (val) { // 监听屏幕宽度变化
      if (val <= 1024) this.$router.push({ name: 'offerDetail', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.offerDetailBox{
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
  .offerCard{
    margin: 10px 0;
    p{
      padding: 5px 0;
    }
  }
}
.Graphic {
  width: 800px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .left {
    width: 400px;
    .swiperList {
      width: 100%;
      cursor: pointer;
      @{deep} .el-image {
        width: 100%;
        .errorImg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  // .right {
    .cententText{
      flex: 1;
      margin-left: 10px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .textItem{
        // margin-bottom: 20px;
        // margin-top: 20px;
        .price{
          color: #ff2505;
        }
      }
      .name{
        font-weight: 600;
      }
    }
  // }
}
.contact {
  margin-top: 20px;
  font-size: 16px;
  margin-bottom: 100px;
  .contactTitleTxt {
    color: white;
    width: 169px;
    height: 60px;
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contactTitleLine {
    border-bottom: 4px solid #ededed;
  }
  .remark {
    padding-top: 20px;
  }
}
</style>
