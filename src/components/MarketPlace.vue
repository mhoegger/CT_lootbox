<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="wood-sign">
        <h3>Own Offers</h3>
      </div>
      <div class="own-offers">
        <div class="card-grid">
          <Offer v-for="(card, index) in own_offers" :key="index" :card="card"></Offer>

        </div>
      </div>

      <div class="wood-sign">
        <h3>Other's Offers</h3>
      </div>
      <div class="card-grid">
        <Offer v-for="(card, index) in others_offers" :key="index" :card="card"></Offer>
      </div>


      <div class="wood-sign">
        <h3 style="font-size: 28px">Hatched dinosaurs</h3>
      </div>
      <div class="card-grid">
        <Card v-for="(card, index) in open_cards" :key="index" :card="card"></Card>
      </div>
      <!--
        in loading states -> cursor: default + some kind of animation -> show that no interaction is required

        show together:
          1 pile: (pending, bought -> loading state, egg is intact), (ready -> click to reveal, onclick egg gets cracks),
            (revealing -> loading state, egg shakes with cracks), (unopened -> onclick openeing animation, move to open pile)
          1 pile: open

      -->
    </div>
    <SellCard :card_id="card_to_sell" v-bind:class="{open: show_sellcard_modal}" />

  </div>
</template>

<script>
import Card from "./Card";
import Box from "./Box";
import Offer from "./Offer";
import SellCard from "./modals/SellCard.vue";

export default {
  name: "MarketPlace",
  data () {
    return {
      show_sellcard_modal: false,
      card_to_sell: null
    };
  },
  props: {},
  components: {
    Card,
    Box,
    SellCard,
    Offer
  },
  computed: {
    own_offers () {
      console.log("Update_onwn")
      let temp = this.$store.state.market_place.own_offers;
      let own_offers = [];
      temp.forEach(offer => {
        let offer_as_obj = Object.assign({}, offer);
        offer_as_obj.action = "widthdraw";
        offer_as_obj.click = () => {
          this.$store.dispatch("withdrawOfferingFromContract", offer);
        };
        own_offers.push(offer_as_obj);
      });
      return own_offers;
    },
    others_offers () {
      let temp = this.$store.state.market_place.others_offers;
      let others_offers = [];
      temp.forEach(offer => {
        let offer_as_obj = Object.assign({}, offer);
        offer_as_obj.action = "buy";
        offer_as_obj.click = () => {
          this.$store.dispatch("buyOfferingFromContract", offer);
        };
        others_offers.push(offer_as_obj);
      });
      return others_offers;
    },
    open_cards () {
      console.log(
        "this.$store.state.cardDeck.open",
        this.$store.state.card_pile
      );
      const open_cards = [];
      this.$store.state.card_pile.forEach(card => {
        if (card.amount > 0) {
          let new_card = card;
          new_card.action = "offer";
          new_card.click = () => {
            this.$eventBus.$emit("openSellCard", new_card.card_id);
          };
          open_cards.push(new_card)

        }
      });
      return open_cards;
    }
  },
  created () {
  },
  mounted () {
    this.$store.dispatch("getContractInstance");

    console.log("dispatching getCardsOpen");
    this.$store.dispatch("getListingsFromContract");
    this.$store.dispatch("getCardsOpen");

    this.$eventBus.$on("openSellCard", (card_id) => {
      this.card_to_sell = card_id;
      console.log("openMetaMaskModal");
      this.show_sellcard_modal = true;
    });
    this.$eventBus.$on("closeSellCard", () => {
      console.log('asdfasf');
      this.show_sellcard_modal = false;
    });
  },
  destroyed () {
    // Generic Modal
    this.$eventBus.$off("openSellCard");
    this.$eventBus.$off("closeSellCard");
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.page-wrapper {
    background-image: url("./../assets/market.jpg");
    background-position: bottom;
    min-height: 100vh;

}
.container {
  padding: 50px;
}
.container h3 {
  color: white;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.own-offers {
  padding: 20px;
  margin: 30px;
}

.wood-sign{
  background-image: url("./../assets/sign.png");
  width: 457px;
  height: 85px;
}
  .wood-sign h3 {
    position: relative;
    top: 20px;
    left: 50px;
    font-size: 35px;
    color: #64370e;
    text-shadow: 3px -3px #3a2416;
  }


</style>
