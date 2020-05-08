<template>
  <div class="card-wrapper" @click="card.click">
    <div class="background">
          <img class="card" v-bind:src="getCardRarity((card.card_id % 5) + 1)" alt />
    </div>

      <div class="dino-image">
          <img v-bind:src="getImageURl((card.card_id % 5) + 1)" alt />
      </div>
      <div class="count">
        <span>{{card.amount}}</span>
      </div>
      <div class="name">
        {{getCardName((card.card_id % 5) + 1)}}
      </div>
      <div class='card-info-wrapper'>
        <p>{{getCardText((card.card_id % 5) + 1)}}</p>
        <p v-if="card.offering">offering: {{card.offering}}</p>
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
.background {
  position: absolute;
  top:0;
  height:0;
}
.dino-image {
  position: absolute;
top: 0;
left: -25px;
width: 100%;
height: 100%;
overflow:hidden;
}
.dino-image img {
  height: 100%;
}

.card-wrapper {
  height: 343px;
  width: 250px;
  background-size: contain;
  z-index: 0;
  position: relative;

}
.card {
  position: absolute;
  z-index: 100;
  left: -25px;
}
.count {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  /*background-color:blue;*/
  height: 39px;
  width: 31px;
  top: 31px;
  z-index: 9999;
  left: -3px;
}
.name {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  /*background-color:blue;*/
 height: 39px;
width: 151px;
top: 171px;
z-index: 9999;
left: 22px;
  color: black;
}
.count span {
  display: inline-block;
  margin:0;
  padding:0;
  color: #d2c4c1;
  text-shadow: 2px 2px #473d3c;
  font-size: 30px;
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
    padding:2px;
  z-index: 120;
  color: black;
width: 159px;
left: 18px;
height: 71px;
top: 239px;
/*background-color: blue;*/
}
.card-info-wrapper p, .card-info-wrapper h4 {
  margin:1px;
  font-size: 12px;
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
