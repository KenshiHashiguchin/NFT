<template>
  <div class="">
    <div class="top-art">
      <header class="w-md-50 mx-auto text-center mb-7">
        <h1 class="h1 font-weight-light mb-1">Collection</h1>
        <hr class="my-7">
      </header>

      <div class="row">
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <nuxt-link v-bind:to="{name:'collection-token',params:{token:token}}">
            <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_1.JPG" alt="Htmlstream">
            <span class="text-right"><span class="badge badge-info">500thanks ~</span></span>
            <p>Title</p>
          </nuxt-link>
        </div>
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <nuxt-link to="/about">
            <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_1.JPG" alt="Htmlstream">
            <span class="text-right"><span class="badge badge-success">200thanks ~</span></span>
            <p>Title</p>
          </nuxt-link>
        </div>

        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_2.JPG" alt="Htmlstream">
          <p>@KenchakoDaibouken<br> bought for 600thanks</p>
        </div>
        <div class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" src="/aikawa_2.JPG" alt="Htmlstream">
          <span class="text-right"><span class="badge badge-dark">1000thanks ~</span></span>
          <p>Title</p>
        </div>
      </div>
    </div>
    <div class="top-music">
      <header class="w-md-50 mx-auto text-center mb-7">
        <h1 class="h1 font-weight-light mb-1">Music</h1>
        <hr class="my-7">
      </header>
      <div class="row">
        <div class="col-sm-6 col-md-6 text-center mb-7 mb-md-0">
          <img class="u-box-shadow-lg img-fluid rounded-circle mt-1" src="/music_default.png" alt="Htmlstream">
          <p><span class="text-right"><span class="badge badge-dark">1000thanks ~</span></span></p>
          <p>Title</p>
        </div>
        <div class="col-sm-6 col-md-6 text-center mb-7 mb-md-0">
          <img class="u-box-shadow-lg img-fluid rounded-circle mt-1" src="/music_default.png" alt="Htmlstream">
          <p>@KenchakoDaibouken<br> bought for 600thanks</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    async asyncData({ app }) {
      const collections = await app.$axios.$get('/nft')
      return { collections }
    },
    data() {
      return {
        //debug
        token: '78A1022CDE0F5059',
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
