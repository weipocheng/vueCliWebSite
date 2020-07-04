<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th width="200">購買款項</th>
          <th width="120">應付金額</th>
          <th width="90">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in orders" :key="index">
          <td>{{item.create_at*1000 | moment("YYYY-MM-DD") }}</td>
          <td>{{item.user.email}}</td>
          <td>
            <ul class="list-group">
              <li v-for="(product,key) in item.products" :key="key" class="list-group-item">
                {{product.product.title}} 數量 {{product.qty}} {{product.product.unit}} 
              </li>
            </ul>
          </td>
          <td>{{item.total}}元</td>
          <td v-if="item.is_paid == true" class="text-success">已付款</td>
          <td v-else class="text-danger">尚未付款</td>
        </tr>
      </tbody>
    </table>

    <Pagination :pages="pagination" @fromChild="getOrders"></Pagination>
  </div>
</template>

<script>
import $ from "jquery"; //在此元件注入jquery 才能運行
import Pagination from "../Pagination"; //注入分頁元件


export default {
  data() {
    return {
      products: [], //儲存資料庫產品資料
      orders: [], //儲存資料庫訂單列表  每個陣列元素代表一筆訂單
      pagination: {}, //分頁資料
      isLoading: false
    };
  },
  components: {
    Pagination
  },
  methods: {
    getOrders: function(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true; //在重新渲染畫面時出現loading
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.orders = response.data.orders;
        console.log(vm.orders);
        vm.isLoading = false; //渲染成功後改為false取消
        vm.pagination = response.data.pagination; //將資料庫的分頁資料存入
      });
    }
  },
  created() {
    this.getOrders();
    console.log("created:"+this.products);
  }
};
</script>