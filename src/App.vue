<template>
  <div id="app">
    <Header v-if="notHome && Web3Ready"></Header>
    <router-view />
    <!-- <Footer/> -->
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Home,
    Header,
    Footer
  },
  computed: {
    notHome () {
      return !(this.$route.path === "/" || this.$route.path === "/home");
    },
    Web3Ready () {
      console.log("this.$store.state.is_connected", this.$store.state)
      console.log("this.$store.state.is_connected", this.$store.state.web3)
      console.log("this.$store.state.is_connected", this.$store.state.web3.is_connected)
      return this.$store.state.web3.is_connected;
    }
  },
  beforeCreate () {
    console.log("registerWeb3 Action dispatched from casino-dapp.vue");
    this.$store.dispatch("registerWeb3");
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
