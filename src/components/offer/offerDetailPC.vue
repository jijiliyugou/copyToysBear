<template>
  <div style="width:100%;margin-left:5px;">
    <div class="berad">
      <el-page-header
        @back="changeIsDetail"
        content="产品详情"
      ></el-page-header>
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
      <div class="cententText" v-if="productDetail">
          <p class="textItem name">产品名称：{{productDetail.name}}</p>
          <p class="textItem">产品货号：{{productDetail.fa_no}}</p>
          <p class="textItem">包装方式：{{productDetail.ch_pa}}</p>
          <p class="textItem">样品规格：{{productDetail.pr_le + " X " + productDetail.pr_wi + " X " + productDetail.pr_hi + "(CM)"}}</p>
          <p class="textItem">外箱规格：{{productDetail.ou_le + " X " + productDetail.ou_wi + " X " + productDetail.ou_hi + "(CM)"}}</p>
          <p class="textItem">装箱量：{{productDetail.in_en + "/" + productDetail.ou_lo + "(PSC)"}}</p>
          <p class="textItem">体积/材积：{{productDetail.bulk_stere + "(CBM)" + "/" + productDetail.bulk_feet + "(CUFT)"}}</p>
          <p class="textItem">毛重/净重：{{productDetail.ne_we + "/" + productDetail.gr_we + "(kg)"}}</p>
          <p class="textItem">报价：<span class="price">{{productDetail.cu_de + (productDetail.price && productDetail.price.toFixed(2))}}</span></p>
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
      imagesList: null,
      companyData: null
    }
  },
  methods: {
    // 获取产品明细
    async getProductByNumber () {
      const id = this.number
      const res = await this.$http.post('/api/GetProductByProductNumber', {
        productNumber: id
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item.bearProduct
        console.log(this.productDetail)
        this.imagesList = res.data.result.item.imglist.map(val => val && (val.imgUrl.replace(/_MiddlePic/, '_Photo')))
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    changeIsDetail () {
      this.$emit('changeIsDetail', false)
    }
  },
  mounted () {
    this.getProductByNumber()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.berad {
  margin-bottom: 5px;
  height: 36px;
  font-size: 16px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  @{deep} .el-page-header__left:hover {
    color: #409eff;
  }
}
.Graphic {
  width: 100%;
  display: flex;
  justify-content: space-between;
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
