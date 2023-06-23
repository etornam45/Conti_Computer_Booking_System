<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <main>
    <RouterView> </RouterView>
  </main>
  <footer>
    <div>Made with 💕 by <a href="#">@Bennie</a></div>
  </footer>
</template>

<style scoped>

main{
  width: 800px;
  margin: 0 auto;
  margin-bottom: 100px;
}

  footer{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
    background: black;
    color: white;
    width: 100vw;
    position: fixed;
    bottom: 0;
  }
</style>
