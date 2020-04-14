<template>
  <div class="pack"
  v-on:click='buy'>
      <h3>{{this.name}}</h3>
      <p>{{this.price}} schmeckels</p>
  </div>
</template>

<script>

export default {
  name: "Pack",
  data: function() {
    return {
    };
  },
  props: {
      name: String,
      price: Number,
  },
  components: {
  },
  methods: {
      buy: function() {
          this.$emit('bought')
      },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pack {
    border: 1px solid pink;
    border-radius: 12px;
    padding: 10px;
}
</style>