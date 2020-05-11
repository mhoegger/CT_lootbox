<template>
  <div class="page-wrapper">

      <div class="hatching-section" ref="hatchingSection">
        <Rain>
          </Rain>
      <div class="hatching-box">
        <div class="nest" ref="nest">
          <div class="nest-wrapper">
          <Box v-for="(card) in pending_cards" :key="card.tx" :box="card" :status="0" :openingAnimantion="openBox"></Box>
          <Box v-for="(card) in bought_cards" :key="card.tx" :box="card" :status="1" :openingAnimantion="openBox"></Box>
          <Box v-for="(card) in ready_cards" :key="card.tx" :box="card" :status="2" :openingAnimantion="openBox"></Box>
          <Box v-for="(card) in revealing_cards" :key="card.tx" :box="card" :status="3" :openingAnimantion="openBox"></Box>
          <Box v-for="(card) in unopened_cards" :key="card.tx" :box="card" :status="4" :openingAnimantion="openBox"></Box>
          </div>
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

      <div class="container">
      <div class="card-grid">
        <Card v-for="(card, index) in open_cards" :key="index" :card="card"></Card>
      </div>
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
    return {
      eggX: 0,
      eggY: 0,
      openBox: false
    };
  },
  props: {},
  components: {
    Card,
    Box,
    Rain
  },
  methods: {
    hatch (id) {
      console.log("hatching: " + id);
    },
    scrollDown () {
      console.log("scroll");
    },
    generateEggPosition () {
      var width = this.$refs.hatchingSection.clientWidth;
      var height = this.$refs.hatchingSection.clientHeight;
      console.log(width);
      console.log(height);
      this.eggX = Math.random() * 100;
      this.eggY = Math.random() * 100;
    },
    setEggPosition () {
      this.$refs.nest.style.top = this.eggX + "%";
      this.$refs.nest.style.left = this.eggY + "%";
    }
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
      /*cards.push({
        'tx':1,
        'click': () => {
          this.openBox = true;
          this.$eventBus.$emit("openOpenBox", 1);
          }
      });*/
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
          let new_card = Object.assign({}, card);
          new_card.click = () => {
            this.$eventBus.$emit("openSellCard", new_card.card_id);
          };
          open_cards.push(new_card);
        }
      });
      /*
      this.unopened_cards.forEach(card => {
        console.log("*", open_cards, card);
        let unopened = open_cards.find(c => c.card_id === parseInt(card.content));
        console.log("unop", unopened);
        if (unopened) {
          unopened.amount = unopened.amount - 1;
        }
      });*/
      // var test_card = [];
      // test_card.push({ tx: 0, revealblock: "asdf", card_id: 1, "click": () => {} });
      // test_card.push({ tx: 5, revealblock: "qwer", card_id: 2, "click": () => {} });
      return open_cards;
    }
  },
  created () {
    console.log("dispatching getContractInstance");
    // this.$store.dispatch("getContractInstance");
  },
  mounted () {
    this.generateEggPosition();
    this.setEggPosition();
    this.$store.dispatch("getContractInstance");

    console.log("dispatching getCardsOpen");
    this.$store.dispatch("getCardsOpen");
    this.$eventBus.$on("openOpenBox", (id) => {
      console.log("opening card with id: " + id);
      // this.opening_card_id = card;
      // this.show_openbox_modal = true;
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 80%;
  margin: auto;
}

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
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.hatching-box {

  left:700px;
  top:-70px;
}
.nest {
  position: absolute;
  height: 100px;
  width: 133px;
  background: url('./../assets/nest.png');
  background-size: cover;

}
.nest-wrapper {
  position: relative;
  height: 100%;
}
Box {
  position: absolute;
  left:50%;
  bottom:0;
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
