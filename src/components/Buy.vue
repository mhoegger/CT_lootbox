<template>
  <div class="page-wrapper">
      <div class="shop">
        <p style="position: absolute; left: 200px;">{{buying_blocked}}</p>
        <div class="water-container">
          <div class="overlay water">
                    <div class="shaker">
                    <div class='box' @click="buyPack">

                    </div>
                    </div>


        </div>
          <div class="wave wave1"></div>
          <div class="wave wave2"></div>
          <div class="wave wave3"></div>
          <div class="wave wave4"></div>
        </div>
        </div>

      </div>
  </div>
</template>

<script>

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
  computed: {
    buying_blocked () {
      return this.$store.state.box_blocked;
    }
  },
  components: {
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
        this.$store.dispatch("changeBlockBoxesStateAction", false);
      });
      this.$store.dispatch("changeBlockBoxesStateAction", true);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shaker {
animation: shake-box 2s linear infinite;
position: absolute;
  bottom:10px;
  left:0;
  cursor: pointer;
}
.box {

  animation: animate-box 30s linear infinite;
  background: url("./../assets/pngwave.png");
  height:200px;
  width:200px;
  z-index: 999;
  background-position: center;
  background-size: contain;
}
.box img {
  height:50%;
  width:50%;
}
.shop {
  background-image: url('./../assets/jungle_water.jpg');
  background-size: cover;
  background-position: center;
  height:100vh;
  width:100vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(auto-fit, 200px);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  overflow: hidden;
}
.water-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width:100vw;
}
.overlay {
  position: relative;
  width:100%;
  height:100px;
}
.wave{
position: absolute;
bottom: 0;
left: 0;
width: 100%;
height:100px;
background: url('./../assets/wave2.png');

}
.wave1 {
  animation: animate 30s linear infinite;
  z-index:1000;
  opacity: 1;
  animation-delay: 0s;
  bottom: 0px;
}
.wave2 {
  animation: animate2 15s linear infinite;
  z-index:999;
  opacity: 0.5;
  animation-delay: -5s;
  bottom: 10px;
}
.wave3 {
  animation: animate 30s linear infinite;
  z-index:998;
  opacity: 0.2;
  animation-delay: -2s;
  bottom: 15px;
}
.wave4 {
  animation: animate2 15s linear infinite;
  z-index:997;
  opacity: 0.7;
  animation-delay: 0s;
  bottom: 20px;
}

@keyframes animate {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 1000px;
  }
}
@keyframes animate-box {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(2000px);
  }
}
@keyframes shake-box {
  0% {
    transform: translateY(0);
  }
    25% {
    transform: translateY(20px);
  }
    50% {
    transform: translateY(0);
  }
    75% {
    transform: translateY(-25px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes animate2 {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -1000px;
  }
}

</style>
