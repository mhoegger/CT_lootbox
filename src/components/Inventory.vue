<template>
  <div class="page-wrapper">
    <p>{{`pending_cards ${pending_cards} ${pending_cards.length}`}}</p>
    <div v-for="card in pending_cards" :key="card.tx">
      <p>{{`card.tx: ${card.tx} card.time_issued: ${card.time_issued}`}}</p>
    </div>
    <p>{{`unopened_cards ${unopened_cards} ${unopened_cards.length}`}}</p>
    <div v-for="card in unopened_cards" :key="card.tx">
      <p>{{`card.tx: ${card.tx} card.time_issued: ${card.time_issued} card.card_id: ${card.card_id}`}}</p>
    </div>
    <p>{{`opened_cards ${open_cards} ${open_cards.length}`}}</p>
    <div class="container">
      <h3>open cards</h3>
      <div class="card-grid">
        <div v-for="(card, index) in open_cards" :key="index">
          <Card v-if="card>0"></Card>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "Inventory",
  data () {
    return {};
  },
  props: {},
  components: {
    Card
  },
  computed: {
    pending_cards () {
      return this.$store.state.cardDeck.pending;
    },
    unopened_cards () {
      return this.$store.state.cardDeck.unopened;
    },
    open_cards () {
      console.log(
        "this.$store.state.cardDeck.open",
        this.$store.state.cardDeck.open
      );
      let open_card = Object.assign(
        {},
        this.$store.state.cardDeck.open
      );
      let unopen_card = this.$store.state.cardDeck.unopened;
      unopen_card.forEach(card_id => {
        open_card[card_id] = parseInt(open_card[card_id]) - 1;
      });
      console.log("open_card", open_card);
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
</style>
