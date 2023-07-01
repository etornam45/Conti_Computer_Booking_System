<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <main>
    <RouterView> </RouterView>
  </main>
  <footer>
    <div>Made with 💕 by <a href="https://twitter.com/supacodar" target="_blank">@Bennie</a></div>
  </footer>
</template>

<style scoped>


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
    z-index: 4;
  }
</style>
