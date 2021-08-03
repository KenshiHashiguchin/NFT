<template>
  <div class="">
    <div class="top-art">
      <div class="row">
        <div v-if="collection.type == 1" class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <img class="u-box-shadow-lg img-fluid img-thumbnail mt-1 image-trim" :src="collection.object_url"
               alt="Htmlstream">
          <span v-if="collection.min_amount" class="text-right"><span class="badge badge-info">{{ collection.min_amount }} thanks ~</span></span>
        </div>
        <div v-if="collection.type == 2" class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <client-only>
            <VueAplayer :music=music
            ></VueAplayer>
          </client-only>
          <span v-if="collection.min_amount" class="text-right"><span class="badge badge-info">{{ collection.min_amount }} thanks ~</span></span>
        </div>
        <div v-if="collection.type == 3" class="art-img col-lg-4 col-sm-6 col-md-4 text-center mb-7 mb-md-5">
          <h2>ファーストアルバム 前売り券</h2>
          <span v-if="collection.min_amount" class="text-right"><span class="badge badge-info">{{ collection.min_amount }} thanks ~</span></span>
        </div>
        <div class="col-lg-8 col-sm-6 col-md-8 text-center mb-7 mb-md-5">
          <div class="card">
            <div class="card-body">
              <h3 class="text-left">{{ collection.title }}</h3>
              <p class="text-left">{{ collection.description }}</p>
              <div class="form-group mb-2">
                <template v-if="!$auth.loggedIn || !$auth.user.address">
                  <label class="u-font-size-90 text-left"><b>送信メッセージ</b></label>
                  <textarea v-model="message" type="message" name="password" class="form-control mb-5"
                            placeholder="メッセージを入力してください。" disabled></textarea>
                  <div class="form-group mb-2">
                    <label class="u-font-size-90 text-left"><b>thanks量</b></label>
                    <input v-model="amount" type="text" name="volume" class="form-control mb-3" placeholder="500"
                           disabled>
                  </div>
                </template>
                <template v-else-if="!successBuy">
                  <label class="u-font-size-90 text-left"><b>送信メッセージ</b></label>
                  <textarea v-model="message" type="message" name="password" class="form-control mb-5"
                            placeholder="メッセージを入力してください。"></textarea>
                  <div class="form-group mb-2">
                    <label class="u-font-size-90 text-left"><b>thanks量</b></label>
                    <input v-model="amount" type="text" name="volume" class="form-control mb-3" placeholder="500">
                  </div>
                </template>
                <div v-else-if="successBuy">
                  <p><b>ありがとうございます！</b></p>
                  <p>購入トランザクションを発行しました。</p>
                  <p>トランザクションに購入者とトークン所有者が署名することで、購入手続き完了となります。<br>(署名はウォレットから実施いただけます)</p>
                  <p>※他ユーザも購入手続きしている場合はよりthanks量の多い取引が優先される可能性がありますので、予めご了承ください。</p>
                </div>
                <p v-if="errors.amount">{{errors.amount}}</p>
                <button v-if="!$auth.loggedIn" type="button" class="btn btn-block btn-dark mb-3" disabled>ログイン必須です
                </button>
                <button v-else-if="!$auth.user.address" type="button" class="btn btn-block btn-dark mb-3" disabled>
                  アドレス紐付け必須です
                </button>
                <button v-else-if="successBuy" type="button" class="btn btn-block btn-dark mb-3" disabled>Success!!
                </button>
                <button v-else-if="!successBuy" type="button" class="btn btn-block btn-dark mb-3" @click="buy">購入する
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-sm-6 col-md-6 text-center mb-7 mb-md-5">
          <p class="text-left">
            Owner：{{ ownerAddress }}
            <span v-if="ownerId">(@{{ ownerId }})</span>
          </p>
        </div>
        <div class="col-lg-6 col-sm-6 col-md-6 text-center mb-7 mb-md-5">
          <p class="text-left">Historic</p>
          <hr>
          <p class="text-left">Comming Soon</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueAplayer from 'vue-aplayer';

  export default {
    components: {VueAplayer},
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
        music: {
          title: '無題',
          artist: '無題',
          src: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3',
          pic: ''
        },
        ownerAddress: '',
        ownerId: '',
      }
    },
    watch: {
      ownerAddress: async function (newValue, oldValue) {
        console.log("watch")
        console.log(newValue)
        await this.$axios.$get('/id', {
          params: {
            // ここにクエリパラメータを指定する
            address: this.ownerAddress
          }
        }).then((res) => {
          this.ownerId = res.id
        }).catch(() => {
          this.ownerId = ''
        })
        console.log(this.ownerId)
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
      },
      async getOwnerAddress(mosaicId, ownerAddress) {
        const symbol_sdk = require('symbol-sdk');

        const nodeUrl = 'https://izanami.tsvr.net:3001';
        const repositoryFactory = new symbol_sdk.RepositoryFactoryHttp(nodeUrl);
        const transactionHttp = repositoryFactory.createTransactionRepository();
        // const address = Address.createFromPublicKey(ownerPubKey);
        const address = symbol_sdk.Address.createFromRawAddress(ownerAddress);

        // const mosaic = new MosaicId(mosaicId)
        const searchCriteria = {
          group: symbol_sdk.TransactionGroup.Confirmed,
          // group: TransactionGroup.Partial,
          address,
          // transferMosaicId: mosaic,
          pageNumber: 1,
          pageSize: 100,
          type: [
            symbol_sdk.TransactionType.AGGREGATE_BONDED,
            symbol_sdk.TransactionType.AGGREGATE_COMPLETE,
            symbol_sdk.TransactionType.TRANSFER
          ],
        };

        await transactionHttp.search(searchCriteria).subscribe(
          (page) => {
            var data = page.data.reverse()

            this.getOwnerAddressByTxs(data, mosaicId).then((address) => {
                return address
              }
            ).catch(() => {
              return null;
            })
          },
          (err) => {
            console.error(err)
          },
        );
      },
      async getOwnerAddressByTxs(txs, mosaicId) {
        const symbol_sdk = require('symbol-sdk');
        const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
        const repositoryFactory = new symbol_sdk.RepositoryFactoryHttp(nodeUrl);
        const transactionHttp = repositoryFactory.createTransactionRepository();
        txs.forEach((tx) => {
          //アグリゲートトランザクション判定
          if (tx.type === symbol_sdk.TransactionType.AGGREGATE_COMPLETE
            || tx.type === symbol_sdk.TransactionType.AGGREGATE_BONDED) {

            //アグリゲートの場合、内部トランザクションを再取得
            transactionHttp.getTransaction(
              tx.transactionInfo.hash,
              symbol_sdk.TransactionGroup.Confirmed
            ).subscribe(tx => {

              // console.log("== aggregateTx ==")
              //この関数を再帰的に呼び出し
              this.getOwnerAddressByTxs(tx.innerTransactions, mosaicId);  //再帰呼び出し
              // console.log("-----------------")
            });
          } else {
            //ここに解析する処理を記述します。
            // console.log(tx);
            if (tx.type === symbol_sdk.TransactionType.TRANSFER) {
              // console.log(tx.mosaics[0].id.toHex())
              if (tx.mosaics[0].id.toHex() === mosaicId) {
                this.ownerAddress = tx.recipientAddress.address
              }
            }
          }
        })
      }
    },
    mounted() {
      this.music.src = this.collection.object_url
      this.getOwnerAddress(this.collection.token, process.env.OWNER_ADDRESS)
    },
  }
</script>
<style lang="scss" scoped>
  label {
    display: block;
  }
</style>
