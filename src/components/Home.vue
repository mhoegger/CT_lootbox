<template>
  <div class="home-wrapper">
    <div class="home-left">
      <div class="home-button"><router-link to="/Buy">buy lootboxes</router-link></div>
    </div>
    <div class="home-right">
      <div class="home-button"><router-link to="/Inventory">view collection</router-link></div>
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
.home-left,
.home-right {
  height: 100%;
  width: 50%;
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
  background-image: url("../assets/black.jpg");
  background-position: center;
  background-size: cover;
  color: white;
}
.home-right {
  background-image: url("../assets/white.jpg");
  background-position: center;
  background-size: cover;
  color: black;
}
</style>
