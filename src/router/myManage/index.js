const MyCustomer = () => import('@/views/myManage/myCustomer.vue')
const MyProduct = () => import('@/views/myManage/myProduct.vue')
const ProductMan = () => import('@/views/systemManage/productMan.vue')
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
  }
]
