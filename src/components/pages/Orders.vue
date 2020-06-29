<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th width="160">購買款項</th>
          <th width="120">應付金額</th>
          <th width="90">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{item.create_at*1000 | moment("YYYY-MM-DD") }}</td>
          <td>{{item.user.email}}</td>
          <td>
            <ul class="list-group">
              <li v-for="(product,key) in item.products" :key="key" class="list-group-item">
                {{product.product_id}}
              </li>
            </ul>
          </td>
          <td></td>
          <td v-if="item.is_paid == true" class="text-success">已付款</td>
          <td v-else class="text-muted">尚未啟用</td>
        </tr>
      </tbody>
    </table>

    <Pagination :pages="pagination" @fromChild="getList"></Pagination>
  </div>
</template>

<script>
import $ from "jquery"; //在此元件注入jquery 才能運行
import Pagination from "../Pagination"; //注入分頁元件


export default {
  data() {
    return {
      products: [], //儲存資料庫產品資料
      list: [], //儲存資料庫訂單列表  每個陣列元素代表一筆訂單
      pagination: {}, //分頁資料
      isLoading: false
    };
  },
  components: {
    Pagination
  },
  computed: {
    
  },
  methods: {
    getProducts: function() {
      const vm = this;
      const productsApi = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products`;
      this.$http.get(productsApi).then(response => {
        vm.products = response.data.products;
        console.log(vm.products);
      });
    },
    getList: function(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true; //在重新渲染畫面時出現loading
      this.$http.get(api).then(response => {
        // vm.list = response.data.products;
        vm.list.push(
          {
            create_at: 1523539834,
            id: "-L9u2EUkQSoEmW7QzGLF",
            is_paid: true,
            message: "這是留言",
            paid_date: 1523539924,
            payment_method: "credit_card",
            products: [
              {
                id: "L8nBrq8Ym4ARI1Kog4t",
                product_id: "-MAQE6RTAqZClUSJy5O4",
                qty: "3"
              },
              {
                id: "L8nBrq8Ym4ARI1Kog4t",
                product_id: "-MARe6KX7qHYcLERTtKG",
                qty: "3"
              }
            ],
            total: 100,
            user: {
              address: "kaohsiung",
              email: "test@gmail.com",
              name: "test",
              tel: "0912346768"
            },
            num: 1
          },
          {
            create_at: 1523539519,
            id: "-L9u11NAE0m0SpSBUDIq",
            is_paid: false,
            message: "這是留言",
            payment_method: "credit_card",
            products: [
              {
                id: "L8nBrq8Ym4ARI1Kog4t",
                product_id: "-MAQE-jAzbcct-L2V1kd",
                qty: "3"
              },
              {
                id: "L8nBrq8Ym4ARI1Kog4t",
                product_id: "-MARdzkWVVbQ1yuTH7BX",
                qty: "3"
              }
            ],
            user: {
              address: "kaohsiung",
              email: "test123465@gmail.com",
              name: "test",
              tel: "0912346768"
            },
            num: 2
          }
        );
        console.log(vm.list);
        vm.isLoading = false; //渲染成功後改為false取消
        vm.pagination = response.data.pagination; //將資料庫的分頁資料存入
      });
    }
  },
  created() {
    this.getProducts();
    this.getList();
    console.log("created:"+this.products);
  },
  mounted() {
    console.log("mounted:"+this.products);
  },
  updated(){
    console.log("upadted:"+this.products);
  }
};
</script>