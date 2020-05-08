 <template>
  <div class="header">
    <router-link to="/">
      <img class="home-button" v-bind:src='require("@/assets/home_button.png")' alt />
    </router-link>
    <img class="user-button" v-bind:src='require("@/assets/user_button.png")' alt />
    <div class="ether-button">
      <img v-bind:src='require("@/assets/etherium.png")' alt />
      <p>{{balance}}</p>
    </div>
  </div>
</template>

<script>

import ether from "@/mixin/ether.js";

export default {
  name: "Header",
  props: {
    msg: String
  },
  computed: {
    balance () {
      console.log(this.toEther(this.$store.state.web3.balance));
      return this.toEther(this.$store.state.web3.balance);
    },
    address () {
      return this.$store.state.web3.coinbase;
    }
  },
  mixins: [ether],
  created () {
    console.log("....");
  }
};
</script>

<style scoped>
.header {
  top: 0;
  position: sticky;
}
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 20px;
}
h3 {
  color: #5f69ef;
  font-weight: 700;
  font-size: 40px;
}
#eth-account {
  display: flex;
  align-items: center;
}
#eth-balance {
  display: inline-block;
  height: 100%;
}
#eth-balance p {
  font-size: 1.5rem;
  margin-left: 1rem;
}
.header-right img {
  max-height: 50px;
  width: auto;
}

img.avatar {
  border-radius: 50%;
  background-color: #5E5E5E;
}
.home-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  z-index: 9999;
}

.user-button {
  position: absolute;
  top: 80px;
  left: 20px;
  width: 50px;
  height: 50px;
  z-index: 9999;
}

.ether-button img {
  height: 50px;
  z-index: 9999;
}
.ether-button p {
  position: absolute;
  top: -10px;
  right: 50px;
  height: 50px;
  z-index: 9999;
  font-family: 'Frijole';
  font-size: 22px;
  font-stretch: ultra-expanded;
  color: black;
}

.ether-button {
  position: absolute;
  top: 20px;
  right: 20px;
  height: 50px;
  z-index: 9999;
}


</style>
