<template>
    <el-container>
      <el-header style="padding:0; height:160px;">
        <beforeTop class="beforeTop"></beforeTop>
      </el-header>
      <el-main style="padding:0;min-width: 1024px;overflow: visible;display: flex;">
        <router-view></router-view>
      </el-main>
      <!-- <el-footer style="padding:0;" height="162px">
        <bsFooter></bsFooter>
      </el-footer> -->
    </el-container>
</template>

<script>
import beforeTop from '@/components/beforeTop'
// import bsFooter from '@/components/Footer'
export default {
  components: {
    beforeTop
  }
}
</script>

<style lang="less" scoped>
</style>
