<template>
  <div class="box">
    <div class="search">
      <el-input
        class="searchInput"
        prefix-icon="iconfont icon-sousuo"
        v-model="search"
        placeholder="搜索"
      ></el-input>
    </div>
    <div class="organizationContent">
      <div class="organizationItem" v-if="Organization">
        <div
          class="parent"
          @click="showorganizationItem(Organization.companyNumber)"
        >
          <el-image
            :src="Organization.companyLogo"
            class="myAvatar"
            fit="cover"
          >
            <div
              slot="error"
              class="image-slot"
              style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
            >
              {{ Organization.companyName }}
            </div>
          </el-image>
          <p>{{ Organization.companyName }}</p>
        </div>
        <el-collapse-transition>
          <ol class="items" v-show="show3">
            <li
              class="item"
              v-for="(item, i) in orgList"
              :key="i"
              @click="sendInfo(Organization.id, item.id)"
            >
              <el-image
                :src="item.userImage"
                class="myAvatar"
                :key="item.userImage"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ item.linkman }}
                </div>
              </el-image>
              <p>{{ item.linkman }}</p>
            </li>
          </ol>
        </el-collapse-transition>
      </div>
      <hr />
      <div
        class="contactPerson"
        v-if="this.userInfo && this.userInfo.commparnyList"
      >
        <div
          class="parent"
          @click="showcontactPerson('Exhibition')"
          v-show="
            this.userInfo.commparnyList &&
              this.userInfo.commparnyList.length &&
              this.userInfo.commparnyList[0].companyType  !==  'Exhibition'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/zhanting.png')"
          ></el-avatar>
          <p>展厅联系人</p>
        </div>
        <div
          class="parent"
          @click="showcontactPerson('Supplier')"
          v-show="
            this.userInfo.commparnyList &&
              this.userInfo.commparnyList.length &&
              this.userInfo.commparnyList[0].companyType  !==  'Supplier'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/lianxiren.png')"
          ></el-avatar>
          <p>供应商联系人</p>
        </div>
        <div
          class="parent"
          @click="showcontactPerson('Sales')"
          v-show="
            this.userInfo.commparnyList &&
              this.userInfo.commparnyList.length &&
              this.userInfo.commparnyList[0].companyType  !==  'Sales'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/gongsilianxi.png')"
          ></el-avatar>
          <p>公司联系人</p>
        </div>
      </div>
      <h3>常用联系人</h3>
      <div
        class="oftenContact"
        v-for="(item, i) in regularContact"
        :key="i"
        @click="sendInfo(item.companyId, item.id)"
      >
        <el-image
          :src="item.userImage"
          class="myAvatar"
          :key="item.userImage"
          fit="cover"
        >
          <div
            slot="error"
            class="image-slot"
            style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
          >
            {{ item.linkman }}
          </div>
          <div
            slot="placeholder"
            class="image-slot"
            style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
          >
            {{ item.linkman }}
          </div>
        </el-image>
        <em>{{ item.linkman }}</em>
        <i v-if="item.isFocus" class="iconfont icon-wujiaoxing"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      show3: false,
      search: '',
      Organization: {},
      orgList: [],
      regularContact: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    showorganizationItem (val) {
      this.show3 = !this.show3
      this.sendCompany(val)
    },
    // 点击公司查看公司详情
    sendCompany (val) {
      this.$emit('showCompany', {
        id: val,
        type: 'showCompany',
        active: 1
      })
    },
    // 打开对应联系公司列表
    showcontactPerson (val) {
      this.$emit('showCompanyList', {
        listType: val,
        type: 'showCompanyList',
        active: 1,
        id: this.userInfo.commparnyList[0].commparnyId
      })
    },
    handleNodeClick (data) {},
    // 获取组织架构
    async getOrgList () {
      const res = await this.$http.post('/api/OrgList', {})
      if (res.data.result.code === 200) {
        this.Organization = res.data.result.item.orgCompany
        this.orgList = res.data.result.item.personnes
      }
    },
    // 获取对应联系公司
    // async getContactList() {
    //   let res = await this.$http.post("/api/ContactsCompanyListByID", {
    //     companyID: this.userInfo.commparnyList[0].commparnyId,
    //     OppositeRole: this.userInfo.commparnyList[0].companyType
    //   });
    // },
    // 获取常用联系人
    async getContactListPerson () {
      const res = await this.$http.post('/api/OrgPersonnelPage', {
        id: this.userInfo.userInfo.id,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.regularContact = res.data.result.item.items
      }
    },
    // 点击架构的联系人
    sendInfo (companyId, id) {
      this.$emit('showInfo', {
        id: id,
        companyId: companyId,
        active: 1,
        type: 'showInfo'
      })
    }
  },
  mounted () {
    this.getOrgList()
    // this.getContactList();
    this.getContactListPerson()
    this.$root.eventHub.$on('UpdateOrgPersonnel', () => {
      this.getOrgList()
      this.getContactListPerson()
    })
  },
  beforeDestroy () {
    this.$root.eventHub.$off('UpdateOrgPersonnel')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.box {
  padding: 0 5px;
  height: 769px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.search {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
  @{deep} .searchInput input.el-input__inner {
    border-radius: 20px;
    border: none;
    background-color: #eceeef;
  }
}

.organizationContent {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 0 20px 0;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  .organization {
    .myTree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .el-checkbox {
      display: none;
    }
    .myAvatar,
    .myTree {
      float: left;
    }
    .myAvatar {
      color: white;
      background-color: #165af7;
    }

    .myTree {
      margin-top: 10px;
    }

    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .organizationItem {
    width: 100%;
    left: 0;
    padding: 5px;
    cursor: pointer;
    box-sizing: border-box;
    .parent {
      display: flex;
      align-items: center;
      height: 40px;
      @{deep} .myAvatar {
        margin-right: 10px;
        color: white;
        background-color: #165af7;
        transition: all 1s;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      &:hover {
        .myAvatar {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
    .items {
      margin-left: 40px;
      font-size: 14px;
      li.item {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        height: 30px;
        padding: 10px 0;
        .myAvatar {
          margin-right: 10px;
          color: white;
          background-color: #165af7;
          transition: all 1s;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        &:hover {
          .myAvatar {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }
  hr {
    height: 10px;
    background-color: #f2f5f6;
    border: none;
  }
  .el-tree-node__expand-icon {
    border: 0;
    /*自定义，必要时用!important*/
  }
  .contactPerson {
    width: 100%;
    left: 0;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
    .parent {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 10px 0;
      .myAvatar {
        margin-right: 10px;
        color: white;
        background-color: #165af7;
        transition: all 1s;
      }
      &:hover {
        .myAvatar {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
  h3 {
    font-size: 16px;
    font-weight: 700;
  }
  .oftenContact {
    padding: 5px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    box-sizing: border-box;
    cursor: pointer;
    .myAvatar {
      color: white;
      background-color: #165af7;
      transition: all 1s;
      margin-right: 10px;
      color: white;
      background-color: #165af7;
      transition: all 1s;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    &:hover {
      .myAvatar {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
    em {
      margin: 0 10px;
    }
    i {
      color: #ff6060;
    }
  }
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg) !important;
    transform: rotate(0deg) !important;
  }
  .el-icon-caret-right:before {
    // 加号图片
    content: "" !important;
    font-size: 16px;
  }
  .expanded:before {
    // 减号图片
    content: "" !important;
    font-size: 16px;
  }
  // 叶子类目不要图标
  .is-leaf.el-tree-node__expand-icon.el-icon-caret-right:before {
    content: "" !important;
    font-size: 16px;
  }
}
</style>
