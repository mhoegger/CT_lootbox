<template>
  <div class="home-wrapper">
    <div class="home-left">
      <div class="home-button"><router-link to="/Buy">Explore</router-link></div>
    </div>
    <div class="home-center">
      <div class="home-button"><router-link to="/Inventory">Collect</router-link></div>
    </div>
    <div class="home-right">
      <div class="home-button"><router-link to="/MarketPlace">Trade</router-link></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data () {
    return {};
  },
  props: {},
  components: {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
}
.home-wrapper a {
  color: white;
}
.home-left,
.home-right,
.home-center {
  height: 100%;
  width: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 3rem;
  letter-spacing: 3px;
  cursor: pointer;
}
.home-left:hover,
.home-right:hover {
}
.home-left {
  background-image: url("../assets/explore.jpeg");
  background-position: center;
  background-size: cover;
  color: white;
}
.home-right {
  background-image: url("../assets/trade.jpeg");
  background-position: center;
  background-size: cover;
  color: white;
}
.home-center {
  background-image: url("../assets/collect.jpeg");
  background-position: center;
  background-size: cover;
  color: white;
}
</style>
