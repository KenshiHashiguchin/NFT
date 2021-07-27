<template>
  <div class="">
    <div class="top-art">
      <header class="w-md-50 mx-auto text-center mb-7">
        <h1 class="h1 font-weight-light mb-1">Collection</h1>
        <hr class="my-7">
      </header>

      <div class="row">
        <div v-for="collection in collections" class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <nuxt-link v-bind:to="{name:'collection-token',params:{token:collection.token}}">
            <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" :src="collection.object_url"
                 alt="Htmlstream">
            <span class="text-right"><span class="badge badge-dark">{{ collection.min_amount }}thanks ~</span></span>
            <p>{{ collection.title }}</p>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="top-music">
      <header class="w-md-50 mx-auto text-center mb-7">
        <h1 class="h1 font-weight-light mb-1">Music</h1>
        <hr class="my-7">
      </header>
      <div class="row">
        <div v-for="item in music" class="col-sm-6 col-md-6 text-center mb-7 mb-md-0">
          <nuxt-link v-bind:to="{name:'collection-token',params:{token:item.token}}">
            <img class="u-box-shadow-lg img-fluid rounded-circle mt-1" src="/music_default.png" alt="Htmlstream">
            <p><span class="text-right"><span class="badge badge-dark">{{ item.min_amount }}thanks ~</span></span>
            </p>
            <p>{{ item.title }}</p>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    async asyncData({app}) {
      const data = await app.$axios.$get('/nft')
      const collections = data.collections
      const music = data.music
      const tickets = data.tickets
      return {collections, music, tickets}
    },
    data() {
      return {
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
