<template>
  <div class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3
          class="no-space"
        >
          MetaMaskModal
        </h3>
        <div
          class="close"
          @click="$eventBus.$emit('closeMetaMaskModal')"
        />
      </div>
      <div class="grid">
        <p>
          Please Add the current domain as a valid connection to your MetaMask Account.
        </p>
        <p>
          Account > Settings > Connections > Connect
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MetaMaskSetup"
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
    overflow-y: scroll;
    border-top: 5px solid var(--fg);
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
    text-align: justify;
  }
  a {
    font-weight: bold;
    float: right;
  }
  h4.no-space, h3.no-space {
    margin: 0;
    padding: 15px 0 0 0;
  }
</style>
