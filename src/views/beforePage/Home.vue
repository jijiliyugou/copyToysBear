/* eslint-disable vue/require-v-for-key */
<template>
  <div class="home">
    <div class="homeBox">
      <div class="searchBox">
        <div class="searchImg"></div>
        <div class="inputBox">
            <el-input
              placeholder="请输入关键词/图片搜索"
              v-model="searchValue">
            </el-input>
            <div class="iconBox">
              <div class="uploadIcon">
                <i class="iconfont icon-tupian">
                  <input
                    type="file"
                    ref="uploadRef"
                    @change="changeUpload"
                    class="fileInput"
                    accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                  />
                </i>
              </div>
              <button class="searchBtn" @click="toProductSearch">搜索</button>
            </div>
        </div>
        <button class="advanced" @click="isAdvanced = !isAdvanced">高级搜索</button>
      </div>
      <div class="keywords" v-show="isAdvanced">
        <span @click="keywordActive = i" :class="{'item':true, active: keywordActive === i}" v-for="(item, i) in keywordList" :key="i">{{ item }}</span>
      </div>
      <transition name="el-zoom-in-top">
      <div class="searchAdvanced" v-show="!isAdvanced">
        <div class="box">
          <div class="left">
            <div class="item">
              出厂货号：<el-input size="mini" v-model="packingOptions.fa_no" placeholder="请输入货号"></el-input><div class="unit"></div>
            </div>
            <div class="item">
              玩具尺寸：<el-input size="mini" placeholder="长"></el-input><em>-</em><el-input size="mini" placeholder="宽"></el-input><em>-</em><el-input size="mini" placeholder="高"></el-input><div class="unit">CM</div>
            </div>
            <div class="item">
              外包装箱：<el-input size="mini" placeholder="长"></el-input><em>-</em><el-input size="mini" placeholder="宽"></el-input><em>-</em><el-input size="mini" placeholder="高"></el-input><div class="unit">CM</div>
            </div>
            <div class="item">
              包装方式：<el-select v-model="packingOptions.pa_nu" size="mini" placeholder="请选择">
              <el-option
                v-for="item in packingList"
                :key="item.value"
                  :label="item.ch_pa"
                  :value="item.pa_nu">
              </el-option>
            </el-select>
            <div class="unit"></div>
            </div>
          </div>
          <div class="right">
            <div class="item">
              产品名称：<el-input size="mini" v-model="packingOptions.name" placeholder="请输入产品名称"></el-input><div class="unit"></div>
            </div>
            <div class="item">
              价格区间：<el-input size="mini" v-model="packingOptions.minPrice" placeholder="最低"></el-input><em>-</em><el-input size="mini" v-model="packingOptions.maxPrice" placeholder="最高"></el-input><div class="unit"></div>
            </div>
            <div class="item">
              时间区间：<el-select v-model="packingDatetime" size="mini" placeholder="请选择">
              <el-option
                v-for="item in dateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="unit"></div>
            </div>
            <div class="item">
              图<span style="opacity: 0;">图片</span>片：
              <div style="flex:1;marginLeft:10px;">
                <el-radio v-model="packingOptions.radio" label="1">是</el-radio>
                <el-radio v-model="packingOptions.radio" label="2">否</el-radio>
              </div>
              <div class="unit"></div>
            </div>
          </div>
        </div>
        <div class="btnList">
          <el-button round style="backgroundColor:#dddddd;width:100px;">重置</el-button>
          <el-button type="primary" style="marginLeft:40px;width:100px;" round>确定</el-button>
        </div>
      </div>
      </transition>
    </div>
    <!-- vueCropper 剪裁图片实现 -->
    <el-dialog title="图片剪裁" :visible.sync="isShowCropper" destroy-on-close append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canScale='option.canScale'
            :info="option.info"
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
            :mode="option.mode"
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
    VueCropper
  },
  data () {
    return {
      packingList: [],
      dateList: [
        { label: '全部', value: '' },
        { label: '当天', value: 'today' },
        { label: '一周', value: 'lastOneWeek' },
        { label: '一个月', value: 'lastOneMonth' },
        { label: '三个月', value: 'lastThreeMonth' },
        { label: '六个月', value: 'lastHalfYear' }
      ],
      packingDatetime: null,
      packingOptions: {
        radio: '1',
        minPrice: null,
        fa_no: null,
        maxPrice: null,
        pa_nu: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      },
      isAdvanced: true,
      loading: false,
      isShowCropper: false,
      dialogVisible: false,
      baseImg: null,
      fileinfo: null,
      searchValue: '',
      keywordList: ['芭比娃娃', '积木', '电动车', '积木是', '积是木', '啊积木', '泡泡机'],
      keywordActive: 0,
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
      }
    }
  },
  methods: {
    toProductSearch () {
      this.$root.eventHub.$emit('searchBeforeProduct')
      this.$router.push({ name: 'Product' })
    },
    // 获取包装方式list
    async getProductChpaList () {
      const fd = {}
      const res = await this.$http.post('/api/GetProductChpaList', fd)
      if (res.data.result.code === 200) {
        this.packingList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
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
    // 确定裁剪图片
    onCubeImg () {
      this.loading = true
      this.$store.commit('handlerBeforeSearch', { value: '', type: 'name' })
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
    }
  },
  created () {
    this.getProductChpaList()
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
@deep: ~">>>";
  .home {
    flex: 1;
    .homeBox{
      max-width: 1200px;
      margin: 0 auto;
      height: calc(100%);
      .searchBox{
        width: 700px;
        margin: 0 auto;
        position: relative;
        padding-top: 71px;
        display: flex;
        .searchImg {
          position: absolute;
          left: 5px;
          top: 0;
          width: 230px;
          height: 80px;
          background: url('~@/assets/images/searchTopBg.png') no-repeat;
          z-index: 1;
        }
          .inputBox{
            border-radius: 10px;
            border: 1px solid #789ffa;
            position: relative;
            display: flex;
            width: 619px;
            align-items: center;
            @{deep} .el-input{
              input {
                border: none;
                border-radius: 10px;
              }
            }
            .iconBox{
              display: flex;
              align-items: center;
              justify-content: center;
              .uploadIcon{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #3872f8;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                cursor: pointer;
                .iconfont {
                  font-size: 10px;
                  .fileInput {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 30px;
                    height: 30px;
                    font-size: 0;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0;
                  }
                }
              }
            .searchBtn{
                margin-left: 10px;
                background-color: #3872f8;
                border: 1px solid #3872f8;
                border-radius: 9px;
                color: #fff;
                width: 96px;
                height: 40px;
                outline: none;
                cursor: pointer;
              }
            }
          }
          .advanced{
              margin-left: 10px;
              background-color: #fff;
              border: 1px solid #3872f8;
              font-weight: 600;
              border-radius: 9px;
              color: #3872f8;
              width: 96px;
              height: 40px;
              outline: none;
              cursor: pointer;
            }
        }
      .keywords{
          width: 700px;
          margin: 0 auto;
          font-size: 14px;
          .item {
            display: inline-block;
            padding-right: 20px;
            margin-top: 10px;
            cursor: pointer;
            &.active{
              color: red;
            }
          }
      }
      .searchAdvanced{
        width: 700px;
        margin: 0 auto;
        font-size: 14px;
        padding-top: 20px;
        .box{
          display: flex;
          border-bottom: 2px solid #f0f5ff;
          .left,.right {
            flex: 1;
            .item {
              margin-bottom: 20px;
              padding: 0 20px;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              align-items: center;
              @{deep} .el-input{
                flex: 1;
                input{
                  border-radius: 28px;
                }
              }
              em{
                padding: 0 5px;
              }
              .unit{
                margin-left: 5px;
                width: 30px;
                color: red;
              }
            }
          }
        }
        .btnList{
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
