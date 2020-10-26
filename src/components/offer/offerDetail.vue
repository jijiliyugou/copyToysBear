<template>
  <div class="baojia">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="titleText">报价信息</div>
        <!-- <el-button type="warning" icon="el-icon-edit" size="small"
          >编辑</el-button
        > -->
      </div>
      <div class="text">
        <div class="item">
          报价主题：<span class="content">{{productInfo && productInfo.title}}</span>
        </div>
        <div class="item">
          报价参数：<span class="content">{{productInfo && productInfo.bidPrice}}</span>
        </div>
        <div class="item">
          报价员：<span class="content">{{productInfo && productInfo.linkman}}</span>
        </div>
      </div>
    </el-card>
    <div class="line"></div>
    <div class="backTo">
      <el-page-header
        @back="toOfferSharing"
        content="商品详情"
      ></el-page-header>
    </div>
    <!-- <div slot="header" class="detailTitle">
        <div class="titleText">商品详情</div>
      </div> -->
    <div class="centent"  v-if="productDetail">
      <div class="img">
        <el-image :preview-src-list="imagesList" style="width: 100%;"
      :src="productDetail.imageUrl"
      fit="contain"></el-image>
      </div>
      <div class="cententText">
        <p class="textItem name">{{productDetail.name}}</p>
        <p class="textItem">货号：{{productDetail.fa_no}}</p>
        <p class="textItem">包装方式：{{productDetail.ch_pa}}</p>
        <p class="textItem">样品规格：{{productDetail.pr_le + " X " + productDetail.pr_wi + " X " + productDetail.pr_hi + "(CM)"}}</p>
        <p class="textItem">外箱规格：{{productDetail.ou_le + " X " + productDetail.ou_wi + " X " + productDetail.ou_hi + "(CM)"}}</p>
        <p class="textItem">装箱量：{{productDetail.in_en + "/" + productDetail.ou_lo + "(PCS)"}}</p>
        <p class="textItem">体积/材积：{{productDetail.bulk_stere + "(CBM)" + "/" + productDetail.bulk_feet + "(CUFT)"}}</p>
        <p class="textItem">毛重/净重：{{productDetail.ne_we + "/" + productDetail.gr_we + "(kg)"}}</p>
        <p class="textItem">报价：<span class="price">{{productDetail.cu_de + (productDetail.price && productDetail.price.toFixed(2))}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productDetail: null,
      imagesList: [],
      productInfo: null,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    toOfferSharing () {
      this.$router.go(-1)
    },
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
      const id = this.$route.params.id
      const res = await this.$http.post('/api/GetProductByProductNumber', {
        productNumber: id
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item.bearProduct
        this.imagesList = res.data.result.item.imglist.map(val => val && (val.imgUrl.replace(/_MiddlePic/, '_Photo')))
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {},
  watch: {
    '$store.state.screenWidth' (val) { // 监听屏幕宽度变化
      if (val > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.params.pid)
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.baojia {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 0.266667rem;
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 0.24rem;
    &:last-of-type{
      margin-bottom: 0;
    }
  }
 .box-card{
    width: 95%;
    margin: 0.4rem auto 0 auto;
    @{deep} .el-card__header {
      padding:0.133333rem;
    }
     @{deep} .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .titleText{
          font-weight: 600;
          position: relative;
          text-indent: 0.133333rem;
          &::before{
            content:'';
            position: absolute;
            left: 0;
            top: 50%;
            height: 70%;
            width: 4px;
            background-color: #165af7;
            transform:translate(0, -50%);
            border-radius: 0 5px 5px 0;
          }
        }
      }
  }
  .line{
    width: 100%;
    height: 100%;
    height: 0.266667rem;
    background: #F5F5F5;
  }
  .backTo{
    padding: 0.133333rem;
    border-bottom: 1px solid #EBEEF5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .centent{
    padding: 0.133333rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .img{
      flex: 1;
      display: flex;
      align-items: center;
      padding-right: 0.133333rem;
      box-sizing: border-box;
    }
    .cententText{
      flex: 2;
      .textItem{
        margin-bottom: 0.133333rem;
        .price{
          color: #ff2505;
        }
      }
      .name{
        font-weight: 600;
      }
    }
  }
  // @{deep} .detailTitle {
  //       display: flex;
  //       padding:  0.133333rem 0.266667rem;
  //       justify-content: space-between;
  //       align-items: center;
  //       .titleText{
  //         font-weight: 600;
  //         position: relative;
  //         text-indent: 0.133333rem;
  //         &::before{
  //           content:'';
  //           position: absolute;
  //           left: 0;
  //           top: 50%;
  //           height: 70%;
  //           width: 4px;
  //           background-color: #165af7;
  //           transform:translate(0, -50%);
  //           border-radius: 0 5px 5px 0;
  //         }
  //       }
  //     }
}
</style>
