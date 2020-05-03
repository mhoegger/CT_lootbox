<template>
  <div class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <div
          class="close"
          @click="$eventBus.$emit('closeSellCard')"
        />
        <h3
          class="no-space"
        >
          SellCardModal
        </h3>
        <input type="number" v-model="price" placeholder="price">
        <button @click="sendOffer">submit</button>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "OpenBox",
  props: {
    card_id: String
  },
  data () {
    return {
      price: null
    };
  },
  methods: {
    sendOffer () {
      console.log("P", this.price);
      this.$store.dispatch("createOfferingFromContract", {
        cardNumber: this.card_id,
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
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }
  .modal-header {
    display: inline;
  }
  .modal-container {
    position: relative;
    min-width: 65vw;
    max-width: 90vw;
    height: fit-content;
    max-height: 90vh;
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
  .close:before, .close:after {
    position: absolute;
    left: 15px;
    content: ' ';
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
  h4.no-space, h3.no-space {
    margin: 0;
    padding: 15px 0 0 0;
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
</style>
