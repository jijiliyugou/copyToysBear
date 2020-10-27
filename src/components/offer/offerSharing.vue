<template>
  <div
    class="baojia"
    @scroll="baojiaScroll"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="titleText">报价信息</div>
        <!-- <el-button type="warning" icon="el-icon-edit" size="small"
          >编辑</el-button
        > -->
      </div>
      <div class="text">
        <div class="item">
          报价主题：<span class="content">{{
            productInfo && productInfo.title
          }}</span>
        </div>
        <div class="item">
          报价：<span class="content">{{
            productInfo && productInfo.bidPrice
          }}</span>
        </div>
        <div class="item">
          报价员：<span class="content">{{
            productInfo && productInfo.linkman
          }}</span>
        </div>
      </div>
    </el-card>
    <div class="line"></div>
    <div class="floatSearch">
      <div class="categoryList">
        <div class="cates">
          <!-- 分类：<el-cascader
            clearable
            :show-all-levels="false"
            placeholder="请输入分类"
            filterable
            v-model="categoryNumber"
            size="small"
            ref="clearSelect"
            :props="{
              checkStrictly: true,
              emitPath: false,
              label: 'name',
              value: 'id',
              children: 'children',
            }"
            :options="categoryList"
            @visible-change="resetSelect"
            class="myCate"
            @change="handleChange"
          ></el-cascader> -->
          分类：<el-select v-model="categoryNumber" @change="handleChange" placeholder="请输入或选择" clearable filterable>
          <el-option
            v-for="item in [{categoryName: '全部', categoryNumber: ''}, ...categoryList]"
            :key="item.value"
            :label="item.categoryName"
            :value="item.categoryNumber">
          </el-option>
        </el-select>
        </div>
        <div class="total">总数：{{ totalCount }}</div>
      </div>
      <div class="listTitle">
        <span class="listTitleTXT">报价商品 ({{ totalCount }})</span>
        <div class="downloads">
          <el-button type="primary" @click="downloadDocument('PDF')" plain size="small">下载PDF</el-button>
          <el-button type="primary" @click="downloadDocument('Excel')" plain size="small">下载Excel</el-button>
        </div>
      </div>
    </div>
    <div class="productList">
      <div class="listItems" v-if="totalCount > 0">
        <el-card
          class="listItem"
          v-for="(item, i) in productList"
          :key="i"
          @click.stop.native="productDetail(item.productNumber)"
        >
          <div class="left">
            <el-image
              style="width: 100px; height: 100px; position: static"
              :src="item.imageUrl"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
                <img
                  class="errorImg"
                  style="width: 100px; height: 100px"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 100px; height: 100px"
              >
                <img
                  class="errorImg"
                  style="width: 100px; height: 100px"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
            </el-image>
          </div>
          <div class="right">
            <p class="productName">{{ item.name }}</p>
            <p class="productCode">
              货号：<span>{{ item.fa_no }}</span>
            </p>
            <p class="productWeight">
              毛重/净重：<span>{{ item.gr_we }}/{{ item.ne_we }}kg</span>
            </p>
            <p class="productPrice">
              单价：<span class="price">{{
                item.cu_de + item.unitPrice.toFixed(2)
              }}</span>
            </p>
          </div>
        </el-card>
      </div>
      <el-image
        v-else
        style="width: 100%; position: static"
        :src="require('@/assets/images/暂无产品.png')"
        fit="contain"
      ></el-image>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productInfo: null,
      productList: [],
      currentPage: 1,
      pageSize: 10,
      categoryList: [],
      categoryNumber: '',
      totalCount: 0,
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 下载
    downloadDocument (document) {
      console.log('下载了' + document)
    },
    // 下拉加载更多
    load () {
      this.currentPage++
      this.getProductOfferDetailPage(true)
    },
    handleChange (value) {
      // 重新搜索产品列表
      this.currentPage = 1
      this.getProductOfferDetailPage()
      // this.$refs.clearSelect.panel.activePath = []
      // this.$refs.clearSelect.panel.syncActivePath()
      // this.$refs.clearSelect.dropDownVisible = false
    },
    resetSelect (flag) {
      if (flag && this.$refs.clearSelect.getCheckedNodes().length === 0) {
        // 重置激活路径，级联下拉框恢复默认，收起展开节点路径面板
        this.$refs.clearSelect.panel.activePath = []
        this.$refs.clearSelect.panel.syncActivePath()
      }
    },
    // 滚动事件
    baojiaScroll (e) {
      const top = e.target.scrollTop
      const box = document.getElementsByClassName('baojia')[0]
      const item = document.getElementsByClassName('floatSearch')[0]
      if (top >= 205) {
        box.style.paddingTop = '2rem'
        item.style.position = 'fixed'
        item.style.left = '0'
        item.style.padding = '0.133333rem 0.188888rem 0.133333rem 0.188888rem'
        item.style.top = '0px'
      } else {
        box.style.paddingTop = '0px'
        item.style.position = 'static'
        item.style.padding = '10px 0px'
      }
    },
    // 获取产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/GetProductCategoryList', { offerNumber: this.$route.query.id })
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息产品列表
    async getProductOfferDetailPage (flag) {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        offerNumber: this.$route.query.id,
        categoryNumber: this.categoryNumber
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.productList = flag
          ? this.productList.concat(res.data.result.item.items)
          : [...res.data.result.item.items, ...res.data.result.item.items, ...res.data.result.item.items, ...res.data.result.item.items, ...res.data.result.item.items]
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.query.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击列表进入详情页
    productDetail (number) {
      if (!number) {
        this.$message.error('该产品没有产品编号')
        return false
      }
      this.$router.push({ name: 'offerDetail', params: { id: number, pid: this.$route.query.id } })
    }
  },
  created () {
    this.getProductCategoryList()
    this.getProductOfferByNumber()
    this.getProductOfferDetailPage()
  },
  computed: {
    noMore () {
      return this.totalCount <= this.productList.length
    },
    disabled () {
      return this.$store.state.vueElementLoading || this.noMore
    }
  },
  mounted () {
    if (this.$store.state.screenWidth > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
  },
  watch: {
    '$store.state.screenWidth' (val) {
      if (val > 1024) {
        this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
      }
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.baojia {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  font-size: 0.266667rem;
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .box-card {
    width: 95%;
    margin: 0.4rem auto 0 auto;
    @{deep} .el-card__header {
      padding: 0.133333rem;
    }
    @{deep} .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titleText {
        font-weight: 600;
        position: relative;
        text-indent: 0.133333rem;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          height: 70%;
          width: 4px;
          background-color: #165af7;
          transform: translate(0, -50%);
          border-radius: 0 5px 5px 0;
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 100%;
    height: 0.266667rem;
    background: #f5f5f5;
  }
  .floatSearch {
    width: 95%;
    margin: 0 auto;
    background-color: #fff;
    .categoryList {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      padding: 0.133333rem 0px;
      border-bottom: 1px solid #ebeef5;
      .cates {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @{deep} .el-input__inner {
          width: 2.666667rem;
        }
      }
    }
    .listTitle {
      width: 100%;
      height: 0.933333rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      border-bottom: 1px solid #ebeef5;
      .listTitleTXT {
        position: relative;
        text-indent: 0.133333rem;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          height: 70%;
          width: 4px;
          background-color: #165af7;
          transform: translate(0, -50%);
          border-radius: 0 5px 5px 0;
        }
      }
      .downloads {
        .el-button {
          font-size: 0.16rem;
          border-radius: 0.266667rem;
          padding: 0.12rem 0.2rem;
          border: 0.013333rem solid #b3d8ff;
        }
      }
    }
  }
  .productList {
    width: 95%;
    margin: 0 auto;
    .listItems {
      .listItem {
        margin-bottom: 0.266667rem;
        border-radius: 0.133333rem;
        @{deep} .el-card__body {
          padding: 0.133333rem;
          display: flex;
          justify-content: space-between;
          .left {
            margin-right: 0.133333rem;
            border-radius: 0.133333rem;
            box-sizing: border-box;
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .productName {
              font-weight: 600;
            }
            .productPrice {
              .price {
                color: #f54d35;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}
</style>
