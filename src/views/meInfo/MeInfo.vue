<template>
<el-container class="meInfo">
  <el-header style="padding:0;">
    <bsTop></bsTop>
  </el-header>
  <el-main style="padding:0;overflow:visible;">
    <div class="content">
      <li class="info">
        <router-view
          @showInfo="showInfo"
          @showInfoListOrder="showInfoListOrder"
          @showLiaotianr="showLiaotianr"
          @showCompany="showCompany"
          @showCompanyList="showCompanyList"
          @cancelSendGonggao="active2 = null"
          @showFindLiaotian="showFindLiaotian"
          @showOrderCompanyList="showOrderCompanyList"
        ></router-view>
        <!-- tabs -->
        <div class="footer">
          <router-link to="infoList" class="li" @click.native="offDetail()">
            <i class="el-icon-s-comment"></i>
            <p>消息</p>
          </router-link>
          <router-link to="findList" class="li" @click.native="offDetail()">
            <i class="el-icon-s-help"></i>
            <p>发现</p>
          </router-link>
          <router-link to="newSletter" class="li" @click.native="offDetail()">
            <i class="el-icon-s-custom"></i>
            <p>通讯录</p>
          </router-link>
        </div>
      </li>
      <!-- 查看个人资料 -->
      <li
        class="contentTwo"
        v-if="
          showCollection.active === 1 &&
            $route.path === '/meInfo/newSletter' &&
            showCollection.type === 'showInfo'
        "
      >
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="personalInfo" v-if="personalDetail">
          <div class="name">
            <div class="text">
              <p>{{ personalDetail.linkman }}</p>
            </div>
            <div class="img">
              <el-image
                :src="personalDetail && personalDetail.userImage"
                :size="80"
                @click.native="openEdit(personalDetail.id)"
                class="myAvatar"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ personalDetail.linkman }}
                </div>
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ personalDetail.linkman }}
                </div>
              </el-image>
            </div>
          </div>
          <div class="floor">
            <div class="title">性别：</div>
            <p>{{ personalDetail.sex === 1 ? "男" : "女" }}</p>
          </div>
          <div class="floor">
            <div class="title">生日：</div>
            <p v-if="personalDetail.birthday">
              {{ personalDetail.birthday.replace(/T[\s\S]*/gi, "") }}
            </p>
          </div>
          <div class="floor">
            <div class="title">电话：</div>
            <p>{{ personalDetail.phoneNumber }}</p>
          </div>
          <div class="floor">
            <div class="title myRemark" v-show="!isEditRemark">备注：
              <el-button class="subRemark" type="success" size="mini" icon="el-icon-edit" @click="ckeckEditUserRemark" plain>编辑</el-button>
            </div>
            <div class="title myRemark" v-show="isEditRemark">备注：
              <el-button class="subRemark" type="success" size="mini" icon="el-icon-check" @click="editUserRemark(personalDetail)" plain>保存</el-button>
            </div>
            <p v-show="personalDetail.remark || isEditRemark">
              <!-- <el-input type="textarea" :disabled="!isEditRemark" autosize class="companyRemark" v-model="personalDetail.remark" placeholder="请输入备注"></el-input> -->
              <el-input type="textarea" ref="myTextarea" autosize :disabled="!isEditRemark" class="companyRemark" v-model="personalDetail.remark" placeholder="请输入备注"></el-input>
            </p>
          </div>
          <center class="send">
            <el-button
              class="sendInfo"
              :style="{
                opacity:
                  personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
                    ? 0.7
                    : 1
              }"
              @click="personalSend"
              :disabled="
                personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
              "
              round
            >
              <i class="el-icon-s-comment el-icon--left sendIcon"></i>
              发消息
            </el-button>
          </center>
        </div>
      </li>
      <!-- 点击对应公司展示我的排号 -->
      <li
        class="contentThree"
        v-if="showOrderCompanyItem && $route.path === '/meInfo/infoList'"
      >
        <h3 class="infoListTitle" style="background-color: #fff;">
          {{ showOrderCompanyItem.client_na }}
          <span style="margin-left:20px;font-size:14px;">
            (共
            <strong style="color:red;">{{ ERPOrderOptions.total }}</strong> 条)
          </span>
        </h3>
        <div
          class="xinde"
          v-show="
            (this.orderSampleFrom &&
              this.orderSampleFrom.SampleFrom &&
              this.orderSampleFrom.SampleFrom.toLowerCase()) ==
              showTypeOptions.mySampleFrom.toLowerCase()
          "
          style="padding: 20px 0;border-top:1px solid #ccc;text-align:center;"
        >
          <span
            class="xindeInfo"
            style="border-radius:30px;backgroundColor:#f8f8f8;color:#00b94b;padding:8px 40px;cursor: pointer;"
            @click="resetPaihaoCompanyList"
            >您有新的消息通知</span
          >
        </div>
        <template
          v-if="
            showTypeOptions &&
              showTypeOptions.mySampleFrom &&
              showTypeOptions.mySampleFrom.toLowerCase() === 'hall' &&
              $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
        >
          <div class="meCode" @click="openRowMeCode(personalNumber)">
            <div class="meCodeContent">
              <el-image
                class="meCodeImg"
                :src="showOrderCompanyItem.companyLogo"
                fit="cover"
              >
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ showOrderCompanyItem.client_na }}
                </div>
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ showOrderCompanyItem.client_na }}
                </div>
              </el-image>
              <div class="codeTitle">我的排号:</div>
              <div class="code">{{ personalNumber.arr_nu }}</div>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div
            class="productList"
            v-if="
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
            "
          >
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'historySample'
              }"
              @click="openSampleList('historySample')"
            >
              <i class="historyIcon"></i>历史择样
            </span>
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'rankingSample'
              }"
              @click="openSampleList('rankingSample')"
            >
              <i class="rankingIcon"></i>择样排行
            </span>
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'myProduct'
              }"
              @click="openSampleList('myProduct')"
            >
              <i class="myProductIcon"></i>我的产品
            </span>
          </div>
        </template>
        <div class="infoOrderList" v-infinite-scroll="orderLoad">
          <template
            v-if="
              ERPOrderOptions.ERPOrderList &&
                ERPOrderOptions.ERPOrderList.length
            "
          >
            <div v-for="(item, i) in ERPOrderOptions.ERPOrderList" :key="i">
              <center>
                <span class="date">{{
                  item.createdOn && item.createdOn.replace(/T/, " ")
                }}</span>
              </center>
              <div class="infoOrder" @click="openOrderDetail(item)">
                <div class="orderState">
                  <div class="title">
                    {{
                      $store.state.userInfo.commparnyList[0].companyType ==
                      "Exhibition"
                        ? item.toCompanyName + "：" + item.messageTitle
                        : $store.state.userInfo.commparnyList[0].companyType ==
                          "Supplier"
                        ? item.fromCompanyName + "：" + item.messageTitle
                        : item.messageModel === '7'
                        ? item.toCompanyName + "：" + item.messageTitle
                        : item.fromCompanyName + "：" + item.messageTitle
                    }}
                  </div>
                  <el-tag
                    :class="{ red: item.orderStatus === '0' }"
                    :type="
                      item.orderStatus === '9'
                        ? 'success'
                        : item.orderStatus === '1'
                        ? 'danger'
                        : item.orderStatus === '99'
                        ? 'info'
                        : ''
                    "
                    effect="dark"
                  >
                    <i
                      :class="{
                        wanchengIcon: item.orderStatus === '9',
                        weichakanIcon: item.orderStatus === '0',
                        weiquerenIcon: item.orderStatus === '1',
                        yiquxiaoIcon: item.orderStatus === '99'
                      }"
                    ></i>
                    {{ item | myState }}
                  </el-tag>
                </div>
                <div class="txtWrap">
                  <p>
                    <span class="title">客户名称：</span>
                    {{ item.client_na }}
                  </p>
                  <p>
                    <span class="title">消息时间：</span>
                    {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
                  </p>
                  <p>
                    <span class="title">本次代号：</span>
                    {{ item.the_nu }}
                  </p>
                  <p class="remark">
                    <span class="title">备注：</span>
                    {{ item.pushContent }}
                  </p>
                </div>
                <div class="btnList">
                  <div class="box" v-if="item.orderType === 'Sample'">
                    <el-button round size="mini">查看详情</el-button>
                  </div>
                  <div class="box" v-else-if="item.orderType === 'OrderOffer'">
                    <el-button
                      type="success"
                      round
                      size="mini"
                      v-show="
                        !item.confirmStatus &&
                          (item.messageExt === '3' ||
                            item.messageExt === '5' ||
                            item.messageExt === '11')
                      "
                      @click.stop="configOrder(item)"
                      >确认完成</el-button
                    >
                    <el-button round size="mini">查看详情</el-button>
                    <el-button
                      type="primary"
                      round
                      size="mini"
                      @click.stop="orderSend(item)"
                      >立即沟通</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <center style="padding-top:10px;">
              <i
                class="el-icon-loading"
                v-show="orderLoadText === '加载中...'"
              ></i>
              {{ orderLoadText }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </div>
      </li>
      <!-- 公司订单列表 -->
      <li
        class="contentThree"
        v-if="showTypeOptions.showType === 'showInfoListOrder'"
      >
        <h3 class="infoListTitle" style="background-color: #fff;">
          {{ showTypeOptions.sampleFrom | ERPOrderTitle }}
          <span style="margin-left:20px;font-size:14px;">
            (共
            <strong style="color:red;">{{ ERPOrderOptions.total }}</strong> 条)
          </span>
        </h3>
        <div
          class="xinde"
          v-show="
            (this.orderSampleFrom &&
              this.orderSampleFrom.SampleFrom &&
              this.orderSampleFrom.SampleFrom.toLowerCase()) ==
              showTypeOptions.sampleFrom.toLowerCase()
          "
          style="padding: 20px 0;border-top:1px solid #ccc;text-align:center;"
        >
          <span
            class="xindeInfo"
            style="border-radius:30px;backgroundColor:#f8f8f8;color:#00b94b;padding:8px 40px;cursor: pointer;"
            @click="resetCompanyList"
            >您有新的消息通知</span
          >
        </div>
        <div class="infoOrderList" v-infinite-scroll="orderLoad">
          <template
            v-if="
              ERPOrderOptions.ERPOrderList &&
                ERPOrderOptions.ERPOrderList.length
            "
          >
            <div v-for="(item, i) in ERPOrderOptions.ERPOrderList" :key="i">
              <center>
                <span class="date">{{
                  item.createdOn && item.createdOn.replace(/T/, " ")
                }}</span>
              </center>
              <div class="infoOrder" @click="openOrderDetail(item)">
                <div class="orderState">
                  <div class="title">
                    {{
                      $store.state.userInfo.commparnyList[0].companyType ==
                      "Exhibition"
                        ? item.toCompanyName + "：" + item.messageTitle
                        : $store.state.userInfo.commparnyList[0].companyType ==
                          "Supplier"
                        ? item.fromCompanyName + "：" + item.messageTitle
                        : item.messageModel === '7'
                        ? item.toCompanyName + "：" + item.messageTitle
                        : item.fromCompanyName + "：" + item.messageTitle
                    }}
                  </div>
                  <el-tag
                    :class="{ red: item.orderStatus === '0' }"
                    :type="
                      item.orderStatus === '9'
                        ? 'success'
                        : item.orderStatus === '1'
                        ? 'danger'
                        : item.orderStatus === '99'
                        ? 'info'
                        : ''
                    "
                    effect="dark"
                  >
                    <i
                      :class="{
                        wanchengIcon: item.orderStatus === '9',
                        weichakanIcon: item.orderStatus === '0',
                        weiquerenIcon: item.orderStatus === '1',
                        yiquxiaoIcon: item.orderStatus === '99'
                      }"
                    ></i>
                    {{ item | myState }}
                  </el-tag>
                </div>
                <div class="txtWrap">
                  <p>
                    <span class="title">客户名称：</span>
                    {{ item.client_na }}
                  </p>
                  <p>
                    <span class="title">消息时间：</span>
                    {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
                  </p>
                  <p>
                    <span class="title">本次代号：</span>
                    {{ item.the_nu }}
                  </p>
                  <p class="remark">
                    <span class="title">备注：</span>
                    {{ item.pushContent }}
                  </p>
                </div>
                <div class="btnList">
                  <div class="box" v-if="item.orderType === 'Sample'">
                    <el-button round size="mini">查看详情</el-button>
                  </div>
                  <div class="box" v-else-if="item.orderType === 'OrderOffer'">
                    <el-button
                      type="success"
                      round
                      size="mini"
                      v-show="
                        !item.confirmStatus &&
                          (item.messageExt === '3' ||
                            item.messageExt === '5' ||
                            item.messageExt === '11')
                      "
                      @click.stop="configOrder(item)"
                      >确认完成</el-button
                    >
                    <el-button round size="mini">查看详情</el-button>
                    <el-button
                      type="primary"
                      round
                      size="mini"
                      @click.stop="orderSend(item)"
                      >立即沟通</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <center style="padding-top:10px;">
              <i
                class="el-icon-loading"
                v-show="orderLoadText === '加载中...'"
              ></i>
              {{ orderLoadText }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </div>
      </li>
      <!-- 择样订单详情 -->
      <li
        class="contentThree"
        v-show="showTypeOptions.isShowOrderDetail"
        v-if="
          showTypeOptions.showOrderDetail && $route.path === '/meInfo/infoList'
        "
      >
        <h3 class="infoListTitle">
          {{
            $store.state.userInfo.commparnyList[0].companyType === "Exhibition"
              ? orderOptions.toCompanyName
              : $store.state.userInfo.commparnyList[0].companyType === "Supplier"
              ? orderOptions.fromCompanyName
              : orderOptions.messageModel === '7'
              ? orderOptions.toCompanyName
              : orderOptions.fromCompanyName
          }}
        </h3>
        <div class="orderDetailState">
          <div class="title">
            {{
              $store.state.userInfo.commparnyList[0].companyType === "Exhibition"
                ? orderOptions.toCompanyName + "：" + orderOptions.messageTitle
                : $store.state.userInfo.commparnyList[0].companyType ==
                  "Supplier"
                ? orderOptions.fromCompanyName +
                  "：" +
                  orderOptions.messageTitle
                : orderOptions.messageModel === '7'
                ? orderOptions.toCompanyName + "：" + orderOptions.messageTitle
                : orderOptions.fromCompanyName +
                  "：" +
                  orderOptions.messageTitle
            }}
          </div>
          <!-- 订单详情状态 -->
          <el-tag
            :class="{ red: orderOptions.orderStatus === '0' }"
            :type="
              orderOptions.orderStatus === '9'
                ? 'success'
                : orderOptions.orderStatus === '1'
                ? 'danger'
                : orderOptions.orderStatus === '99'
                ? 'info'
                : ''
            "
            effect="dark"
          >
            <i
              :class="{
                wanchengIcon: orderOptions.orderStatus === '9',
                weichakanIcon: orderOptions.orderStatus === '0',
                weiquerenIcon: orderOptions.orderStatus === '1',
                yiquxiaoIcon: orderOptions.orderStatus === '99'
              }"
            ></i>
            {{ orderOptions | myState }}
          </el-tag>
        </div>
        <div
          class="mobile"
          v-show="
            $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
        >
          <p>
            <span class="title">客户名称：</span>
            {{ orderOptions.client_na }}
          </p>
          <p>
            <span class="title">消息时间：</span>
            {{
              orderOptions.createdOn && orderOptions.createdOn.replace(/T/, " ")
            }}
          </p>
          <p>
            <span class="title">本次代号：</span>
            {{ orderOptions.the_nu }}
          </p>
          <p class="remark">
            <span class="title">备注：</span>
            {{ orderOptions.pushContent }}
          </p>
          <div class="btns">
            <el-button
              v-if="orderOptions.orderType === 'OrderOffer'"
              round
              size="small"
              type="primary"
              @click="orderSend(orderOptions)"
              >立即沟通</el-button
            >
            <el-button
              round
              size="small"
              @click="configOrder(orderOptions)"
              v-show="
                !orderOptions.confirmStatus &&
                  (orderOptions.messageExt === '3' ||
                    orderOptions.messageExt === '5' ||
                    orderOptions.messageExt === '11')
              "
            >
              确认完成
            </el-button>
          </div>
        </div>
        <el-tabs
          type="border-card"
          v-if="
            $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
          v-model="activeName"
          class="orderDetailTitle"
        >
          <el-tab-pane
            :label="'历史记录(' + orderDetailTotal + '条)'"
            name="first"
          >
            <div class="headerTitle">
              <div class="headerItem code"><i></i> 出厂货号</div>
              <div class="headerItem client"><i></i>客户</div>
              <div class="headerItem date"><i></i>时间</div>
            </div>
            <div class="historyReco">
              <li v-for="(item, i) in orderDetailList" :key="i">
                <div class="fa_no">{{ item.fa_no }}</div>
                <div class="client_na">{{ item.client_na }}</div>
                <div class="createdOn">
                  {{
                    item.createdOn && item.createdOn.replace(/T[\s\S]+/gi, "")
                  }}
                </div>
              </li>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="'当前记录(' + orderDetailTotal + '条)'"
            name="last"
          >
            <ul class="cureentReco">
              <li v-for="(item, i) in orderDetailList" :key="i">
                <div class="fa_no">
                  <i></i>
                  {{ item.fa_no }}
                </div>
                <div class="pr_na" v-if="item.messageExt === '0'">
                  {{ item.pr_na }}
                </div>
                <div class="btns" v-else-if="item.messageExt === '3'">
                  <el-button
                    @click="updateOrderConfirmStatus(item, 1)"
                    size="mini"
                    round
                    :class="{ activeGray: item.messageStatus === '1' }"
                    >不可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      blueBtn: true,
                      activeBlue: item.messageStatus === '0'
                    }"
                    >可带</el-button
                  >
                </div>
                <div class="btns" v-else-if="item.messageExt === '5'">
                  <el-button
                    size="mini"
                    @click="updateOrderConfirmStatus(item, 1)"
                    round
                    :class="{ activeGray: item.messageStatus === '1' }"
                    >不可借</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      orangeBtn: true,
                      activeOrange: item.messageStatus === '0'
                    }"
                    >可借</el-button
                  >
                </div>
                <div class="btns" v-else-if="item.messageExt === '11'">
                  <el-button
                    size="mini"
                    @click="updateOrderConfirmStatus(item, 2)"
                    round
                    :class="{ activeGray: item.messageStatus === '2' }"
                    >不可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      blueBtn: true,
                      activeBlue: item.messageStatus === '0'
                    }"
                    >可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 1)"
                    size="mini"
                    round
                    :class="{
                      orangeBtn: true,
                      activeOrange: item.messageStatus === '1'
                    }"
                    >可借</el-button
                  >
                </div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <div
          v-else
          class="orderDetailTitle2"
          @scroll="orderDetailListShowTotal"
          v-infinite-scroll="orderDetailListScroll"
        >
          <div class="mobile">
            <p>
              <span class="title">客户名称：</span>
              {{ orderOptions.client_na }}
            </p>
            <p>
              <span class="title">消息时间：</span>
              {{
                orderOptions.createdOn &&
                  orderOptions.createdOn.replace(/T/, " ")
              }}
            </p>
            <p>
              <span class="title">本次代号：</span>
              {{ orderOptions.the_nu }}
            </p>
            <p class="remark">
              <span class="title">备注：</span>
              {{ orderOptions.pushContent }}
            </p>
            <div class="btns">
              <el-button
                v-if="orderOptions.orderType === 'OrderOffer'"
                round
                size="small"
                type="primary"
                @click="orderSend(orderOptions)"
                >立即沟通</el-button
              >
              <el-button
                round
                size="small"
                @click="configOrder(orderOptions)"
                v-show="
                  !orderOptions.confirmStatus &&
                    (orderOptions.messageExt === 3 ||
                      orderOptions.messageExt === 5 ||
                      orderOptions.messageExt === 11)
                "
              >
                确认完成
              </el-button>
            </div>
          </div>
          <el-card
            class="productItem"
            v-for="item in orderDetailList"
            :key="item.id"
          >
            <div class="context">
              <div class="left">
                <el-image
                  class="myImage"
                  :src="item.imgUrl && item.imgUrl[0]"
                  fit="contain"
                ></el-image>
              </div>
              <div class="right">
                <p>{{ item.pr_na }}</p>
                <p>货号：{{ item.co_nu }}</p>
                <p>包装：{{ item.ch_pa }}</p>
                <p>
                  样品规格：{{ item.pr_le }}X{{ item.pr_wi }}X{{
                    item.pr_hi
                  }}(CM)
                </p>
                <p>
                  外箱规格：{{ item.ou_le }}X{{ item.ou_wi }}X{{
                    item.ou_hi
                  }}(CM)
                </p>
                <p>装箱量：{{ item.in_en }}/{{ item.ou_lo }}(PCS)</p>
                <p>
                  体积/材积：{{ item.bulk_feet }}(CBM)/{{
                    item.bulk_stere
                  }}(CUFT)
                </p>
                <p>净重/毛重：{{ item.ne_we }}/{{ item.gr_we }}(kg)</p>
                <p>
                  参考单价：<span class="price">{{
                    item.cu_de + item.fa_pr.toFixed(2)
                  }}</span>
                </p>
              </div>
            </div>
            <div class="contact">
              <div class="laiyuan">
                来源于：<span>{{
                  $store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType ==
                    "Exhibition"
                    ? item.supplierName
                    : item.exhibitionName
                }}</span>
              </div>
              <el-button
                round
                size="mini"
                type="primary"
                @click="orderSend(undefined, item)"
                >立即沟通</el-button
              >
            </div>
          </el-card>
        </div>
        <div class="totalBox">
          <transition name="el-zoom-in-bottom">
            <div v-show="drawer" class="transition-box">
              <h3>合计：</h3>
              <div class="items">
                <p>
                  箱数/数量：<span
                    >{{
                      orderDetailTotalCount && orderDetailTotalCount.sumtAmount
                    }}/{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumAmountOu_lo
                    }}(个)</span
                  >
                </p>
                <p>
                  体积/材积：<span
                    >{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumBulk_stere
                    }}(CBM)/{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumBulk_feet
                    }}(cuft)</span
                  >
                </p>
              </div>
              <div class="items">
                <p>
                  毛重/净重：<span
                    >{{
                      orderDetailTotalCount && orderDetailTotalCount.sumGr_we
                    }}/{{
                      orderDetailTotalCount && orderDetailTotalCount.sumNe_we
                    }}(kg)</span
                  >
                </p>
                <p>
                  出厂价/总销售价：<span
                    >{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumAmountFa_pr
                    }}/{{
                      orderDetailTotalCount && orderDetailTotalCount.sumFa_pr_pr
                    }}</span
                  >
                </p>
              </div>
            </div>
          </transition>
        </div>
      </li>
      <!-- 打开我的排号详情 -->
      <li class="contentThree" v-if="showPersonalNumber">
        <div class="personalNumberTitle">
          <p class="titleTXT">{{ showOrderCompanyItem.client_na }}排号</p>
          <div class="numberWarp" @click="openNumberList">
            <el-image
              class="myImg"
              :src="showOrderCompanyItem.companyLogo"
              fit="cover"
            >
              <div
                slot="placeholder"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
              >
                {{ showOrderCompanyItem.client_na }}
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                {{ showOrderCompanyItem.client_na }}
              </div>
            </el-image>
            <div>
              <div class="codeTitle">我的排号:</div>
              <div class="code">{{ personalNumber.arr_nu || 102435 }}</div>
            </div>
          </div>
        </div>
        <div class="personalNumberContent">
          <div class="currentCode">
            <div class="left">
              <span>当前排号</span>
            </div>
            <div class="right"></div>
          </div>
          <el-table
            class="currentCodeContent"
            :data="currentCodeList"
            style="width: 100%"
            height="200"
            :cell-style="timeStyle"
            :header-row-style="headerStyle"
            v-el-table-infinite-scroll="nextCurrentCodeContent"
          >
            <el-table-column
              prop="nego_nu"
              label="洽谈室"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="arr_nu"
              label="当前排号"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="hallcountage"
              label="平均等待时间"
              align="center"
            ></el-table-column>
          </el-table>
          <div class="buyer">
            <div class="left">
              <span>采购商</span>
            </div>
            <div class="right"></div>
          </div>
          <ul class="buyerContent" v-infinite-scroll="buyerContentLoad">
            <li
              class="buyerItem"
              v-for="(item, i) in customerVisitList"
              :key="i"
            >
              <div class="title">{{ item.client_na }}</div>
              <div class="date">
                {{
                  item.happenDate && item.happenDate.replace(/ [\s\S]+/gi, "")
                }}
              </div>
            </li>
          </ul>
        </div>
      </li>
      <!-- 打开历史择样列表 -->
      <li class="contentThree" v-if="showSampleSelection === 'historySample'">
        <div class="historyWrapContent">
          <p class="titleTXT">历史择样</p>
          <div class="bigHistoryHeaderTop">
            <div class="changshang">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">厂商名称</div>
            </div>
            <div class="huohao">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">出厂货号</div>
            </div>
            <div class="kehu">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">客户</div>
            </div>
            <div class="shijian">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">时间</div>
            </div>
          </div>
        </div>
        <ul
          class="historyWrapBody"
          v-infinite-scroll="addSampleSelectionList"
          infinite-scroll-disabled="activeAddSample"
        >
          <template v-if="sampleSelectionList && sampleSelectionList.length">
            <li v-for="(item, i) in sampleSelectionList" :key="i">
              <span>{{ item.ma_na }}</span>
              <span>{{ item.fa_no }}</span>
              <span>{{ item.client_na }}</span>
              <span>{{
                item.happendate && item.happendate.split(/ /)[0]
              }}</span>
            </li>
            <center
              style="padding:10px;backgroundColor:#f5f7fa;color:#aaa"
              v-show="showAddSampleTXT"
            >
              <i
                class="el-icon-loading"
                v-show="showAddSampleTXT === '加载中...'"
              ></i>
              {{ showAddSampleTXT }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </ul>
      </li>
      <!-- 打开择样排行列表 -->
      <li class="contentThree" v-if="showSampleSelection === 'rankingSample'">
        <div class="rankingWrapContent">
          <p class="titleTXT">择样排行</p>
          <div class="bigRankingHeaderTop">
            <div class="changshang">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">厂商名称</div>
            </div>
            <div class="huohao">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">出厂货号</div>
            </div>
            <div class="zeyangshu">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">择样数</div>
            </div>
          </div>
        </div>

        <ul
          class="rankingWrapBody"
          v-infinite-scroll="addSampleSelectionList"
          infinite-scroll-disabled="activeAddSample"
        >
          <template v-if="sampleSelectionList && sampleSelectionList.length">
            <li v-for="(item, i) in sampleSelectionList" :key="i">
              <span class="item">{{ item.ma_na }}</span>
              <span class="item">{{ item.fa_no }}</span>
              <span class="item">{{ item.sumfa_no }}</span>
            </li>
            <center
              style="padding:10px;backgroundColor:#f5f7fa;color:#aaa"
              v-show="showAddSampleTXT"
            >
              <i
                class="el-icon-loading"
                v-show="showAddSampleTXT === '加载中...'"
              ></i>
              {{ showAddSampleTXT }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </ul>
      </li>
      <!-- 打开我的产品列表 -->
      <li class="contentThree" v-if="showSampleSelection === 'myProduct'">
         <h3 class="infoListTitle" style="background-color: #fff;">我的产品</h3>
        <div class="myProductSearch">
          <div class="inputBox">
            <el-input v-model="myProductSearchValue" @keyup.native.enter="myProductSearchEvent" clearable placeholder="请输入搜索内容"></el-input>
            <el-button type="primary" @click="myProductSearchEvent" round>搜索</el-button>
          </div>
        </div>
        <div class="myProductSearchTotalCountBox"><p></p><p class="myTotalCount"><span>{{sampleSelectionTotalCount}}</span>条产品</p> <p class="more"><i @click="checkMoreEvent" class="checkCube" v-show="isCheckCube"></i><i @click="checkMoreEvent" class="checkList"  v-show="!isCheckCube"></i></p></div>
        <ul class="myProductWrapBody" v-infinite-scroll="addSampleSelectionList"
          infinite-scroll-disabled="activeAddSample">
          <template v-if="sampleSelectionList && sampleSelectionTotalCount">
            <!-- 方格类型 -->
            <div class="itemBox" v-if="isCheckCube">
              <li class="itemCube"  v-for="(item, i) in sampleSelectionList" :key="i">
              <div class="imgItem">
                <el-image
                  fit="contain"
                  :src="item.imageUrl"
                  :key="item.id"
                  :preview-src-list="[
                    item.imageUrl &&
                      item.imageUrl.replace(/_SmallPic/, '_Photo')
                  ]"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
              </div>
              <div class="context">
                <h3 class="contextItem">{{ item.name }}</h3>
                <p class="contextItem"> 出厂货号：{{ item.fa_no }}</p>
                <p class="contextItem">参考单价：<span class="price">{{ item.cu_de + item.price }}</span> </p>
              </div>
            </li>
            </div>
            <!-- 列表类型 -->
            <div class="itemBox" v-else>
              <li class="itemList"  v-for="(item, i) in sampleSelectionList" :key="i">
              <div class="imgItemLeft">
                <el-image
                  fit="contain"
                  :src="item.imageUrl"
                  :key="item.id"
                  :preview-src-list="[
                    item.imageUrl &&
                      item.imageUrl.replace(/_SmallPic/, '_Photo')
                  ]"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
                <div class="date"><i></i> 2020-10-10</div>
              </div>
              <div class="context">
                <h3 class="contextItem productName">{{ item.name }}</h3>
                <p class="contextItem"> 出厂货号：{{ item.fa_no }}</p>
                <p class="contextItem"> 包装：{{ item.ch_pa }}</p>
                <p class="contextItem"> 样品规格：{{item.pr_le + " X " + item.pr_wi + " X " + item.pr_hi + "(CM)"}}</p>
                <p class="contextItem"> 外箱规格：{{ item.ou_le + " X " + item.ou_wi + " X " + item.ou_hi + "(CM)" }}(CM)</p>
                <p class="contextItem"> 装箱量：{{ item.in_en + "/" + item.ou_lo + "(PCS)" }}</p>
                <p class="contextItem"> 体积/材积：{{ item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)" }}</p>
                <p class="contextItem"> 毛重净重：{{ item.ne_we + "/" + item.gr_we + "(KG)" }}</p>
                <p class="contextItem"> 参考单价：<span class="price">{{ item.cu_de + item.price }}</span> </p>
              </div>
            </li>
            </div>
            <center
              style="padding:10px;backgroundColor:#f5f7fa;color:#aaa"
              v-show="showAddSampleTXT"
            >
              <i
                class="el-icon-loading"
                v-show="showAddSampleTXT === '加载中...'"
              ></i>
              {{ showAddSampleTXT }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </ul>
      </li>
      <!-- 修改个人资料 -->
      <li class="contentThree" v-if="active2 === 2">
        <div class="datas">
          <li>
            <div class="title">头像</div>
            <div class="text">
              <el-image
                :src="datas && datas.userImage"
                class="myAvatar"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ datas.linkman }}
                </div>
              </el-image>
              <input type="file" class="upLoad" @change="fileChange" />
            </div>
          </li>
          <li>
            <div class="title">姓名</div>
            <div class="text">
              <input type="text" v-model="datas.linkman" />
            </div>
          </li>
          <li>
            <div class="title">性别</div>
            <div class="text">
              <select
                v-model="datas.sex"
                style="border:none;outline: none;cursor: pointer;"
              >
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
          </li>
          <li>
            <div class="title">生日</div>
            <div class="text">
              <el-date-picker
                v-model="datas.birthday"
                type="date"
                placeholder="选择日期"
                size="mini"
                style="width:130px"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <div class="title">电话</div>
            <div class="text">
              <input type="text" v-model="datas.phoneNumber" />
            </div>
          </li>
          <li>
            <div class="title">备注</div>
            <textarea
              rows="2"
              cols="15"
              v-model="datas.remark"
              style="border-color:#ccc;border-radius:5px;outline:none;overflow:auto;resize:none;"
              maxlength="500"
            ></textarea>
          </li>
        </div>
        <center class="send">
          <el-button class="sendInfo" round @click="editPersonal"
            >确认</el-button
          >
        </center>
      </li>
      <!-- 查看公司资料 -->
      <li
        class="contentTwo"
        v-if="
          showCollection.active === 1 &&
            $route.path === '/meInfo/newSletter' &&
            showCollection.type === 'showCompany'
        "
      >
        <div class="CompanyTop"></div>
        <div class="CompanyBottom"></div>
        <div class="detailBox" v-if="CompanyDetail">
          <div class="CompanyDetail">
            <div class="CompanyName">
              <div class="text">
                <p>{{ CompanyDetail && CompanyDetail.companyName }}</p>
              </div>
              <div class="img">
                <el-image
                  @click.native="openEdit(CompanyDetail.id)"
                  class="myImgs"
                  :src="CompanyDetail && CompanyDetail.companyLogo"
                  fit="cover"
                >
                  <div
                    slot="error"
                    class="image-slot"
                    style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                  >
                    {{ CompanyDetail && CompanyDetail.companyName }}
                  </div>
                </el-image>
              </div>
            </div>
          </div>
          <div class="ContactInformation">
            <div class="ContactItem">
              <div class="title">电话</div>
              <div class="text">
                <template v-if="CompanyDetail && CompanyDetail.phoneNumber">
                  {{ CompanyDetail.phoneNumber }}
                </template>
              </div>
            </div>
            <div class="ContactItem">
              <div class="title">邮箱</div>
              <div class="text">
                <template v-if="CompanyDetail && CompanyDetail.e_mail">
                  {{ CompanyDetail.e_mail }}
                </template>
              </div>
            </div>
            <div class="ContactItem">
              <div class="title">地址</div>
              <div class="text">
                 <template  v-if="CompanyDetail && CompanyDetail.address">
                  <div class="address el-icon-location-information" @click="openMap(CompanyDetail)">
                    {{ CompanyDetail.address }}
                    </div>
                  </template>
              </div>
            </div>
            <center class="send">
              <el-button class="sendInfo" @click="companySend" round>
                <i class="el-icon-s-comment el-icon--left sendIcon"></i>
                立即沟通
              </el-button>
            </center>
          </div>
        </div>
      </li>
      <!-- 查看对应联系公司列表 -->
      <li
        class="contentTwo"
        v-if="
          showCollection.active === 1 &&
            $route.path === '/meInfo/newSletter' &&
            showCollection.type === 'showCompanyList'
        "
      >
        <div class="list">
          <div class="mySearchs">
            <el-input
              class="searchInput"
              prefix-icon="iconfont icon-sousuo"
              clearable
              v-model="searchCompanyName"
              placeholder="请输入公司名称进行搜索"
              @keyup.enter.native="searchCompanyList"
            ></el-input>
          </div>
          <center
            style="margin-top:10px;font-size:14px;color:#383838;"
            v-show="showSearchCompanyCount"
          >
            搜索到
            <span style="color:red;">{{ companyListTotalCount }}</span> 个结果
          </center>
          <div class="listItems" v-if="companyListTotalCount" v-infinite-scroll="companyListLoad" infinite-scroll-disabled="companyLoadDisabled">
            <div
              class="item"
              v-for="(item, i) in CompanyList"
              :key="i"
              @click="openCompanyDetail(item.companyId)"
            >
              <el-image class="myAvatar" :src="item.companyLogo" fit="cover">
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ item.companyName }}
                </div>
              </el-image>
              <p>{{ item.companyName }}</p>
            </div>
          </div>
          <div v-else-if="showSearchCompanyCount" class="searchCompanyNoData">
            <p>暂无搜到联系人</p>
          </div>
          <div v-else class="companyNoData">
            <p>暂无联系人</p>
          </div>
        </div>
      </li>
      <!-- 查看对应联系公司详情 -->
      <li class="contentThree" v-if="active2 === 4">
        <div class="CompanyTop"></div>
        <div class="CompanyBottom"></div>
        <div class="detailBox">
          <div class="CompanyDetail" v-if="CompanyDetail">
            <div class="CompanyName">
              <div class="text">
                <p>
                  {{
                    CompanyDetail &&
                      CompanyDetail.orgCompany &&
                      CompanyDetail.orgCompany.companyName
                  }}
                </p>
              </div>
              <div class="img">
                <el-image
                  class="myAvatar"
                  :src="
                    CompanyDetail &&
                      CompanyDetail.orgCompany &&
                      CompanyDetail.orgCompany.companyLogo
                  "
                  fit="cover"
                >
                  <div
                    slot="error"
                    class="image-slot"
                    style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                  >
                    {{
                      CompanyDetail &&
                        CompanyDetail.orgCompany &&
                        CompanyDetail.orgCompany.companyName
                    }}
                  </div>
                </el-image>
              </div>
            </div>

            <div
              class="evaluation"
              v-if="CompanyDetail && CompanyDetail.isMain"
            >
              <p class="evaluationTitle">自身评价</p>
              <div class="tags">
                <template v-if="CompanyDetail && CompanyDetail.companyLabel">
                  <el-button
                    size="small"
                    round
                    icon="el-icon-edit"
                    @click="openAddTag"
                    >填写标签</el-button
                  >
                  <el-tag
                    class="deleteTag"
                    closable
                    :type="tagsType[i]"
                    v-for="(item, i) in CompanyDetail.companyLabel"
                    :key="i"
                    >{{ item.labelName }}</el-tag
                  >
                </template>
              </div>
            </div>
            <template v-else>
              <div class="evaluation">
                <p class="evaluationTitle">自身评价</p>
                <div class="tags">
                  <template v-if="CompanyDetail && CompanyDetail.companyLabel">
                    <template v-for="(item, i) in CompanyDetail.companyLabel">
                      <el-tag
                        v-if="!item.isCompany"
                        :type="tagsType[i]"
                        :key="i"
                        >{{ item.labelName }}</el-tag
                      >
                    </template>
                  </template>
                </div>
              </div>
              <div class="evaluation">
                <p class="evaluationTitle">我的评价</p>
                <div class="tags">
                  <el-button
                    size="small"
                    round
                    icon="el-icon-edit"
                    @click="openAddTag"
                    >填写标签</el-button
                  >
                  <template v-if="CompanyDetail && CompanyDetail.companyLabel">
                    <template v-for="(item, i) in CompanyDetail.companyLabel">
                      <el-tag
                        v-if="item.isCompany"
                        :type="tagsType[i]"
                        :key="i"
                        >{{ item.labelName }}</el-tag
                      >
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div class="ContactInformation">
            <div class="ContactItem">
              <div class="title">电话</div>
              <div class="text">
                <span
                  v-if="
                    CompanyDetail &&
                      CompanyDetail.orgCompany &&
                      CompanyDetail.orgCompany.phoneNumber
                  "
                  >{{ CompanyDetail.orgCompany.phoneNumber }}</span
                >
              </div>
            </div>
            <div class="ContactItem">
              <div class="title">邮箱</div>
              <div class="text">
                <template
                  v-if="
                    CompanyDetail &&
                      CompanyDetail.orgCompany &&
                      CompanyDetail.orgCompany.e_mail
                  "
                  >{{ CompanyDetail.orgCompany.e_mail }}</template
                >
              </div>
            </div>
            <div class="ContactItem">
              <div class="title">地址</div>
              <div class="text">
                <template  v-if="CompanyDetail && CompanyDetail.orgCompany && CompanyDetail.orgCompany.address">
                   <div class="address el-icon-location-information"  @click="openMap(CompanyDetail.orgCompany)">
                     {{ CompanyDetail.orgCompany.address }}
                     </div>
                  </template>
              </div>
            </div>
            <center class="send">
              <el-button class="sendInfo" @click="companySend" round>
                <i class="el-icon-s-comment el-icon--left sendIcon"></i>
                立即沟通
              </el-button>
            </center>
          </div>
        </div>
      </li>
      <!-- 朋友圈我发布的信息 -->
      <div class="findList" v-if="$route.path === '/meInfo/findList'">
        <div class="sendFind">
          <div
            class="sendFindItem"
            @click="openSendFind(item.type)"
            v-for="item in [
              {
                id: 1,
                text: '普通公告',
                type: 'Ordinary',
                path: require('@/assets/images/gonggao1.png')
              },
              {
                id: 2,
                text: '采购公告',
                type: 'Purchase',
                path: require('@/assets/images/gonggao2.png')
              },
              {
                id: 3,
                text: '供应公告',
                type: 'Supply',
                path: require('@/assets/images/gonggao3.png')
              }
            ]"
            :key="item.id"
          >
            <div class="iconImg">
              <img :src="item.path" :key="item.path" alt />
            </div>
            <div class="txt">{{ item.text }}</div>
          </div>
        </div>
        <div
          class="findItems"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled"
        >
          <div class="findItem" v-for="(item, i) in dataList" :key="i">
            <template v-if="item">
              <div class="topLayout">
                <div class="img">
                  <el-image
                    :src="item.userInfo.image"
                    class="findImage"
                    fit="cover"
                  >
                    <div
                      slot="error"
                      class="image-slot"
                      style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                    >
                      {{ item.userInfo.niceName }}
                    </div>
                  </el-image>
                </div>
                <div class="title">
                  <p>{{ item.userInfo.niceName }}</p>
                </div>
              </div>
              <p class="ContentText">
                <em>{{ item.bearNotice.notice }}</em>
              </p>
              <div class="imgComtent" v-if="item.video">
                <div class="demo1-video">
                  <video
                    width="100%"
                    height="100%"
                    class="video-js vjs-default-skin vjs-big-play-centered"
                    controls
                    style="object-fit:cover"
                  >
                    <source :src="item.video" type="video/mp4" />
                  </video>
                </div>
              </div>
              <template v-else-if="item.imgList.length > 1">
                <div class="imgComtent">
                  <el-image
                    v-for="(val, index) in item.imgList.split(',')"
                    :key="index"
                    class="img"
                    :src="val"
                    alt
                    :preview-src-list="item.imgList.split(',')"
                  ></el-image>
                </div>
              </template>
              <div class="dateInDelet">
                <div>
                  <span>{{ dateDiff(item.bearNotice.publishDate) }}</span>
                  <el-popconfirm
                    class="deleteBtn"
                    title="确定要删除这条公告吗？"
                    @onConfirm="deleteCement(item, i)"
                  >
                    <span slot="reference">删除</span>
                  </el-popconfirm>
                </div>

                <div class="like">
                  <span @click="dianZan(item)">
                    <i
                      class="iconfont icon-love_icon"
                      v-show="!item.isLike"
                    ></i>
                    <i
                      class="iconfont icon-aixin"
                      v-show="item.isLike"
                      style="color:#fb6055;"
                    ></i>
                    <em>{{ item.bearNotice.upvoteTotal }}</em>
                  </span>
                  <span class="pinglun" @click="openPinglun(item)">
                    <i class="iconfont icon-xiaoxi1"></i>
                    <em>{{ item.bearNotice.review }}</em>
                  </span>
                </div>
              </div>
              <!-- 评论 -->
              <div class="reply" v-if="item.noticeInteraction.length > 0">
                <template v-for="(item1, i) in item.noticeInteraction">
                  <p :key="i">
                    <span
                      style="cursor: pointer;"
                      @click="openReplyComment(item1)"
                      >{{ item1.userName }}</span
                    >
                    <em v-if="item1.replyToUserName">
                      回复
                      <span
                        @click="openReplyComment(item1, item1.replyToUserName)"
                        style="padding-right:5px;cursor: pointer;"
                        >{{ item1.replyToUserName }}</span
                      >
                    </em>
                    ：{{ item1.comment }}
                  </p>
                </template>
              </div>
            </template>
          </div>
          <center
            style="padding:10px 0;background-color:#eeeeed;margin:10px 0 0 0;position: relative;"
          >
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
            <div
              class="huidaodingbu el-icon-caret-top"
              v-show="dataList.length > 9"
              @click="toTop"
            ></div>
          </center>
        </div>
      </div>
      <!-- 发布公告 -->
      <li
        class="contentThree sendGonggaoBox"
        v-if="active2 === 5 && $route.path === '/meInfo/findList'"
      >
        <div class="sendGonggao">
          <el-form :model="ruleForm" ref="refGonggao" class="demo-ruleForm" show-message hide-required-asterisk>
            <el-form-item prop="GonggaoText" ref="rulesInput" :rules="[{ required: true, message: '公告内容不能为空' }]">
              <el-input
                type="textarea"
                class="txtWrap"
                resize="none"
                :rows="5"
                :placeholder="gonggaoTypes"
                v-model="ruleForm.GonggaoText"
                :maxlength="Json.NoticeRestrictions[3].itemCode"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>

          <div class="gonggaoImgList">
            <el-upload
              action="#"
              list-type="picture-card"
              :file-list="fileList"
              :limit="imgAndVideoNum"
              :on-change="changeFile"
              class="imgsItem"
              :auto-upload="false"
              :accept="uploadAccept"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  width="100%"
                  height="100%"
                  v-if="
                    Json.NoticeRestrictions &&
                      Json.NoticeRestrictions[1].itemCode
                        .toLowerCase()
                        .includes($_.last(file.name.split('.')))
                  "
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt
                />
                <video
                  v-else-if="
                    Json.NoticeRestrictions &&
                      Json.NoticeRestrictions[0].itemCode
                        .toLowerCase()
                        .includes($_.last(file.name.split('.')))
                  "
                  width="100%"
                  height="100%"
                  class="video-js vjs-default-skin vjs-big-play-centered sendVideoImg"
                  controls
                  style="object-fit:cover"
                >
                  <source
                    ref="videoPreview"
                    :src="file.url"
                    :type="file.raw.type"
                  />
                </video>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabledImg"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabledImg"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file, fileList)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibleImg" destroy-on-close>
              <img
                v-if="dialogVisibleImg"
                width="100%"
                :src="dialogImageUrl"
                alt
              />
            </el-dialog>
          </div>
          <div class="sendGonggaoBtn">
            <el-button type="primary" class="sendBtn" @click="isSelectPush"
              >发 布</el-button
            >
          </div>
        </div>
      </li>
      <!-- 聊天窗口 -->
      <li
        class="contentThree sendGonggaoBox showLiaotianList"
        v-if="showTypeOptions.showLiaotianType === 'showLiaotianList'"
      >
        <h3 class="infoListTitle">
          {{ signalROptions.name && signalROptions.name }}
        </h3>
        <div
          class="isOrder"
          @click="isOrderShowEvent"
          v-if="
            isOrderShow &&
              $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
        >
          <div class="wenzitxt">
            <h4 style="font-weight:500;">
              {{ orderItemsOptions && orderItemsOptions.messageTitle }}
            </h4>
            <p>
              客户名称：{{ orderItemsOptions && orderItemsOptions.client_na }}
            </p>
            <p>
              备注：{{ orderItemsOptions && orderItemsOptions.pushContent }}
            </p>
          </div>
          <i class="guanbi el-icon-close" @click.stop="guanbiOrder"></i>
        </div>
        <div
          class="isOrder2"
          @click="isOrderShowEvent"
          v-else-if="
            isOrderShow &&
              $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType  !==  'Supplier'
          "
        >
          <div class="left">
            <el-image
              fit="contain"
              :src="orderItemOptions && orderItemOptions.imgUrl[0]"
            >
              <div slot="placeholder" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
            </el-image>
          </div>
          <div class="right">
            <h3>{{ orderItemOptions.pr_na }}</h3>
            <p>货号：{{ orderItemOptions.co_nu }}</p>
          </div>
          <i class="guanbi el-icon-close" @click.stop="guanbiOrder"></i>
        </div>
        <div
          class="liaotianList"
          ref="liaotianRef"
          @scroll="liaotianScroll"
          id="liaotianchuangkou"
        >
          <div class="liaotianWarp">
            <p
              style="textAlign:center;width:100%;color:#b2c3da;padding:10px;box-sizing:border-box;"
              v-show="loadText && chatHistoryTotal > 10"
            >
              <i class="el-icon-loading" v-show="loadText === '加载中...'"></i>
              {{ loadText }}
            </p>
            <template v-for="(item, i) in signalROptions.showmsg">
              <div :key="i" class="liaotianItens">
                <div
                  v-if="item.fromUserId === $store.state.userInfo.userInfo.id"
                >
                  <center style="font-size:12px;color:#ccc;">
                    {{ item.createdOn && dateDiff(item.createdOn) }}
                  </center>
                  <!-- 我的消息 -->
                  <div class="myInfo">
                    <div class="myAvatarImg">
                      <el-image
                        class="img"
                        :src="$store.state.userInfo.userInfo.userImage"
                        fit="cover"
                      >
                        <div slot="placeholder" class="image-slot">
                          <img
                            class="errorImg"
                            src="~@/assets/images/imgError.jpg"
                            alt
                          />
                        </div>
                        <div slot="error" class="image-slot">
                          <img
                            class="errorImg"
                            src="~@/assets/images/imgError.jpg"
                            alt
                          />
                        </div>
                      </el-image>
                    </div>
                    <div class="context">
                      <div
                        id="myContent"
                        @contextmenu.prevent.stop="
                          openEditInfo($event, item.id)
                        "
                      >
                        <!-- 文本 -->
                        <div
                          class="youTextInfo"
                          v-if="item.messageType === 'Text'"
                        >
                          <span class="msgTypeText">
                            <pre>{{ item.content }}</pre></span
                          >
                        </div>
                        <!-- 视频 -->
                        <div
                          class="msgTypeVideo"
                          v-else-if="item.messageType === 'Video'"
                        >
                          <video
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            style="object-fit:cover"
                          >
                            <source
                              ref="videoPreview"
                              :src="item.attachment"
                              :type="
                                'video/' + $_.last(item.attachment.split('.'))
                              "
                            />
                          </video>
                        </div>
                        <!-- 图片 -->
                        <div
                          class="msgTypeImage"
                          v-else-if="item.messageType === 'Picture'"
                        >
                          <el-image
                            fit="contain"
                            :src="item.attachment"
                            :key="item.attachment"
                            :preview-src-list="[item.attachment]"
                          >
                            <div slot="error" class="image-slot">
                              <img
                                class="errorImg"
                                src="~@/assets/images/图片加载失败.png"
                                alt
                              />
                            </div>
                          </el-image>
                        </div>
                        <!-- 音频 -->
                        <div
                          v-else-if="item.messageType === 'Voice'"
                          @click="checkMsgTypeAudio(item)"
                          class="msgTypeAudio"
                        >
                          <img
                            v-show="!item.isOpen"
                            src="~@/assets/images/暂停.png"
                            alt
                          />
                          <img
                            v-show="item.isOpen"
                            src="~@/assets/images/播放.gif"
                            alt
                          />
                          <audio
                            :ref="'myAudio' + item.attachment"
                            :src="item.attachment"
                            @ended="ended"
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <!-- file文件 -->
                        <a
                          v-else-if="item.messageType === 'file'"
                          :href="item.attachment"
                          :download="$_.last(item.attachment.split('/'))"
                          target="_blank"
                          class="msgTypeTXT"
                        >
                          <div class="title">附件：</div>
                          <p>{{ $_.last(item.attachment.split("/")) }}</p>
                        </a>
                        <!-- 即时语音功能 -->
                        <div
                          style="width:285px;padding:10px;color:#b2b2b2;"
                          v-else-if="item.messageType === 'InstantVoice'"
                        >
                          <center>暂无即时语音功能</center>
                        </div>
                        <!-- 即时视频功能 -->
                        <div
                          style="width:285px;padding:10px;color:#b2b2b2;"
                          v-else-if="item.messageType === 'TimeVideo'"
                        >
                          <center>暂无即时视频功能</center>
                        </div>
                      </div>
                      <!-- 打开操作消息 -->
                      <div class="myChehui" v-show="item.id === isChehui">
                        <div
                          class="item"
                          v-if="item.messageType === 'Text'"
                          @click="copyInfo(item)"
                        >
                          复制
                        </div>
                        <div
                          class="item"
                          v-if="item.messageType  !==  'Voice'"
                          @click="forwardInfo(item)"
                        >
                          转发
                        </div>
                        <div class="item" @click="withdrawInfo(item)">撤回</div>
                        <div class="item" @click="deleteInfo(item)">删除</div>
                      </div>

                      <!-- 群发已读未读 | 单聊已读未读 -->
                      <template v-if="signalROptions.isGroup">
                        <div class="unRead" v-show="item.unreadCout">
                          {{ isShowReady(item) }}人未读
                        </div>
                        <div class="read" v-show="!item.unreadCout">
                          全部已读
                        </div>
                      </template>

                      <template v-else>
                        <div class="read" v-show="!item.unreadCout">
                          已读
                        </div>
                        <div class="unRead" v-show="isShowReady(item)">
                          未读
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <center style="font-size:12px;color:#ccc;">
                    {{ item.createdOn && dateDiff(item.createdOn) }}
                  </center>
                  <!-- 你的消息 -->
                  <div class="youInfo">
                    <div class="myAvatarImg">
                      <el-image class="img" :src="item.userImage" fit="cover">
                        <div
                          slot="placeholder"
                          class="image-slot"
                          style="width:100%;height:100%;backgroundColor:#165af7;color:#fff;display:flex;align-items:center;justify-content: center;white-space: nowrap;"
                        >
                          {{ item.linkName }}
                        </div>
                        <div
                          slot="error"
                          class="image-slot"
                          style="width:100%;height:100%;backgroundColor:#165af7;color:#fff;display:flex;align-items:center;justify-content: center;white-space: nowrap;"
                        >
                          {{ item.linkName }}
                        </div>
                      </el-image>
                    </div>
                    <div class="context">
                      <div class="youInfoName">{{ item.linkName }}</div>
                      <div
                        id="myContent"
                        @contextmenu.prevent.stop="
                          openEditInfo($event, item.id)
                        "
                      >
                        <!-- 文本 -->
                        <div
                          class="youTextInfo"
                          v-if="item.messageType === 'Text'"
                        >
                          <span class="msgTypeText"
                            ><pre>{{ item.content }}</pre></span
                          >
                        </div>
                        <!-- 视频 -->
                        <div
                          class="msgTypeVideo"
                          v-else-if="item.messageType === 'Video'"
                        >
                          <video
                            class="video-js vjs-default-skin vjs-big-play-centered"
                            controls
                            style="object-fit:cover"
                          >
                            <source
                              ref="videoPreview"
                              :src="item.attachment"
                              :type="
                                'video/' + $_.last(item.attachment.split('.'))
                              "
                            />
                          </video>
                        </div>
                        <!-- 图片 -->
                        <div
                          class="msgTypeImage"
                          v-else-if="item.messageType === 'Picture'"
                        >
                          <el-image
                            fit="contain"
                            :src="item.attachment"
                            :key="item.attachment"
                            :preview-src-list="[item.attachment]"
                          >
                            <div slot="error" class="image-slot">
                              <img
                                class="errorImg"
                                src="~@/assets/images/图片加载失败.png"
                                alt
                              />
                            </div>
                          </el-image>
                        </div>
                        <!-- 音频 -->
                        <div
                          v-else-if="item.messageType === 'Voice'"
                          @click="checkMsgTypeAudio(item)"
                          class="msgTypeAudio"
                        >
                          <img
                            v-show="!item.isOpen"
                            src="~@/assets/images/暂停.png"
                            alt
                          />
                          <img
                            v-show="item.isOpen"
                            src="~@/assets/images/播放.gif"
                            alt
                          />
                          <audio
                            :ref="'myAudio' + item.attachment"
                            :src="item.attachment"
                            @ended="ended"
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <!-- file文件 -->
                        <!-- @click="openPreview(item)" -->
                        <a
                          v-else-if="item.messageType === 'file'"
                          :href="item.attachment"
                          :download="$_.last(item.attachment.split('/'))"
                          target="_blank"
                          class="msgTypeTXT"
                        >
                          <div class="title">附件：</div>
                          <p>{{ $_.last(item.attachment.split("/")) }}</p>
                        </a>
                        <!-- 即时语音功能 -->
                        <div
                          style="width:250px;padding:10px;color:#b2b2b2;"
                          v-else-if="item.messageType === 'InstantVoice'"
                        >
                          <center>暂无即时语音功能</center>
                        </div>
                        <!-- 即时视频功能 -->
                        <div
                          style="width:250px;padding:10px;color:#b2b2b2;"
                          v-else-if="item.messageType === 'TimeVideo'"
                        >
                          <center>暂无即时视频功能</center>
                        </div>
                      </div>
                      <div class="myChehui" v-show="item.id === isChehui">
                        <div
                          class="item"
                          v-if="item.messageType === 'Text'"
                          @click="copyInfo(item)"
                        >
                          复制
                        </div>
                        <div
                          class="item"
                          v-if="item.messageType  !==  'Voice'"
                          @click="forwardInfo(item)"
                        >
                          转发
                        </div>
                        <div class="item" @click="deleteInfo(item)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="infoListSend">
          <div
            class="maikef el-icon-microphone"
            @click="recOpen(true)"
            v-show="!isShowRec"
          ></div>
          <div
            class="maikef iconfont icon-dakaijianpan"
            @click="recOpen(false)"
            v-show="isShowRec"
          ></div>
          <div
            class="sendValueInput"
            v-show="!isShowRec"
            @contextmenu.prevent.stop="OpenPaste"
          >
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              autocomplete="off"
              v-model="signalROptions.value"
              ref="sendMessageRef"
              class="sendValue"
              @keyup.native.prevent="sendMessage"
              :maxlength="Json.MessageRestriction[6].itemCode"
            ></el-input>
            <div class="pasteIten" v-show="isPaste" @click="pasteInfo($event)">
              粘贴
            </div>
          </div>
          <el-button
            class="sendValueBtn"
            plain
            v-show="isShowRec"
            @click="showDeleteButton"
            :style="{ backgroundColor: sendRec ? '#fff' : '#ecf5ff' }"
          >
            <span v-show="sendRec">{{ sendRec }}</span>
            <img
              v-show="!sendRec"
              src="~@/assets/images/录音.gif"
              alt
              width="100%"
              style="vertical-align:top;height:50px;"
            />
          </el-button>

          <i class="iconfont icon-746bianjiqi_biaoqing"></i>
          <i class="iconfont el-icon-circle-plus-outline sendfiles">
            <input
              type="file"
              title
              ref="refFileInput"
              @change="changeFiless"
              class="fileInput"
              :accept="
                Json.MessageRestriction &&
                  Json.MessageRestriction[2].itemCode +
                    ',' +
                    Json.MessageRestriction[3].itemCode +
                    ',' +
                    Json.MessageRestriction[4].itemCode +
                    ',' +
                    Json.MessageRestriction[5].itemCode
              "
            />
          </i>
          <div class="sendBtnBox">
            <transition name="show">
              <el-button
                class="sendBtn"
                @click="sendMessages"
                v-show="signalROptions.value"
                size="mini"
                >发送</el-button
              >
            </transition>
          </div>
        </div>
      </li>
    </div>
    <!-- 打标签 -->
    <el-dialog title="新增标签" :visible.sync="dialogAddTag" destroy-on-close width="400px">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="标签内容">
          <el-input
            v-model="tagValue"
            autocomplete="off"
            :maxlength="
              Json.CompanyRestrictions && Json.CompanyRestrictions[0].itemCode
            "
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddTag = false">取 消</el-button>
        <el-button type="primary" @click="addTag">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 评论 -->
    <el-dialog :title="pinglunTitle" :visible.sync="dialogPinglun" width="30%">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="评论内容">
          <el-input v-model="pinglunValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPinglun = false">取 消</el-button>
        <el-button type="primary" @click="addComment">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认订单 -->
    <el-dialog
      title="确认提示"
      :visible.sync="queRenDialog"
      width="30%"
      :before-close="handleClose"
    >
      <center class="querenDialog">
        <h3 class="title">{{ orderOptions && orderOptions.client_na }}</h3>
        <p class="titleText">需要带走或借走所有样品？</p>
        <template v-if="orderOptions">
          <div class="btns" v-if="orderOptions.messageExt === 3">
            <el-button
              @click="UpdateERPOrderStatus('1')"
              size="medium"
              round
              :class="{ activeGray: orderOptions.messageStatus === 1 }"
              >不可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                blueBtn: true,
                activeBlue: orderOptions.messageStatus === 0
              }"
              >可带</el-button
            >
          </div>
          <div class="btns" v-else-if="orderOptions.messageExt === 5">
            <el-button
              size="medium"
              @click="UpdateERPOrderStatus('1')"
              round
              :class="{ activeGray: orderOptions.messageStatus === 1 }"
              >不可借</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                orangeBtn: true,
                activeOrange: orderOptions.messageStatus === 0
              }"
              >可借</el-button
            >
          </div>
          <div class="btns" v-else-if="orderOptions.messageExt === 11">
            <el-button
              size="medium"
              @click="UpdateERPOrderStatus('2')"
              round
              :class="{ activeGray: orderOptions.messageStatus === 2 }"
              >不可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                blueBtn: true,
                activeBlue: orderOptions.messageStatus === 0
              }"
              >可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('1')"
              size="medium"
              round
              :class="{
                orangeBtn: true,
                activeOrange: orderOptions.messageStatus === 1
              }"
              >可借</el-button
            >
          </div>
        </template>
        <p style="padding-top:20px;">
          <i
            style="width:16px;height:16px;backgroundColor:#709AFA;display:inline-block;border-radius:50%;color:white;vertical-align: middle;"
            >!</i
          >
          此次操作将确认所有货号状态
        </p>
      </center>
    </el-dialog>
    <!-- 选择公告推送人 -->
    <el-dialog
      title="选择收信人"
      :visible.sync="selectPush"
      destroy-on-close
      width="30%"
      top="50px"
    >
      <el-radio-group class="myRadios" v-model="radio" @change="changeRadios">
        <el-radio label="all" v-show="$store.state.userInfo.commparnyList[0].companyType === 'Supplier' || $store.state.userInfo.commparnyList[0].companyType === 'Exhibition' || $store.state.userInfo.commparnyList[0].companyType === 'Sales'">
          <el-avatar
            :size="30"
            :src="require('@/assets/images/供应商.png')"
          ></el-avatar
          >平台所有人
        </el-radio>
        <!-- <el-radio label="Exhibition" v-show="$store.state.userInfo.commparnyList[0].companyType === 'Admin'">
          <el-avatar
            :size="30"
            :src="require('@/assets/images/公司.png')"
          ></el-avatar
          >所有展厅联系人
        </el-radio> -->
        <el-radio label="Sales" v-show="$store.state.userInfo.commparnyList[0].companyType === 'Supplier'">
          <el-avatar
            :size="30"
            :src="require('@/assets/images/公司.png')"
          ></el-avatar
          >所有公司联系人
        </el-radio>
        <el-radio label="Supplier"  v-show="$store.state.userInfo.commparnyList[0].companyType === 'Exhibition' || $store.state.userInfo.commparnyList[0].companyType === 'Sales'">
          <el-avatar
            :size="30"
            :src="require('@/assets/images/公司.png')"
          ></el-avatar
          >所有厂商联系人
        </el-radio>
      </el-radio-group>
      <div class="tongxunlu">
        <div class="title">
          <span>通讯录联系人</span>
        </div>
        <div class="tongxunluLianxiren" v-infinite-scroll="tongxunluLoad">
          <el-checkbox-group
            class="myCheckBox"
            v-model="checkUserList"
            @change="handleCheckAllChange"
          >
            <el-checkbox v-for="(item, i) in orgList" :key="i" :label="item.id">
              <el-image class="img" :src="item.userImage" fit="cover">
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ item.linkman }}
                </div>
              </el-image>
              {{ item.linkman }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <center>
        <el-button @click="selectPush = false">取 消</el-button>
        <el-button type="primary" @click="sendSelectPush">发 送</el-button>
      </center>
    </el-dialog>
    <!-- 公司地址定位地图 -->
    <el-dialog
      title="定位"
      :visible.sync="companyAddrMapDialog"
      v-if="companyAddrMapDialog"
      destroy-on-close
      width="50%">
      <div class="companyAddrMapBox" v-if="companyAddr">
        <BMapComponent :addr="companyAddr"></BMapComponent>
      </div>
    </el-dialog>
  </el-main>
    <el-footer style="padding:0;" height="162px">
    <bsFooter></bsFooter>
  </el-footer>
  </el-container>
</template>
<script>
import bsTop from '@/components/BsTop.vue'
import bsFooter from '@/components/Footer'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import Recorder from 'recorder-core/recorder.mp3.min'
import BMapComponent from '@/components/map.vue'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    bsTop, BMapComponent, bsFooter
  },
  data () {
    return {
      isCheckCube: true,
      myProductSearchValue: null,
      companyLoadDisabled: true,
      companyListPageSize: 20,
      companyListCurrentPage: 1,
      isEditRemark: false,
      companyAddr: '',
      companyAddrMapDialog: false,
      orderItemOptions: null,
      orderDetailTotalCount: null,
      orderDetailCurrentPage: 1,
      orderDetailPageSize: 10,
      drawer: false,
      copyText: null,
      isChehui: null,
      isPaste: null,
      orderSampleFrom: null,
      orderWsMsg: null,
      orderWs: null,
      isGroupNumber: false,
      MessageUnreadCount: null,
      orgListCurrentPage: 1,
      orgListPageSize: 10,
      orgListCount: null,
      customerVisitCurrentPage: 1,
      customerVisitPageSize: 10,
      showSearchCompanyCount: false,
      searchCompanyName: '',
      isNoCustomerVisit: false,
      isNoCurrentNumber: false,
      currentNumberPageSize: 10,
      currentNumberCurrentPage: 0,
      orderCurrentPage: 1,
      orderPageSize: 10,
      orderLoadText: '加载中...',
      sendRec: null,
      Loop: null, // 长按事件
      isShowRec: false,
      rec: null,
      showAddSampleTXT: null,
      activeAddSample: false,
      sampleSelectionCurrentPage: 0,
      mySampleSelectionCurrentPage: 1,
      sampleSelectionPageSize: 20,
      sampleSelectionList: [],
      sampleSelectionTotalCount: 0,
      currentCodeList: [],
      customerVisitList: [],
      personalNumber: {
        arr_nu: 1024,
        historyNumbers: []
      },
      showPersonalNumber: false,
      showSampleSelection: false,
      timeID: null,
      loadText: null,
      activeName: '',
      loginState: null,
      showOrderCompanyItem: null,
      fileType: null,
      TXTUrl: '',
      visibleTXT: false,
      chatHistoryCurrentPage: 1,
      chatHistoryPageSize: 15,
      chatHistoryTotal: 0,
      noScrollTop: false,
      audioItem: null,
      radio: '',
      checkUserList: [],
      orgList: [],
      selectPushPersonList: [],
      selectPush: false,
      imgAndVideoNum: null,
      Json: {}, // 规则
      orderOptions: null,
      queRenDialogActive: 0,
      queRenDialog: false,
      orderDetailList: [],
      orderDetailTotal: 0,
      isOrderShow: false,
      signalROptions: {
        // 深网配置
        value: null,
        attachment: null,
        addId: '5de91f02f12c41c2b276c9accb4679c7',
        userName:
          this.$store.state.userInfo.userInfo &&
          this.$store.state.userInfo.userInfo.linkman,
        token: '',
        showmsg: [],
        orderNumber: null,
        creatChannel: null,
        groupNumber: '',
        toCompanyID: null,
        toUserID: null,
        name: '',
        uid: '',
        client: '',
        channelMember: []
      },
      ERPOrderOptions: {
        ERPOrderList: null,
        total: 0
      },
      messageList: [],
      sendValue: '',
      showTypeOptions: {
        showType: null,
        sampleFrom: null,
        showLiaotianType: null,
        showOrderDetail: false,
        isShowOrderDetail: true
      },
      dialogPinglun: false,
      pinglunTitle: '',
      pinglunValue: '',
      gonggaoType: '',
      ruleForm: { GonggaoText: '' },
      fileList: [],
      dialogImageUrl: '',
      dialogVideoUrl: '',
      dialogVisibleImg: false,
      disabledImg: false,
      datas: {},
      dialogAddTag: false,
      tagValue: '',
      tagsType: [
        '',
        'success',
        'warning',
        'danger',
        'info',
        '',
        'success',
        'warning',
        'danger',
        'info'
      ],
      file: null,
      search: '',
      infoItem2: null,
      active2: null,
      activeFind: null,
      personalDetail: undefined,
      CompanyDetail: undefined,
      CompanyList: [],
      companyListTotalCount: 0,
      showCollection: {
        type: null,
        active1: null,
        infoItem: null,
        active: null
      },
      skipCount: 1,
      dialogVisible: false,
      maxResultCount: 10,
      total: null,
      loading: false,
      dataList: []
    }
  },
  methods: {
    // 深网登录
    login () {
      // 登入 RTM 之前，调用 AgoraRTM.createInstance 方法创建一个 RtmClient 实例。
      this.signalROptions.client = this.$AgoraRTM.createInstance(
        this.signalROptions.addId
      )
      // 通过监听 RtmClient 上的 ConnectionStateChanged 事件可以获得 SDK 连接状态改变的通知
      this.signalROptions.client.on(
        'ConnectionStateChanged',
        (newState, reason) => {
          this.loginState = newState
        }
      )
      // 登录
      this.signalROptions.client
        .login({
          token: this.signalROptions.token,
          uid: this.$store.state.userInfo.uid
        })
        .then(() => {
          console.log('AgoraRTM客户端登录成功')
        })
        .catch(err => {
          console.log('AgoraRTM客户端登录失败', err)
        })
      // 监听 client 上的事件 MessageFromPeer 接收点对点消息
      this.signalROptions.client.on(
        'MessageFromPeer',
        ({ text }, peerId, messageProps) => {
          // text 为消息文本，peerId 是消息发送方 User ID
          // this.$message.success("我收到了点对点");
          console.log('我收到了点对点')
          this.$root.eventHub.$emit('resetData')
          /* 收到点对点消息的处理逻辑 */
        }
      )
      // 监听收到来自主叫的呼叫邀请
      this.signalROptions.client.on(
        'RemoteInvitationReceived',
        remoteInvitation => {
          console.log(remoteInvitation)
        }
      )
      // 监听对方是否在线
      this.signalROptions.client.on('PeersOnlineStatusChanged', status => {
        this.$message.error(status)
      })
    },
    // 深网登出
    signOut () {
      if (this.signalROptions.client && this.signalROptions.client.logout) {
        this.signalROptions.client.logout()
        console.log('退出頻道成功')
      }
    },
    // 深网加入频道
    async addChannel () {
      if (!this.signalROptions.groupNumber) {
        return false
      }
      if (this.signalROptions.creatChannel) {
        this.signalROptions.creatChannel.leave()
      }
      try {
        // 创建频道
        this.signalROptions.creatChannel = this.signalROptions.client.createChannel(
          this.signalROptions.groupNumber // 此处传入频道 ID// 加入频道
        )
        const error = await this.signalROptions.creatChannel.join()
        if (error) {
          /* 加入频道失败的处理逻辑 */
          console.log('加入频道失败', error)
          // this.login();
          this.$nextTick(() => this.addChannel())
        } else {
          /* 加入频道成功的处理逻辑 */
          console.log('加入频道成功')
          await this.getMembers()
        }
        // 接收频道消息
        this.signalROptions.creatChannel.on(
          'ChannelMessage',
          async ({ text }, senderId) => {
            // text 为收到的频道消息文本，senderId 为发送方的 User ID
            /* 远端用户收到消息的处理逻辑 */
            // this.$message.success("我收到了频道消息");
            console.log('我收到了频道消息')
            this.chatHistoryCurrentPage = 1
            const res = await this.getInstantMessageByNumber(
              this.signalROptions.groupNumber
            )
            if (res.data.result.code === 200) {
              this.signalROptions.showmsg = res.data.result.item.items
              this.chatHistoryTotal = res.data.result.item.totalCount
            } else {
              // 订单点击立即沟通拿不到groupNumber，所以没有聊天记录
              this.CompanyDetail = []
            }
            this.$root.eventHub.$emit('resetData')
          }
        )
      } catch (err) {
        this.login()
        this.$message.closeAll()
        this.$message.error('断线重连成功')
      }
    },
    // 深网获取群成员
    async getMembers () {
      this.signalROptions.channelMember = await this.signalROptions.creatChannel.getMembers()
    },
    // 深网退出频道
    signChannel () {
      this.signalROptions.creatChannel.leave()
    },
    async sendMessages () {
      this.noScrollTop = false
      if (this.signalROptions.msgType === 'Text' && !this.signalROptions.value) {
        this.signalROptions.value = null
        this.$message.error('发送内容不能为空')
        return
      }
      try {
        const res = await this.createMessageAccept()
        this.signalROptions.showmsg.push(res.data.result.item)
        this.signalROptions.value = ''
        if (res.data.result.code === 200) {
          this.signalROptions.groupNumber = res.data.result.item.groupNumber
          // 连接ws
          if (this.isGroupNumber) {
            this.$setWs.$ws && this.$setWs.$ws.close()
            this.$store.commit('setWsId', this.signalROptions.groupNumber)
            this.$setWs.initWebSocket()
            this.isGroupNumber = false
          }
          // 加入深网频道
          try {
            await this.getMembers()
          } catch (error) {
            await this.addChannel()
          }
          const re = await this.$http.post('/api/UpdateMessageMemberActivate', {
            GroupNumber: this.signalROptions.groupNumber,
            UIDList: this.signalROptions.channelMember
          })
          this.sendMsg(res.data.result.item) // 深网发消息
        }
        this.$root.eventHub.$emit('resetData')
      } catch (error) {
        this.login()
        this.$message.warning('断线重连成功')
      }

      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.msgType = 'Text'
      this.$refs.refFileInput.value = ''
    },
    // 即时通讯发消息
    async sendMessage (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.signalROptions.value += '\n' // 换行
      } else if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
        e.preventDefault() // 禁止回车的默认换行
        this.noScrollTop = false
        if (
          this.signalROptions.msgType === 'Text' &&
          !this.signalROptions.value
        ) {
          this.signalROptions.value = null
          this.$message.error('发送内容不能为空')
          return
        }
        try {
          const res = await this.createMessageAccept()
          this.signalROptions.showmsg.push(res.data.result.item)
          this.signalROptions.value = ''

          if (res.data.result.code === 200) {
            this.signalROptions.groupNumber = res.data.result.item.groupNumber
            // 连接ws
            if (this.isGroupNumber) {
              this.$setWs.$ws && this.$setWs.$ws.close()
              this.$store.commit('setWsId', this.signalROptions.groupNumber)
              this.$setWs.initWebSocket()
              this.isGroupNumber = false
            }
            // 加入深网频道
            try {
              await this.getMembers()
            } catch (error) {
              await this.addChannel()
            }
            const re = await this.$http.post('/api/UpdateMessageMemberActivate', {
              GroupNumber: this.signalROptions.groupNumber,
              UIDList: this.signalROptions.channelMember
            })
            this.sendMsg(res.data.result.item) // 深网发消息
          }
          this.$root.eventHub.$emit('resetData')
        } catch (error) {
          this.login()
          this.$message.warning('断线重连成功')
        }

        this.signalROptions.value = null
        this.signalROptions.attachment = null
        this.signalROptions.msgType = 'Text'
        this.$refs.refFileInput.value = ''
        e.preventDefault() // 阻止浏览器默认换行操作
      }
    },
    // 发送点对点消息
    sendPeerToPeer (content, toUserID) {
      this.signalROptions.client
        .sendMessageToPeer(
          { text: content }, // 符合 RtmMessage 接口的参数对象
          toUserID // 远端用户 ID
        )
        .then(sendResult => {
          if (sendResult.hasPeerReceived) {
            /* 远端用户收到消息的处理逻辑 */
            this.$message.closeAll()
            console.log('远端用户收到我发送的消息')
          } else {
            /* 服务器已接收、但远端用户不可达的处理逻辑 */
            console.log('服务器已接收点对点消息、但远端用户不可达的处理')
          }
        })
        .catch(error => {
          console.log(error)
          /* 发送失败的处理逻辑 */
          this.$message.error('发送失败')
        })
    },
    // 个推送
    async GeSendPush (item, toUserID, number) {
      const obj = {
        callType: number,
        channelId: item.groupNumber,
        userAvatar: item.userImage,
        userId: toUserID,
        userName: item.linkName
      }
      try {
        const res = await this.$http.post('/api/GeSendPush', {
          UserId: toUserID,
          Title: '您有一条新的消息',
          Description: item.content || item.attachment,
          ExtraBody: item.content || item.attachment,
          ActionData: JSON.stringify(obj)
        })
        if (res.data.result.code === 200) {
          console.log('推送成功')
        } else {
          this.$message.error(res.data.result.message)
        }
      } catch (error) {
        console.log('推送失败')
      }
    },
    // 发送点对点或频道消息
    sendMsg (item) {
      // 加入频道成功后可发送频道消息
      if (item) {
        item.linkName = this.$store.state.userInfo.userInfo.linkman
        item.userImage = this.$store.state.userInfo.userInfo.userImage
        let toUserIDList = []
        for (let i = 0; i < item.toUserList.length; i++) {
          // 判断如果不在频道内
          if (
            !this.signalROptions.channelMember.includes(item.toUserList[i].uid)
          ) {
            // 如果不在频道内并且有uid
            if (item.toUserList[i].uid) {
              // 发送点对点消息
              this.sendPeerToPeer(JSON.stringify(item), item.toUserList[i].uid)
            }
          } else {
            // 在频道内的
            toUserIDList.push(item.toUserList[i].toUserID)
          }
        }
        // 先去重 后去掉在频道内的
        const newobj = {}
        const arr = item.toUserList.reduce((preVal, curVal) => {
        /* eslint-disable */
          newobj[curVal.toUserID]
            ? ''
            : (newobj[curVal.toUserID] = preVal.push(curVal))
          return preVal
        }, [])
        // 发推送
        toUserIDList = JSON.stringify(toUserIDList)
        for (let i = 0; i < arr.length; i++) {
          if (!toUserIDList.includes(arr[i].toUserID)) {
            this.GeSendPush(item, arr[i].toUserID, 3)
          }
        }

        this.$root.eventHub.$emit('UpdateOrgPersonnel')
        // 在不在频道内都发频道消息
        this.signalROptions.creatChannel
          .sendMessage({ text: JSON.stringify(item) })
          .then(() => {
            /* 频道消息发送成功的处理逻辑 */
            console.log('频道消息发送成功')
          })
          .catch(error => {
            /* 频道消息发送失败的处理逻辑 */
            this.$message.error('频道消息发送失败')
          })
      }
    },
    // 单选事件
    changeRadios (val) {
      if (val) {
        this.checkUserList = []
      }
    },
    // 多选事件
    handleCheckAllChange (val) {
      val && (this.radio = '')
    },
    // 点击公告立即沟通
    async showFindLiaotian ({ item }) {
      this.offDetail()
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.orderOptions = null
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.showmsg = []
      this.signalROptions.orderNumber = null
      this.signalROptions.name = ''
      this.signalROptions.uid = ''
      this.signalROptions.name = item.niceName
      this.signalROptions.toUserID = item.userId
      this.signalROptions.toCompanyID = item.companyId
      this.signalROptions.isGroup = false
      this.signalROptions.groupNumber = null
      this.signalROptions.msgType = 'Text'
      try {
        this.addChannel() // 加入深网频道
      } catch (error) {
        this.login()
        this.$message.warning('断线重连成功')
      }
      // 获取聊天记录
      // let res = await this.getInstantMessageByNumber();
      // if (res.data.result.code === 200) {
      //   console.log(res.data.result.item.items);
      //   this.signalROptions.showmsg = res.data.result.item.items;
      //   this.chatHistoryTotal = res.data.result.item.totalCount;
      // } else {
      //   this.CompanyDetail = [];
      // }
      this.CompanyDetail = []
      this.showTypeOptions.showLiaotianType = 'showLiaotianList'
    },
    // 点击消息立即沟通
    async showLiaotianr (item) {
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.offDetail()
      this.isOrderShow = null
      this.chatHistoryCurrentPage = 1
      this.chatHistoryPageSize = 15
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.showmsg = []
      this.signalROptions.orderNumber = null
      this.signalROptions.name = ''
      this.signalROptions.uid = ''
      this.showTypeOptions.showType = null
      this.showTypeOptions.showOrderDetail = false
      this.signalROptions.isGroup = item.isGroup
      this.signalROptions.name = item.linkName
      this.signalROptions.toCompanyID = item.toCompanyID
      this.signalROptions.groupNumber = item.groupNumber
      this.signalROptions.msgType = 'Text'
      this.signalROptions.toUserID = item.toUserID
      this.showTypeOptions.showLiaotianType = 'showLiaotianList'
      try {
        this.addChannel() // 加入深网频道
      } catch (error) {
        this.login()
        this.$message.warning('断线重连成功')
      }
      // 获取聊天记录
      const res = await this.getInstantMessageByNumber()
      if (res.data.result.code === 200) {
        this.signalROptions.showmsg = res.data.result.item.items
        this.chatHistoryTotal = res.data.result.item.totalCount
      } else {
        this.CompanyDetail = []
      }
      this.$root.eventHub.$emit('resetData')

      console.log(this.showTypeOptions)
    },
    // 点击公司的立即沟通
    async companySend () {
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.active2 = null
      this.isGroupNumber = false
      this.chatHistoryCurrentPage = 1
      this.chatHistoryPageSize = 15
      this.orderOptions = null
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.showmsg = []
      this.signalROptions.orderNumber = null
      this.signalROptions.name = ''
      this.signalROptions.uid = ''
      this.signalROptions.name = this.CompanyDetail.companyName
      this.signalROptions.toCompanyID = this.CompanyDetail.id
      this.signalROptions.isGroup = true
      this.signalROptions.groupNumber = this.CompanyDetail.groupNumber
      this.signalROptions.msgType = 'Text'
      try {
        this.addChannel() // 加入深网频道
      } catch (error) {
        this.login()
        this.$message.warning('断线重连成功')
      }
      const res = await this.getInstantMessageByNumber() // 获取聊天记录
      if (res.data.result.code === 200) {
        this.signalROptions.showmsg = res.data.result.item.items
        this.chatHistoryTotal = res.data.result.item.totalCount
      } else {
        this.CompanyDetail = []
      }
      this.showTypeOptions.showLiaotianType = 'showLiaotianList'
    },
    // 点击个人的立即沟通
    async personalSend () {
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.chatHistoryCurrentPage = 1
      this.chatHistoryPageSize = 15
      this.orderOptions = null
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.showmsg = []
      this.signalROptions.orderNumber = null
      this.isGroupNumber = false
      this.signalROptions.name = ''
      this.signalROptions.uid = ''
      this.signalROptions.name = this.personalDetail.linkman
      this.signalROptions.toUserID = this.personalDetail.id
      this.signalROptions.isGroup = false
      this.signalROptions.groupNumber = this.personalDetail.groupNumber
      this.signalROptions.toCompanyID = this.personalDetail.companyId
      this.signalROptions.msgType = 'Text'
      try {
        this.addChannel() // 加入深网频道
      } catch (error) {
        this.login()
        this.$message.warning('断线重连成功')
      }
      const res = await this.getInstantMessageByNumber(
        this.personalDetail.groupNumber
      )
      if (res.data.result.code === 200) {
        this.signalROptions.showmsg = res.data.result.item.items
        this.chatHistoryTotal = res.data.result.item.totalCount
      } else {
        this.personalDetail = []
      }
      this.showTypeOptions.showLiaotianType = 'showLiaotianList'
      this.active2 = null
    },
    // 公司下拉加载更多
    async companyListLoad(val) {
      this.companyListCurrentPage++
       const res = await this.$http.post('/api/ContactsCompanyListByID', {
        companyID: this.showCollection.id,
        OppositeRole: this.showCollection.listType,
        companyName: this.searchCompanyName,
        maxResultCount: this.companyListPageSize,
        skipCount: this.companyListCurrentPage
      })
      if (res.data.result.code === 200) {
        this.CompanyList = this.CompanyList.concat(res.data.result.item.items)
        this.companyListTotalCount = res.data.result.item.totalCount
        if (this.CompanyList.length >= this.companyListTotalCount) this.companyLoadDisabled = true
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击订单|订单详情立即沟通
    async orderSend (item, value) {
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.orderItemsOptions = item
      this.orderItemOptions = value
      const res = await this.$http.post('/api/GetPersonnelListByERPOrderNumber', {
        orderNumber: item ? item.orderNumber : this.orderOptions.orderNumber
      })
      if (res.data.result.code === 200) {
        if (res.data.result.item.length < 1) {
          this.$message.error('该用户未注册')
          return false
        } else {
          this.showPersonalNumber = false
          this.isGroupNumber = false
          this.signalROptions.value = null
          this.signalROptions.attachment = null
          this.signalROptions.showmsg = []
          this.signalROptions.uid = ''
          this.signalROptions.name = item
            ? res.data.result.item[0].companyName
            : this.$store.state.userInfo.commparnyList[0].companyType ===
              'Exhibition'
              ? value.supplierPersonnelName
              : value.exhibitionPersonnelName
          this.signalROptions.isGroup = !!item
          this.signalROptions.msgType = 'Text'
          this.signalROptions.orderNumber = item
            ? item.orderNumber
            : this.orderOptions.orderNumber
          this.signalROptions.groupNumber = null
          this.signalROptions.toUserID = item
            ? res.data.result.item[0].companyName
            : this.$store.state.userInfo.commparnyList[0].companyType ===
              'Exhibition'
              ? value.supplierPersonnelID
              : value.exhibitionPersonnelID
          this.signalROptions.toCompanyID = item
            ? res.data.result.item[0].companyName
            : this.$store.state.userInfo.commparnyList[0].companyType ===
              'Exhibition'
              ? value.supplierId
              : value.exhibitionId

          this.showTypeOptions.isShowOrderDetail = false
          this.CompanyDetail = []
          console.log(this.signalROptions.groupNumber)
          try {
            this.addChannel() // 加入深网频道
          } catch (error) {
            this.login()
            this.$message.warning('断线重连成功')
          }
          const re = await this.getInstantMessageByNumber()
          if (re.data.result.code === 200) {
            this.signalROptions.showmsg = re.data.result.item.items
            this.chatHistoryTotal = re.data.result.item.totalCount
          } else {
            this.personalDetail = []
          }
          this.isOrderShow = true
          // item ? (this.isOrderShow = false) : (this.isOrderShow = true);
          this.showTypeOptions.showLiaotianType = 'showLiaotianList'
        }
      }
    },
    // 创建 发送聊天
    async createMessageAccept () {
      const fd = {
        MessageType: this.signalROptions.msgType,
        Attachment: this.signalROptions.attachment,
        IsGroup: this.signalROptions.isGroup,
        ToUserId: this.signalROptions.toUserID,
        ToCompanyId: this.signalROptions.toCompanyID,
        OrderNumber: this.signalROptions.orderNumber,
        Content: this.signalROptions.value,
        GroupNumber: this.signalROptions.groupNumber,
        Platform: 'PC'
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      console.log('发送聊天配置=', fd)
      return await this.$http.post('/api/CreateMessageAccept', fd)
    },
    // 根据GroupNumber 查询所有的聊天记录
    async getInstantMessageByNumber () {
      // 连接ws
      if (this.signalROptions.groupNumber && !this.isGroupNumber) {
        this.$setWs.$ws && this.$setWs.$ws.close()
        this.$store.commit('setWsId', this.signalROptions.groupNumber)
        this.$setWs.initWebSocket()
      } else {
        this.isGroupNumber = true
      }
      const fd = {
        skipCount: this.chatHistoryCurrentPage,
        maxResultCount: this.chatHistoryPageSize,
        groupNumber: this.signalROptions.groupNumber,
        ToCompanyId: this.signalROptions.toCompanyID,
        ToUserId: this.signalROptions.toUserID,
        isGroup: this.signalROptions.isGroup,
        orderNumber: this.signalROptions.orderNumber
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      console.log(fd)
      return await this.$http.post('/api/GetInstantMessageByNumber', fd)
    },
    // 转发消息
    forwardInfo (item) {
      switch (item.messageType) {
        case 'Text':
          this.signalROptions.msgType = item.messageType
          this.signalROptions.value = item.content
          this.sendMessages()
          break
        case 'Voice':
          this.signalROptions.value = null
          this.signalROptions.msgType = item.messageType
          this.signalROptions.attachment = item.attachment
            .replace(/Message\/Voice/gi, '|Message/Voice')
            .split(/|/gi)[1]
          this.sendMessages()
          break
        case 'Video':
          this.signalROptions.value = null
          this.signalROptions.msgType = item.messageType
          this.signalROptions.attachment = item.attachment
            .replace(/Message\/Video/gi, '|Message/Video')
            .split(/|/gi)[1]
          this.sendMessages()
          break
        case 'Picture':
          this.signalROptions.value = null
          this.signalROptions.msgType = item.messageType
          this.signalROptions.attachment = item.attachment
            .replace(/Message\/Picture/gi, '|Message/Picture')
            .split(/|/gi)[1]
          this.sendMessages()
          break
        case 'file':
          this.signalROptions.value = null
          this.signalROptions.msgType = item.messageType
          this.signalROptions.attachment = item.attachment
            .replace(/Message\/File/gi, '|Message/File')
            .split(/|/gi)[1]
          this.sendMessages()
          break
      }
      this.signalROptions.value = null
      this.signalROptions.msgType = null
      this.signalROptions.attachment = null
    },
    // 打开编辑聊天消息
    openEditInfo (e, id) {
      this.noScrollTop = true
      this.isPaste = null
      this.isChehui = id
      const x = e.layerX // 鼠标left位置
      const y = e.layerY // 鼠标top位置
      this.copyDOM = $(e.target).offsetParent()
      this.copyDOM
        .offsetParent()
        .children('.myChehui')
        .css({ left: x, top: y })
    },
    // 复制消息
    copyInfo (item) {
      switch (item.messageType) {
        case 'Text':
          this.copyContact()
          break
      }
    },
    // 撤回消息
    async withdrawInfo (item) {
      try {
        const res = await this.$http.post('/api/UpdateWithdrawMessage', {
          id: item.id,
          isDelete: true,
          groupNumber: item.groupNumber,
          isWithdraw: true,
          companyID: item.companyId,
          fromUserID: item.fromUserId
        })
      } catch (error) {
        console.log(error.response)
      }
    },
    // 删除消息
    deleteInfo (item) {
      console.log(item)
    },
    // 打开粘贴
    OpenPaste (e) {
      this.isChehui = null
      this.isPaste = true
      const x = e.layerX // 鼠标left位置
      const y = e.layerY // 鼠标top位置
      $(e.target)
        .offsetParent()
        .children('.pasteIten')
        .css({ left: x, top: y })
    },
    // 粘贴
    pasteInfo () {
      if (window.clipboardData) {
        this.signalROptions.value = window.clipboardData.getData('Text')
      } else {
        this.signalROptions.value = this.copyText
        // clipboardData.setData("Text", range.text);
        // document.all.pp.value = clipboardData.getData("Text");
      }
    },
    // 复制文字方法
    copyContact (contat) {
      window.getSelection().removeAllRanges()
      const range = document.createRange()
      range.selectNode(this.copyDOM[0])
      this.copyText = this.copyDOM[0].innerText
      window.getSelection().addRange(range)
      try {
        const successful = document.execCommand('copy')
        if (successful) this.$message.success('复制成功')
        else this.$message.error('复制失败')
      } catch (error) {
        this.$message.error('复制失败')
      }
    },
    // 查询订单业务通知
    async getERPOrderListByPage () {
      const fd = {
        skipCount: this.orderCurrentPage,
        maxResultCount: this.orderPageSize
      }
      if (this.showTypeOptions.sampleFrom !== null) { fd.sampleFrom = this.showTypeOptions.sampleFrom }
      if (this.showTypeOptions.CompanyNumber !== null) { fd.CompanyNumber = this.showTypeOptions.CompanyNumber }
      if (this.showTypeOptions.ReadStatus !== null) { fd.ReadStatus = this.showTypeOptions.ReadStatus }
      if (this.showTypeOptions.isToCompany !== null) { fd.isToCompany = this.showTypeOptions.isToCompany }
      return await this.$http.post('/api/GetERPOrderListByPage', fd)
    },
    // 获取订单详情合计
    async getOrderDetailTotal ({
      orderType,
      erpOrderID,
      orderNumber,
      sampleNumber
    }) {
      let res
      if (orderType === 'Sample') {
        res = await this.$http.post('/api/SampleOrderTotal', {
          SampleNumber: orderNumber
        })
      } else {
        res = await this.$http.post('/api/OrderOfferTotal', {
          offerNumber: orderNumber
        })
      }
      if (res.data.result.code === 200) {
        this.orderDetailTotalCount = res.data.result.item
        console.log(this.orderDetailTotalCount)
      }
    },
    // 滚动显示总数
    orderDetailListShowTotal (e) {
      e.target.scrollTop ? (this.drawer = true) : (this.drawer = false)
    },
    // 订单详情滚动事件
    async orderDetailListScroll () {
      if (this.orderDetailTotal <= this.orderDetailPageSize) return false
      else {
        this.orderDetailCurrentPage++
        const res = await this.getOrderDetail(this.orderOptions) // 获取订单详情
        if (res.data.result.code === 200) {
          this.orderDetailList = this.orderDetailList.concat(
            res.data.result.item.items
          )
          this.orderDetailTotal = res.data.result.item.totalCount
        }
      }
    },
    // 获取订单详情
    async getOrderDetail ({ orderType, erpOrderID, orderNumber, sampleNumber }) {
      if (orderType === 'Sample') {
        return await this.$http.post('/api/SampleOrderDetailPage', {
          SampleNumber: orderNumber,
          Id: erpOrderID,
          skipCount: this.orderDetailCurrentPage,
          maxResultCount: this.orderDetailPageSize
        })
      } else {
        return await this.$http.post('/api/OrderOfferDetailPage', {
          offerNumber: orderNumber,
          Id: erpOrderID,
          skipCount: this.orderDetailCurrentPage,
          maxResultCount: this.orderDetailPageSize
        })
      }
    },
    // 打开订单详情-----------------------------------------------------------------------------------------------------------------
    async openOrderDetail (item) {
      this.orderOptions = item
      this.activeName = item.messageExt === '0' ? 'first' : 'last'
      const res = await this.getOrderDetail(item) // 获取订单详情
      this.getOrderDetailTotal(item) // 获取订单详情合计
      if (res.data.result.code === 200) {
        this.orderDetailList = res.data.result.item.items
        this.orderDetailTotal = res.data.result.item.totalCount
      }
      // 重新获取列表刷新状态
      this.orderCurrentPage = 1
      const re = await this.getERPOrderListByPage()
      if (re.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = re.data.result.item.items
        this.ERPOrderOptions.total = re.data.result.item.totalCount
        for (let i = 0; i < this.ERPOrderOptions.ERPOrderList.length; i++) {
          if (
            this.ERPOrderOptions.ERPOrderList[i].erpOrderID ===
            this.orderOptions.erpOrderID
          ) {
            this.orderOptions = this.ERPOrderOptions.ERPOrderList[i]
          }
        }
      }
      this.$root.eventHub.$emit('resetCompany')
      console.log(this.orderOptions)
      this.showTypeOptions.isShowOrderDetail = true
      this.showTypeOptions.showOrderDetail = true
      this.showTypeOptions.showLiaotianType = null
      this.isGroupNumber = false
      this.showPersonalNumber = false
      this.showSampleSelection = false
    },
    // 聊天窗口列表事件
    isOrderShowEvent () {
      this.showTypeOptions.showLiaotianType = null
      this.isGroupNumber = false
      this.showTypeOptions.isShowOrderDetail = true
      this.isOrderShow = false
    },
    // 上传文件
    async upLoadFiles (file) {
      const fd = new FormData()
      fd.append('fileType', this.signalROptions.msgType)
      fd.append('fileName', file.name)
      fd.append('file', file)
      return await this.$http.post('/api/File/MessageUploadFile', fd)
    },
    // 选择发送文件
    async changeFiless (e) {
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      const file = e.target.files && e.target.files[0]
      const type = this.$_.first(file.type.split('/'))
      switch (type) {
        case 'application':
          this.signalROptions.msgType = 'file'
          break
        case 'text':
          this.signalROptions.msgType = 'file'
          break
        case 'video':
          this.signalROptions.msgType = 'Video'
          break
        case 'image':
          this.signalROptions.msgType = 'Picture'
          break
      }
      const res = await this.upLoadFiles(file)
      if (res.data.result.code === 200) {
        this.signalROptions.attachment = res.data.result.object[0].filePath
        this.sendMessages()
      } else {
        this.$message.error('上传失败，请检查网络')
      }
    },
    // 开始录音|录制完成发送语音
    showDeleteButton () {
      try {
        if (this.sendRec === '点击录制语音') {
          this.rec.start()
        } else {
          this.recEnd()
        }
      } catch (error) {
        this.$message.error('需要https才能实现这个功能')
      }

      this.sendRec = this.sendRec === '点击录制语音' ? null : '点击录制语音'
    },
    // 初始化录音功能
    initRec () {
      // 一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
      this.rec = Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16 // mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
      })
      this.rec.open()
    },
    // 选择录音
    recOpen (flag) {
      console.log(flag)
      this.isShowRec = flag
      this.sendRec = '点击录制语音'
      if (flag) {
        this.initRec()
        console.log(this.rec)
      } else this.rec.close()
    },
    // 结束录音
    recEnd () {
      const TestApi = '/api/File/MessageUploadFile' // 用来在控制台network中能看到请求数据，测试的请求结果无关紧要
      const _that = this
      this.rec.stop(
        function (blob, duration) {
          console.log('blob', blob)
          // 录音结束时拿到了blob文件对象，可以用FileReader读取出内容，或者用FormData上传
          const api = TestApi
          /** *方式二：使用FormData用multipart/form-data表单上传文件***/
          const form = new FormData()
          form.append('upfile', blob, 'recorder.mp3') // 和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3
          _that.$http.post(api, form).then(result => {
            if (result.data.result.code === 200) {
              _that.signalROptions.value = null
              _that.signalROptions.msgType = 'Voice'
              _that.signalROptions.attachment =
                result.data.result.object[0].filePath
              _that.sendMessages()
            } else {
              _that.$message.error('发送失败，请检查网络')
            }
          })
        },
        function (msg) {
          this.$message.error('录音失败:' + msg)
        }
      )
    },
    // 语音播放完事件
    ended () {
      this.audioItem.isOpen = false
      this.audioItem = null
      this.$nextTick(() => {
        this.noScrollTop = false
      })
    },
    // 点击听语音
    checkMsgTypeAudio (val) {
      this.noScrollTop = true
      if (!val.isOpen) {
        console.log(this.$refs['myAudio' + val.attachment][0])
        this.$refs['myAudio' + val.attachment][0].play()
        this.$set(val, 'isOpen', true)
        if (this.audioItem) {
          this.$refs['myAudio' + this.audioItem.attachment][0].pause()
          this.$refs['myAudio' + this.audioItem.attachment][0].load()
          this.audioItem.isOpen = false
          this.audioItem = null
        }
        this.audioItem = val
      } else {
        console.log(this.$refs['myAudio' + val.attachment][0])
        this.$refs['myAudio' + val.attachment][0].pause()
        this.$refs['myAudio' + val.attachment][0].load()
        this.$set(val, 'isOpen', false)
        this.audioItem = null
        this.$nextTick(() => {
          this.noScrollTop = false
        })
      }
    },
    // 通讯录下拉加载更多
    tongxunluLoad () {
      if (this.orgListCount < 10 || this.orgList.length >= this.orgListCount) {
        return
      }
      this.orgListCurrentPage++
      this.getOrgList(true)
    },
    // 获取通讯录列表
    async getOrgList (flag) {
      const res = await this.$http.post('/api/OrgPersonnelPage', {
        skipCount: this.orgListCurrentPage,
        maxResultCount: this.orgListPageSize,
        id: this.$store.state.userInfo.userInfo.id
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.orgList = flag
          ? this.orgList.concat(res.data.result.item.items)
          : res.data.result.item.items
        this.orgListCount = res.data.result.item.totalCount
      }
    },
    // 确定推送公告
    async sendSelectPush () {
      this.sendGonggao()
      const fd = {
        PushType: 3,
        UserList: this.checkUserList,
        CompanyType: this.radio
      }
      try {
        const res = await this.$http.post('/api/GeSendPush', fd)
        if (res.data.result.code === 200) {
          console.log('推送成功')
        } else {
          this.$message.error(res.data.result.message)
        }
      } catch (error) {
        console.log(error)
      }
      this.selectPush = false
    },
    // 打开发布公告
    openSendFind (type) {
      this.isGroupNumber = false
      this.active2 = 5
      this.gonggaoType = type
      this.showTypeOptions.showLiaotianType = null
    },
    // 发布公告
    async sendGonggao () {
      this.$refs.refGonggao.validate(async valid => {
        if (valid) {
          let urls = ''
          let fileType = ''
          let res = ''
          if (this.$_.size(this.fileList)) {
            const fd = new FormData()
            for (const val of this.fileList) {
              fd.append('file', val.raw)
            }
            fd.append('BusinessType', 'Notice')
            res = await this.$http.post('/api/File/InsertPic', fd, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res.data.result.code === 200) {
              urls = res.data.result.object.map(re => re.filePath)
            }
          }
          if (this.fileList.length > 0) {
            fileType = this.fileList[0].raw.type.split('/')[0]
          }
          const result = await this.$http.post('/api/CreateBearNotice', {
            NoticeTitle: '',
            NoticeType: this.gonggaoType,
            Acceptor: this.userInfo.commparnyList[0].companyType,
            Notice: this.ruleForm.GonggaoText,
            Publisher: this.userInfo.userInfo.id,
            IssuedCompanyID: this.userInfo.commparnyList[0].commparnyId,
            FileAddress: urls && urls.join(','),
            FileType:
              fileType === 'image' ? 'img' : fileType === 'video' ? 'video' : '' // 文件类型 img video
          })
          if (result.data.result.code === 200) {
            this.$message.success('发布公告成功')
            // 重新调用查看公告
            this.$root.eventHub.$emit('UpdateFind')
            this.skipCount = 1
            this.maxResultCount = 10
            this.getDataList()
          } else {
            this.$message.error(result.data.result.msg)
          }
          this.fileList = []
          this.ruleForm.GonggaoText = ''
          this.gonggaoType = ''
          this.active2 = null
        }
      })
    },
    // 关闭订单聊天
    guanbiOrder () {
      this.isOrderShow = false
    },
    // 选择图片
    changeFile (file, fileList) {
      if (fileList[0].raw.type.split(/\//)[0] === 'video') {
        this.imgAndVideoNum = 1
        if (file.size > this.Json.NoticeRestrictions[2].itemCode) {
          this.$message.error(
            '上传视频大小不能超过 ' +
              this.Json.NoticeRestrictions[2].itemCode / 1024 / 1024 +
              'MB'
          )
          fileList.pop()
          return false
        }
      } else {
        this.imgAndVideoNum = Number(this.Json.NoticeRestrictions[4].itemCode)
        if (file.raw.type.split(/\//)[0] === 'video') {
          fileList.pop()
          this.$message.error('只能上传图片或视频的其中一种文件格式')
          return false
        }
        if (file.size > this.Json.NoticeRestrictions[5].itemCode) {
          this.$message.error(
            '上传图片大小不能超过 ' +
              this.Json.NoticeRestrictions[5].itemCode / 1024 / 1024 +
              'MB'
          )
          fileList.pop()
          return false
        }
      }
      this.fileList = fileList
    },
    // 删除图片
    handleRemove (file, fileList) {
      fileList.pop()
    },
    // 是否推送公告
    isSelectPush () {
      this.$refs.refGonggao.validate(valid => {
        console.log(valid)
      })
      // this.$confirm('是否需要推送公告?', '提示', {
      //   distinguishCancelAndClose: true,
      //   cancelButtonText: '需要推送',
      //   confirmButtonText: '不了，谢谢',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.sendGonggao()
      //   })
      //   .catch(action => {
      //     if (action === 'cancel') {
      //       this.orgListCurrentPage = 1
      //       this.getOrgList()
      //       this.radio = ''
      //       this.checkUserList = []
      //       this.selectPush = true
      //     }
      //   })
    },
    // 放大预览
    handlePictureCardPreview (file) {
      if (file.raw.type.split(/\//)[0] === 'video') {
        this.$message.error('功能暂未开放')
      } else {
        this.dialogImageUrl = file.url
        this.dialogVisibleImg = true
      }
    },
    ckeckEditUserRemark () {
      this.isEditRemark = true
      this.$nextTick(()=>{
        this.$refs.myTextarea.focus()
      })
    },
    // 给员工打备注
    async editUserRemark(item){
      const result = await this.$http.post('/api/UpdateOrgPersonnel', item)
      if (result.data.result.code === 200) {
        this.getPersonalDetails(result.data.result.item.id)
        this.$message.success('修改成功')
        this.isEditRemark = false
      }else {
        this.$message.success('修改失败')
      }
    },
    // 下载图片或视频
    handleDownload (file) {
      console.log(file)
    },
    // 打开添加标签
    openAddTag () {
      this.dialogAddTag = true
    },
    // 添加标签
    async addTag () {
      const res = await this.$http.post('/api/CreateCompanyLabel', {
        companyID: this.CompanyDetail.orgCompany.id,
        companyName: this.CompanyDetail.orgCompany.companyName,
        labelName: this.tagValue,
        isCompany: true,
        companyCode: this.CompanyDetail.orgCompany.companyNumber
      })
      if (res.data.result.code === 200) {
        this.openCompanyDetail(res.data.result.item.companyID)
        this.$message.success('添加标签成功')
      }
      this.dialogAddTag = false
    },
    // 点击对应公司列表查看详情
    async openCompanyDetail (id) {
      this.isGroupNumber = false
      this.showTypeOptions.showLiaotianType = null
      this.active2 = 4
      const res = await this.$http.post('api/OrgCompanyLableListByID', {
        CompanyId: id
      })
      if (res.data.result.code === 200) {
        this.CompanyDetail = res.data.result.item
        this.CompanyDetail.companyName =
          res.data.result.item.orgCompany.companyName
        this.CompanyDetail.companyLogo =
          res.data.result.item.orgCompany.companyLogo
        this.CompanyDetail.id = res.data.result.item.orgCompany.id
      }
      this.CompanyDetail.detailId = id
    },
    // 搜索公司列表
    async searchCompanyList () {
      this.showSearchCompanyCount = false
      this.companyLoadDisabled = true
      this.companyListCurrentPage = 1
      await this.getContactsCompanyListByID()
      this.showSearchCompanyCount = true
      this.showTypeOptions.showLiaotianType = null
      this.isGroupNumber = false
      this.active2 = null
    },
    // 获取公司列表 /超时/
    async getContactsCompanyListByID () {
      const res = await this.$http.post('/api/ContactsCompanyListByID', {
        companyID: this.showCollection.id,
        OppositeRole: this.showCollection.listType,
        companyName: this.searchCompanyName,
        maxResultCount: this.companyListPageSize,
        skipCount: this.companyListCurrentPage
      })
      if (res.data.result.code === 200) {
        this.CompanyList = res.data.result.item.items
        this.companyListTotalCount = res.data.result.item.totalCount
        if (this.companyListTotalCount > this.companyListPageSize) this.companyLoadDisabled = false
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击查看对应公司列表页
    async showCompanyList (val) {
      this.offDetail()
      this.companyLoadDisabled = true
      this.showSearchCompanyCount = false
      this.CompanyList = []
      this.companyListTotalCount = 0
      this.showTypeOptions.showType = false
      this.active2 = null
      this.showCollection = val
      this.getContactsCompanyListByID()
    },
    // 上传图片修改头像
    async fileChange (e) {
      this.file = e.target.files[0]
      const url = URL.createObjectURL(this.file)
      this.datas.userImage = url
    },
    // 点击对应公司查看公司信息
    async showCompany (val) {
      this.showCollection = val
      this.active2 = null
      this.showTypeOptions.showType = false
      this.showTypeOptions.showLiaotianType = null
      this.isGroupNumber = false
      // 获取公司详情
      const res = await this.getCompanyDetails(val.id)
      if (res.data.result.code === 200) {
        this.CompanyDetail = res.data.result.item
      }
    },
    // 查看公司详情
    async getCompanyDetails (id) {
      return await this.$http.post('/api/CompanyByID', { CompanyNumber: id })
    },
    // 确认修改个人信息
    async editPersonal () {
      const formData = JSON.parse(JSON.stringify(this.datas))
      if (this.file) {
        const fd = new FormData()
        fd.append('file', this.file)
        fd.append('BusinessType', 'Head')
        const res = await this.$http.post('/api/File/InsertPic', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.data.result.code === 200) {
          formData.userImage = res.data.result.object[0].filePath
        }
      }
      formData.birthday = new Date(this.datas.birthday)
        // formData.password = this.$md5(formData.phoneNumber+)
        .toLocaleString()
        .replace(/\//g, '-')
        .replace(/ [\s\S]+/g, '')
      const result = await this.$http.post('/api/UpdateOrgPersonnel', formData)
      if (result.data.result.code === 200) {
        this.getPersonalDetails(result.data.result.item.id)
        this.$root.eventHub.$emit('UpdateOrgPersonnel')
        this.$message.success('修改成功')
      }
    },
    // 查看个人信息
    showInfo (val) {
      this.infoItem = val.id
      this.showCollection = val
      this.showTypeOptions.showType = false
      this.showPersonalNumber = false
      this.showSampleSelection = false
      this.active2 = null
      this.showTypeOptions.showLiaotianType = null
      this.isGroupNumber = false
      this.getPersonalDetails(val.id)
    },
    // 关闭其他信息
    offDetail (active) {
      this.isGroupNumber = false
      this.rec && this.rec.close()
      this.$setWs.$ws && this.$setWs.$ws.close()
      this.orderCurrentPage = 1
      this.searchCompanyName = ''
      this.orderDetailList = []
      this.isShowRec = false
      this.fileList = []
      this.showCollection.active1 = null
      this.showTypeOptions.showType = null
      this.showTypeOptions.sampleFrom = null
      this.showTypeOptions.showLiaotianType = null
      this.ERPOrderOptions.ERPOrderList = null
      this.showPersonalNumber = false
      this.showSampleSelection = false
      try {
        this.signalROptions.creatChannel &&
          this.signalROptions.creatChannel.leave()
      } catch (error) {
        console.log(error)
      }

      this.showTypeOptions.showOrderDetail = false
      this.showCollection.active = null
      this.active2 = null
      this.isOrderShow = null
      this.showOrderCompanyItem = null
      this.activeFind = active || null
    },
    // 点击公司订单列表新的消息
    async resetCompanyList () {
      this.$store.commit('clearWsOrderMsg')
      // 刷新列表
      this.orderCurrentPage = 1
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 点击排号订单列表新的消息
    async resetPaihaoCompanyList () {
      this.$store.commit('clearWsOrderMsg')
      // 刷新列表
      this.orderCurrentPage = 1
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 点击公司业务打开订单列表
    async showInfoListOrder (val) {
      this.offDetail()
      this.showTypeOptions.showType = val.showType
      this.showTypeOptions.sampleFrom = val.sampleFrom
      this.showTypeOptions.CompanyNumber = null
      this.showTypeOptions.isToCompany = null
      this.showTypeOptions.ReadStatus = null
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 打开公司排号公司的订单列表
    async showOrderCompanyList (item) {
      this.offDetail()
      const re = await this.getPersonalNumber(item)
      if (re.data.result.code === 200) {
        this.personalNumber = re.data.result.item
      }
      this.showOrderCompanyItem = item

      this.showTypeOptions.sampleFrom = null
      this.showTypeOptions.mySampleFrom = item.sampleFrom
      this.showTypeOptions.CompanyNumber = item.client_nu
      this.showTypeOptions.ReadStatus = '-1'
      this.showTypeOptions.isToCompany = item.isToCompany
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 获取排号
    async getPersonalNumber (item) {
      return await this.$http.post('/api/PersonalNumber', {
        companyNumber: item.client_nu
      })
    },
    // 获取排号中的采购商
    async getCustomerVisit () {
      return await this.$http.post('/api/CustomerVisit', {
        companyNumber: this.showOrderCompanyItem.client_nu,
        skipCount: this.customerVisitCurrentPage,
        maxResultCount: this.customerVisitPageSize
      })
    },
    // 当前排号到底加载更多
    async nextCurrentCodeContent () {
      if (this.isNoCurrentNumber) {
        return
      }
      this.currentNumberCurrentPage++
      const res = await this.getCurrentNumber()
      if (res.data.result.code === 200) {
        this.currentCodeList = this.currentCodeList.concat(
          res.data.result.item
        )
      }
    },
    // 采购商下拉加载
    async buyerContentLoad () {
      if (this.isNoCustomerVisit) {
        return
      }
      this.customerVisitCurrentPage++
      const res = await this.getCustomerVisit()
      if (res.data.result.code === 200) {
        this.customerVisitList = this.customerVisitList.concat(
          res.data.result.item
        )
      }
    },
    // 获取当前排号
    async getCurrentNumber () {
      return await this.$http.post('/api/CurrentNumber', {
        companyNumber: this.showOrderCompanyItem.client_nu,
        pageSize: this.currentNumberPageSize,
        pageIndex: this.currentNumberCurrentPage
      })
    },
    // 下拉加载更多
    async addSampleSelectionList () {
      this.activeAddSample = true
      if(this.sampleSelectionTotalCount <= this.sampleSelectionPageSize) {
        this.showAddSampleTXT = '我也是有底线的'
        return false
      }
      this.showAddSampleTXT = '加载中...'
      let res
      switch (this.showSampleSelection) {
        case 'myProduct':
          this.mySampleSelectionCurrentPage++
          res = await this.getSampleSelectionList(this.showSampleSelection)
          if (
            res.data.result.code === 200 &&
            res.data.result.item.items.length > 0
          ) {
            this.sampleSelectionList = this.sampleSelectionList.concat(
              res.data.result.item.items
            )
            this.sampleSelectionTotalCount = res.data.result.item.totalCount
            this.activeAddSample = false
          } else {
            this.showAddSampleTXT = '我也是有底线的'
            this.activeAddSample = true
          }
          break
        default:
          this.sampleSelectionCurrentPage++
          res = await this.getSampleSelectionList(this.showSampleSelection)
          if (res.data.result.code === 200 && res.data.result.item.length > 0) {
            this.sampleSelectionList = this.sampleSelectionList.concat(
              res.data.result.item
            )
            this.activeAddSample = false
          } else {
            this.showAddSampleTXT = '我也是有底线的'
            this.activeAddSample = true
          }
          break
      }
    },
    // 获取 历史择样|择样排行|我的产品 列表
    async getSampleSelectionList (val) {
      let API
      switch (val) {
        case 'historySample':
          API = '/api/OrderOfferDetailHistoryPage'
          break
        case 'rankingSample':
          API = '/api/ProductRanking'
          break
        case 'myProduct':
          API = '/api/SupplierProduct'
          break
      }
      return await this.$http.post(API, {
        companyNumber: this.showOrderCompanyItem.client_nu,
        pageIndex:
          val === 'myProduct'
            ? this.mySampleSelectionCurrentPage
            : this.sampleSelectionCurrentPage,
        pageSize: this.sampleSelectionPageSize,
        keyword: this.myProductSearchValue,
      })
    },
    // 搜索我的产品
    async myProductSearchEvent () {
      const res = await this.getSampleSelectionList ('myProduct')
      if (res.data.result.code === 200) {
        this.sampleSelectionList = res.data.result.item.items
        this.sampleSelectionTotalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开 历史择样|择样排行|我的产品 列表
    async openSampleList (val) {
      this.showAddSampleTXT = null
      this.sampleSelectionList = []
      this.mySampleSelectionCurrentPage = 1
      this.sampleSelectionCurrentPage = 0
      const res = await this.getSampleSelectionList(val)
      if (res.data.result.code === 200) {
        switch (val) {
          case 'myProduct':
            this.sampleSelectionList = res.data.result.item.items
            this.sampleSelectionTotalCount = res.data.result.item.totalCount
            this.activeAddSample = false
            break
          default:
            this.sampleSelectionList = res.data.result.item
            this.activeAddSample = false
            break
        }
      } else {
        this.$message.error(res.data.result.msg)
      }
      this.showSampleSelection = val
      this.showPersonalNumber = false
      this.showTypeOptions.showOrderDetail = false
    },
    // 打开我的排号详情
    async openRowMeCode () {
      this.customerVisitCurrentPage = 1
      const currentNumberList = await this.getCurrentNumber()
      if (currentNumberList.data.result.code === 200) {
        if (!currentNumberList.data.result.item.length) {
          this.isNoCurrentNumber = true
        }
        this.currentCodeList = currentNumberList.data.result.item
      }
      const res = await this.getCustomerVisit()
      if (res.data.result.code === 200) {
        if (!res.data.result.item.length) {
          this.isNoCustomerVisit = true
        }
        this.customerVisitList = res.data.result.item
      }
      this.showPersonalNumber = true
      this.showSampleSelection = false
      this.showTypeOptions.showOrderDetail = false
    },
    // 弹出我的排号list
    openNumberList () {
      console.log(this.personalNumber)
      this.$alert(
        (this.personalNumber.historyNumbers &&
          this.personalNumber.historyNumbers.join(',')) ||
          '10,30,100,3023,2233',
        '排号',
        {
          confirmButtonText: '确定'
        }
      )
    },
    // 展开修改个人信息页面
    showInfo2 (val) {
      this.active2 = 2
      this.infoItem2 = val
    },
    // 打开修改个人信息详情页
    openEdit (id) {
      if (this.userInfo.userInfo.id === id) {
        this.active2 = 2
      }else {
        this.$message.error("不能修改别人的资料哦")
      }
    },
    // 获取个人详情页
    async getPersonalDetails (id) {
      const res = await this.$http.post('/api/OrgPersonnelByID', {
        id: id,
        CompanyId: this.showCollection.companyId
      })
      if (res.data.result.code === 200) {
        this.personalDetail = res.data.result.item
        this.datas = JSON.parse(JSON.stringify(res.data.result.item))
      }
    },
    // 拉到底加载更多
    load () {
      this.loading = true
      setTimeout(async () => {
        this.skipCount++
        this.maxResultCount = 10
        await this.getDataList(true)
        this.loading = false
      }, 2000)
    },
    // 回到顶部事件
    async toTop () {
      let top = $('.findItems').scrollTop()
      // 实现滚动效果
      const _that = this
      const timeTop = setInterval(() => {
        $('.findItems').scrollTop((top -= 20))
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 1)
      this.skipCount = 1
      this.maxResultCount = 10
      this.dataList = this.dataList.slice(0, 10)
      $('.findItems').animate({ scrollTop: 0 })
    },
    // 获取我发布的公告
    async getDataList (flag) {
      const res = await this.$http.post('/api/BearNoticePage', {
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        publisher: this.userInfo.userInfo.id
      })
      if (res.data.result.code === 200) {
        if (flag) {
          this.dataList = this.dataList.concat(
            res.data.result.item.result.items
          )
        } else {
          this.dataList = res.data.result.item.result.items
          this.loading = false
        }
        this.total = res.data.result.item.result.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    /*
     * 时间戳显示为多少分钟前，多少天前的处理
     * console.log(dateDiff(1411111111111));  // 2014年09月19日
     */
    dateDiff (time) {
      let timestamp = Number(new Date(time))
      const arrTimestamp = (timestamp + '').split('')
      for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
          arrTimestamp[start] = '0'
        }
      }
      timestamp = arrTimestamp.join('') * 1

      var minute = 1000 * 60
      var hour = minute * 60
      var day = hour * 24
      var halfamonth = day * 15
      var month = day * 30
      var now = new Date().getTime()
      var diffValue = now - timestamp

      // 如果本地时间反而小于变量时间
      if (diffValue < 0) {
        return '不久前'
      }

      // 计算差异时间的量级
      var monthC = diffValue / month
      var weekC = diffValue / (7 * day)
      var dayC = diffValue / day
      var hourC = diffValue / hour
      var minC = diffValue / minute

      // 数值补0方法
      var zero = function (value) {
        if (value < 10) {
          return '0' + value
        }
        return value
      }

      // 使用
      if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
          var date = new Date(timestamp)
          return (
            date.getFullYear() +
            '年' +
            zero(date.getMonth() + 1) +
            '月' +
            zero(date.getDate()) +
            '日'
          )
        })()
      } else if (monthC >= 1) {
        return parseInt(monthC) + '月前'
      } else if (weekC >= 1) {
        return parseInt(weekC) + '周前'
      } else if (dayC >= 1) {
        return parseInt(dayC) + '天前'
      } else if (hourC >= 1) {
        return parseInt(hourC) + '小时前'
      } else if (minC >= 1) {
        return parseInt(minC) + '分钟前'
      }
      return '刚刚'
    },
    // 点赞
    async dianZan (val) {
      const res = await this.$http.post('/api/UpdateBearNotice', {
        noticeNumber: val.bearNotice.noticeNumber,
        NoticeType: 'Upvote',
        id: val.bearNotice.id
      })
      if (res.data.result.code === 200) {
        if (res.data.result.item.collectTotal) {
          this.$message.success('点赞成功')
        } else {
          this.$message.warning('取消点赞成功')
        }
        val.isLike = !val.isLike
        val.isLike
          ? val.bearNotice.upvoteTotal++
          : val.bearNotice.upvoteTotal--
        this.$root.eventHub.$emit('UpdateFind')
      }
    },
    // 打开评论
    openPinglun (value) {
      this.pinglunTitle = '评论'
      this.dialogPinglun = true
      this.pinglunForm = value
    },
    // 评论
    async addComment () {
      let data
      if (this.pinglunTitle === '回复评论') {
        data = {
          noticeNumber: this.huifuPinglun.noticeNumber,
          interactionType: 'Reply',
          userName: this.userInfo.userInfo.linkman,
          comment: this.pinglunValue,
          replyCompanyID: this.replyToUserName
            ? this.huifuPinglun.replyCompanyID
            : this.huifuPinglun.companyID,
          replyToUser: this.replyToUserName
            ? this.huifuPinglun.replyToUser
            : this.huifuPinglun.createdBy,
          replyToUserName: this.replyToUserName || this.huifuPinglun.userName
        }
      } else {
        data = {
          noticeNumber: this.pinglunForm.bearNotice.noticeNumber,
          companyID: this.userInfo.userInfo.id,
          userName: this.userInfo.userInfo.linkman,
          interactionType: 'Comment',
          comment: this.pinglunValue
        }
      }
      const res = await this.$http.post('/api/CreateNoticeInteraction', data)
      if (res.data.result.code === 200) {
        this.skipCount = 1
        this.maxResultCount =
          this.dataList.length >= 100 ? 10 : this.dataList.length
        this.getDataList()
        // 重新调用子路由查看公告
        this.$root.eventHub.$emit('UpdateFind')
        this.dialogPinglun = false
        this.$message.success('评论成功')
      }
      this.pinglunValue = ''
      this.pinglunTitle = ''
    },
    // 打开回复评论
    async openReplyComment (val, replyToUserName) {
      if (
        val.createdBy ===
        (this.$store.state.userInfo.userInfo &&
          this.$store.state.userInfo.userInfo.id)
      ) {
        this.$message.error('不能回复自己哦')
        return false
      }
      this.pinglunTitle = '回复评论'
      this.dialogPinglun = true
      this.huifuPinglun = val
      this.replyToUserName = replyToUserName
    },
    // 删除公告
    async deleteCement (val, i) {
      const res = await this.$http.post('/api/DeleteBearBotice', {
        id: val.bearNotice.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.dataList.splice(i, 1)
        // 重新调用子路由查看公告
        this.$root.eventHub.$emit('UpdateFind')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 关闭确认订单
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 确认订单列表修改订单状态
    async UpdateERPOrderStatus (messageStatus) {
      console.log(this.orderOptions)
      const res = await this.$http.post('/api/UpdateERPOrderStatus', {
        erpOrderID: this.orderOptions.erpOrderID,
        messageStatus: messageStatus,
        statusType: 'ConfirmStatus'
      })
      if (res && res.data.result.code === 200) {
        this.$message.success('确认订单完成')
        // 重新获取订单列表
        this.orderCurrentPage = 1
        const re = await this.getERPOrderListByPage()
        if (re.data.result.code === 200) {
          this.ERPOrderOptions.ERPOrderList = re.data.result.item.items
          console.log(re.data.result.item.items)
          this.ERPOrderOptions.total = re.data.result.item.totalCount
          for (let i = 0; i < this.ERPOrderOptions.ERPOrderList.length; i++) {
            if (
              this.ERPOrderOptions.ERPOrderList[i].erpOrderID ===
              this.orderOptions.erpOrderID
            ) {
              this.orderOptions = this.ERPOrderOptions.ERPOrderList[i]
            }
          }
          this.openOrderDetail(this.orderOptions)
          this.getOrderDetail(this.orderOptions)
        }

        this.queRenDialog = false
      } else {
        this.$message.success('确认订单失败，请检查网络')
      }
    },
    // 确认订单详情修改订单状态
    async updateOrderConfirmStatus (item, messageStatus) {
      const res = await this.$http.post('/api/UpdateOrderConfirmStatus', {
        OfferDetailId: item.id,
        messageStatus: messageStatus
      })
      let re
      switch (res.data.result.code) {
        case 200:
          this.$message.success('修改订单成功')
          // if (res.data.result.item.confirmStatus) {
          // }
          re = await this.getOrderDetail(this.orderOptions) // 获取订单详情
          if (re.data.result.code === 200) {
            this.orderDetailList = re.data.result.item.items
            this.orderDetailTotal = re.data.result.item.totalCount
          }
          break
        case 400:
          this.$message.error(res.data.result.msg)
          break
      }
    },
    // 确认订单
    async configOrder (val) {
      this.orderOptions = val
      this.queRenDialog = true
    },
    // 下拉加载更多订单
    async orderLoad () {
      this.orderLoadText = '加载中...'
      if (
        this.ERPOrderOptions.ERPOrderList &&
        this.ERPOrderOptions.ERPOrderList.length < this.ERPOrderOptions.total
      ) {
        this.orderCurrentPage++
        const res = await this.getERPOrderListByPage()
        if (res.data.result.code === 200) {
          this.ERPOrderOptions.ERPOrderList = this.ERPOrderOptions.ERPOrderList.concat(
            res.data.result.item.items
          )
          this.ERPOrderOptions.total = res.data.result.item.totalCount
          console.log(
            this.ERPOrderOptions.total,
            this.ERPOrderOptions.ERPOrderList
          )
        }
      } else {
        this.orderCurrentPage = 1
        this.orderLoadText = '人家也是有底线滴'
      }
    },
    // 聊天滚动查看历史记录
    async liaotianScroll (e) {
      const topJuli = e.target.scrollTop
      const warpHeight = $('.liaotianWarp').innerHeight()
      if (this.timeID) clearTimeout(this.timeID)
      this.timeID = setTimeout(async () => {
        if (topJuli === 0) {
          this.noScrollTop = true
          this.loadText = '加载中...'
          if (this.timeID) clearTimeout(this.timeID)
          this.timeID = setTimeout(async () => {
            if (this.signalROptions.showmsg.length >= this.chatHistoryTotal) {
              this.noScrollTop = true
              this.loadText = '没有更多聊天记录了'
              this.$nextTick(() => {
                this.noScrollTop = false
              })
              return false
            }
            this.chatHistoryCurrentPage++
            const res = await this.getInstantMessageByNumber()
            if (res.data.result.code === 200) {
              this.loadText = null
              const list = res.data.result.item.items
              for (let i = list.length - 1; i >= 0; i--) {
                this.signalROptions.showmsg.unshift(list[i])
              }
              this.chatHistoryTotal = res.data.result.item.totalCount
              this.$nextTick(() => {
                e.target.scrollTop =
                  $('.liaotianWarp')[0].offsetHeight - warpHeight

                this.noScrollTop = false
              })
            }
          }, 1000)
        }
      }, 500)
    },
    // 获取系统参数
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        return res.data.result.item
      }
    },
    // 列样式
    timeStyle (column) {
      return 'color: #165af8'
    },
    // 表头样式
    headerStyle (column) {
      return 'font-weight:600;color:black;'
    },
    // 显示已读未读
    isShowReady (item) {
      if (this.MessageUnreadCount) {
        if (this.MessageUnreadCount.length) {
          for (let i = 0; i < this.MessageUnreadCount.length; i++) {
            if (this.MessageUnreadCount[i].MessageID === item.id) {
              item.unreadCout = this.MessageUnreadCount[i].Count
              return item.unreadCout
            }
          }
        } else {
          item.unreadCout = 0
        }
      } else {
        return item.unreadCout
      }
    },
    // 点击公司地址打开定位
    openMap(addr){
      this.companyAddr = addr
      this.companyAddrMapDialog = true
    },
    // 切换我的产品展示格式类型
    checkMoreEvent () {
      this.isCheckCube = !this.isCheckCube
    }
  },
  mounted () {
    this.activeFind = 2
    this.getDataList()
    this.login()
    this.$store.commit('clearWsMsg') // 清空已读未读
  },
  async created () {
    document.onclick = () => {
      this.isChehui = null
      this.isPaste = null
    }
    document.oncontextmenu = () => {
      this.isChehui = null
      this.isPaste = null
      return false
    }
    if (this.$route.query.id) {
      // 登录成功获取系统参数
      const Json = {}
      Json.MessageRestriction = await this.getClientTypeList(
        'MessageRestriction'
      )
      Json.UserRestrictions = await this.getClientTypeList('UserRestrictions')
      Json.NoticeRestrictions = await this.getClientTypeList(
        'NoticeRestrictions'
      )
      Json.CompanyRestrictions = await this.getClientTypeList(
        'CompanyRestrictions'
      )
      Json.PlatForm = await this.getClientTypeList('PlatForm')
      Json.packageManage = await this.getClientTypeList('packageManage')
      this.$store.commit('globalJson/setGlobalJson', Json)
      this.$router.push('/meInfo')
    }

    this.$set(
      this,
      'Json',
      this.$_.cloneDeep(this.$store.state.globalJson.Json)
    )
    this.imgAndVideoNum = Number(this.Json.NoticeRestrictions[4].itemCode)
  },
  // 聊天窗口滚动到最底部
  // updated() {
  //   if (!this.noScrollTop) {
  //     this.$nextTick(() => {
  //       $("#liaotianchuangkou")
  //         .stop()
  //         .animate(
  //           {
  //             scrollTop:
  //               $("#liaotianchuangkou")[0] &&
  //               $("#liaotianchuangkou")[0].scrollHeight +
  //                 $("#liaotianchuangkou")[0].offsetHeight
  //           },
  //           500
  //         );
  //     });
  //   }
  // },
  watch: {
    updateLiaotian (msgList) {
      if (msgList && msgList.length && !this.noScrollTop) {
        // this.$nextTick(() => {
        $('#liaotianchuangkou')
          .stop()
          .animate(
            {
              scrollTop:
                $('#liaotianchuangkou')[0] &&
                $('#liaotianchuangkou')[0].scrollHeight +
                  $('#liaotianchuangkou')[0].offsetHeight
            },
            500
          )
        // });
      }
    },
    // 监听订单长连接推送消息
    '$store.state.wsOrderMsg' (val) {
      this.orderSampleFrom = val
    },
    getWsMsg: function (data) {
      if (data) {
        data = JSON.parse(data)
      }
      if (
        data &&
        data.action === 'MessageUnreadCount' &&
        data.SendClientId === this.signalROptions.groupNumber
      ) {
        this.MessageUnreadCount = JSON.parse(data.content).UnreadCountList
        // 长连接接收到
        console.log('长连接接收到消息', this.MessageUnreadCount)
      }
    },
    'showTypeOptions.showType' (newVal) {
      if (newVal === 'showInfoList') {
        this.$nextTick(() => {
          this.$refs.sendMessageRef.$refs.input.focus()
        })
      }
    },
    'signalROptions.client' (val) {
      if (!val) {
        console.log('已被迫下线，可刷新重新登录')
        // this.login();
      }
    },
    'showTypeOptions.showLiaotianType' (newVal) {
      if (newVal !== 'showLiaotianList' && this.rec) this.rec.close()
      if (newVal !== 'showLiaotianList' && this.$setWs.$ws) {
        this.$setWs.$ws.close()
        clearInterval(this.$setWs.timeoutID)
        clearTimeout(this.$setWs.serverTimeoutObj)
      }
    },
    visibleTXT (val) {
      if (!val) {
        this.TXTUrl = null
      }
    },
    loginState (val) {
      console.log('登录状态', val)
      switch (val) {
        case 'CONNECTED':
          this.$message.closeAll()
          console.log('即时通讯链接成功')
          break
        default:
          this.$message.closeAll()
          // this.login();
          console.log('即时通讯已断开链接')
          break
      }
    }
  },
  computed: {
    updateLiaotian () {
      return this.signalROptions.showmsg
    },
    getWsMsg () {
      return this.$store.state.wsMsg
    },
    noMore () {
      return this.dataList.length >= this.total
    },
    disabled () {
      return this.loading || this.noMore
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    gonggaoTypes () {
      return this.gonggaoType === 'Ordinary'
        ? '请输入普通公告内容'
        : this.gonggaoType === 'Purchase'
          ? '请输入采购公告内容'
          : '请输入供应公告内容';
      this.$refs.refGonggao.clearValidate();
    },
    uploadAccept () {
      return (
        this.Json.NoticeRestrictions[0].itemCode +
        ',' +
        this.Json.NoticeRestrictions[1].itemCode
      )
    }
  },
  filters: {
    ERPOrderTitle (val) {
      let type
      switch (val) {
        case 'SUPPLIER':
        case 'supplier':
          type = '厂商业务列表'
          break
        case 'SALES':
        case 'sales':
          type = '公司业务列表'
          break
        case 'HALL':
        case 'hall':
          type = '展厅业务列表'
          break
      }
      return type
    },
    myState (val) {
      let msg
      switch (val.orderStatus) {
        case '0':
          msg = '未查看'
          break
        case '1':
          msg = '未确认'
          break
        case '99':
          msg = '已取消'
          break
        case '9':
          msg = '已完成'
          break
      }
      return msg
    }
  },
  beforeDestroy () {
    this.signOut()
    this.signalROptions.creatChannel && this.signChannel()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.meInfo {
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    &:after {
      content: "";
      width: 32%;
    }
    li {
      width: 32%;
      box-sizing: border-box;
      border: 1px solid #ccc;
      &.info {
        height: 827px;
        position: relative;
        // margin-bottom:60px ;
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          height: 60px;
          background-color: #f6f6f6;
          box-sizing: border-box;
          .li {
            cursor: pointer;
            flex: 1;
            margin: 2px 5px;
            border: none;
            text-align: center;
            i {
              font-size: 30px;
            }
            &.router-link-active {
              color: #1ac25f;
            }
          }
        }
      }
    }
    .contentTwo {
      display: flex;
      justify-content: center;
      position: relative;
      flex-wrap: wrap;
      // 个人详情页样式
      .top,
      .bottom {
        width: 100%;
        height: 50%;
      }
      .top {
        background-color: #165af7;
      }
      .bottom {
        background-color: #eeeeed;
      }
      .personalInfo {
        position: absolute;
        top: 50px;
        width: 95%;
        // height: 700px;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 10px 30px 10px;
        box-sizing: border-box;
        .name {
          height: 80px;
          margin-top: 10px;
          display: flex;
          .text {
            flex: 2;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            align-self: center;
            p {
              font-size: 18px;
              width: 100%;
              font-weight: 500;
            }
            span {
              color: #4679f8;
            }
          }
          .img {
            flex: 1;
            @{deep} .myAvatar {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              cursor: pointer;
              color: white;
              background-color: #165af7;
            }
          }
        }
        .floor {
          .companyRemark {
             @{deep} .el-textarea__inner {
              resize: none;
              box-sizing: border-box;
              padding-left:0;
              padding-right:0;
              font-size:16px;
              font-family: "Microsoft Yahei";
              background-color: #fff;
              border-color: #fff;
              color: #000;
             }
          }
          .title {
            color: #7e7e81;
            font-size: 14px;
            margin: 10px 0;
          }
          .myRemark{
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .subRemark{
          }
          p {
            padding-bottom: 10px;
          }
        }
        .send {
          margin-top: 20px;
          .sendInfo {
            background-color: #165af7;
            color: #fff;
            width: 80%;
            .sendIcon {
              font-size: 16px;
              vertical-align: middle;
            }
          }
        }
      }
      // 公司详情页样式
      .CompanyTop {
        background: url("~@/assets/images/bg.png") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 200px;
      }
      .CompanyBottom {
        width: 100%;
        height: 625px;
        background-color: #eeeeed;
      }
      .detailBox {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: auto;
        .CompanyDetail {
          margin: 100px auto 20px auto;

          width: 95%;
          background-color: #fff;
          border-radius: 10px;
          padding: 30px 10px 0 10px;
          box-sizing: border-box;
          .CompanyName {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            .img {
              @{deep} .el-image {
                width: 80px;
                height: 80px;
                background-color: #165af7;
                color: #fff;
                border-radius: 50%;
              }
            }
          }
          .evaluation {
            font-size: 14px;
            margin-top: 5px;
            padding-bottom: 20px;
            .evaluationTitle {
              color: #89898a;
            }
            .tags {
              margin-top: 10px;
              width: 100%;
              .el-tag {
                margin: 5px;
                border-radius: 20px;
              }
            }
            .deleteTag {
              cursor: pointer;
            }
          }
        }
        .ContactInformation {
          width: 95%;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 10px;
          padding: 30px 10px 20px 10px;
          box-sizing: border-box;
          .ContactItem {
            .title {
              color: #8d8d8e;
              font-size: 14px;
              padding-top: 5px;
            }
            .text {
              padding: 10px 0;
              width:100%;
              border-bottom: 1px solid #8d8d8e;
              .address{
                width:100%;
                cursor: pointer;
                &:hover{
                  color:#165af7;
                }
              }
            }
          }
          center {
            margin-top: 20px;
            .sendInfo {
              background-color: #165af7;
              color: #fff;
              width: 250px;
              .sendIcon {
                font-size: 16px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .list {
        height: 825px;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .mySearchs {
          margin-top: 20px;
          background-color: #fff;
          box-sizing: border-box;
          padding: 0 20px;
          @{deep} .searchInput input.el-input__inner {
            border-radius: 20px;
            border: none;
            background-color: #eceeef;
          }
        }
        .listItems {
          padding: 0 10px;
          flex: 1;
          box-sizing: border-box;
          padding: 10px;
          overflow-x: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          .item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
            cursor: pointer;
            .myAvatar {
              margin-right: 10px;
              width: 40px;
              height: 40px;
              background-color: #165af7;
              color: #fff;
              border-radius: 50%;
            }
          }
        }
        .companyNoData {
          width: 100%;
          height: 600px;
          background: url("~@/assets/images/tu.png") no-repeat center;
          position: relative;
          p {
            position: absolute;
            width: 100%;
            font-size: 20px;
            left: 0;
            font-weight: 500;
            color: #9a9a9a;
            text-align: center;
            top: 55%;
          }
        }
        .searchCompanyNoData {
          width: 100%;
          height: 600px;
          background: url("~@/assets/images/tu1.png") no-repeat center;
          position: relative;
          p {
            position: absolute;
            width: 100%;
            left: 0;
            font-weight: 500;
            color: #9a9a9a;
            text-align: center;
            top: 55%;
          }
        }
      }
    }
    .contentThree {
      background-color: #fff;
      height: 827px;
      box-sizing: border-box;
      display: flex;
      position: relative;
      flex-direction: column;
      .myProductSearch {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .inputBox{
          width: 95%;
          height: 40px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid #aaa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          @{deep} .el-input{
            border: none;
            .el-input__inner{
              border: none;
            }
          }
          .el-button{
            border: none;
            height: 100%;
            background-color: #165af7;
          }
        }
      }
      .myProductSearchTotalCountBox{
        padding: 10px 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          flex: 1;
          &.myTotalCount{
            text-align: center;
            span{
              color: #ff0000;
              margin-right: 5px;
            }
          }
          &.more{
            display: flex;
            justify-content: flex-end;
            margin-right: 10px;
            .checkList{
              width: 20px;
              height: 20px;
              display: block;
              background: url('~@/assets/images/格式化列表.png') no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
            .checkCube{
              width: 20px;
              height: 20px;
              display: block;
              background: url('~@/assets/images/liebiao2.png') no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
          }
        }
      }
      .datas {
        width: 100%;
        background-color: #fff;
        padding: 50px 10px;
        box-sizing: border-box;
        li {
          height: 50px;
          width: 100%;
          border: none;
          border-bottom: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .text {
            position: relative;
            .myAvatar {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background-color: #165af7;
              color: #fff;
            }
            input {
              border: none;
              width: 100px;
              text-align: right;
              outline: none;
            }
            .upLoad {
              border: 1px solid #000;
              cursor: pointer;
              width: 42px;
              height: 42px;
              opacity: 0;
              position: absolute;
              right: 0;
              top: 0;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
      }
      .send {
        margin-top: 50px;
        .sendInfo {
          background-color: #165af7;
          color: #fff;
          width: 250px;
          .sendIcon {
            font-size: 16px;
            vertical-align: middle;
          }
        }
      }
      // 公司详情样式
      // 公司详情页样式
      .CompanyTop {
        background: url("~@/assets/images/bg.png") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 200px;
      }
      .CompanyBottom {
        width: 100%;
        height: 625px;
        background-color: #eeeeed;
      }
      .detailBox {
        position: absolute;
        width: 100%;
        height: 825px;
        left: 0;
        top: 0;
        overflow: auto;
        .CompanyDetail {
          margin: 100px auto 20px auto;
          width: 95%;
          background-color: #fff;
          border-radius: 10px;
          padding: 30px 10px 0 10px;
          box-sizing: border-box;
          .CompanyName {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .img {
              @{deep} .el-image {
                width: 80px;
                height: 80px;
                background-color: #165af7;
                color: #fff;
                border-radius: 50%;
              }
            }
          }
          .evaluation {
            font-size: 14px;
            margin-top: 5px;
            padding-bottom: 20px;
            .evaluationTitle {
              color: #89898a;
            }
            .tags {
              margin-top: 10px;
              width: 100%;
              .el-tag {
                margin: 5px;
                border-radius: 20px;
              }
            }
          }
        }
        .ContactInformation {
          width: 95%;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 10px;
          padding: 30px 10px 20px 10px;
          box-sizing: border-box;
          .ContactItem {
            .title {
              color: #8d8d8e;
              font-size: 14px;
              padding-top: 5px;
            }
            .text {
              padding: 10px 0;
              border-bottom: 1px solid #8d8d8e;
              width:100%;
              .address{
                width:100%;
                cursor: pointer;
                &:hover{
                  color:#165af7;
                }
              }
            }
          }
          center {
            margin-top: 20px;
            .sendInfo {
              background-color: #165af7;
              color: #fff;
              width: 250px;
              .sendIcon {
                font-size: 16px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      // 择样订单导出
      .infoListTitle {
        min-height: 50px !important;
        background-color: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
      }
      .meCode {
        width: 100%;
        height: 100px;
        background-color: #f6f9ff;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: 14px;
        justify-content: space-between;
        cursor: pointer;
        .meCodeImg {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #165af7;
          color: #fff;
        }
        .meCodeContent {
          flex: 1;
          height: 100px;
          display: flex;
          align-items: center;
          .codeTitle {
            margin: 0 10px;
          }
          .code {
            font-size: 30px;
            color: #165af8;
            font-weight: bold;
          }
        }
        &:hover .el-icon-arrow-right {
          color: #165af8;
        }
      }
      .infoOrderList {
        height: 765px;
        overflow: auto;
        padding: 0 10px 10px 10px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: #f5f5f5;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        div {
          center {
            margin: 20px 0;
            .date {
              height: 24px;
              width: 156px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #dadada;
              color: #ffffff;
            }
          }
        }
        .infoOrder {
          background-color: #fff;
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.14);
          border-radius: 10px;
          margin-top: 10px;
          padding: 0 10px;
          .orderState {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-tag {
              display: flex;
              align-items: center;
              &.red {
                background-color: #f4382e;
                border-color: #f4382e;
              }
              .weiquerenIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/未确认.png") no-repeat center;
                background-size: contain;
              }
              .yiquxiaoIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/已取消.png") no-repeat center;
                background-size: contain;
              }
              .wanchengIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/完成.png") no-repeat center;
                background-size: contain;
              }
              .weichakanIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/未查看.png") no-repeat center;
                background-size: contain;
              }
            }
          }
          .txtWrap {
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
            p {
              padding-top: 5px;
              &.remark {
                display: -webkit-box;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: pre-line;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
              }
              .title {
                color: #a0a0a0;
              }
            }
          }
          .btnList {
            padding: 10px 0;
            .box {
              float: right;
              button.el-button.el-button--default.el-button--mini.is-round {
                border-color: #66b1ff;
                color: #66b1ff;
              }
            }
            &::after {
              content: "";
              display: block;
              width: 0;
              height: 0;
              overflow: hidden;
              clear: both;
            }
          }
        }
      }
      .mobile {
        box-sizing: border-box;
        padding: 5px 10px;
        font-size: 14px;
        p {
          line-height: 30px;
          .title {
            color: #a0a0a0;
          }
        }
        .btns {
          padding: 10px;
          @{deep} .el-button {
            float: right;
            margin-left: 10px;
          }
          &::after {
            content: "";
            clear: both;
            height: 0;
            line-height: 0;
            display: block;
            visibility: hidden;
          }
        }
      }
      .orderDetailState {
        padding: 5px 10px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        border-bottom: 1px solid #e5e5e5;
        .text {
          font-weight: bold;
        }
        .el-tag {
          display: flex;
          align-items: center;
          &.red {
            background-color: #f4382e;
            border-color: #f4382e;
          }
          .weiquerenIcon {
            margin-right: 10px;
            width: 14px;
            height: 14px;
            background: url("~@/assets/images/未确认.png") no-repeat center;
            background-size: contain;
          }
          .yiquxiaoIcon {
            margin-right: 10px;
            width: 14px;
            height: 14px;
            background: url("~@/assets/images/已取消.png") no-repeat center;
            background-size: contain;
          }
          .wanchengIcon {
            margin-right: 10px;
            width: 14px;
            height: 14px;
            background: url("~@/assets/images/完成.png") no-repeat center;
            background-size: contain;
          }
          .weichakanIcon {
            margin-right: 10px;
            width: 14px;
            height: 14px;
            background: url("~@/assets/images/未查看.png") no-repeat center;
            background-size: contain;
          }
        }
      }
       @{deep} .orderDetailTitle {
        width: 100%;
        border: none;
        box-shadow: none;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .el-tabs__header{
          .el-tabs__nav-wrap{
            .el-tabs__nav-scroll{
              .el-tabs__nav{
                .el-tabs__item{
                  display:flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
          }
        }
        .el-tabs__content{
          .el-tab-pane{
            width:100%;
            .headerTitle {
          width:100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding: 0 10px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(246, 245, 245, 1);
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          .headerItem {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            &.code {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/编号@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
            &.client {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/客户@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
            &.date {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/时间@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
          }
        }
          }
        }
        
      }
      .orderDetailTitle2 {
        flex: 1;
        overflow-x: none;
        overflow-y: auto;
        padding: 5px 5px 100px 5px;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          display: none;
        }
        .productItem {
          margin-top: 10px;
          font-size: 14px;
          @{deep} .el-card__body {
            padding: 10px 10px 0px 10px;
            box-sizing: border-box;
          }
          .context {
            display: flex;
            justify-content: space-between;
            .left {
              flex: 1;
              padding-bottom: 10px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              .myImage {
                width: 100%;
              }
            }
            .right {
              box-sizing: border-box;
              flex: 2;
              font-size: 13px;
              padding-left: 10px;
              padding-bottom: 10px;
              color: #626262;
              p {
                padding: 2px 0;
                &:first-of-type {
                  color: #000;
                  font-weight: 500;
                }
                .price {
                  color: #ff2000;
                }
              }
            }
          }
          .contact {
            height: 50px;
            display: flex;
            align-items: center;
            border-top: 1px solid #dcdcdc;
            justify-content: space-between;
            .laiyuan {
              color: #58b668;
            }
          }
        }
      }
      .totalBox {
        width: 100%;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        left: 0;
        .transition-box {
          background-color: #fff;
          h3 {
            font-weight: bold;
            font-size: 14px;
            padding: 10px 15px;
            border-bottom: 1px solid #dcdcdc;
          }
          .items {
            font-size: 13px;
            display: flex;
            padding: 5px 15px;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
      @{deep} .el-tabs__header {
        border: 1px solid #dcdfe6;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
          0 0 6px 0 rgba(0, 0, 0, 0.04);
      }
      @{deep} .el-tabs__header,
      @{deep} .is-top,
      @{deep} .el-tabs__nav-scroll {
        height: 50px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f6f9ff;
        @{deep} .el-tabs__item {
          display: flex;
          justify-content: center;
          border: none;
        }
      }
      @{deep}
        .el-tabs--border-card
        > .el-tabs__header
        .el-tabs__item.is-active {
        color: #409eff;
        background-color: #fff;
      }
      @{deep} .el-tabs--border-card > .el-tabs__content {
        display: flex;
        @{deep} .el-tab-pane {
          flex: 1;
          box-sizing: border-box;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
      }
      .productList {
        height: 70px;
        width: 100%;
        box-sizing: border-box;
        background-color: #f6f9ff;
        border-top: 10px solid #f3f3f3;
        border-bottom: 10px solid #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .productIten {
          font-size: 14px;
          width: 33%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:nth-of-type(2) {
            position: relative;
            &::before,
            &::after {
              content: "";
              position: absolute;
              width: 2px;
              height: 20px;
              background-color: #b6caf2;
            }
            &::before {
              left: -2px;
            }
            &::after {
              right: -2px;
            }
          }
          .historyIcon,
          .rankingIcon,
          .myProductIcon {
            width: 16px;
            height: 16px;
            background-color: #ccc;
            margin-right: 5px;
          }
          .historyIcon {
            background: url("~@/assets/images/历史.png") no-repeat center;
            background-size: contain;
          }
          .rankingIcon {
            background: url("~@/assets/images/排行.png") no-repeat center;
            background-size: contain;
          }
          .myProductIcon {
            background: url("~@/assets/images/产品.png") no-repeat center;
            background-size: contain;
          }
          &.active {
            background-color: #fff;
          }
        }
      }
      .historyReco {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        color: black;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          width: 100%;
          height: 60px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(246, 245, 245, 1);
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          .fa_no,
          .createdOn,
          .client_na {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .cureentReco {
        width: 100%;
        flex: 1;
        border: none;
        font-size: 14px;
        color: black;
        overflow: auto;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          width: 100%;
          height: 60px;
          border-radius: 1px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:nth-of-type(odd) {
            background: rgba(229, 238, 255, 1);
            border: 1px solid rgba(246, 245, 245, 1);
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          }
          &:nth-of-type(even) {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(246, 245, 245, 1);
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          }
          &:first-of-type {
            margin-top: 0;
          }
          .fa_no {
            display: flex;
            align-items: center;
            i {
              width: 14px;
              height: 14px;
              background: url("~@/assets/images/编号.png") center no-repeat;
              background-size: contain;
              margin-right: 5px;
            }
          }
          .btns {
            .blueBtn {
              color: #165af7;
              border-color: #165af7;
              &.activeBlue {
                background-color: #165af7;
                color: white;
              }
            }
            .orangeBtn {
              color: #f56024;
              border-color: #f56024;
              &.activeOrange {
                background-color: #f56024;
                color: white;
              }
            }
            .activeGray {
              background-color: #5a5a5a;
              color: white;
            }
          }
        }
      }
      .liaotianList {
        height: 715px;
        padding: 0 10px 10px 10px;
        font-size: 14px;
        box-sizing: border-box;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .liaotianWarp {
          position: relative;
          .youInfo,
          .myInfo {
            min-height: 60px;
            box-sizing: border-box;
            align-items: center;
            padding: 10px 0;
            color: #555;
            letter-spacing: 1px;
            .context {
              position: relative;
              &::after {
                content: "";
                display: block;
                overflow: hidden;
                height: 0;
                clear: both;
              }
              #myContent {
                position: relative;
              }
              .myChehui {
                position: absolute;
                width: 75px;
                font-size: 12px;
                left: 0;
                top: 0;
                color: #000;
                // border-radius: 5px;
                background-color: #fff;
                box-sizing: border-box;
                z-index: 1;
                border: 1px solid #c4c4c4;
                box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
                cursor: pointer;
                .item {
                  padding: 5px;
                  text-align: center;
                  &:hover {
                    background-color: #e2e2e2;
                  }
                  // &:first-of-type {
                  //   border-top-left-radius: 5px;
                  //   border-top-right-radius: 5px;
                  // }
                  // &:last-of-type {
                  //   border-bottom-left-radius: 5px;
                  //   border-bottom-right-radius: 5px;
                  // }
                }
              }
            }
          }
          .youInfo {
            .myAvatarImg {
              float: left;
              .el-image {
                transition: all 1s;
                width: 50px;
                height: 50px;
                border-radius: 50%;
              }
              &::after {
                content: "";
                display: block;
                height: 0;
                overflow: hidden;
                clear: both;
              }
            }
            .context {
              float: left;
              margin-left: 10px;
              max-width: 285px;
              .youInfoName {
                font-size: 14px;
                padding-bottom: 5px;
                color: #b2b2b2;
              }
              .youTextInfo {
                max-width: 282px;
                min-height: 32px;
                min-width: 32px;
                display: inline-block;
                box-sizing: border-box;
                background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
                border: 1px solid #d2d2d2;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                color: #000;
                border-radius: 10px;
                padding: 5px 10px;
                .msgTypeText {
                  word-wrap: break-word;
                  word-break: break-all;
                  pre {
                    line-height: 20px;
                    white-space: pre-wrap; /* css3.0 */
                    white-space: -moz-pre-wrap; /* Firefox */
                    white-space: -pre-wrap; /* Opera 4-6 */
                    white-space: -o-pre-wrap; /* Opera 7 */
                    word-wrap: break-word; /* Internet Explorer 5.5+ */
                  }
                }
                &::before {
                  content: "";
                  display: block;
                  border-bottom: 9px solid transparent;
                  border-right: 9px solid #d2d2d2;
                  border-top: 9px solid transparent;
                  position: absolute;
                  left: -8px;
                  top: 15px;
                  transform: translate(0, -50%);
                  width: 0;
                  height: 0;
                }
              }
              .msgTypeVideo {
                width: 285px;
                height: 150px;
                left: 50px;
                top: -30px;
                .video-js {
                  width: 100%;
                  height: 100%;
                }
              }
              .msgTypeImage {
                max-width: 150px;
                border: 1px solid #f0eeee;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                left: 50px;
                top: -30px;
                box-sizing: border-box;
                .el-image {
                  width: 100%;
                  height: 100%;
                  position: static;
                  vertical-align: middle;
                }
              }
              .msgTypeAudio {
                background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
                border: 1px solid #d2d2d2;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                display: flex;
                padding: 5px;
                border-radius: 20px;
                img {
                  width: 150px;
                  height: 20px;
                  cursor: pointer;
                }
              }
              .msgTypeTXT {
                display: block;
                width: 285px;
                padding: 10px 20px;
                box-sizing: border-box;
                border: 1px solid #d2d2d2;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                max-height: 80px;
                border-radius: 9px;
                cursor: pointer;
                color: #298cf7;
                .title {
                  font-size: 12px;
                }
                p {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  box-sizing: border-box;
                  cursor: pointer;
                }
              }
            }
            &::after {
              content: "";
              display: block;
              height: 0;
              overflow: hidden;
              clear: both;
            }
          }
          .myInfo {
            .myAvatarImg {
              float: right;
              .el-image {
                transition: all 1s;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #165af7;
                color: #fff;
                .image-slot {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: left;
                }
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .context {
              float: right;
              max-width: 285px;
              margin-right: 10px;
              .youTextInfo {
                .msgTypeText {
                  float: right;
                  max-width: 282px;
                  min-height: 32px;
                  min-width: 32px;
                  box-sizing: border-box;
                  position: relative;
                  background: linear-gradient(
                    #eafad8,
                    #ade44d,
                    #ade44d,
                    #81c40d
                  );
                  box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
                  border: 1px solid #ade44d;
                  color: #000;
                  border-radius: 10px;
                  padding: 5px 10px;
                  &::after {
                    content: "";
                    display: block;
                    border-bottom: 9px solid transparent;
                    border-left: 9px solid #bae973;
                    border-top: 9px solid transparent;
                    position: absolute;
                    right: -8px;
                    top: 15px;
                    transform: translate(0, -50%);
                    width: 0;
                    height: 0;
                  }
                  pre {
                    line-height: 20px;
                    white-space: pre-wrap; /* css3.0 */
                    white-space: -moz-pre-wrap; /* Firefox */
                    white-space: -pre-wrap; /* Opera 4-6 */
                    white-space: -o-pre-wrap; /* Opera 7 */
                    word-wrap: break-word; /* Internet Explorer 5.5+ */
                  }
                }
                &::after {
                  content: "";
                  display: block;
                  overflow: hidden;
                  width: 0;
                  height: 0;
                  clear: both;
                }
              }
              .msgTypeText {
                word-wrap: break-word;
                word-break: break-all;
                pre {
                  line-height: 20px;
                  white-space: pre-wrap; /* css3.0 */
                  white-space: -moz-pre-wrap; /* Firefox */
                  white-space: -pre-wrap; /* Opera 4-6 */
                  white-space: -o-pre-wrap; /* Opera 7 */
                  word-wrap: break-word; /* Internet Explorer 5.5+ */
                }
              }
              .msgTypeVideo {
                width: 285;
                height: 150px;
                left: 50px;
                top: -30px;
                .video-js {
                  width: 100%;
                  height: 100%;
                }
              }
              .msgTypeImage {
                max-width: 150px;
                border: 1px solid #f0eeee;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                left: 50px;
                top: -30px;
                @{deep} .el-image {
                  width: 100%;
                  height: 100%;
                  position: static;
                  vertical-align: middle;
                }
              }
              .msgTypeAudio {
                background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
                border: 1px solid #d2d2d2;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                display: flex;
                padding: 5px;
                border-radius: 20px;
                img {
                  width: 150px;
                  height: 20px;
                  cursor: pointer;
                }
              }
              .msgTypeTXT {
                display: block;
                width: 285px;
                padding: 10px 20px;
                box-sizing: border-box;
                border: 1px solid #d2d2d2;
                box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
                max-height: 80px;
                border-radius: 9px;
                cursor: pointer;
                color: #298cf7;
                .title {
                  font-size: 12px;
                }
                p {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  box-sizing: border-box;
                  cursor: pointer;
                }
              }
              .unRead {
                color: #165af7;
                font-size: 12px;
                text-align: right;
              }
              .read {
                color: #c0c5c9;
                font-size: 12px;
                text-align: right;
              }
            }
            &::after {
              content: "";
              display: block;
              height: 0;
              overflow: hidden;
              clear: both;
            }
          }
        }
      }
      .infoListSend {
        height: 60px;
        background-color: #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .sendBtnBox {
          overflow: hidden;
        }
        .maikef {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        @{deep} .sendValue {
          position: static;
          textarea {
            overflow-x: none;
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            padding: 5px;
          }
        }
        .sendValueInput {
          flex: 1;
          background-color: #fff;
          position: relative;
          .pasteIten {
            position: absolute;
            width: 75px;
            font-size: 12px;
            left: 0;
            top: 0;
            color: #000;
            border-radius: 3px;
            background-color: #fff;
            padding: 5px;
            text-align: center;
            z-index: 1;
            border: 1px solid #c4c4c4;
            box-sizing: border-box;
            box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
            cursor: pointer;
            &:hover {
              background-color: #ecf5ff;
            }
          }
        }
        @{deep} .sendValueBtn {
          flex: 1;
          margin: 0;
          padding: 10px 10px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          vertical-align: top;
        }
        .iconfont {
          width: 40px;
          height: 40px;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          &::before {
            cursor: pointer;
          }
          &:hover {
            color: #409eff;
          }
          &:last-of-type {
            justify-content: left;
            width: 30px;
          }
        }
        .sendfiles {
          position: relative;
          .fileInput {
            position: absolute;
            left: 0;
            top: 50%;
            width: 20px;
            height: 20px;
            font-size: 0;
            padding: 0;
            cursor: pointer;
            opacity: 0;
            transform: translate(0, -50%);
            border: 1px solid #000;
          }
        }
        @{deep} .sendBtn {
          margin-right: 10px;
        }
        @{deep} .show-enter-active,
        @{deep} .show-leave-active {
          transition: margin-right 0.5s;
        }
        @{deep} .show-enter {
          margin-right: -56px;
        }
        @{deep} .show-enter-to,
        .show-leave {
          margin-right: 10px;
        }
        @{deep} .show-leave-to {
          margin-right: -56px;
        }
      }
      .personalNumberTitle {
        width: 100%;
        height: 150px;
        padding: 0 30px;
        box-sizing: border-box;
        background-color: #165af7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .titleTXT {
          box-sizing: border-box;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .numberWarp {
          width: 100%;
          flex: 1;
          padding: 0 20px;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          .myImg {
            margin-right: 10px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #165af7;
            color: #fff;
          }
          .code {
            font-size: 30px;
            color: #165af8;
            font-weight: bold;
          }
        }
        .historyHeaderTop {
          width: 100%;
          flex: 1;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
      .historyWrapContent {
        width: 100%;
        height: 150px;
        padding: 0 20px;
        box-sizing: border-box;
        background-color: #165af7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .titleTXT {
          color: white;
          text-align: center;
          padding: 20px;
        }
        .bigHistoryHeaderTop {
          width: 100%;
          flex: 1;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          justify-content: space-between;
          .changshang,
          .huohao,
          .kehu,
          .shijian {
            height: 100%;
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: center;
            .text,
            .icon {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon {
              margin-bottom: 5px;
              i {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }
          }
          .changshang {
            position: relative;
            .icon {
              i {
                background: url("~@/assets/images/工厂.png") no-repeat center;
                background-size: cover;
                border-radius: 0;
              }
            }
            &::before {
              content: "";
              position: absolute;
              height: 20px;
              width: 2px;
              right: -1px;
              top: 50%;
              background-color: #bfbfbf;
              transform: translate(0, -50%);
            }
          }
          .huohao {
            .icon {
              i {
                background: url("~@/assets/images/编号@2x (1).png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .kehu {
            position: relative;
            &::before,
            &::after {
              content: "";
              position: absolute;
              height: 20px;
              width: 2px;
              top: 50%;
              background-color: #bfbfbf;
              transform: translate(0, -50%);
            }
            &::before {
              left: -1px;
            }
            &::after {
              right: -1px;
            }
            .icon {
              i {
                background: url("~@/assets/images/客户@2x (1).png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .shijian {
            .icon {
              i {
                background: url("~@/assets/images/时间@2x (1).png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
        }
      }
      .historyWrapBody {
        font-size: 14px;
        border: none;
        height: 675px;
        width: 100%;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          border: none;
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f2f2f2;
          span {
            flex: 1;
            text-align: center;
          }
        }
      }
      .rankingWrapContent {
        width: 100%;
        height: 150px;
        padding: 0 20px;
        box-sizing: border-box;
        background-color: #165af7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .titleTXT {
          color: white;
          text-align: center;
          padding: 20px;
        }
        .bigRankingHeaderTop {
          width: 100%;
          flex: 1;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          justify-content: space-between;
          .changshang,
          .huohao,
          .zeyangshu,
          .name {
            height: 100%;
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: center;
            .text,
            .icon {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon {
              margin-bottom: 5px;
              i {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }
          }
          .changshang {
            .icon {
              i {
                background: url("~@/assets/images/工厂.png") no-repeat center;
                background-size: cover;
                border-radius: 0;
              }
            }
          }
          .huohao {
            position: relative;
            &::before,
            &::after {
              content: "";
              position: absolute;
              height: 20px;
              width: 2px;
              top: 50%;
              background-color: #bfbfbf;
              transform: translate(0, -50%);
            }
            &::before {
              left: -1px;
            }
            &::after {
              right: -1px;
            }
            .icon {
              i {
                background: url("~@/assets/images/编号@2x (1).png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .name {
            .icon {
              i {
                background: url("~@/assets/images/名称@2x.png") no-repeat center;
                background-size: contain;
              }
            }
          }
          .zeyangshu {
            .icon {
              i {
                background: url("~@/assets/images/数据@2x.png") no-repeat center;
                background-size: contain;
              }
            }
          }
        }
      }
      // 我的产品下拉
      .myProductWrapBody{
        font-size: 14px;
        border: none;
        height: 675px;
        width: 100%;
        overflow-x: none;
        overflow-y: scroll;
        justify-content: space-evenly;
        &::-webkit-scrollbar {
            display: none;
        }
        /** 单独为横向和竖向设置滚动条 **/
        .itemBox{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: space-evenly;
          .itemCube{
            width: 46%;
            height: 260px;
            margin: 5px 0;
            overflow: hidden;
            border: 1px solid #DCDCDC;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .imgItem{
              width: 100%;
              height: 175px;
              @{deep} .el-image{
                width: 100%;
                height: 100%;
                img{
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .context{
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              .contextItem{
                box-sizing: border-box;
                padding: 0 10px;
                .price {
                  color: #ff0000;
                }
              }
            }
          }
          .itemList {
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-radius: 10px;
            margin: 5px 10px;
            overflow: hidden;
            cursor: pointer;
            height: 250px;
            .imgItemLeft{
              flex: 1;
              display: flex;
              align-items: center;
              position: relative;
              .el-image{
                width: 100%;
              }
              .date{
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                color: #626262;
                i {
                  display: block;
                  margin-right: 5px;
                  width: 14px;
                  height: 14px;
                  background: url('~@/assets/images/时间.png') no-repeat center;
                  background-size: contain;
                }
              }
            }
            .context{
              flex: 2;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              color: #626262;
              .contextItem{
                box-sizing: border-box;
                padding-left: 5px;
                .price {
                  color: #ff0000;
                }
                &.productName {
                  color: #000;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
      .rankingWrapBody {
        font-size: 14px;
        border: none;
        height: 675px;
        width: 100%;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          border: none;
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f2f2f2;
          padding: 0 20px;
          .item {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 5px;
          }
          .imgItem {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 5px;
            @{deep} .el-image {
              cursor: pointer;
            }
          }
        }
      }
      .personalNumberContent {
        flex: 1;
        background-color: #fff;
        display:flex;
        flex-direction: column;
        .currentCode,
        .buyer {
          // margin-top: 5px;
          background-color: #f6f9ff;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          .left {
            font-weight: bold;
            position: relative;
            span {
              margin-left: 30px;
            }
            &::before {
              content: "";
              position: absolute;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: url("~@/assets/images/排号.png") no-repeat center;
              background-size: contain;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
          .right {
            color: #888888;
          }
        }
        .buyer {
          .left {
            &::before {
              content: "";
              position: absolute;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: url("~@/assets/images/采购商.png") no-repeat center;
              background-size: contain;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
        }
        .buyerContent {
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
          height: 315px;
          overflow: auto;
          font-size: 14px;
          .buyerItem {
            width: 100%;
            height: 50px;
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;
            .title {
              color: #333;
            }
            .date {
              color: #555;
            }
          }
        }
      }
      @{deep} .myTables {
        @{deep} .el-table__body-wrapper::-webkit-scrollbar {
          /*width: 0;宽度为0隐藏*/
          width: 0;
        }
      }
    }
  }
}
.showLiaotianList {
  position: relative;
  .infoListTitle {
    background: linear-gradient(#ccc, #fff, #a5b6c8, #7f90c5);
  }
  .isOrder {
    position: absolute;
    width: 96%;
    left: 50%;
    top: 50px;
    transform: translate(-50%, 0);
    border: 1px solid #73add8;
    border-radius: 20px;
    background-color: rgba(230, 230, 230, 0.9);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
    z-index: 1;
    cursor: pointer;
    .guanbi {
      display: block;
      width: 15px;
      height: 15px;
      border: 1px solid #ccc;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 15px;
      &:hover {
        color: #2c97ff;
        border-color: #2c97ff;
      }
    }
    .tupian {
      width: 60px;
      height: 60px;
      background-color: #ddd;
      border-radius: 20px;
      overflow: hidden;
      .el-image {
        width: 60px;
        height: 60px;
      }
    }
    .wenzitxt {
      flex: 1;
      color: #273d6c;
      padding: 0 20px 0 10px;
      h4 {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      p {
        color: black;
        font-size: 12px;
        margin-top: 3px;
      }
      &:last-of-type p {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .isOrder2 {
    position: absolute;
    width: 96%;
    left: 50%;
    top: 50px;
    transform: translate(-50%, 0);
    border: 1px solid #73add8;
    border-radius: 20px;
    background-color: rgba(230, 230, 230, 0.9);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
    z-index: 1;
    cursor: pointer;
    .left {
      width: 80px;
      height: 80px;
      @{deep} .el-image {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        img {
          width: 80px;
          height: 80px;
          transition: all 1s;
        }
      }
    }
    .right {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h3 {
        color: #165af7;
      }
    }
    .guanbi {
      display: block;
      width: 15px;
      height: 15px;
      border: 1px solid #ccc;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 15px;
      &:hover {
        color: #2c97ff;
        border-color: #2c97ff;
      }
    }
  }
}
@{deep} .TXTClass {
  .el-dialog {
    height: 840px;
    color: red;
    overflow: auto;
    position: relative;
    .el-dialog__body {
      max-height: 650px;
      width: 600px;
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: scroll;
      border: 2px solid rgb(231, 231, 231);
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
// 我发布的朋友圈
.findList {
  position: relative;
  width: 32%;
  padding-top: 100px;
  border: 1px solid #ccc;
  height: 827px;
  box-sizing: border-box;
  .sendFind {
    width: 100%;
    height: 100px;
    background-color: #f6f6f6;
    border-radius: 0 0 20px 20px;
    margin-top: -100px;
    display: flex;
    justify-content: space-between;
    .sendFindItem {
      width: 33.333%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      align-self: center;
      text-align: center;
      cursor: pointer;
      .iconImg {
        width: 100%;
        img {
          transition: all 1s;
          border-radius: 50%;
        }
      }
      .txt {
        width: 100%;
      }
      &:hover {
        .iconImg {
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
  .findItems {
    width: 100%;
    height: 725px;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .findItem {
      width: 100% !important ;
      border: none !important ;

      .topLayout {
        display: flex;
        align-items: center;
        vertical-align: top;
        padding: 5px;
        .img {
          .findImage {
            width: 40px;
            height: 40px;
            background-color: #165af7;
            color: white;
            border-radius: 50%;
          }
        }
        .title {
          margin-left: 10px;
          color: #48639f;
          span {
            color: #ccc;
            font-size: 12px;
          }
        }
        i {
          float: right;
        }
      }
      .imgComtent {
        margin-left: 50px;
        margin-bottom: 5px;
        width: 300px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &::after {
          content: "";
          width: 30%;
        }
        .img {
          width: 30%;
          height: 90px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
      .ContentText {
        margin-left: 50px;
        margin-bottom: 10px;

        display: flex;
        em {
          flex: 5;
        }
        span {
          flex: 1;
          color: #48639f;
          font-size: 12px;
          cursor: pointer;
          text-align: center;
        }
      }
      .dateInDelet {
        margin-left: 50px;
        font-size: 12px;
        color: #ccc;
        display: flex;
        justify-content: space-between;
        .deleteBtn {
          margin-left: 20px;
          cursor: pointer;
          color: #48639f;
        }
        .attrs {
          margin-left: 50px;
          font-size: 14px;
        }
        .like {
          float: right;
          span {
            margin-right: 30px;
            cursor: pointer;
            i {
              font-size: 18px;
            }
            em {
              font-size: 16px;
              margin-left: 10px;
            }
          }
          .pinglun {
            position: relative;
            .pinglunOptions {
              position: absolute;
              width: 100px;
              height: 50px;
              border: 1px solid #000;
              border-radius: 10px;
            }
          }
        }
      }
      .reply {
        background-color: #eeeeed;
        margin-left: 50px;
        width: 300px;
        box-sizing: border-box;
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        span {
          color: #48639f;
        }
      }
    }
    // 回到顶部
    .huidaodingbu {
      position: absolute;
      top: -47px;
      right: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: #409eff;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.22);
      cursor: pointer;
      &:hover {
        background-color: #f2f6fc;
      }
    }
  }
}
// 发朋友圈样式
.sendGonggaoBox {
  background-color: #fff !important;
}
.sendGonggao {
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px 5px;
  box-sizing: border-box;
  .txtWrap {
    padding: 0;
    @{deep} .el-input__count{
      bottom: -5px;
      line-height: normal;
      padding: 0 5px;
    }
  }
  .gonggaoImgList {
    .imgsItem {
      padding-left: 12px;
      @{deep} img {
        width: 102px;
        height: 102px;
      }
      @{deep} video {
        width: 102px;
        height: 102px;
      }
      &::v-deep li.el-upload-list__item.is-ready {
        width: 30%;
        height: 102px;
      }
      &::v-deep .el-upload.el-upload--picture-card {
        width: 102px;
        height: 102px;
        line-height: 102px;
        text-align: center;
      }
    }
  }
  .sendGonggaoBtn {
    text-align: center;
    margin: 20px 0;
    .sendBtn {
      width: 80%;
      border-radius: 20px;
    }
  }
}
.btnLists {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
@{deep} .yesOrderTitle {
  display: flex;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.myRadios {
  @{deep} .el-radio {
    font-size: 30px;
    display: flex;
    align-items: center;
    margin: 20px;
    .el-radio__label{
     .el-avatar {
      vertical-align: top;
      margin-right: 10px;
      }
    }
    .el-radio__label,
    .is-checked,
    .el-radio__inner {
      display: flex;
      align-items: center;
    }
  }
}
.tongxunlu {
  .title {
    margin-bottom: 20px;
    font-weight: 600;
  }
}
.tongxunluLianxiren {
  max-height: 430px;
  overflow: auto;
  .myCheckBox {
  .el-checkbox {
    font-size: 30px;
    display: flex;
    align-items: center;
    margin: 20px;
    @{deep} .el-checkbox__label, @{deep} .el-checkbox__input{
      display: flex;
      align-items: center;
      .el-image {
      transition: all 0.5s;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 50%;
      background-color: #165af7;
      color: white;
      }
    }
    
    &:hover {
      @{deep} .el-image {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
    .el-checkbox__label,
    .is-checkbox,
    .el-checkbox__inner {
      display: flex;
      align-items: center;
      border-radius: 50%;
    }
  }
}
}
.zanwushuju1 {
  width: 100%;
  height: 382px;
  margin: 0 auto;
  background: url("~@/assets/images/暂无数据.png") no-repeat center;
  background-size: 100%;
  position: absolute;
  left: 0;
}
.querenDialog {
  font-size: 16px;
  .title {
    color: #165af7;
    font-weight: bold;
  }
  .titleText,
  .title {
    padding-bottom: 20px;
    color: black;
  }
  .btns {
    .blueBtn {
      color: #165af7;
      border-color: #165af7;
      &.activeBlue {
        background-color: #165af7;
        color: white;
      }
    }
    .orangeBtn {
      color: #f56024;
      border-color: #f56024;
      &.activeOrange {
        background-color: #f56024;
        color: white;
      }
    }
    .activeGray {
      background-color: #5a5a5a;
      color: white;
    }
  }
}
.companyAddrMapBox{
  height:500px;
}
</style>
