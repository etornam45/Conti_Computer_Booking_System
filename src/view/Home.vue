<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import PocketBase from "pocketbase";
import { onMounted } from "vue";

import { useRouter } from "vue-router";

let router = useRouter();

const pb = new PocketBase("http://127.0.0.1:8090");

let currentUser = pb.authStore.model;

pb.authStore.onChange(() => {
  currentUser = pb.authStore.model;
});

onMounted(() => {
  console.log(currentUser);
  if (!currentUser) {
    console.log(currentUser);
    router.push({
      name: "signup",
    });
  }
});

const LogOut = () => {
  pb.authStore.clear();

  router.push({
    name: "signup",
  });
};
</script>

<template>
  Home

  <button v-on:click="LogOut">LogOut</button>
</template>
