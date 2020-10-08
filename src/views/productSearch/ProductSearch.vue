<template>
  <div style="min-height:757px;">
    <bsTop></bsTop>
    <productSearchTop></productSearchTop>
    <ul class="hotSearch">
      <li>热门搜搜</li>
      <li
        @click="toSearchIndex(item.productName)"
        v-for="(item, i) in hotWords"
        :key="i"
      >
        {{ item.productName }}
      </li>
    </ul>
    <div class="lunbo">
      <h5>
        新品推荐
        <span class="gengduo" @click="$router.push('/searchIndex')"
          >查看更多</span
        >
      </h5>
      <template v-if="!carouselList || carouselList.length === 0">
        <div class="zanwuchanpin"></div>
      </template>
      <div class="lunboContent" v-else>
        <el-carousel :interval="2000" type="card">
          <el-carousel-item
            class="carouselItem"
            v-for="(item, i) in carouselList"
            :key="i"
            @click.native="toHotRecommend(item)"
          >
            <el-image fit="contain" :src="item.img" :key="item.img">
              <div
                slot="placeholder"
                class="image-slot"
                style="width:300px;margin:0 auto;"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/zanwutupian2.png"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width:300px;margin:0 auto;"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/jiazaishibai.png"
                  alt
                />
              </div>
            </el-image>
            <div class="item-content">
              <p class="item-title">产品名称：{{ item.name }}</p>
              <div class="item-detail line-2">
                产品编号：{{ item.productNumber }}
              </div>
              <p class="item-price">
                价格：
                <span
                  >{{ item.cu_de
                  }}{{ item.price === 0 ? "???" : item.price.toFixed(2) }}</span
                >
              </p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import bsTop from '@/components/BsTop'
import productSearchTop from '@/components/productSearchTop'
export default {
  components: { bsTop, productSearchTop },
  data () {
    return {
      hotWords: [],
      carouselList: [],
      currentPage: 1,
      pageSize: 20
    }
  },
  methods: {
    // 去产品列表
    toHotRecommend (item) {
      this.$router.push({
        path: '/hotRecommend',
        query: { id: item.productNumber }
      })
    },
    async toSearchIndex (val) {
      this.$store.commit('searchTxtValues', val)
      this.$router.push({ path: '/searchIndex' })
    },
    // 获取搜索热词
    async getHotWord () {
      const res = await this.$http.post('/api/GetHotWord', {})
      if (res.data.result.code === 200) {
        this.hotWords = res.data.result.item
      } else {
        this.$message.error(res.data.result.item.message)
      }
    },
    // 获取新品推荐
    async getNewArrivalsPage () {
      const res = await this.$http.post('/api/GetNewArrivalsPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.carouselList = res.data.result.item.items
      } else {
        this.$message.error(res.data.result.item.message)
      }
    }
  },
  mounted () {
    this.getHotWord()
    this.getNewArrivalsPage()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.mySearchBox {
  width: 100%;
  text-align: center;
  margin: 30px 0;
  .myCamera {
    color: black;
    font-size: 22px;
    cursor: pointer;
  }
}
.hotSearch {
  width: 100%;
  display: flex;
  justify-content: center;
  li {
    margin: 0 10px;
    font-size: 12px;
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
    &:first-child {
      color: black;
      cursor: default;
      &:hover {
        color: black;
      }
    }
  }
}
.lunbo {
  width: 1200px;
  margin: 100px auto 10px auto;
  padding: 10px;
  box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
  .gengduo {
    float: right;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  @{deep} .lunboContent {
    padding-top: 20px;
    @{deep} .el-carousel {
      height: 420px;
      @{deep} .carouselItem {
        height: 400px;
        border: 1px solid #e4edfa;
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
        background-color: #fff;
        @{deep} .el-image {
          width: 100%;
          height: 300px;
          img {
            width: 100%;
            height: 300px;
            vertical-align: top;
            transition: all 1s;
          }
        }
        .item-content {
          height: 100px;
          padding: 10px 20px;
          box-shadow: inset 0px 2px 3px -1px #e0e0e0;
          font-size: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          .item-price {
            display: flex;
            span {
              color: #f56c6c;
            }
          }
        }
        &:hover {
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
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

// 轮播
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item.carouselItem.is-active.el-carousel__item--card.is-in-stage {
  margin: 0 20px;
}
</style>
