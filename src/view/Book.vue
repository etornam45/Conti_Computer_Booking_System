<script setup>
import PocketBase from "pocketbase";
import { useRouter } from "vue-router";
import { onMounted, ref, onUnmounted } from "vue";

let router = useRouter();
const pb = new PocketBase("http://127.0.0.1:8090");
let currentUser = pb.authStore.model;

let AllComputers = ref([]);
let bookings = ref([])
onMounted(async () => {
  if (!currentUser) {
    router.push({
      name: "signin",
    });
  }

  pb.collection("computers")
    .getFullList({
      filter: 'status = "Available"',
    })
    .then((result) => {
      AllComputers.value = result;
      console.log(result)
    });

  pb.collection("bookings")
    .getFullList()
    .then((a) => {
      for (let computer = 0; computer < AllComputers.value.length; computer++) {
        // a.forEach(booking => {
        //   if(AllComputers.value[computer].id == booking.computer){
        //     AllComputers.value[computer].booking.push(booking)
        //     console.log(AllComputers)
        //   }
        // })

        bookings.value = a
        console.log(a)
        console.log(bookings.value);
      }
    });
});

onUnmounted(async () => {});
</script>

<template>
  <form action="/">
    <input type="time" placeholder="Start Time" />
    <input type="time" placeholder="End Time" />
  </form>

  <section>
    <h3>Section A</h3>

    <div v-if="AllComputers.length !== 0">
      <ul>
        <li v-for="computer in AllComputers" :key="computer.id">
          {{ computer.display_name }}
          {{ computer.status }}
        </li>
      </ul>
    </div>
  </section>

  <section>
    <h3>Section B</h3>
  </section>

  <section>
    <h3>Section C</h3>
  </section>
</template>
