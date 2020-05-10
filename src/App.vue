<template>
  <div id="app">
    <Header v-if="notHome && Web3Ready"></Header>
    <router-view />
    <MetaMaskModal v-if="show_metamask_modal" />
    <OpenBox v-if="show_openbox_modal" :card_id="opening_card_id"/>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import MetaMaskModal from "./components/modals/MetaMaskSetup.vue";
import OpenBox from "./components/modals/OpenBox.vue";

export default {
  name: "App",
  components: {
    Home,
    Header,
    Footer,
    MetaMaskModal,
    OpenBox
  },
  computed: {
    notHome () {
      return !(this.$route.path === "/" || this.$route.path === "/home");
    },
    Web3Ready () {
      console.log("this.$store.state.is_connected", this.$store.state);
      console.log("this.$store.state.is_connected", this.$store.state.web3);
      console.log("this.$store.state.is_connected", this.$store.state.web3.is_connected);
      return this.$store.state.web3.is_connected && this.$store.state.web3.web3Instance().eth;
    }
  },
  beforeCreate () {
    console.log("registerWeb3 Action dispatched from casino-dapp.vue");
  },
  data () {
    return {
      show_metamask_modal: false,
      show_openbox_modal: false,
      block_number_subscription: null,
      opening_card_id: null
    };
  },
  mounted () {
    // Generic Modal
    this.$eventBus.$on("openMetaMaskModal", () => {
      console.log("openMetaMaskModal");
      this.show_metamask_modal = true;
    });
    this.$eventBus.$on("closeMetaMaskModal", () => {
      this.show_metamask_modal = false;
    });
    this.$eventBus.$on("openOpenBox", (card) => {
      console.log("openOpenBoxModal");
      this.opening_card_id = card;
      this.show_openbox_modal = true;
    });
    this.$eventBus.$on("closeOpenBox", () => {
      this.opening_card_id = null;
      this.show_openbox_modal = false;
    });
    this.$store.dispatch("registerWeb3").then(res => {
      console.log("****RES****", res);
      if (res) {
        this.block_number_subscription = this.$store.state.web3.web3Instance().eth.subscribe(
          "newBlockHeaders",
          function (error, result) {
            if (!error) {
              return;
            }
            console.error(error);
          })
          .on("data", (blockHeader) => {
            console.log("blockNumber", blockHeader.number);
            this.$store.dispatch("checkBoxReveal", blockHeader.number);
          })
          .on("error", console.error);
        this.$store.state.web3.web3Instance().eth.getBlockNumber().then(block => {
          console.log("blockNumberrr", block);
          this.$store.dispatch("checkBoxReveal", block);
        });
      }
    });
  },
  destroyed () {
    // Generic Modal
    this.$eventBus.$off("openMetaMaskModal");
    this.$eventBus.$off("closeMetaMaskModal");
    this.$eventBus.$off("openOpenBox");
    this.$eventBus.$off("closeOpenBox");
    // unsubscribes the subscription
    this.block_number_subscription.unsubscribe(function (error, success) {
      if (success) {
        console.log("Successfully unsubscribed!");
      } else {
        console.log("err", error);
      }
    });
  }
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Frijole');

  :root {
  --bg: #f5f7ff;
  --fg: #616b93;
}
a {
  color: var(--fg);
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--fg);
}

.page-wrapper {

}
.container {
  max-width: 80%;
  margin: auto;
}

  html, body {
    font-family: 'Frijole';
  }

  #app {
    font-family: 'Frijole';
  }
</style>
