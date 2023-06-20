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
      name: "signin",
    });
  }
});

const LogOut = () => {
  pb.authStore.clear();

  router.push({
    name: "signin",
  });
};
</script>

<template>
  <main v-if="currentUser">
    <header>
      <div>
        <div style="display: flex; align-items: center; gap: 20px;">
          <div class="avatar">

          </div>
          <div class="user">
          <p>
            {{ currentUser.student_id }}
          </p>
          <p>
            {{ currentUser.name }}
          </p>
        </div>
        </div>
        <button v-on:click="LogOut">Sign Out</button>
      </div>
    </header>

    <article>
      <section></section>
      <section></section>
      <section></section>
    </article>
  </main>
</template>

<style scoped>

section{
  margin-bottom: 20px;
  height: 300px;
  background: whitesmoke;
  border: 1px solid grey;
  /* box-shadow: 1px 1px 2px #ccc; */
  border-radius: 4px;
}


.avatar{
  height: 50px;
  width: 50px;
  background: black;
  border-radius: 50px;
}
.user{
  display: flex;
  flex-direction: column;
  /* align-self: auto; */
  align-items: flex-start;
  /* color: black; */
  font-weight: bold;
}

main{
  --added-h: 70px;
  --main-width: 800px;
}

article{
  max-width: var(--main-width);
  margin: 20px auto;
  /* background: lime; */
  padding: var(--added-h) 0;
  height: max-content;
}

header {
  height: 70px;
  background: rgb(235, 180, 180);
  box-shadow: 0 0 3px black;
  position: fixed;
  top: 0;
  width: 100vw;
}

header > div {
  max-width: var(--main-width);
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  height: 100%;

  /* color: white; */
}

@media screen and (max-width: 800px) {
  header > div {
    padding: 0 20px;
  }
  article{
    padding-left: 20px;padding-right: 20px;
  }
}

button {
  padding: 10px 20px;

  border-radius: 6px;
  font-size: 18px;
  background: rgb(236, 18, 18);
  font-weight: 800;
  border: 0;
  --border-color: rgb(136, 26, 7);
  color: white;
  transition: 500ms;
  /* border-bottom: 3px solid var(--border-color); */
  cursor: pointer;
}
</style>
