<script setup>
import PocketBase from "pocketbase";
const pb = new PocketBase("http://localhost:8090");

let name = "";
let email;
let password;
let student_id;

import { useRouter } from "vue-router";

let router = useRouter();

const signUpUser = async () => {
  const data = {
    username: name.split("").join("_"),
    email: email,
    emailVisibility: true,
    password: password,
    passwordConfirm: password,
    name: name,
    student_id: student_id,
  };

  const record = await pb
    .collection("students")
    .create(data)
    .then(async (result) => {
      // await pb;
      await pb
        .collection("students")
        .authWithPassword(email, password)
        .then(() => {
          router.push({ name: "home" });
        });
    });
};
</script>

<template>
  <main>
    <form v-on:submit.prevent>
      <h3>Create An Account</h3>

      <input v-model="name" type="text" placeholder="Full Name" />
      <input v-model="student_id" type="number" placeholder="Student Id" />
      <input v-model="email" type="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Password" />

      <button v-on:click.prevent="signUpUser()">Sign Up</button>

      <p>
        Already have an account? <RouterLink to="/signin">Sign In</RouterLink>
      </p>
    </form>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 70px;
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
