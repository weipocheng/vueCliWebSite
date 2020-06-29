// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap'


import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'

Vue.use(VueAxios, axios);
Vue.use(require('vue-moment'));
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

Vue.component('Loading', Loading);
Vue.filter('currency',currencyFilter);//透過 Vue.filter 做全域註冊，讓所有的 Vue 元件都可以使用 currency.js 的判斷來轉換格式
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to,from,next) => {
  console.log('TO:',to,'FROM:',from,'NEXT:',next);
  if(to.meta.requiresAuth==true){
    const api=`${process.env.APIPATH}/api/user/check`;
    const vm=this;

    axios.post(api).then((response) => {
      // console.log(response.data);
      if(response.data.success == true) {
        next();
      }else{
        alert('未登入，請重新登入。');
        next({
          path: '/login'
        });
      }
    });
  }else{
    next();
  }
});
//判斷是否有登入，如果"to"是要前往首頁(helloworld)，那就會傳回"meta.requiresAuth"為true(因為helloworld頁面會回傳此值為true => 參考index.js)，
//if requiresAuth==true 代表需要進行驗證，確認是否已經登入過。透過api查看登入資料，如果response.data.success為true代表已經登入過，
//則放行前往首頁，如果為false，則前往login頁面。最後 if requiresAuth==false 則不需要進行驗證。