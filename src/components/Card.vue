<template>
  <div class="card-wrapper">
    <div class="card" v-bind:class="getCardRarity(2)">
      <div class="card-image-wrapper">
        <img v-bind:src="getImageURl(2)" alt />
      </div>
      <div class='card-info-wrapper'>
          <h4>name: {{getCardName(2)}}</h4>
          <p>text: {{getCardText(2)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import getCard from "./../util/constants/cards";

export default {
  name: "Card",
  data() {
    return {};
  },
  props: {
    id: String
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
  height: 300px;
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
