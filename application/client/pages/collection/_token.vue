<template>
  <div class="">
    <div class="top-art">
      <div class="row">
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_1.JPG" alt="Htmlstream">
          <span v-if="collection.min_amount" class="text-right"><span class="badge badge-info">{{ collection.min_amount }} thanks ~</span></span>
        </div>
        <div class="col-lg-8 col-sm-6 col-md-8 text-center mb-7 mb-md-5">
          <div class="card">
            <div class="card-body">
              <h3 class="text-left">{{ collection.title }}</h3>
              <p class="text-left">{{ collection.description }}</p>
              <div class="form-group mb-2">
                <label class="u-font-size-90 text-left"><b>送信メッセージ</b></label>
                <textarea v-model="message" type="message" name="password" class="form-control mb-5"
                          placeholder="メッセージを入力してください。"></textarea>
                <div class="form-group mb-2">
                  <label class="u-font-size-90 text-left"><b>thanks量</b></label>
                  <input v-model="amount" type="text" name="volume" class="form-control mb-3" placeholder="500">
                </div>
                <p v-if="errors.amount">{{errors.amount}}</p>
                <button type="button" class="btn btn-block btn-dark mb-3" @click="buy">購入する</button>
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
      console.log(collection)
      return {collection, token}
    },
    data(){
      return {
        message : '',
        amount: null,
        token: '',
        errors: {},
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
        }).catch(function (err){
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
