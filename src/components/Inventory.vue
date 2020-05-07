<template>
  <div class="page-wrapper">

      <div class="hatching-section">
        <Rain>
          </Rain>
      <div class="hatching-box">
        <div class="nest">
          <Box v-for="(card) in pending_cards" :key="card.tx" :box="card" :status="0"></Box>
          <Box v-for="(card) in bought_cards" :key="card.tx" :box="card" :status="1"></Box>
          <Box v-for="(card) in ready_cards" :key="card.tx" :box="card" :status="2"></Box>
          <Box v-for="(card) in revealing_cards" :key="card.tx" :box="card" :status="3"></Box>
          <Box v-for="(card) in unopened_cards" :key="card.tx" :box="card" :status="4"></Box>
        </div>

      </div>
      <div class="message-box">

        <!-- TODO Frontend design:
          - add v-ifs to show only correct message
          - design eggs nicely
          - design cards nicely
          - design animations
          -->

        <!-- pending -->
        <div v-if="pending_cards.length>0" class="message" id="wait" >
          Our archaeologists are currently removing the dust from the prehistoric egg. You will get your precious prehistoric
          friend any minute!
        </div>
        <!-- Bought -->
        <div v-if="bought_cards.length>0" class="message" id="wait" >
          We found a very special egg, it is currently on its way to you!
        </div>
        <!-- Ready -->
        <div v-if="ready_cards.length>0" class="message" id="wait" >
          Click on your new egg to start hatching it!
        </div>
        <!-- Revealing -->
        <div v-if="revealing_cards.length>0" class="message" id="wait" >
          It's already shaking, just a few moments!
        </div>
        <!-- Unopened -->
        <div v-if="unopened_cards.length>0" class="message" id="wait" >
          Click to see what you hatched!
        </div>
      </div>
        
      </div>

      <div class="scroll">
        <span v-on:click='scrollDown' class='bounce'><img src="./../assets/chevron-down-solid.svg" alt=""></span>
      </div>

      <h3>Hatched dinosaurs</h3>
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
</template>

<script>
import Card from "./Card";
import Box from "./Box";
import Rain from "./Rain";
export default {
  name: "Inventory",
  data () {
    return {};
  },
  props: {},
  components: {
    Card,
    Box,
    Rain,
  },
  methods: {
    hatch (id) {
      console.log("hatching: " + id);
    },
    scrollDown () {
      console.log("scroll");
    }
  },
  computed: {
    pending_cards () {
      var cards = this.$store.state.box_pile.pending;
      cards.push({'tx':0});
      return cards;
    },
    bought_cards () {
      var cards = this.$store.state.box_pile.bought;
      return cards;
    },
    ready_cards () {
      var cards = this.$store.state.box_pile.ready;
      return cards;
    },
    revealing_cards () {
      var cards = this.$store.state.box_pile.revealing;
      return cards;
    },
    unopened_cards () {
      var cards = this.$store.state.box_pile.unopened;
      return cards;
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
          new_card.click = () => {
            this.$eventBus.$emit("openSellCard", new_card.card_id);
          };
          open_cards.push(new_card);
        }
      });
      //let unopen_card = this.$store.state.box_pile.unopened;
      // TODO: remove unopened
      var test_card = [];
      test_card.push({ tx: 0, revealblock: "asdf", card_id: 1, "click": () => {} });
      test_card.push({ tx: 5, revealblock: "qwer", card_id: 2, "click": () => {} });
      return test_card;
    }
  },
  created () {
    console.log("dispatching getContractInstance");
    // this.$store.dispatch("getContractInstance");
  },
  mounted () {
    this.$store.dispatch("getContractInstance");

    console.log("dispatching getCardsOpen");
    this.$store.dispatch("getCardsOpen");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .bounce {
        animation-name: bounce;
        animation-timing-function: ease;
            animation-duration: 2s;
        animation-iteration-count: infinite;
    }
    @keyframes bounce {
        0%   { transform: translateY(0); }
        30%  { transform: translateY(-20px); }
        50%  { transform: translateY(0); }
        100% { transform: translateY(0); }
    }

.scroll {
  position: absolute;
  bottom: 0;
  height:10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width:100vw;
}
.scroll span {
  color: black;
  display: block;
}
.scroll img {
  height:50px;
  width:50px;
}
.hatching-section {
  display: flex;
  justify-content: center;
  height:100vh;
  background-image: url('./../assets/jungle_hatch.jpeg');
}
.page-wrapper {

}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.hatching-box {

 position: relative;
 height: 100%;
 width: 100%;
}
.nest {
  position: absolute;
  height: 80px;
  width: 80px;
  background: url('./../assets/nest.png');
  background-size: cover;
  bottom:280px;
  right:220px;
}
.message {
  background-color: white;
  width:200px;
   padding: 20px;
  margin: 30px;
  margin-left:5px;
    border: 4px solid grey;
  border-radius: 8px;
}

</style>
