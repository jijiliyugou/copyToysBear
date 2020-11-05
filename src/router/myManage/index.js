const MyCustomer = () => import('@/views/myManage/myCustomer.vue')
const MyProduct = () => import('@/views/myManage/myProduct.vue')
const ProductMan = () => import('@/views/myManage/productMan.vue')
const CompanyMan = () => import('@/views/myManage/companyMan.vue')
const AdvertisingMan = () => import('@/views/myManage/advertisingMan.vue')
export default [
  {
    path: '/myCustomer',
    name: 'myCustomer',
    component: MyCustomer
  },
  {
    path: '/myProduct',
    name: 'myProduct',
    component: MyProduct
  },
  {
    path: '/productMan',
    name: 'productMan',
    component: ProductMan
  },
  {
    path: '/advertisingMan',
    name: 'advertisingMan',
    component: AdvertisingMan
  },
  {
    path: '/companyMan',
    name: 'companyMan',
    component: CompanyMan
  }
]
