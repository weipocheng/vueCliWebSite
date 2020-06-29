<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="40%">名稱</th>
          <th width="15%">折扣百分比</th>
          <th width="15%">到期日</th>
          <th width="15%">是否啟用</th>
          <th width="15%">編輯</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="(cart,key) in Carts" :key="key">
              <td>{{cart.title}}</td>
              <td>{{cart.percent}}</td>
              <td>{{cart.due_date}}</td>
              <td>
                  <span v-if="cart.is_enabled" class="text-success">已啟用</span>
                  <span v-else class="text-secondary">未啟用</span>
              </td>
              <td>
                  <button class="btn btn-outline-success" @click="openModal(false,cart)">編輯</button>
                  <button class="btn btn-outline-danger" @click="openDelModal(cart)">刪除</button>
              </td>
          </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempCart.title"
                  />
                </div>
                <div class="form-group">
                  <label for="title">優惠碼</label>
                  <input
                    type="text"
                    class="form-control"
                    id="coupons"
                    placeholder="請輸入優惠碼"
                    v-model="tempCart.code"
                  />
                </div>
                <div class="form-group">
                  <label for="date">到期日</label>
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    name="date"
                    v-model="tempCart.due_date"
                  />
                </div>
                <div class="form-group">
                  <label for="title">折扣百分比</label>
                  <input
                    type="text"
                    class="form-control"
                    id="percentage"
                    placeholder="請輸入折扣百分比"
                    v-model="tempCart.percent"
                  />
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                      v-model="tempCart.is_enabled"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCart">確認</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="delCartModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCart.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delCartItem(tempCart.id)">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"; //在此元件注入jquery 才能運行

export default {
  data() {
    return {
      Carts: [],
      tempCart: {
        title: "",
        is_enabled: "",
        percent: "",
        due_date: "",
        code: ""
      },
      isLoading: false,
      isNew: false
    };
  },
  methods: {
    openModal: function(isNew,item) {
        if(isNaN==true){
            this.tempCart = {};
            this.isNew = true;
        }else{
            this.tempCart =  Object.assign({}, item);
            this.isNew= false;
        }
      $("#productModal").modal("show");
    },
    getCarts: function(){
        var moment = require('moment'); // 注入moment.js套件
        let vm = this;
        vm.isLoading = true;
        let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
        this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.Carts = response.data.coupons;
            vm.Carts.forEach((item) =>{
                item.due_date = moment(item.due_date).format('YYYY-MM-DD');
            })
            vm.isLoading = false;
        });
    },
    updateCart: function() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMethod = "post";
      const vm = this;
      vm.isLoading = true;
      if(!vm.isNew){
          api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCart.id}`;
        httpMethod = "put";
      }
      vm.tempCart.due_date = new Date(vm.tempCart.due_date).getTime();
      this.$http[httpMethod](api, { data: vm.tempCart }).then(response => {
        console.log(response.data);
        if (response.data.success == true) {
          $("#productModal").modal("hide");
        //   vm.getProducts();
          console.log("新增成功!");  
          vm.getCarts();   
          vm.isLoading = false;  
        } else {
          $("#productModal").modal("hide");
        //   vm.getProducts();
          console.log("新增失敗!");
          vm.isLoading = false;
        }
      });
    },
    delCartItem: function(id){
        const vm = this;
        vm.isLoading = true;
        let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
        this.$http.delete(api).then((response) => {
            if(response.data.success == true){
                vm.getCarts(); 
                console.log("刪除成功!");
                $("#delCartModal").modal("hide");
                vm.isLoading = false;
            }else{
                vm.getCarts(); 
                console.log("刪除失敗!");
                $("#delCartModal").modal("hide");
                vm.isLoading = false;
            }
            
        });
    },
    openDelModal: function(cart) {
      var vm = this;
      // console.log(cart);
      vm.tempCart = Object.assign({}, cart);
      $("#delCartModal").modal("show");
    }
  },
  created(){
      this.getCarts();
  }
};
</script>