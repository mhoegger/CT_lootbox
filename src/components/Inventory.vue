<template>
  <div class="page-wrapper">
    <div class="container">
              <h3>Your hatching box</h3>

      <div class="hatching-box">
        <div class="card-grid">
          <Box v-for="(card) in pending_cards" :key="card.tx" :box="card" :status="0"></Box>
          <Box v-for="(card) in bought_cards" :key="card.tx" :box="card" :status="1"></Box>
          <Box v-for="(card) in ready_cards" :key="card.tx" :box="card" :status="2"></Box>
          <Box v-for="(card) in revealing_cards" :key="card.tx" :box="card" :status="3"></Box>
          <Box v-for="(card) in unopened_cards" :key="card.tx" :box="card" :status="4"></Box>
        </div>
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
  </div>
</template>

<script>
import Card from "./Card";
import Box from "./Box";

export default {
  name: "Inventory",
  data () {
    return {};
  },
  props: {},
  components: {
    Card,
    Box
  },
  computed: {
    pending_cards () {
      var cards = this.$store.state.box_pile.pending;
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
      let open_card = [];
      let temp = this.$store.state.card_pile;
      Object.keys(temp).forEach(id => {
        if (temp[id] > 0) {
          open_card.push({id: id,
            count: temp[id],
            click: () => {
              console.log("DO Nothing");
            }});
        }
      });
      let unopen_card = this.$store.state.box_pile.unopened;
      unopen_card.forEach(card_id => {
        open_card[card_id] = parseInt(open_card[card_id]) - 1;
      });
      console.log("open_card", open_card);
      var test_card = [];
      test_card.push({ tx: 0, revealblock: "asdf", content: 1 });
      test_card.push({ tx: 0, revealblock: "qwer", content: 2 });
      return open_card;
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
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.hatching-box {
  background-color: brown;
  padding: 20px;
  margin: 30px;
}
</style>
