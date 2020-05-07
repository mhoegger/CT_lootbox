<template>
  <div class="footer">    
      Blockchain Lootboxes
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.footer {
    position: absolute;
    bottom:0;
    background-color: #f5f7ff;
    color: #616b93;
    display: flex;
    padding: 20px 50px;
    margin-top: 50px;
}
</style>