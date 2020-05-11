<template>
  <div class="egg-wrapper" @click="box.click">
    <div class="egg" :class="animClass">
      <div class="img-container" >
        <img :style="colorEgg" class="masked" alt />
        <div class="rotator" v-if="openingAnimantion">
       <img class='egg-img egg-top' v-bind:class="{flying: openingAnimantion}" src="./../assets/eggs/egg_top.png" alt
        />
        </div>

        <img class='egg-img egg-bottom' src="./../assets/eggs/egg_bottom.png" alt
        v-if="openingAnimantion"/>
        <img class='egg-img' :src="imageUrl" alt
        v-if="!openingAnimantion"/>
      </div>
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
    status: Number,
    openingAnimantion: Boolean
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
      return require(`@/assets/eggs/egg_${this.status}.png`);
    },

    animClass () {
      switch (this.status) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          return "ready";
        case 3:
          return "revealing";
        case 4:
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rotator {
    transform-origin: 50% 50%;
    animation: fly-out 2s linear 0s 1;

}
.egg-img.egg-top.flying {
    animation: rotate 0.5s linear 0s infinite;

  }
.egg-img {
  height:100%;
  width:71%;
}

.egg-wrapper {
  position: absolute;
bottom: 29px;
left: 42px;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  } to {
    transform: rotate(360deg);
  }

}
@keyframes fly-out {
  0% {
    transform: translate3d(0px,0px,0px);
  }
    10% {
    transform: translate3d(50px,-70px,0px);
  }
    20% {
    transform: translate3d(100px,-160px,0px);
  }
    30% {
    transform: translate3d(150px,-230px,0px);
  }
    40% {
    transform: translate3d(200px,-280px,0px);
  }
      50% {
    transform: translate3d(250px,-300px,0px);
  }
      60% {
    transform: translate3d(300px,-200px,0px);
  }
      70% {
    transform: translate3d(350px,-150px,0px);
  }
      80% {
    transform: translate3d(400px,-100px,0px);
  }
      90% {
    transform: translate3d(450px,-50px,0px);
  }
  100% {
    transform: translate3d(500px,0px,0px);
  }
}

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

.bounce {
  animation-name: bounce;
  animation-timing-function: ease;
}
@keyframes bounce {
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-25px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-7px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
}

.egg.revealing img {
  animation: shake 1.5s infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.egg.ready img {
  animation: bounce 1.5s infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}


.egg img {
  height: 100%;
  width: 71%;
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
