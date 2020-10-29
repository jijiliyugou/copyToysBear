
<template>
  <div class="offerDetailBox">
    <div class="topLayout">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-image fit="contain" src="~@/assets/images/imgError.jpg" lazy>
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 1.066667rem; height: 1.066667rem; margin: 0 auto"
            >
              <img
                class="errorImg"
                style="width: 1.066667rem; height: 1.066667rem"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 1.066667rem; height: 1.066667rem; margin: 0 auto"
            >
              <img
                class="errorImg"
                style="width: 1.066667rem; height: 1.066667rem"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
        </el-col>
        <el-col :span="12"
          ><div class="grid-content bg-purple conText">玩具厂分享</div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple offterBtn">
            <i class="offterShare el-icon-share"></i> 分享
          </div></el-col
        >
      </el-row>
    </div>
    <div class="offerInfo">
      <div class="navBar">
        <div class="navBarTitle">
          <span class="title">基本信息</span>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div class="text-item">公司名称：<span>竹熊玩具厂</span></div>
      <div class="text-item addr" @click="openMap">
        <div class="left">
          地<em style="opacity: 0">地区</em>区：<span>民乐科技大厦</span>
        </div>
        <div class="right"></div>
      </div>
      <div class="text-item">产品数量：<span>888只</span></div>
      <div class="text-item lianxi">
        我要联系：<el-popover
          placement="bottom"
          trigger="click"
          content="13838389438"
        >
          <el-button
            slot="reference"
            icon="el-icon-phone-outline"
            type="danger"
            round
            >联系电话</el-button
          >
        </el-popover>
      </div>
    </el-card>
    <div class="fanhui">
        <el-button size="mini" @click="backtrackPage" round icon="iconfont icon-fanhui">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productInfo: null,
      address: '坂田星河wrold'
    }
  },
  methods: {
    // 返回
    backtrackPage () {
      this.$router.go(-1)
    },
    // 打开地图
    openMap () {
      const mapAttr =
        'https://api.map.baidu.com/geocoder?address=' +
        this.address +
        '&output=html&src=webapp.baidu.openAPIdemo'
      window.open(mapAttr)
    },
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.params.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductOfferByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) {
      this.$router.push({
        name: 'offerContact',
        params: { id: this.$route.params.id }
      })
    }
  },
  watch: {
    '$store.state.screenWidth' (val) {
      // 监听屏幕宽度变化
      if (val <= 1024) {
        this.$router.push({
          name: 'offerContact',
          params: { id: this.$route.params.id }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.offerDetailBox {
  .topLayout {
    width: 95%;
    margin: 0 auto;
    .el-row {
      height: 1.066667rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .conText {
        text-align: center;
        color: #165bf7;
        font-size: 0.4rem;
      }
      .offterBtn {
        color: #f7ba24;
        font-size: 0.293333rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        .offterShare {
          font-size: 0.466667rem;
        }
      }
    }
  }
  .offerInfo {
    .navBar {
      background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
      .navBarTitle {
        width: 95%;
        font-size: 0.32rem;
        height: 0.666667rem;
        display: flex;
        text-indent: 0.133333rem;
        margin: 0 auto;
        align-items: center;
        .title {
          position: relative;
          font-weight: 600;
          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            height: 70%;
            width: 0.053333rem;
            background-color: #165af7;
            transform: translate(0, -50%);
            border-radius: 0 0.066667rem 0.066667rem 0;
          }
        }
      }
    }
  }
  .box-card {
    width: 95%;
    margin: 0 auto;
    .text-item {
      display: flex;
      align-items: center;
      height: 0.533333rem;
      &.addr {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .right {
          width: 0.28rem;
          height: 0.386667rem;
          background: url("~@/assets/images/分享定位地址.png") no-repeat center;
          background-size: contain;
        }
      }
      &.lianxi {
        margin-top: 0.4rem;
        font-size: 0.266667rem;
        font-weight: 600;
        .el-button {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.013333rem;
        height: 0.733333rem;
        border-radius: 0.373333rem;
        background: #e60012;
        color: #fff;
        font-size: 0.266667rem;
        @{deep} .el-icon-phone-outline {
            font-size: 0.333333rem;
        }
        }
      }
    }
  }
  .fanhui{
    width: 95%;
    margin: 0 auto;
    margin-top: 0.266667rem;
    display: flex;
    justify-content: flex-end;
    .el-button{
        background-color:#165af7;
        color: #fff;
        @{deep} .iconfont{
            margin-right: 0.066667rem;
        }
    }
  }
}
</style>
