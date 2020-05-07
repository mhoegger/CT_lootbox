<template>
  <div class="card-wrapper" @click="card.click" :style="{'background-image': 'url(' + require('@/assets/cards/template.png') + ')'}">
    <div class="container">
      <img class="card" v-bind:src="require('@/assets/cards/template_front.png')" alt />
      <div class="card-image-wrapper">
          <img v-bind:src="getImageURl((card.card_id % 4) + 1)" alt />
      </div>
      <div class='card-info-wrapper'>
        <h4>name: {{getCardName((card.card_id % 4) + 1)}}</h4>
        <p>text: {{getCardText((card.card_id % 4) + 1)}}</p>
        <p>id: {{card.card_id}}</p>
        <p>amount: {{card.amount}}</p>
        <p v-if="card.offering">offering: {{card.offering}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import getCard from "./../util/constants/cards";

export default {
  name: "Card",
  data () {
    return {};
  },
  props: {
    card: Object
  },
  components: {},
  methods: {
    getImageURl (id) {
      return getCard(id).image;
    },
    getCardName (id) {
      return getCard(id).name;
    },
    getCardText (id) {
      return getCard(id).text;
    },
    getCardRarity (id) {
      return getCard(id).rarity;
    }
  },
  created () {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-wrapper {
  height: 343px;
  width: 250px;
  background-size: contain;
  z-index: 0;

}
.card {
  position: absolute;
  z-index: 100;
  left: -25px;
}
.card-image-wrapper {
  position: absolute;
  height: 200px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid black;
  z-index: 99;

}
.card-image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  z-index: 99;

}
.card-info-wrapper {
  top: 200px;
  position: absolute;
    padding:10px;
  z-index: 120;
  color: red;
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

  .container{
    position: relative;
    top:0;
    left: 0;
  }
</style>
