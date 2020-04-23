<template>
  <div class="card-wrapper" >
    <div class="card" @click="box.click" v-bind:class="getCardRarity(1)">

    <p>ID/Tx: {{box.tx}}</p>
    <p>Content: {{box}}</p>
  </div>
  </div>
</template>

<script>
import getCard from "./../util/constants/cards";

export default {
  name: "Box",
  data() {
    return {};
  },
  props: {
    box: Object,
  },
  components: {},
  methods: {
    getImageURl: function(id) {
      return getCard(id).image;
    },
    getCardName: function(id) {
        return getCard(id).name;
    },
    getCardText: function(id) {
        return getCard(id).text;
    },
    getCardRarity: function(id) {
        return getCard(id).rarity;
    }
  },
  created: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-wrapper {
  height: 400px;
}
.card {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  border: 1px solid black;
}
.card-image-wrapper {
  height: 50%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid black;
}
.card-image-wrapper img {
  max-width: 100%;
  max-height: 100%;
}
.card-info-wrapper {
    padding:10px;
}
.rarity-common {

}
.rarity-uncommon {

}
.rarity-rare {

}
.epic {
    box-shadow: 0px 0px 8px purple;
}
.legendary {
    box-shadow: 0px 0px 8px gold;
}
</style>
