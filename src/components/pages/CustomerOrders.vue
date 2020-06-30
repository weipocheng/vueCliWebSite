<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="(item,key) in products" :key="key">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
              <del class="h6" v-if="item.price">{{item.origin_price}}</del>
              <div class="h5" v-if="item.price">{{item.price}}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem == item.id"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click.prevent="addtoCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem == item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <div class="container">
      <table class="table mt-4 text-center" style="width: 50%;margin: 0 auto;">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cart,key) in carts.carts" :key="key">
            <td>
              <button class="btn btn-outline-danger" @click.prevent="delCartItem(cart.id)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
            <td>
              {{cart.product.title}}
              <div class="text-success" v-if="cart.coupon">已套用優惠券</div>
            </td>
            <td>{{cart.qty}}/{{cart.product.unit}}</td>
            <td>{{cart.total}} 元</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>總計</td>
            <td>{{carts.total}} 元</td>
          </tr>
          <tr v-if="carts.final_total!==carts.total">
            <td></td>
            <td></td>
            <td class="text-success">折扣價</td>
            <td class="text-success">{{carts.final_total}} 元</td>
          </tr>
        </tbody>
      </table>
      <div class="input-group mb-3" style="width: 50%;margin: 0 auto;">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
        </div>
      </div>

      <div class="my-5 row justify-content-center">
        <form class="col-md-6" @submit.prevent="createOrder">
          <div class="form-group">
            <label for="useremail">Email</label>
            <input
              type="email"
              class="form-control"
              name="email"
              id="useremail"
              v-model="form.user.email"
              placeholder="請輸入 Email"
              v-validate="'required|email'"
              :class="{'is-invalid': errors.has('email')===true}"
            />
            <span class="text-danger" v-if="errors.has('email')===true">{{errors.first('email')}}</span>
          </div>

          <div class="form-group">
            <label for="username">收件人姓名</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="username"
              v-model="form.user.name"
              placeholder="輸入姓名"
              v-validate="'required'"
              :class="{'is-invalid': errors.has('name')===true}"
            />
            <span class="text-danger" v-if="errors.has('name')===true">請輸入姓名</span>
          </div>

          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input
              type="tel"
              class="form-control"
              name="tel"
              id="usertel"
              v-model="form.user.tel"
              placeholder="請輸入電話"
              v-validate="'required'"
              :class="{'is-invalid': errors.has('tel')===true}"
            />
            <span class="text-danger" v-if="errors.has('tel')===true">請輸入手機號碼</span>
          </div>

          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input
              type="text"
              class="form-control"
              name="address"
              id="useraddress"
              v-model="form.user.address"
              placeholder="請輸入地址"
              v-validate="'required'"
              :class="{'is-invalid': errors.has('address')===true}"
            />
            <span class="text-danger" v-if="errors.has('address')===true">地址欄位不得留空</span>
          </div>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
    </div>

    <!--Modal-->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{product.content}}</p>
              <footer class="blockquote-footer text-right">{{product.description}}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{product.origin_price}}元</div>
              <del class="h6" v-if="product.price">原價 {{product.origin_price}}元</del>
              <div class="h4" v-if="product.price">現在只要 {{product.price}}元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option
                :value="number"
                v-for="number in 10"
                :key="number"
              >選購 {{number}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{product.num * product.price}}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="addtoCart(product.id,product.num)"
            >加到購物車</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [], //取得產品列表
      product: {}, //取得單一資料
      carts: {}, //取得購物車資料
      status: {
        loadingItem: "" //正在讀取的產品ID
      },
      isLoading: false,
      coupon_code: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      } //要傳送的訂單資訊
    };
  },
  methods: {
    getProducts: function() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.products = response.data.products;
        console.log(response);
        vm.isLoading = false;
      });
    },
    getProduct: function(id) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then(response => {
        vm.product = response.data.product;
        $("#productModal").modal("show");
        console.log(response);
        vm.status.loadingItem = "";
      });
    },
    addtoCart: function(id, qty = 1) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty: qty
      };
      this.$http.post(url, { data: cart }).then(response => {
        console.log(response);
        vm.status.loadingItem = "";
        $("#productModal").modal("hide");
        this.getCart();
      });
    },
    getCart: function() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.carts = response.data.data;
        console.log(vm.carts);
        vm.isLoading = false;
      });
    },
    delCartItem: function(id) {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
        this.getCart();
        console.log(vm.carts);
        vm.isLoading = false;
      });
    },
    addCouponCode: function() {
      const vm = this;
      const coupon = {
        data: {
          code: vm.coupon_code
        }
      };
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      vm.isLoading = true;
      this.$http.post(url, coupon).then(response => {
        console.log(response.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder: function() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      vm.isLoading = true;
      this.$validator.validate().then(valid => {
        if (valid === true) {
          this.$http.post(url, { data: vm.form }).then(response => {
            console.log("訂單已建立", response);
            vm.isLoading = false;
          });
        }else{
          console.log(valid);
          vm.isLoading = false;
        }
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>