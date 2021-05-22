<template>
  <div class="container">
    <div class="header">
      <a class="navbar-brand logo" href="/">
        <img src="/header_logo.png" alt="Stream UI Kit" style="height: 65px;">
      </a>
      <div class="navbar-brand">
        <template v-if="$auth.loggedIn">
          <a class="u-link">
            <img width="40" height="40" src="/logout.png" alt="logout" @click="logout">
          </a>
        </template>
        <template v-else>
          <a class="u-link" data-toggle="modal" href="#exampleModalCenter">
            <img class="" width="40" height="40" src="/login.png" alt="login">
          </a>
        </template>
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
      <h2>ログイン状態:{{ $auth.loggedIn }}</h2>
      <p>{{ $auth.user }}</p>
      <p>{{ authUser.username }}</p>

      <div class="page-content-inner">
        <Nuxt/>
      </div>
    </div>
    <client-only>
      <div class="modal" id="exampleModalCenter" tabindex="-1" role="dialog"
           aria-labelledby="exampleModalCenterTitle" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <h5 class="text-center">ログイン</h5><br>
              <div class="form-group mb-2">
                <form class="form-signin">
                  <input v-model="login_username" type="text" name="username" class="form-control" placeholder="ユーザ名">
                  <input v-model="login_password" type="password" name="password" class="form-control"
                         placeholder="パスワード">
                  <p v-if="this.error.login">{{error.login}}</p>
                  <button type="button" class="btn btn-block btn-dark" @click="login">ログインする</button>
                </form>
              </div>
              <br>
              <hr>
              <h5 class="text-center">新規登録</h5><br>
              <form class="form-signin" @submit.prevent="registerUser">
                <input v-model="register_username" type="text" name="username" class="form-control" placeholder="ユーザ名">
                <p v-if="this.error.username">{{error.username}}</p>
                <input v-model="register_password" type="text" name="password" class="form-control" placeholder="パスワード">
                <input v-model="register_password_confirm" type="text" name="password_confirm" class="form-control"
                       placeholder="パスワード">
                <p v-if="this.error.password">{{error.password}}</p>
                <button type="button" class="btn btn-block btn-dark" @click="registerUser">登録する</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        login_username: '',
        login_password: '',
        register_username: '',
        register_password: '',
        register_password_confirm: '',
        error: {},

        authUser: {
          username: '',
          address: '',
        },
      }
    },
    methods: {
      onCopy() {
        this.$copyText("Hello World")
        alert("コピーしました。")
      },
      show() {
        this.$modal.show("modal-content");
      },
      async login() {
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.login_username,
              password: this.login_password
            }
          })
          this.$bvModal.hide("#exampleModalCenter")
        } catch (e) {
          this.error = true
          console.log(e)
        }
      },
      async logout() {
        await this.$auth.logout();
      },
      registerUser() {
        var _this = this
        this.$axios.post('/register', {
            username: this.register_username,
            password: this.register_password,
            password_confirm: this.register_password_confirm
        })
          .then((response) => {
            console.log("Success")
            // alert(response)
            this.$auth.loginWith('local', {
              data: {
                username: this.register_username,
                password: this.register_password,
              }
            })
            this.$bvModal.hide("exampleModalCenter")
          })
          .catch(function (err){
            console.log(err.response)
            _this.error = err.response.data.errors
            // this.error = err.response.data.errors
            // console.log(this.error)
            // console.log(this.error.password)
          })
      },
    },
    mounted() {
      if (this.$auth.loggedIn) {
        this.authUser.username = this.$auth.user.username
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

