<template>
  <div style="width:100%;">
    <div class="banner">
      <div class="bannerContent">
        <div class="left">
          <div class="contactType">
            <span>
              <i class="iconfont icon-dianhua"></i>热线电话：0754-89861122
            </span>
            <span>
              在线客服：
              <i class="qqBg" @click="toQQ"></i>
            </span>
          </div>
        </div>
        <div class="middle">
          小竹熊欢迎您
        </div>
        <div class="right">
          <div class="loginTitle">
            <div class="myLogin" v-if="!isLogin">
                <button class="loginBtn" @click="toLogin">登录</button>
            </div>
            <div class="user" v-else>
              <div class="userImage" @click="toMe">
                <el-avatar
                  icon="el-icon-user-solid"
                  @error="errorHandler"
                  size="small"
                ></el-avatar>
                {{ userInfo.userInfo && userInfo.userInfo.linkman }}
              </div>
              <a class="tuichu" width="20" @click="SignOut">退出</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      baseImg: '',
      // 显示裁剪框
      isShowCropper: false,
      loading: false,
      fileinfo: null,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        full: false, // 是否输出原图比例的截图
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 1000, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        canMove: true, // 图片是否可移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      menuList: [
        { name: '首页', url: '/beforeIndex/home' },
        { name: '展厅', url: '/beforeIndex/showroom' },
        { name: '公司', url: '/beforeIndex/buyers' },
        { name: '供应商', url: '/beforeIndex/supplier' },
        { name: '产品', url: '/beforeIndex/product' },
        { name: '找样信息', url: '/beforeIndex/findSamInfo' },
        { name: '采购信息', url: '/beforeIndex/purchaseInfo' },
        { name: '展会', url: '/beforeIndex/exhibition' }
      ]
    }
  },
  methods: {
    toLogin () {
      this.$router.push({ path: '/beforeIndex/login' })
    },
    errorHandler () {
      return true
    },
    toMe () {
      const href = this.$router.resolve('/me')
      window.open(href.href, '_blank')
      // window.open("http://127.0.0.1:8081/#/me", "_blank");
    },
    toProductSearch () {
      this.$root.eventHub.$emit('searchBeforeProduct')
      this.$router.push({ name: 'Product' })
    },
    // 确定裁剪图片
    onCubeImg () {
      this.loading = true
      // 获取cropper的截图的 数据
      this.$refs.cropper.getCropBlob(async file => {
        const urlPreView = URL.createObjectURL(file)
        this.option.img = urlPreView
        this.$store.commit('handlerBeforeSearchImgPreview', { img: urlPreView, baseImg: this.baseImg })
        // 上传
        const companyNumber = this.$store.state.userInfo.commparnyList
          ? this.$store.state.userInfo.commparnyList[0].companyNumber
          : 'Tourist'
        const fd = new FormData()
        fd.append('companynumber', companyNumber)
        fd.append('file', file)
        try {
          const res = await this.$http.post('/api/File/SearchPicture', fd)
          if (res.data.result.code === 200) {
            this.cropperCancel()
            this.$store.commit('handlerBeforeSearchImg', res.data.result.object)
          } else {
            this.cropperCancel()
            this.$store.commit('handlerBeforeSearchImg', null)
            this.$message.error(res.data.result.message)
          }
          this.$router.push('/beforeIndex/product')
        } catch (error) {
          this.cropperCancel()
        }
      })
    },
    // 取消裁剪
    cropperCancel () {
      this.$refs.cropper.clearCrop()
      this.isShowCropper = false
      this.loading = false
      this.option.img = ''
      this.$refs.uploadRef && (this.$refs.uploadRef.value = '')
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
      return new File([u8arr], filename + '.' + mime.split('/')[1], {
        type: mime
      })
      // 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    },
    // 图片上传
    async upLoadImgSearch (file) {
      const companyNumber = this.$store.state.userInfo.commparnyList
        ? this.$store.state.userInfo.commparnyList[0].companyNumber
        : 'Tourist'
      console.log(companyNumber)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('companyNumber', companyNumber)
      const res = await this.$http.post('/api/File/SearchPicture', fd)
      if (res.data.result.code === 200) {
        this.$store.commit(
          'handlerBeforeSearchImg',
          res.data.result.object.result
        )
        this.$router.push('/beforeIndex/product')
      } else {
        this.$store.commit('handlerBeforeSearchImg', null)
        this.$message.error(res.data.result.message)
      }
    },
    // 选择图片搜索
    changeUpload (e) {
      this.fileinfo = e.target.files[0]
      const isLt5M = this.fileinfo.size / 1024 / 1024 < 3
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 3MB!')
        this.option.img = ''
        this.$refs.uploadRef.value = ''
        return false
      }
      this.isShowCropper = true

      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(this.fileinfo)
        this.baseImg = this.option.img = f
        this.dialogVisible = true
      })
    },
    // 登出
    SignOut () {
      // this.dialogVisible = true;
      this.$confirm('确定要退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$router.push({ name: 'Login', query: { id: 'signOut' } })
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出'
          })
        })
    },
    // 联系客服
    toQQ () {
      window.open('tencent://message/?uin=3300802838&Site=Sambow&Menu=yes', '_blank')
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  mounted () {
  }
  // beforeDestroy () {
  //   this.$store.commit('handlerBeforeSearchImgPreview', null)
  // }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/globalVariable.less";
@deep: ~">>>";
.banner {
  min-width: 1024px;
  width: 100%;
  overflow: visible;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  .bannerContent {
    max-width: 1200px;
    overflow: visible;
    min-width: 1024px;
    margin: 0 auto;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
     color:#797979;
    .left,.right,.middle{
      flex:1;
    }
    .middle{
      text-align: center;
      color: #000;
      font-weight: 600;
      font-size: 20px;
    }
    .left {
      .contactType {
        font-size: 12px;
        display: flex;
        align-items: center;
        // text-indent: 2em;
        span {
          display: flex;
          align-items: center;
          &:last-of-type {
            margin-left: 50px;
          }
          i {
            margin-right: 10px;
            &.icon-dianhua {
              font-size: 18px;
            }
          }
          .qqBg {
            display: block;
            width: 16px;
            height: 16px;
            background: url("~@/assets/images/qq.png") center center;
            background-size: 90%;
            cursor: pointer;
          }
        }
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      .loginTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .myLogin {
          font-size: 12px;
          .loginBtn{
            color: #3872f8;
            border: 1px solid #3872f8;
            background-color: #fff;
            padding: 5px 30px;
            border-radius: 5px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            &:hover{
              background-color: #ecf5ff;
            }
          }
        }
        .user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .userImage {
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 14px;
            .el-avatar {
              background-color: rgb(230, 230, 230);
              margin-right: 10px;
              color:#797979;
            }
          }
          .tuichu {
            color:#797979;
            margin-left: 20px;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

// .grid-content-top {
//   height: 110px;
//   display: flex;
//   align-items: center;
//   .logo {
//     width: 110px;
//     height: 110px;
//   }
//   @{deep} input.el-input--suffix, @{deep} input.el-input__inner {
//       border: none;
//     }
//   .top-center {
//     border-radius: 50px;
//     border: 1px solid #ccc;
//     overflow: hidden;
//     height: 40px;
//     width:100%;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin: 30px 0;
//     /deep/ .el-input-group__append, /deep/ .el-input-group__prepend, /deep/ .el-input {
//       border: none;
//     }
//     @{deep} .elInput{
//       border:none;
//       flex:1;
//     }
//     .subSearch{
//       background-color:#165af7;
//       color:#fff;
//       border:none;
//       border-radius: 0;
//       width:100px;
//       display:flex;
//       height:100%;
//       justify-content: center;
//       align-items: center;
//     }
//     .myCamera {
//       border:none;
//       margin-right: 10px;
//       font-size: 24px;
//       position: relative;
//       .fileInput {
//         position: absolute;
//         left: 0;
//         top: 0;
//         width: 24px;
//         height: 40px;
//         font-size: 0;
//         padding: 0;
//         cursor: pointer;
//         cursor: pointer;
//         opacity: 0;
//       }
//     }
//   }
// }
// .erwemas {
//   float: right;
// }

// .sidebar {
//   display: flex;
//   height: 100px;
//   align-items: center;
//   color: #fff;
//   ul {
//     flex: 1;
//     display: flex;
//     .li {
//       margin: 0 30px;
//       padding-bottom: 5px;
//       border-bottom: 2px solid transparent;
//       &:first-of-type {
//         margin-left: 0;
//       }
//     }
//     .router-link-active {
//       color: #165af7;
//       border-bottom-color: #165af7;
//     }
//   }
// }
// // 截图
// .cropper-content {
//   .cropper {
//     width: auto;
//     height: 500px;
//   }
// }
</style>
