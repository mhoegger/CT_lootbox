 <template>
  <div class="header">
    <router-link to="/">
      <div class="header-wrapper">
        <h3>Blockchain Lootboxes</h3>
        <div class="header-right">
          <div id="eth-account">
            <img class="img-fluid" src="./../assets/ethereum-1.svg" alt />
            <div id="eth-balance">
              <p>{{balance}}</p>
            </div>
            <img class="avatar" :src="`https://robohash.org/${{address}}`" alt="Avatar">
          </div>
        </div>
      </div>
    </router-link>
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
  background-color: #f5f7ff;
  width: 100%;
  max-width: 100%;
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
</style>
