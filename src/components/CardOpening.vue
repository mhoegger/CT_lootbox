<template>
  <div class="card-wrapper" @click="card.click">
    <div class="background">
      <img class="card" v-bind:src='require(`@/assets/cards/offer_design_${getCardRarity(card.card_id)}.png`)' alt />
    </div>

    <div class="dino-image">
        <img v-bind:src="getImageURl(card.card_id)" alt />
    </div>
    <div class="count">
      <span>{{card.amount}}</span>
    </div>
    <div class="name">
      <svg class="svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="200px" height="200px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">

    <path class="text1" fill="none" stroke="red" id="red" stroke-opacity="0.0" d="M 10 80 Q 95 55 180 80"/>
        <text text-anchor="middle" font-size="15px" class="text1">
            <textPath xlink:href="#red" startOffset="50%">
                {{getCardName(card.card_id)}}
            </textPath>
      </text>


  </svg>
    </div>
    <div class='card-info-wrapper'>
      <p>{{getCardText(card.card_id)}}</p>
      <div class="card-id">
        {{card.card_id}}
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
  created () {
    console.log(this.card);
  }
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
  top: -39px;
  left:5px;

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
  font-size: 9.5px;
}
.card-id {
  position: absolute;
  right: 10px;
  bottom: 0px;
  font-size: 10px;
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

.card-id {
  position: absolute;
  right: 10px;
  bottom: 0px;
  font-size: 10px;
}

.text1 {
  position: absolute;
  left: -100px;
}
.svg {
  position: absolute;
  left: -22px;
  top: -48px
}
</style>
