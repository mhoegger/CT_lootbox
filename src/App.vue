<template>
  <div id="app">
    <Header v-if="notHome && Web3Ready"></Header>
    <router-view />
    <MetaMaskModal v-if="show_metamask_modal" />
    <!-- <Footer/> -->
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import MetaMaskModal from "./components/modals/MetaMaskSetup.vue";

export default {
  name: "App",
  components: {
    Home,
    Header,
    Footer,
    MetaMaskModal
  },
  computed: {
    notHome () {
      return !(this.$route.path === "/" || this.$route.path === "/home");
    },
    Web3Ready () {
      console.log("this.$store.state.is_connected", this.$store.state);
      console.log("this.$store.state.is_connected", this.$store.state.web3);
      console.log("this.$store.state.is_connected", this.$store.state.web3.is_connected);
      return this.$store.state.web3.is_connected;
    }
  },
  beforeCreate () {
    console.log("registerWeb3 Action dispatched from casino-dapp.vue");
    this.$store.dispatch("registerWeb3");
  },
  data () {
    return {
      show_metamask_modal: false
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
  },
  destroyed () {
    // Generic Modal
    this.$eventBus.$off("openMetaMaskModal");
    this.$eventBus.$off("closeMetaMaskModal");
  }
};
</script>

<style>
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
  background-color:aliceblue
}
</style>
