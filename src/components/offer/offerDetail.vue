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
          报价员：<span class="content">吴邪</span>
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
    <div class="centent">
      <div class="img">
        <el-image :preview-src-list="['http://139.9.71.135:8087/ProductImg/Productdefault/Productdefault.png']" style="width: 100%;"
      :src="'http://139.9.71.135:8087/ProductImg/Productdefault/Productdefault.png'"
      fit="contain"></el-image>
      </div>
      <div class="cententText">
        <p class="textItem name">儿童益智飞机大炮好牛B啊，你咋不上天咧</p>
        <p class="textItem">货号：HS00402587</p>
        <p class="textItem">包装方式：PVP卡头套</p>
        <p class="textItem">样品规格：29x3x22(CM)</p>
        <p class="textItem">外箱规格：29x3x22(CM)</p>
        <p class="textItem">装箱量：内核数/装箱数</p>
        <p class="textItem">体积/材积：20.0CM/13.02CM</p>
        <p class="textItem">毛重/净重：20.0kg/13.02kg</p>
        <p class="textItem">报价：<span class="price">￥100.00</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      const res = await this.$http.post('/api/GetProductOfferByNumber', { skipCount: this.currentPage, maxResultCount: this.pageSize, offerNumber: this.$route.params.pid })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取产品明细
    async getProductByNumber () {
      const id = this.$route.params.id
      const res = await this.$http.post('/api/BearProductByNumber', {
        productNumber: id
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item
        this.imagesList = res.data.result.item.imglist
          ? res.data.result.item.imglist
          : []
      }
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {}
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
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
