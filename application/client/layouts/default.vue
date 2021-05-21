<template>
  <div class="container">
    <div class="header">
      <a class="navbar-brand logo" href="/">
        <img src="/header_logo.png" alt="Stream UI Kit" style="height: 65px;">
      </a>
      <div class="navbar-brand">
        <a class="u-link" data-toggle="modal" href="#exampleModalCenter"><img class="" width="40" height="40"
                                                                              src="/login.png" alt="login"></a>
        <img class="" width="40" height="40" src="/logout.png" alt="logout">
      </div>
    </div>
    <div class="page-content">
      <div class="row">
        <div class="col-lg-4 col-sm-12 col-xs-12">
          <h2 class="mb-0"><span class="badge badge-dark">@OkadaIzou</span></h2>
        </div>
        <div class="col-lg-8 col-sm-12 col-xs-12 text-right pc">
          <span class="text-success"><b>Linked Address：</b></span><br>
          <span class="address">TCRAU4XIUFZT5NG4MWL6YU4CEJTVFYRTBPV5RVY</span>
          <img @click="onCopy" src="/copy.png">
        </div>
        <div class="col-lg-8 col-sm-12 col-xs-12 sp">
          <span class="text-success"><b>Linked Address：</b></span>
          <span class="address">TCRAU4XIUFZT5NG4MWL6YU4CEJTVFYRTBPV5RVY</span>
          <img @click="onCopy" src="/copy.png">
        </div>
      </div>

      <div class="page-content-inner">
        <Nuxt/>
      </div>
    </div>

    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalCenterTitle" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h5 class="text-center">ログイン</h5><br>
            <div class="form-group mb-2">
              <!--              <label for="defaultInput" class="u-font-size-90"></label>-->
              <form class="form-signin">
                <input type="text" name="username" class="form-control" placeholder="ユーザ名">
                <input type="text" name="password" class="form-control" placeholder="パスワード">
                <button type="button" class="btn btn-block btn-dark">ログインする</button>
              </form>
            </div>
            <br>
            <hr>
            <h5 class="text-center">新規登録</h5><br>
            <form class="form-signin">
              <input type="text" name="username" class="form-control" placeholder="ユーザ名">
              <input type="text" name="password" class="form-control" placeholder="パスワード">
              <input type="text" name="password_confirm" class="form-control" placeholder="パスワード">
              <button type="button" class="btn btn-block btn-dark">登録する</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    methods: {
      onCopy() {
        this.$copyText("Hello World")
        alert("コピーしました。")
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logo {
    margin-right: calc(100% - 236px - 60px - 60px); //画像文と両脇のマージン分
  }

  .address {
    color: #C4C4C4;
    overflow-wrap: break-word;
  }

  .form-signin {
    margin: 0 35px;

    input {
      margin-bottom: 15px;
    }
  }

  .page-content-inner {
    margin-top: 50px;
  }

</style>

