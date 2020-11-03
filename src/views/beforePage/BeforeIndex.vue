<template>
    <el-container>
      <el-header style="padding:0;" height="260px">
        <beforeTop class="beforeTop"></beforeTop>
      </el-header>
      <el-main style="padding:0;min-width: 900px;overflow: visible;">
        <router-view></router-view>
      </el-main>
      <el-footer style="padding:0;" height="172px">
        <bsFooter></bsFooter>
      </el-footer>
    </el-container>
</template>

<script>
import beforeTop from '@/components/beforeTop'
import bsFooter from '@/components/Footer'
export default {
  components: {
    beforeTop, bsFooter
  }
}
</script>

<style lang="less" scoped>
</style>
