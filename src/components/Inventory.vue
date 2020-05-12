<template>
  <div class="page-wrapper">
    <audio ref="sound_common" v-bind:src="require(`@/assets/sounds/sound_common.mp3`)"></audio>
    <audio ref="sound_uncommon" v-bind:src="require(`@/assets/sounds/sound_uncommon.mp3`)"></audio>
    <audio ref="sound_rare" v-bind:src="require(`@/assets/sounds/sound_rare.mp3`)"></audio>
    <audio ref="sound_epic" v-bind:src="require(`@/assets/sounds/sound_epic.mp3`)"></audio>
    <audio ref="sound_legendary" v-bind:src="require(`@/assets/sounds/sound_legendary.mp3`)"></audio>
    <div class="hatching-section" ref="hatchingSection">
      <Rain></Rain>
      <div class="hatching-box" ref='hatchingBox'>
        <div class="nest" ref="nest">
          <div class="nest-wrapper">
            <Box
              v-for="(card) in pending_cards"
              :key="card.tx"
              :box="card"
              :status="0"
              :openingAnimantion="openBox"
            ></Box>
            <Box
              v-for="(card) in bought_cards"
              :key="card.tx"
              :box="card"
              :status="1"
              :openingAnimantion="openBox"
            ></Box>
            <Box
              v-for="(card) in ready_cards"
              :key="card.tx"
              :box="card"
              :status="2"
              :openingAnimantion="openBox"
            ></Box>
            <Box
              v-for="(card) in revealing_cards"
              :key="card.tx"
              :box="card"
              :status="3"
              :openingAnimantion="openBox"
            ></Box>
            <Box
              v-for="(card) in unopened_cards"
              :key="card.tx"
              :box="card"
              :status="4"
              :openingAnimantion="openBox"
            ></Box>
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
        <div v-if="pending_cards.length>0" class="message" id="wait">
          Our archaeologists are currently removing the dust from the prehistoric egg. You will get your precious prehistoric
          friend any minute!
        </div>
        <!-- Bought -->
        <div
          v-if="bought_cards.length>0"
          class="message"
          id="wait"
        >We found a very special egg, it is currently on its way to you!</div>
        <!-- Ready -->
        <div
          v-if="ready_cards.length>0"
          class="message"
          id="wait"
        >Click on your new egg to start hatching it!</div>
        <!-- Revealing -->
        <div
          v-if="revealing_cards.length>0"
          class="message"
          id="wait"
        >It's already shaking, just a few moments!</div>
        <!-- Unopened -->
        <div v-if="unopened_cards.length>0" class="message" id="wait">Click to see what you hatched!</div>
      </div>

      <div class="opening_animation" ref="openingAnimation">
        <div class="scaler">
          <div class="rotator">
            <div class="glower" :class="opening_card_rarity">
              <CardOpening v-if="show_openbox_modal" :card="opening_card"></CardOpening>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll">
      <span v-on:click="scrollDown" class="bounce">
        <img src="./../assets/chevron-down-solid.svg" alt />
      </span>
    </div>

    <div class="inventory">
          <div class="scroll top">
      <span v-on:click="scrollUp" class="bounce">
        <img src="./../assets/chevron-down-solid.svg" alt />
      </span>
    </div>
      <div class="container" ref="inventory">
        <div class="card-grid">
          <Card v-for="(card, index) in open_cards" :key="index" :card="card"></Card>
        </div>
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
import CardOpening from "./CardOpening";
import Box from "./Box";
import Rain from "./Rain";
import getCard from "./../util/constants/cards";

export default {
  name: "Inventory",
  data() {
    return {
      eggX: 0,
      eggY: 0,
      openBox: false,
      show_openbox_modal: false,
      opening_card_id: null,
      opening_card_rarity: "epic"
    };
  },
  props: {},
  components: {
    Card,
    Box,
    Rain,
    CardOpening
  },
  methods: {
    getCardRarity(id) {
      return getCard(id).rarity;
    },
    hatch(id) {
      console.log("hatching: " + id);
    },
    scrollDown() {
      console.log("scroll");
      const el = this.$refs.inventory;
      el.scrollIntoView({ behavior: "smooth" });
    },
        scrollUp() {
      console.log("scroll");
      const el = this.$refs.hatchingBox;
      el.scrollIntoView({ behavior: "smooth" });
    },
    generateEggPosition() {
      var width = this.$refs.hatchingSection.clientWidth;
      var height = this.$refs.hatchingSection.clientHeight;
      this.eggX = 20;
      this.eggY = 72;
    },
    setEggPosition() {
      this.$refs.nest.style.top = this.eggY + "%";
      this.$refs.nest.style.left = this.eggX + "%";
    },
    startOpeningAnimation: function() {
      this.$refs.openingAnimation.style.top = this.$refs.nest.style.top;
      this.$refs.openingAnimation.style.left = this.$refs.nest.style.left;
      this.$refs.openingAnimation.classList.add("centered");
    },
    playSoundFile: function(rarity) {
      //var filename = `@/assets/sounds/sound_${rarity}.mp3`;
      //var audio = new Audio(require(filename));
      //console.log('filename: '+ filename)
      this.$refs[`sound_${rarity}`].play();
      //document.getElementById('audio').play();
      console.log("played");
    }
  },
  computed: {
    pending_cards() {
      var cards = this.$store.state.box_pile.pending;

      return cards;
    },
    bought_cards() {
      var cards = this.$store.state.box_pile.bought;
      return cards;
    },
    ready_cards() {
      var cards = this.$store.state.box_pile.ready;

      return cards;
    },
    revealing_cards() {
      var cards = this.$store.state.box_pile.revealing;
      return cards;
    },
    unopened_cards() {
      //var cards = this.$store.state.box_pile.unopened;
      var cards = [];

      return cards;
    },
    open_cards() {
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
      var test_card = [];
      test_card.push({
        tx: 0,
        revealblock: "asdf",
        card_id: 1,
        click: () => {}
      });
      test_card.push({
        tx: 5,
        revealblock: "qwer",
        card_id: 2,
        click: () => {}
      });
      return open_cards;
    }
  },
  created() {
    console.log("dispatching getContractInstance");
    // this.$store.dispatch("getContractInstance");
  },
  mounted() {
    this.generateEggPosition();
    this.setEggPosition();
    this.$eventBus.$on("openOpenBox", id => {
      console.log("opening card with id: " + id);
      this.opening_card_rarity = this.getCardRarity(id);
      this.openBox = true;
      this.show_openbox_modal = true;
      this.playSoundFile(this.opening_card_rarity);
      this.$refs.openingAnimation.style.display = "block";
      this.opening_card = {
        tx: 5,
        revealblock: "temp",
        card_id: id,
        click: () => {
          this.show_openbox_modal = false;
          this.$refs.openingAnimation.style.display = "none";
        }
      };
      this.startOpeningAnimation();
    });
    this.$store.dispatch("getContractInstance");

    console.log("dispatching getCardsOpen");
    this.$store.dispatch("getCardsOpen");

    console.log("mount");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.opening_animation .glower {
  height: 298px;
  width: 205px;
  box-shadow: 0 0 0px 0px;
  transition: box-shadow 2s ease-in-out;
}
.opening_animation.centered .glower {
  box-shadow: 0 0 15px 15px;
}
.opening_animation {
  position: absolute;
  transition: transform 2s;
}
.opening_animation .scaler {
  transform: scale(0);
  transition: transform 2s;
}
.opening_animation.centered .scaler {
  transform: scale(1);
}
.opening_animation .rotator {
  transform: rotateZ(0deg);
  transition: transform 2s;
}
.opening_animation.centered .rotator {
  transform: rotateZ(720deg);
}
.opening_animation.centered {
  transform: translate3d(484px, -505px, 0px) scale(1);
}
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

.opening_animation.centered .glower.common {
  animation: glow-common linear 2s infinite;
}

.opening_animation.centered .glower.uncommon {
  animation: glow-uncommon linear 2s infinite;
}

.opening_animation.centered .glower.rare {
  animation: glow-rare linear 2s infinite;
}

.opening_animation.centered .glower.epic {
  animation: glow-epic linear 2s infinite;
}

.opening_animation.centered .glower.legendary {
  animation: glow-legendary linear 2s infinite;
}

@keyframes glow-common {
  0% {
    box-shadow: 0 0 1px 1px #606060;
  }
  50% {
    box-shadow: 0 0 15px 15px #606060;
  }
  100% {
    box-shadow: 0 0 1px 1px #606060;
  }
}
@keyframes glow-uncommon {
  0% {
    box-shadow: 0 0 1px 1px #153458;
  }
  50% {
    box-shadow: 0 0 20px 20px #153458;
  }
  100% {
    box-shadow: 0 0 1px 1px #153458;
  }
}
@keyframes glow-rare {
  0% {
    box-shadow: 0 0 1px 1px #b033d7;
  }
  50% {
    box-shadow: 0 0 25px 25px #b033d7;
  }
  100% {
    box-shadow: 0 0 1px 1px #b033d7;
  }
}
@keyframes glow-epic {
  0% {
    box-shadow: 0 0 1px 1px #bd5137;
  }
  50% {
    box-shadow: 0 0 35px 35px #bd5137;
  }
  100% {
    box-shadow: 0 0 1px 1px #bd5137;
  }
}
@keyframes glow-common {
  0% {
    box-shadow: 0 0 1px 1px #f98a0b;
  }
  50% {
    box-shadow: 0 0 40px 40px #f98a0b;
  }
  100% {
    box-shadow: 0 0 1px 1px #f98a0b;
  }
}
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

.scroll {
  position: absolute;
  bottom: 0;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
}
.scroll.top {
  position: absolute;
  top: 100vh;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
}
.scroll.top .bounce img{
  transform: rotateZ(180deg);
}
.scroll span {
  color: black;
  display: block;
}
.scroll img {
  height: 50px;
  width: 50px;
}
.hatching-section {
  display: flex;
  justify-content: center;
  height: 100vh;
  background-image: url("./../assets/jungle_hatch.jpeg");
}
.inventory {
    display: flex;
  justify-content: center;
  height: 100vh;
  background-image: url("./../assets/wood_wall.jpeg");
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
  left: 700px;
  top: -70px;
}
.nest {
  position: absolute;
  height: 100px;
  width: 133px;
  background: url("./../assets/nest.png");
  background-size: cover;
}
.nest-wrapper {
  position: relative;
  height: 100%;
}
Box {
  position: absolute;
  left: 50%;
  bottom: 0;
}
.message {
  background-color: white;
  width: 200px;
  padding: 20px;
  margin: 30px;
  margin-left: 5px;
  border: 4px solid grey;
  border-radius: 8px;
}
</style>
