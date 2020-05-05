<template>
  <div class="card-wrapper" @click="box.click">
    <div class="egg" :class="animClass">
      <img :src="imageUrl" alt />
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
  methods: {},
  created () {},
  computed: {
    imageUrl () {
      console.log(`@/assets/egg-${this.status}.png`);
      return require(`@/assets/egg-${this.status}.png`);
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
  height: 100px;
  width: 100px;
}
</style>
