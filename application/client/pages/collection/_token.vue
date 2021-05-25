<template>
  <div class="">
    <div class="top-art">
      <!--      <header class="w-md-50 mx-auto text-center mb-7">-->
      <!--        <h1 class="h1 font-weight-light mb-1">Art</h1>-->
      <!--        <hr class="my-7">-->
      <!--      </header>-->

      <div class="row">
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_1.JPG" alt="Htmlstream">
          <span class="text-right"><span class="badge badge-info">500thanks ~</span></span>
        </div>
        <div class="col-lg-8 col-sm-6 col-md-8 text-center mb-7 mb-md-5">
          <div class="card">
            <div class="card-body">
              <h3 class="text-left">{{ collection.title }}</h3>
              <p class="text-left">{{ collection.description }}</p>
              <div class="form-group mb-2">
                <label class="u-font-size-90 text-left"><b>送信メッセージ</b></label>
                <textarea type="message" name="password" class="form-control mb-5"
                          placeholder="メッセージを入力してください。"></textarea>
                <div class="form-group mb-2">
                  <label class="u-font-size-90 text-left"><b>thanks量</b></label>
                  <input type="text" name="volume" class="form-control mb-3" placeholder="500">
                </div>
                <!--              <p v-if="this.error.login">{{error.login}}</p>-->
                <button type="button" class="btn btn-block btn-dark mb-3" @click="login">購入する</button>
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
      return {collection}
    }
  }
</script>
<style lang="scss" scoped>
  label {
    display: block;
  }
</style>
