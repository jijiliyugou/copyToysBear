/** 前台模块 */
import beforeModule from './beforrIndex/index'
/** 我的消息模块 */
import meInfo from './meInfo/index'
/** 订单管理模块 */
import orderManage from './orderManage/index'
/** 动态模块 */
import dynamicRouting from './dynamicRouting/index'
/** 个人中心模块 */
import me from './me/index'
/** 404模块 */
import _404 from './404/index'
/** ERP模块 */
import ERP from './ERP/index'
/** 报价分享 */
const QuoteSharing = () => import('@/components/quoteSharing.vue')
/** 特殊搜索路由 */
const SearchIndex = () => import('@/views/productSearch/searchIndex.vue')
/** 静态路由 */
export const staticRouters = [
  beforeModule,
  orderManage,
  me,
  meInfo,
  {
    path: '/searchIndex',
    name: 'searchIndex',
    component: SearchIndex
  },
  {
    path: '/quoteSharing',
    name: 'quoteSharing',
    component: QuoteSharing
  },
  _404,
  ...ERP,
  {
    path: '/',
    redirect: '/beforeIndex/home'
  }
]

export async function setMenuTree (menuTree) {
  const routerList = []
  if (menuTree) {
    for (let i = 0; i < menuTree.length; i++) {
      for (let j = 0; j < menuTree[i].children.length; j++) {
        for (const value of dynamicRouting) {
          if (value.path === menuTree[i].children[j].linkUrl) {
            routerList.push(value)
          }
        }
      }
    }
  }
  routerList.push({
    path: '*',
    redirect: '/404'
  })
  return routerList
}
