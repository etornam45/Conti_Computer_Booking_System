<script setup>
import PocketBase from "pocketbase";
// import { ref } from "vue";
const pb = new PocketBase("http://127.0.0.1:8090");

import { useRouter } from "vue-router";

let router = useRouter();

let email = "";
let password = "";

async function signin() {
  const authData = await pb
    .collection("students")
    .authWithPassword(email, password)
    .then(() => {
      router.push({
        name: "home",
      });
    });
}
</script>

<template>
  <main>
    <form>
      <h3>Sign Into Account</h3>

      <input v-model="email" type="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Password" />

      <button v-on:click.prevent="signin">Sign In</button>
      <p>Don't have an account? <RouterLink to="/signup">create one</RouterLink></p>
    </form>
  </main>
</template>
<!-- <Footer /> -->

<style scoped>
main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  /* width: 400px; */
  width: calc(100% - 100px);

  gap: 30px;
  padding: 30px;
  border: 1.6px solid rgb(161, 161, 161);
  border-radius: 4px;
}
p {
  text-align: center;
  padding: 0;
}

h3 {
  font-weight: bolder;
  text-align: center;
  font-family: sans-serif;
  font-size: 20px;
}

input {
  padding: 20px;
  border: 0;
  border-bottom: 2px solid gray;
  background-color: #e9e9ed;
  border-radius: 4px;
}

button {
  padding: 20px;
  border-radius: 4px;
  font-size: 18px;
  background: rgb(243, 127, 127);
  font-weight: 800;
  border: 0;
  --border-color: rgb(231, 54, 23);

  transition: 500ms;
  border-bottom: 3px solid var(--border-color);
  cursor: pointer;
}

button:active {
  border: 0;
}
</style>
