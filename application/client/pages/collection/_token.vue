<template>
  <div class="">
    <div class="top-art">
      <div class="row">
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" :src="collection.object_url" alt="Htmlstream">
          <span v-if="collection.min_amount" class="text-right"><span class="badge badge-info">{{ collection.min_amount }} thanks ~</span></span>
        </div>
        <div class="col-lg-8 col-sm-6 col-md-8 text-center mb-7 mb-md-5">
          <div class="card">
            <div class="card-body">
              <h3 class="text-left">{{ collection.title }}</h3>
              <p class="text-left">{{ collection.description }}</p>
              <div class="form-group mb-2">
                <template v-if="!successBuy">
                  <label class="u-font-size-90 text-left"><b>送信メッセージ</b></label>
                  <textarea v-model="message" type="message" name="password" class="form-control mb-5"
                            placeholder="メッセージを入力してください。"></textarea>
                  <div class="form-group mb-2">
                    <label class="u-font-size-90 text-left"><b>thanks量</b></label>
                    <input v-model="amount" type="text" name="volume" class="form-control mb-3" placeholder="500">
                  </div>
                </template>
                <div v-if="successBuy">
                  <p><b>ありがとうございます！</b></p>
                  <p>購入トランザクションを発行しました。</p>
                  <p>トランザクションに購入者とトークン所有者が署名することで、購入手続き完了となります。<br>(署名はウォレットから実施いただけます)</p>
                  <p>※他ユーザも購入手続きしている場合はよりthanks量の多い取引が優先される可能性がありますので、予めご了承ください。</p>
                </div>
                <p v-if="errors.amount">{{errors.amount}}</p>
                <button v-if="successBuy" type="button" class="btn btn-block btn-dark mb-3" disabled>Success!!</button>
                <button v-if="!successBuy" type="button" class="btn btn-block btn-dark mb-3" @click="buy">購入する</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({app, params}) {
      let token = params.token
      const collection = await app.$axios.$get('/nft/' + token)
      return {collection, token}
    },
    data() {
      return {
        message: '',
        amount: null,
        token: '',
        errors: {},
        successBuy: false,
        // successBuy: true,
      }
    },
    methods: {
      buy() {
        var _this = this
        this.$axios.post('/nft/' + this.token, {
          message: this.message,
          amount: this.amount
        }).then((result) => {
          _this.errors = {}
          this.successBuy = true
          this.message = ''
          this.amount = ''
        }).catch(function (err) {
          _this.errors = err.response.data.errors
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  label {
    display: block;
  }
</style>
