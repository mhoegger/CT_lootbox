<template>
  <div class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <div class="close" @click="$eventBus.$emit('closeSellCard')" />
        <h3 class="no-space">Choose your Price</h3>
        <input type="number" v-model="price" placeholder="price" />
        <a href="#" @click="sendOffer" class="btn btn-bubble">Sell</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OpenBox",
  props: {
    card_id: Number
  },
  data() {
    return {
      price: null
    };
  },
  methods: {
    sendOffer() {
      console.log("P", this.price);
      this.$store.dispatch("createOfferingFromContract", {
        cardNumber: (this.card_id - 1).toString(),
        price: this.price
      });
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 2s;
  transform: translateX(-100vw);
}
.modal-mask.open {
  transform: translateX(0);
}
.modal-header {
  display: inline;
}
.modal-container {
  width: 400px;

  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  background-color: var(--bg);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
  border-top: 5px solid var(--fg);
  overflow-y: auto;
}
.close {
  float: right;
  position: relative;
  width: 32px;
  height: 32px;
  opacity: 0.3;
  cursor: pointer;
}
.close:hover {
  opacity: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: " ";
  height: 25px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
.modal-header > img {
  width: 150px;
}
.grid {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  -ms-flex-wrap: wrap; /* IE10 */
  flex-wrap: wrap;
  padding: 0 4px;
}
a {
  font-weight: bold;
  float: right;
}
h4.no-space,
h3.no-space {
  margin-top: 0;
  padding: 15px 0 0 0;
  padding-top: 0;
}
img.img-setup {
  -ms-flex: 24%; /* IE10 */
  flex: 24%;
  max-width: 24%;
  padding: 0 4px;
}

@media screen and (max-width: 900px) {
  img.img-setup {
    -ms-flex: 48%; /* IE10 */
    flex: 48%;
    max-width: 48%;
    padding: 0 4px;
  }
}

@media screen and (max-width: 500px) {
  img.img-setup {
    -ms-flex: 98%; /* IE10 */
    flex: 98%;
    max-width: 98%;
    padding: 0 4px;
  }
}


.btn-bubble {
  color: white;
  background-color: #77b11c;
  background-repeat: no-repeat;
}
.btn-bubble:hover, .btn-bubble:focus {
  -webkit-animation: bubbles 1s forwards ease-out;
          animation: bubbles 1s forwards ease-out;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 60% 121% / 0.77em 0.77em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 58% 103% / 0.87em 0.87em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 110% 105% / 0.64em 0.64em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 48% 148% / 0.6em 0.6em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 74% 146% / 0.55em 0.55em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 39% 109% / 0.76em 0.76em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) -4% 100% / 1.1em 1.1em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 61% 102% / 1.11em 1.11em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) 106% 139% / 0.94em 0.94em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) -4% 148% / 1.09em 1.09em, radial-gradient(circle at center, rgba(0, 0, 0, 0) 30%, #eeeeff 60%, #eeeeff 65%, rgba(0, 0, 0, 0) 70%) -1% 106% / 0.97em 0.97em;
  background-color: #77b11c;
  background-repeat: no-repeat;
}

@-webkit-keyframes bubbles {
  100% {
    background-position: 68% -1%, 60% -46%, 109% -139%, 57% -267%, 80% -384%, 33% -191%, 1% -335%, 70% -100%, 116% -207%, -11% -81%, -8% 19%;
    box-shadow: inset 0 -6.5em 0 #0072c4;
  }
}

@keyframes bubbles {
  100% {
    background-position: 68% -1%, 60% -46%, 109% -139%, 57% -267%, 80% -384%, 33% -191%, 1% -335%, 70% -100%, 116% -207%, -11% -81%, -8% 19%;
    box-shadow: inset 0 -6.5em 0 #0072c4;
  }
}
body {
  background: #10192d;
  display: -webkit-box;
  display: flex;
  min-height: 100vh;
  -webkit-box-pack: center;
          justify-content: center;
  align-content: center;
  -webkit-box-align: center;
          align-items: center;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 1em 2em;
}



</style>
