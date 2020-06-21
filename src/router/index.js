import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
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
        }
      ]
    }
  ]
})
