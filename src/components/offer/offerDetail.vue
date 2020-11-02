<template>
  <div class="baojia">
   <div class="topLayout">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-image fit="contain"  style="width:0.533333rem;height:0.533333rem;" :src="productInfo && productInfo.companyLogo" lazy>
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
            <div id="copyUrl" style="height:30px;border:1px solid #DCDFE6;line-height:30px;" disabled>{{url}}</div><el-button size="small" @click="copyUrl">复制</el-button>
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
            productInfo && productInfo.linkman
          }}</span>
          </p>
        </div>
        <div class="dates">
          <p class="dateIconBox"><i class="dateIcon"></i>{{ productInfo && productInfo.createdOn && productInfo.createdOn.split('T')[0] }}</p>
          <a @click="toContact" class="lookInfo">查看联系方式></a>
        </div>
      </div>
    </el-card>
    <!-- <div class="backTo">
      <el-page-header
        @back="toOfferSharing"
        content="商品详情"
      ></el-page-header>
    </div> -->
    <div class="listTitle">
      <span class="listTitleTXT">商品详情</span>
      <span class="backtrack" @click="backtrackPage"><i class="backtrackIcon iconfont icon-fanhui"></i> 返回</span>
    </div>
    <!-- <div slot="header" class="detailTitle">
        <div class="titleText">商品详情</div>
      </div> -->
    <div class="centent"  v-if="productDetail">
      <div class="imgBox">
        <el-image :preview-src-list="imagesList" style="width: 100%;"
      :src="productDetail.imageUrl"
      fit="contain"></el-image>
      </div>
      <div class="cententText">
        <p class="textItem name">{{productDetail.name}}</p>
        <p class="textItem">出厂货号：{{productDetail.fa_no}}</p>
        <p class="textItem">包装方式：{{productDetail.ch_pa}}</p>
        <p class="textItem">样品规格：{{productDetail.pr_le + " X " + productDetail.pr_wi + " X " + productDetail.pr_hi + "(CM)"}}</p>
        <p class="textItem">外箱规格：{{productDetail.ou_le + " X " + productDetail.ou_wi + " X " + productDetail.ou_hi + "(CM)"}}</p>
        <p class="textItem">装箱量：{{productDetail.in_en + "/" + productDetail.ou_lo + "(PCS)"}}</p>
        <p class="textItem">体积/材积：{{productDetail.bulk_stere + "(CBM)" + "/" + productDetail.bulk_feet + "(CUFT)"}}</p>
        <p class="textItem">毛重/净重：{{productDetail.ne_we + "/" + productDetail.gr_we + "(kg)"}}</p>
        <p class="textItem">报价：<span class="price">{{productDetail.cu_de + (productDetail.price && productDetail.price.toFixed(2))}}</span></p>
      </div>
      <p class="createDate"><i class="createDateIcon"></i> 2020-10-24</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: window.location.href.split('/#/')[0] + '/#/offerSharing?id=' + this.$route.params.pid,
      productDetail: null,
      imagesList: [],
      productInfo: null,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    // 查看联系方式
    toContact () {
      if (this.productInfo.companyId) {
        this.$router.push({ name: 'offerContactPC', params: { id: this.$route.params.pid, companyId: this.productInfo.companyId } })
      } else {
        this.$router.push({ name: 'offerContactPC', params: { id: this.$route.params.pid, companyId: (this.productInfo.companyId || 123) } })
      }
    },
    // 返回
    backtrackPage () {
      this.$router.go(-1)
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
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth > 1024) this.$router.push({ name: 'offerDetailPC', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
  },
  watch: {
    '$store.state.screenWidth' (val) {
      if (val > 1024) this.$router.push({ name: 'offerDetailPC', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
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
  font-size: 0.346667rem;
  .item {
    margin-bottom: 0.24rem;
    &:last-of-type{
      margin-bottom: 0;
    }
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
      padding-right: 0;
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
      .dates{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      color: #626262;
      font-size: 0.266667rem;
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
  .line{
    width: 100%;
    height: 100%;
    height: 0.266667rem;
    background: #F5F5F5;
  }
  .listTitle {
      width: 95%;
      margin: 0 auto;
      margin-top: 0.066667rem;
      height: 0.933333rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      box-sizing: border-box;
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
          border-radius: 0 5px 5px 0;
        }
      }
      .backtrack{
        font-weight: normal;
        cursor: pointer;
        display: flex;
        align-items: center;
        i{
          margin-right: 0.066667rem;
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
  .backTo{
    font-size: 0.24rem;
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
    position: relative;
    .createDate{
      position: absolute;
      bottom: 0.266667rem;
      left: 0.133333rem;
      display: flex;
      color: #707070;
      font-size: 0.293333rem;
      align-items: center;
      .createDateIcon{
        display: block;
        width: 0.266667rem;
        height: 0.266667rem;
        background: url('~@/assets/images/报价分享时间.png') no-repeat center;
        background-size:contain;
        margin-right: 0.066667rem;
      }
    }
    .imgBox{
      flex: 1;
      height: 100%;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 0.133333rem;
      box-sizing: border-box;
    }
    .cententText{
      color: #707070;
      font-size: 0.293333rem;
      flex: 2;
      .textItem{
        margin-bottom: 0.133333rem;
        .price{
          color: #ff2505;
        }
      }
      .name{
        color: #000;
        font-weight: 600;
      }
    }
  }
}
</style>
