<template>
  <div class="card-wrapper" @click="box.click">
    <div class="egg" :class="animClass">
      <div class="img-container" >
        <img :style="colorEgg" class="masked" alt />
        <img :src="imageUrl" alt />
      </div>
      <p>{{status}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "Box",
  data () {
    return {};
  },
  props: {
    box: Object,
    status: Number
  },
  components: {},
  methods: {
    stringToColour (str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = "#";
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
    }
  },
  created () {},
  watch: {
    status (val) {
      this.$forceUpdate();
    }
  },
  computed: {
    colorEgg () {
      return {
        backgroundColor: this.stringToColour(this.box.tx),
        "-webkit-mask": `url(../../static/image/egg_${this.status}_mask.svg) no-repeat`,
        "mask": `url(../../static/image/egg_${this.status}_mask.svg) no-repeat`

      };
    },
    imageUrl () {
      // console.log(`@/assets/egg-${this.status}.png`);
      // return require(`@/assets/egg-${this.status}.png`);
      return require("@/assets/egg_0_grey.png");
    },

    animClass () {
      switch (this.status) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          return "ready";
        case 4:
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* ---- animations ----- */
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
    transform: rotateZ(1deg);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
    transform: rotateZ(3deg);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
    transform: rotateZ(-3deg);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
    transform: rotateZ(3deg);
  }
}

.egg.ready img {
  animation: shake 1.5s infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.egg img {
  height: 100%;
  width: 100%;
  z-index: 0;

}

.img-container{
  position: relative;
}
.masked{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  opacity: 0.5;
  -webkit-mask: url(../../static/image/egg_0_mask.svg) no-repeat;
  -webkit-mask-size: 100%;
  mask-size: 100%;
}

</style>
