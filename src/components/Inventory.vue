<template>
  <div class="page-wrapper">
    <p>
      {{`pending_cards ${pending_cards} ${pending_cards.length}`}}
    </p>
    <div v-for="card in pending_cards" :key="card.tx">
      <p>
        {{`card.tx: ${card.tx} card.time_issued: ${card.time_issued}`}}
      </p>
    </div>
    <p>
      {{`unopened_cards ${unopened_cards} ${unopened_cards.length}`}}
    </p>
    <div v-for="card in unopened_cards" :key="card.tx">
      <p>
        {{`card.tx: ${card.tx} card.time_issued: ${card.time_issued} card.card_id: ${card.card_id}`}}
      </p>
    </div>

    <p>
      {{`opened_cards ${open_cards} ${open_cards.length}`}}
    </p>
    <div v-for="(card, index) in open_cards" :key="index">
      <p>
        {{`${index}: ${card}`}}
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: "Inventory",
  data () {
    return {

    };
  },
  props: {},
  components: {
  },
  computed: {
    pending_cards () {
      return this.$store.state.cardDeck.pending;
    },
    unopened_cards () {
      return this.$store.state.cardDeck.unopened;
    },
    open_cards () {
      console.log("this.$store.state.cardDeck.open", this.$store.state.cardDeck.open);
      let open_card = Object.assign({}, this.$store.state.cardDeck.open.map(x => x.toNumber()));
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
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
