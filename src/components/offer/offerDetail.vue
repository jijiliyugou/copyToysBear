<template>
  <div class="xiangqing">
    <div class="title">
      <i class="el-icon-arrow-left" @click="toOfferSharing"></i>
      产品详情
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    toOfferSharing () {
      this.$router.go(-1)
    }
  },
  created () {
  },
  mounted () {}
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.xiangqing {
  width: 100%;
  height: 100%;
  font-size: 0.266667rem;
  .title{
    height: 0.8rem;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    i{
      position: absolute;
      left: 0.133333rem;
      font-size: 0.266667rem !important;
      width: 0.8rem;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
