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
          <a class="u-link" @click="authModal=true">
            <img class="" width="40" height="40" src="/login.png" alt="login">
          </a>
        </template>
      </div>
      <div class="">
        <p>※テストネット版(使用したい方は<a :href="this.mailLink" class="links">こちら</a>から)</p>
      </div>
    </div>
    <div class="page-content">
      <template v-if="$auth.loggedIn">
        <div class="row">
          <div class="col-lg-4 col-sm-12 col-xs-12">
            <h2 class="mb-0"><span class="badge badge-dark">@{{ authUser.username }}</span></h2>
          </div>
          <div class="col-lg-8 col-sm-12 col-xs-12 text-right pc">
            <template v-if="authUser.address">
              <span class="text-success"><b>Linked Address：</b></span><br>
              <span class="address">{{ authUser.address}}</span>
              <img @click="onCopy('')" src="/copy.png">
            </template>
            <template v-else>
              <button type="button" class="btn btn-outline-danger" @click="linkModal=true">アドレスをリンクさせてください</button>
              <!--              <span class="text-danger">アドレスをリンクさせてください</span>-->
            </template>
          </div>
          <div class="col-lg-8 col-sm-12 col-xs-12 sp">
            <template v-if="authUser.address">
              <span class="text-success"><b>Linked Address：</b></span>
              <span class="address">{{ authUser.address}}</span>
              <img @click="onCopy" src="/copy.png">
            </template>
            <template v-else>
              <button type="button" class="btn btn-outline-danger">アドレスをリンクさせてください</button>
            </template>
          </div>
        </div>
      </template>
      <div class="page-content-inner">
        <Nuxt/>
      </div>
    </div>
    <client-only>
      <Modal v-if="authModal">
        <div class="modal-body">
          <button type="button" class="close" @click="authModal=false">
            <span aria-hidden="true">×</span>
          </button>
          <vue-loading v-if="isLoading" type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
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
            <input v-model="register_password" type="password" name="password" class="form-control" placeholder="パスワード">
            <input v-model="register_password_confirm" type="password" name="password_confirm" class="form-control"
                   placeholder="パスワード">
            <p v-if="this.error.password">{{error.password}}</p>
            <button type="button" class="btn btn-block btn-dark" @click="registerUser">登録する</button>
          </form>
        </div>
      </Modal>
      <Modal v-if="linkModal">
        <div class="modal-body">
          <button type="button" class="close" @click="linkModal=false">
            <span aria-hidden="true">×</span>
          </button>
          <h5 class="text-center">
            <b>アカウントと決済アドレスの紐付け</b><br>
            <b>（本登録）</b>
          </h5>
          <br>
          <div class="link_address">
            <p><b>送信先アドレス</b>（テストネット）</p>
            <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="top" title=""
                    data-original-title="Tooltip on top" @click="onCopy($config.adminAddress)">
              <span>{{ this.$config.adminAddress }}</span><img @click="onCopy($config.adminAddress)" src="/copy.png">
            </button>
            <br>
            <br>
            <p><b>送信メッセージ</b></p>
            <button type="button" class="btn btn-outline-danger" @click="onCopy(authUser.linkMessage)">
              <span>{{ this.authUser.linkMessage }}</span><img @click="onCopy(authUser.linkMessage)" src="/copy.png">
            </button>
          </div>
          <br>
          <div class="description">
            <p>
              アカウントと決済アドレスを紐付けるために、上記アドレスに送信メッセージを含めたトランザクションを送信する必要があります。<br>
              送信元のアドレスはユーザー名にリンクされ、すべてのNFTトランザクションが処理されます。<br>
              これは秘密鍵をインポートすることなく、またメールアドレスを使用することなく完全に分散化された登録手段です。<br>
              <span class="text-danger">※トランザクションを送信するにはSymbolウォレットが必要です。</span>
              <span class="text-danger">※現在テスト環境のため、テストネットでご使用いただけます。</span>
            </p>
          </div>
          <hr>
          <div class="link_address">
            <p><b>トランザクションが承認されたらアカウントを有効化してください</b></p>
            <button type="button" class="btn btn-outline-dark" @click="linkAccout">
              <span>有効化する</span>
            </button>
            <vue-loading v-if="isLoading" type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <template v-if="linkFailed">
              <p class="text-danger">
                有効なトランザクションが存在しませんでした。<br>
                アドレスとメッセージが正しいか、トランザクションが承認されたか確認してください。
              </p>
            </template>
          </div>
        </div>
      </Modal>
    </client-only>
  </div>
</template>

<script>
  import Modal from '~/components/Modal.vue'

  export default {
    components: {Modal},
    data() {
      return {
        isLoading: false,
        login_username: '',
        login_password: '',
        register_username: '',
        register_password: '',
        register_password_confirm: '',
        error: {},

        authUser: {
          username: '',
          address: '',
          linkMessage: '',
          status: '',
          txHash: '',
        },
        authModal: false,
        linkModal: false,
        linkFailed: false,
        nft: [],
        mailTo: "hashiguchi.dev@gmail.com",
        mailSubject: "NFT Marketの使用希望",
        mailContent: "Symbolを基盤とした独自コイン(thanksコイン)を決済に使用しております。%0D%0A試しに使用したい方はSymbolアドレスを記載し、当メールを送信してください。%0D%0A後日、コインを送付させていただきます。",
      }
    },
    computed: {
      mailLink () {
        return 'mailto:' + this.mailTo + '?subject=' + this.mailSubject + '&body=' + this.mailContent
      },
    },
    methods: {
      onCopy(val) {
        this.$copyText(val)
        alert("コピーしました。")
      },
      async login() {
        try {
          this.isLoading = true
          await this.$auth.loginWith('local', {
            data: {
              username: this.login_username,
              password: this.login_password
            }
          }).then((response) => {
            this.authUser = this.$auth.user
            this.isLoading = false
          })
          this.authModal = false
        } catch (e) {
          this.error = true
          this.isLoading = false
          // console.log(e)
        }
      },
      async logout() {
        await this.$auth.logout();
      },
      registerUser() {
        var _this = this
        this.isLoading = true
        this.$axios.post('/register', {
          username: this.register_username,
          password: this.register_password,
          password_confirm: this.register_password_confirm
        })
          .then((response) => {
            _this.isLoading = false
            this.$auth.loginWith('local', {
              data: {
                username: this.register_username,
                password: this.register_password,
              }
            }).then((response) => {
              this.authUser = this.$auth.user
            })
            this.authModal = false
          })
          .catch(function (err) {
            _this.error = err.response.data.errors
          })
      },
      async linkAccout() {
        var _this = this
        _this.isLoading = true
        this.$axios.get('/link_account', {})
          .then((response) => {
            _this.$auth.fetchUser()
            _this.linkFailed = false
            _this.isLoading = false
            _this.linkModal = false
          })
          .catch(function (err) {
            console.log(err)
            _this.linkFailed = true
            _this.isLoading = false
          })
      },
    },
    mounted() {
      if (this.$auth.loggedIn) {
        this.authUser = this.$auth.user
      }
    },
  }
</script>
<style lang="scss" scoped>
  .logo {
    margin-right: calc(100% - 140px - 60px - 60px);
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

  .modal-body {
    min-width: 400px;
    max-width: 600px;
    padding-left: 30px;
    padding-right: 30px;
  }
</style>

