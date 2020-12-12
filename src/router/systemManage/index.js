const SystemParams = () => import('@/views/systemManage/SystemParams.vue')
const RoleManage = () => import('@/views/systemManage/RoleManage.vue')
const MenuManage = () => import('@/views/systemManage/MenuManage.vue')
const ClientManage = () => import('@/views/systemManage/ClientManage.vue')
const CategoryMan = () => import('@/views/systemManage/categoryMan.vue')
const ReportReview = () => import('@/views/systemManage/reportReview.vue')
const AppVersion = () => import('@/views/systemManage/appVersion.vue')
const ErrorLog = () => import('@/views/systemManage/errorLog.vue')
const SMSMan = () => import('@/views/systemManage/SMSMan.vue')
const CateAllocation = () => import('@/views/systemManage/cateAllocation.vue')
const TouristMan = () => import('@/views/systemManage/touristMan.vue')

export default [
  {
    path: '/systemParams',
    name: 'SystemParams',
    component: SystemParams
  },
  {
    path: '/roleManage',
    name: 'RoleManage',
    component: RoleManage
  },
  {
    path: '/menuManage',
    name: 'MenuManage',
    component: MenuManage
  },
  {
    path: '/clientManage',
    name: 'ClientManage',
    component: ClientManage
  },
  {
    path: '/categoryMan',
    name: 'categoryMan',
    component: CategoryMan
  },
  {
    path: '/reportReview',
    name: 'reportReview',
    component: ReportReview
  },
  {
    path: '/appVersion',
    name: 'appVersion',
    component: AppVersion
  },
  {
    path: '/errorLog',
    name: 'errorLog',
    component: ErrorLog
  },
  {
    path: '/SMSMan',
    name: 'SMSMan',
    component: SMSMan
  },
  {
    path: '/cateAllocation',
    name: 'cateAllocation',
    component: CateAllocation
  },
  {
    path: '/touristMan',
    name: 'touristMan',
    component: TouristMan
  }
]
