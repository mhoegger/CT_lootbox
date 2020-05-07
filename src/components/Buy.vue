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
  data: function() {
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
  methods: {
      buyPack: function() {
          console.log('TODO: buy')
          return true;
      },
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