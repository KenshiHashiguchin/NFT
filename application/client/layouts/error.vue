<template>
  <div class="page-content">
    <p>ステータスコード：{{ error.statusCode }}</p>
    <p>メッセージ：{{ error.message }}</p>
  </div>
</template>
<script>
  export default {
    props: {
      error: {
        type: Object,
        default: null
      }
    }
  }
</script>
