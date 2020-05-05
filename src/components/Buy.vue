<template>
  <div class="page-wrapper">
    <div class="container">
      <h3>shop</h3>
      <div class="shop">
        <Pack v-on:bought="buyPack"
          v-for="(pack, index) in packs"
          :key="index"
          v-bind:name="pack.name"
          v-bind:price="pack.price"
        ></Pack>
      </div>
    </div>
  </div>
</template>

<script>
import Pack from "./Pack.vue";

export default {
  name: "Buy",
  data () {
    return {
      packs: [
        {
          name: "awesome pack",
          price: 500
        },
        {
          name: "useless pack",
          price: 1000
        },
        {
          name: "crazy pack",
          price: 5
        }
      ]
    };
  },
  props: {},
  components: {
    Pack
  },
  mounted () {
    console.log("dispatching getContractInstance");
    this.$store.dispatch("getContractInstance");
  },
  methods: {
    buyPack () {
      console.log("cont", this.$store.state.contractInstance().methods);
      console.log("web333", this.$store.state.web3.web3Instance());
      console.log("seend", this.$store.state.web3.coinbase, this.$store.state.web3.web3Instance().utils.toWei("0.1", "ether"));
      let transaction = null;
      this.$store.state.contractInstance().methods.buyBox().send({
        value: this.$store.state.web3.web3Instance().utils.toWei("0.1", "ether"),
        from: this.$store.state.web3.coinbase
      }).on("transactionHash", (tx) => {
        console.log("TX", tx);
        transaction = tx;
        // Add to pending
        this.$store.dispatch("addBoxPending", {
          tx: tx,
          time_issued: Date.now()
        });
        // subscribe to event
        this.$store.state.contractInstance().events.boughtCard()
          .on("data", (result) => {
            console.log("result.args", result);
            this.$store.dispatch("getRevealBlockNumber").then(res => {
              console.log("getRevealBlockNumber-....", res);
              this.$store.dispatch("moveBoxPendingBought", {
                tx: tx,
                revealblock: res
              });
            });
          })
          .on("error", (err) => {
            console.log("1112", err);
          });
      }).on("error", (error) => {
        console.log("error", error);
        // Add to pending
        this.$store.dispatch("removeBoxPending", {
          tx: transaction
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shop {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(auto-fit, 200px);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}
</style>
