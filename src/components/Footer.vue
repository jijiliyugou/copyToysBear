<template>
  <div class="footer">
    <p class="contactMe">
      <em @click="$router.push('/beforeIndex/companyInfo/contactUs')"
        >联系我们</em
      >
      <span>|</span
      ><em @click="$router.push('/beforeIndex/companyInfo/aboutUs')"
        >关于小竹熊</em
      ><span>|</span
      ><em @click="$router.push('/beforeIndex/companyInfo/termsService')"
        >服务条款</em
      ><span>|</span
      ><em @click="$router.push('/beforeIndex/companyInfo/legalNotices')"
        >法律声明</em
      >
      <span>|</span
      ><em @click="$router.push('/beforeIndex/companyInfo/privacyStatement')"
        >隐私声明</em
      >
    </p>
    <p class="contactType">
      电话：0754-89861122
      <span></span>传真：0754-89861122 <span></span>E-mail：Toys@Toysbao.com
    </p>
    <div class="QQ">
      <div @click="toKefu"><i class="qq01"></i>客服001</div>
      <div @click="toKefu"><i class="qq02"></i>客服002</div>
    </div>
    <div class="Copyright">
      Copyright<span></span>©<span></span>2014<span
      ></span>深圳宏升软件技术开发有限公司<span> </span>
      <em> 粤ICP备13031421号-4 </em>
      <img src="../assets/images/cnzz.gif" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toKefu () {
      window.open('https://shang.qq.com//email/stop/email_stop.html', '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  font-size: 12px;
  color: #fff;
  text-align: center;
  background: url("~@/assets/images/bottomtu.png") bottom no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  background-color: #909090;
  padding: 20px 0;
  p {
    margin: 10px 0;
  }
  .contactMe {
    span {
      margin: 0 40px;
    }
    em {
      cursor: pointer;
      &:hover {
        color: #4cd6fd;
      }
    }
  }
  .contactType {
    span {
      margin: 0 20px;
    }
  }
  .QQ {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    div {
      margin: 0 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        color: #4cd6fd;
      }
      i {
        display: inline-block;
        margin-right: 5px;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background: url("~@/assets/images/QQ 拷贝.png") center center;
        background-size: 100%;
        vertical-align: middle;
      }
    }
  }
  .Copyright {
    border-top: 2px solid #aaa;
    padding-top: 10px;
    em {
      cursor: pointer;
      padding: 0 5px;
      &:hover {
        color: #4cd6fd;
      }
    }
  }
}
</style>
