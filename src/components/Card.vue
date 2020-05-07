<template>
  <div class="card-wrapper" @click="card.click">
    <div class="card" v-bind:class="getCardRarity((card.card_id % 4) + 1)">
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
