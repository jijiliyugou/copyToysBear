<template>
  <div>
    <el-row>
      <el-col :span="2">
        <div class="grid-content bg-purple grid-content-top">
          <img @click="toHome" src="~@/assets/images/bsLogo.png" alt />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light grid-content-top">
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#2468a9"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
          >
            <a style="color:#fff;cursor: pointer;" @click="toHome"
              >小竹熊首页</a
            >
            <el-menu-item index="/meInfo/infoList">我的消息</el-menu-item>
            <el-menu-item index="/orderManage">订单管理</el-menu-item>
            <template v-for="(item, i) in menuList">
              <el-submenu :index="item.linkUrl" :key="i" v-if="item.children">
                <template slot="title">
                  <el-upload
                    :auto-upload="false"
                    v-if="item.linkUrl === '/productSearch'"
                    ref="uploadRef"
                    accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
                    class="upload-demo"
                    :action="baseAPI + '/api/File/SearchPicture'"
                    :headers="headers"
                    :data="{
                      companynumber:
                        $store.state.userInfo &&
                        $store.state.userInfo.commparnyList &&
                        $store.state.userInfo.commparnyList[0] &&
                        $store.state.userInfo.commparnyList[0].companyNumber
                    }"
                    :show-file-list="false"
                    :on-progress="showLoading"
                    :on-change="changeUpload"
                  >
                    <i class="el-icon-camera-solid imgSearch"></i>
                  </el-upload>
                  {{ item.name }}
                </template>
                <el-menu-item
                  v-for="(child, index) in item.children"
                  :index="child.linkUrl"
                  :key="index"
                  >{{ child.name }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item :index="item.linkUrl" v-else :key="item.id">
                <template v-if="item.linkUrl === '/productSearch'">
                  <el-upload
                    :auto-upload="false"
                    ref="uploadRef"
                    accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
                    class="upload-demo"
                    :action="baseAPI + '/api/File/SearchPicture'"
                    :headers="headers"
                    :data="{
                      companynumber:
                        $store.state.userInfo &&
                        $store.state.userInfo.commparnyList &&
                        $store.state.userInfo.commparnyList[0] &&
                        $store.state.userInfo.commparnyList[0].companyNumber
                    }"
                    :show-file-list="false"
                    :on-progress="showLoading"
                    :on-change="changeUpload"
                  >
                    <i class="el-icon-camera-solid imgSearch"></i>
                  </el-upload>
                </template>
                {{ item.name }}
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="4" style="background-color: #2468a9;">
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#2468a9"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="4">
            <template slot="title">个人中心</template>
            <div class="menuItems">
              <el-menu-item class="menuItem" index="/me">账号管理</el-menu-item>
              <li class="signOut" @click="SignOut">登出</li>
            </div>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="isShowCropper" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <center slot="footer" class="dialog-footer">
        <el-button type="info" @click="cropperCancel">取 消</el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
          >左 旋 转</el-button
        >
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >右 旋 转</el-button
        >
        <el-button type="success" @click="onCubeImg" :loading="loading"
          >确认</el-button
        >
      </center>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper: VueCropper
  },
  data () {
    return {
      fileinfo: null,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 500, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      picsList: [], // 页面显示的数组
      // 防止重复提交
      loading: false,
      // 显示裁剪框
      isShowCropper: false,
      activeIndex2: '1',
      dialogVisible: false,
      headers: {
        Utoken:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken
      },
      menuList: []
    }
  },
  methods: {
    // 确定裁剪图片
    onCubeImg () {
      console.log(this.fileinfo)
      this.loading = true
      this.showLoading()
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropBlob(async file => {
        this.option.img = window.URL.createObjectURL(file)
        // 将剪裁后base64的图片转化为file格式
        // let file = this.dataURLtoFile(
        //   data,this.fileinfo.uid

        // );
        // 上传
        const companynumber =
          this.$store.state.userInfo.commparnyList[0] &&
          this.$store.state.userInfo.commparnyList[0].companyNumber
        const fd = new FormData()
        fd.append('companynumber', companynumber)
        fd.append('file', file)
        const res = await this.$http.post('/api/File/SearchPicture', fd)
        if (res.data.result.code === 200) {
          this.cropperCancel()
          this.$store.commit('searchValues', res.data.result.object)
        } else {
          this.cropperCancel()
          this.$store.commit('searchValues', null)
          this.$message.error(res.data.result.message)
        }
        this.$router.push('/searchIndex')
        this.$store.commit('updateAppLoading', false)
      })
    },
    // 取消裁剪
    cropperCancel () {
      this.$refs.cropper.clearCrop()
      this.isShowCropper = false
      this.option.img = ''
      this.loading = false
      this.$refs.uploadRef.value = ''
    },
    // 将base64转换为文件对象
    dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      console.log(mime)
      // 转换成file对象
      // return new File([u8arr], filename + "." + mime.split("/")[1], {
      //   type: mime
      // });
      // 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    },
    // 选取图片 限制图片大小
    changeUpload (file, fileList) {
      this.isShowCropper = true
      const isLt5M = file.size / 1024 / 1024 < 3
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 3MB!')
        return false
      }
      this.fileinfo = file
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(file.raw)
        this.option.img = f
        this.dialogVisible = true
      })
    },
    // 图片搜索时太慢，显示loading
    showLoading () {
      this.$store.commit('updateAppLoading', true)
    },
    handleSelect (key, keyPath) {},
    // 登出
    SignOut () {
      this.$confirm('确定要退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$router.push({ name: 'Login', query: { id: 'signOut' } })
          // location =
          //   "http://127.0.0.1:8080/#/beforeIndex/login?id=signOut"
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出'
          })
        })
    },
    // 关闭
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 去主页
    toHome (e) {
      const href = this.$router.resolve('/beforeIndex/home')
      window.open(href.href, '_blank')
      // window.open("http://127.0.0.1:8080/#/beforeIndex/home", "_blank");
    }
  },

  mounted () {
    this.menuList = this.$store.state.routers.map(val => {
      val.parent.children = val.children
      return val.parent
    })
  },
  computed: {
    // vProps() {
    //   // https://cn.vuejs.org/v2/api/#vm-attrs
    //   // 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。
    //   // 当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。
    //   return { ...this.$props, ...this.$attrs };
    // }
  }
}
</script>

<style lang="less" scoped>
.grid-content-top {
  background-color: #2468a9;
  img {
    width: 60px;
    height: 60px;
    cursor: pointer;
    vertical-align: top;
    float: right;
  }
}
.el-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .toHome {
    color: white;
    display: block;
    height: 60px;
    line-height: 60px;
    margin: 0;
    padding: 0 20px;
    &:hover {
      background-color: rgb(29, 83, 135);
    }
  }
}
.upload-demo {
  position: absolute;
  right: -30px;
  .imgSearch {
    color: black;
    font-size: 24px;
    &:hover {
      color: white;
    }
  }
}
ul.el-menu-demo.el-menu--horizontal.el-menu {
  width: 100%;
}
.grid-content.bg-purple-light.grid-content-top,
.grid-content.bg-purple.grid-content-top {
  height: 60px;
}
.menuItems {
  .signOut {
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    font-size: 14px;
    color: rgb(255, 255, 255);
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background-color: rgb(29, 83, 135);
    }
  }
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
