// import AgoraRTM from "agora-rtm-sdk";
// import { Message } from 'element-ui';
// const state = {
//   signalROptions: {
//     // 深网配置
//     value: "",
//     addId: "5de91f02f12c41c2b276c9accb4679c7",
//     userName: "",
//     token: "",
//     channelValue: "",
//     showmsg: [],
//     showB2nMsg: [],
//     creatChannel: null,
//     uid: "",
//     client: null
//   }
// };
// const mutations = {
//   // 登录
//   loginAgoraRTM(state) {
//     // RtmClient 实例化
//     state.signalROptions.client = AgoraRTM.createInstance(
//       state.signalROptions.addId
//     );
//     // 通过监听 RtmClient 上的 ConnectionStateChanged 事件可以获得 SDK 连接状态改变的通知
//     state.signalROptions.client.on(
//       "ConnectionStateChanged",
//       (newState, reason) => {
//         console.log("连接状态更改为  " + newState + " 原因: " + reason);
//         Message.success("AgoraRTM客户端连接成功");
//       }
//     );
//     // 登录
//     state.signalROptions.client
//       .login({
//         token: state.signalROptions.token,
//         uid: state.signalROptions.uid
//       })
//       .then(() => {
//         Message.success("AgoraRTM客户端登录成功");
//       })
//       .catch(err => {
//         console.log("AgoraRTM客户端登录失败", err);
//         Message.error("AgoraRTM客户端登录失败");
//       });
//   },
//   // 登出
//   signOut(state) {
//     if (state.signalROptions.client && state.signalROptions.client.logout) {
//       state.signalROptions.client.logout();
//       Message.success("登出成功");
//     }
//   }
// };
// const actions = {
//   login({ state, commit, rootState }) {
//     state.signalROptions.uid = rootState.userInfo.uid;
//     commit("loginAgoraRTM", state);
//   }
// };
// const getters = {};

// // 不要忘记把state, mutations等暴露出去。
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters
// };
