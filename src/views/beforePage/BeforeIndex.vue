<template>
  <div>
    <beforeTop class="beforeTop"></beforeTop>
    <router-view class="contentWrap"></router-view>
  </div>
</template>

<script>
import beforeTop from '@/components/beforeTop'
export default {
  components: {
    beforeTop
  }
}
</script>

<style lang="less" scoped>
// .contentWrap {
// max-width: 1200px;
// margin: 0 auto;
// }
</style>
