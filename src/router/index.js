import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import Orders from '@/components/pages/Orders';
import customerOrders from '@/components/pages/CustomerOrders';
import customerCheckout from '@/components/pages/CustomerCheckout';
import Coupons from '@/components/pages/Coupons'; 
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',//如果用戶打入的網址為不存在的頁面就會自動導向登入頁面
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: {requiresAuth: true}//路由驗證訊息
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Product',
          component: Products,
          meta: {requiresAuth: true},//路由驗證訊息
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {requiresAuth: true},//路由驗證訊息
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: {requiresAuth: true},//路由驗證訊息
        }
      ]
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: customerOrders
        },
        {
          path: 'customer_Checkout/:orderId',//orderId為自定義名稱  對應CutomerCheckout.vue的this.$route.params.orderId
          name: 'customerCheckout',
          component: customerCheckout
        },
      ]
    }
  ]
})
