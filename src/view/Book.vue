<script setup>
import PocketBase from "pocketbase";
import { useRouter } from "vue-router";
import { onMounted, ref, onUnmounted } from "vue";

let router = useRouter();
const pb = new PocketBase("http://127.0.0.1:8090");
let currentUser = pb.authStore.model;

let AllComputers = ref([]);
let bookings = ref([]);

let tadayCurrent = new Date(
  "Fri Jun 22 2023 10:51:23 GMT+0000 (Greenwich Mean Time)"
);

let changeRate = 65 / (3600 * 1000);

let AllProccessComputers = ref([]);

onMounted(async () => {
  if (!currentUser) {
    router.push({
      name: "signin",
    });
  }

  await pb
    .collection("computers")
    .getFullList({
      // filter: 'status = "Available"',
    })
    .then((result) => {
      AllComputers.value = result;
      // console.log(result);
    });

  await pb
    .collection("bookings")
    .getFullList()
    .then((a) => {
      for (let c = 0; c < AllComputers.value.length; c++) {
        let computer = {
          name: AllComputers.value[c].display_name,
          section: AllComputers.value[c].section,
          bookings: [],
        };

        for (let booking = 0; booking < a.length; booking++) {
          if (AllComputers.value[c].id == a[booking].computer) {
            let start = new Date(a[booking].start_time);
            let end = new Date(a[booking].end_time);

            let aBook = {
              width: (end - start) * changeRate,
              offset: (start - tadayCurrent) * changeRate,
            };
            console.log(aBook);
            computer.bookings.push(aBook);
          }
        }
        // console.log(computer);
        AllProccessComputers.value.push(computer);
      }
      // console.log(AllProccessComputers);
    });

  await pb.collection("bookings").subscribe("*", function (e) {
    switch (e.action) {
      case 'create':
        
        break;
      case "update":
        
        break;
      case "delete":
        
        break;
    
      default:
        break;
    }
  });
});

onUnmounted(async () => {
  await pb.collection("bookings").unsubscribe("*");
});
</script>

<template>
  <main>
    <form action="/">
      <input type="time" placeholder="Start Time" />
      <input type="time" placeholder="End Time" />
    </form>

    <section>
      <h3>Section A</h3>

      <div v-if="AllComputers.length !== 0">
        <ul style="list-style: none">
          <li v-for="computer in AllProccessComputers" :key="computer.id">
            <div class="timeline">
              <div>{{ computer.name }}</div>
              <div class="timespace">
                <div
                  v-for="book in computer.bookings"
                  :key="book.width"
                  :style="{ left: book.offset + 'px' }"
                  class="timewidth"
                >
                  <div
                    :style="{
                      width: book.width + 'px',
                      border: '1px solid white',
                      background: `rgb(${Math.floor(
                        Math.random() * 255
                      )},${Math.floor(Math.random() * 255)},${Math.floor(
                        Math.random() * 255
                      )})`,
                    }"
                  >
                    <!-- {{ book.width }} -->
                    .
                  </div>
                </div>
              </div>
            </div>
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
  </main>
</template>

<style scoped>
main{
  --main-width: 800px,

  max-width: var(--main-width);
  margin: 0 auto;
}

.timeline{
  display: flex;
  flex-direction: row;
  background: beige;
  width: 800px;
  /* height: pa; */
  padding: 10px;
  margin-bottom: 5px;
}

.timespace{
  position: relative;
  overflow: hidden;
}

.timewidth{
  position: absolute;
  border: 1px solid black;
}
</style>
