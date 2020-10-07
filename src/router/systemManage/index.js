const SystemParams = () => import('@/views/systemManage/SystemParams.vue')
const RoleManage = () => import('@/views/systemManage/RoleManage.vue')
const MenuManage = () => import('@/views/systemManage/MenuManage.vue')
const ClientManage = () => import('@/views/systemManage/ClientManage.vue')
const SendAudit = () => import('@/views/systemManage/SendAudit.vue')
const EmployeeMan = () => import('@/views/systemManage/EmployeeMan.vue')
const ReportReview = () => import('@/views/systemManage/reportReview.vue')
const AppVersion = () => import('@/views/systemManage/appVersion.vue')

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
    path: '/sendAudit',
    name: 'SendAudit',
    component: SendAudit
  },
  {
    path: '/employeeMan',
    name: 'EmployeeMan',
    component: EmployeeMan
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
  }
]
