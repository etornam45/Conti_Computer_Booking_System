<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import PocketBase from "pocketbase";
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Computer from "../components/icons/Computer.vue";
import NoBookings from "../components/NoBookings.vue";

// Router for routing in vue
let router = useRouter();
const pb = new PocketBase("http://127.0.0.1:8090");

// Current Logged in User
let currentUser = pb.authStore.model;

let currentBooking = ref();

// Available for computers free at the time
let Available = ref([]);

// The total number of comput() ers available

let totalPc = ref(0);
pb.authStore.onChange(() => {
  currentUser = pb.authStore.model;
});

let bookings = ref([]);
onMounted(async () => {
  // If user is not signed in navigate to sign in page
  console.log(currentUser);
  if (!currentUser) {
    console.log(currentUser);
    router.push({
      name: "signin",
    });
  }

  await pb
    .collection("bookings")
    .getFullList({
      filter: "student = '" + currentUser.id + "'",
      expand: "computer",
    })
    .then((a) => {
      a.forEach((b) => {
        if (
          new Date(b.created) >
          new Date(new Date().setHours(new Date().getHours() - 12))
        ) {
          bookings.value.push(b);
        }
      });
      console.log(a);
    });

  // Getting all the computers

  // Gets all the Pcs
  getTotalPc();
  // getAvailable();
  pb.collection("computers").subscribe("*", function (e) {
    if (e.action == "update") {
      if (e.record.status == "Available") {
        Available.value.push(e.record);
      } else if (e.record.status != "Available") {
        let newRes = Available.value.filter((rec) => {
          return rec.id != e.record.id;
        });
        Available.value = newRes;
      }
    }
    console.log(e);
    console.log(e.action);
    console.log(e.record);
  });
});

// Function to get all PC's
const getTotalPc = async () => {
  const computers = await pb
    .collection("computers")
    .getFullList({
      sort: "-created",
    })
    .then((value) => {
      totalPc.value = value.length;
      console.log(value);

      value.forEach((pc) => {
        if (pc.status == "Available") {
          Available.value.push(pc);
        }
      });
    });
};

onUnmounted(async () => {
  pb.collection("computers").unsubscribe("*");
});

const LogOut = () => {
  pb.authStore.clear();

  router.push({
    name: "signin",
  });
};

function bookNow() {
  router.push({
    name: "book",
  });
}

const cancelBooking = async (id) => {
  if (confirm("Are you sure you want to delete the booking")) {
    await pb
      .collection("bookings")
      .delete(id)
      .then((a) => {
        if (a) {
          bookings.value.forEach((book, boodId) => {
            if (book.id == id) {
              bookings.value.splice(boodId, 1);
            }
          });
        }
      });
  }
};
</script>

<template>
  <main v-if="currentUser" class=""> 
    <header>
      <div>
        <div style="display: flex; align-items: center; gap: 20px">
          <div class="avatar">
            <img
              :src="'https://api.dicebear.com/6.x/open-peeps/svg?'+'seed='+currentUser.name"
              alt="avatar"
            />
          </div>
          <div class="user" >
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
      <section class="ava-sec">
        <!-- <div class="ave">
          <Computer />
          <p>
            <span>{{ Available.length }}</span> / {{ totalPc }} Available
          </p>
        </div> -->
        <button
          @click="bookNow"
          class="book-now"
          :disabled="currentBooking"
          style="background: #008db7"
        >
          Book Now
        </button>
      </section>
      <section class="booked">
        <NoBookings v-if="!bookings.length" />
        <div
          class="bookings"
          v-else
          v-for="booking in bookings"
          :key="booking.id"
        >
          <div class="bkk">
            <p>COMPUTER : {{ booking?.expand?.computer.display_name }}</p>
            <p>SECTION : {{ booking?.expand?.computer.section }}</p>
            <p>
              START TIME :
              {{ new Date(booking.start_time).toLocaleTimeString() }}
            </p>
            <p>
              END TIME : {{ new Date(booking.end_time).toLocaleTimeString() }}
            </p>
            <p>BOOKING CODE : {{ booking.booking_code }}</p>
          </div>
          <button @click="cancelBooking(booking.id)">Cancel Booking</button>
        </div>
      </section>
    </article>
  </main>
</template>

<style scoped>
.bkk {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.bookings {
  width: 100%;
  background: rgb(204, 204, 228);
  padding: 20px;
  box-sizing: border-box;
  gap: 10px;
}

.bookings button {
  width: 100%;
  margin-top: 10px;
}

.book-now:disabled {
  background: rgb(216, 216, 216) !important;
  cursor: no-drop;
}

.booked {
  /* min-height: 200px; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
}

.ava-sec {
  display: flex;
  flex-direction: column;
  gap: 30px;
  font-weight: 200;
  font-size: 1.5rem;
}

.ave span {
  font-size: 2.5rem;
  margin-bottom: -10px;
  display: flex;
  font-weight: bolder;
  align-items: flex-end;
}

.ave p {
  display: flex;
  align-items: flex-end;
}

.ave {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 30px;
}

@media (prefers-color-scheme: light) {
  section {
    background: blue;
  }
}

section {
  margin-bottom: 10px;
  /* height: 300px; */
  padding: 10px;
  background: whitesmoke;
  border: 1px solid grey;
  /* box-shadow: 1px 1px 2px #ccc; */
  border-radius: 4px;
}

.avatar {
  height: 50px;
  width: 50px;
  background: rgb(163, 157, 157);

  overflow: hidden;
  border-radius: 50px;
}
.user {
  display: flex;
  flex-direction: column;
  /* align-self: auto; */
  align-items: flex-start;
  /* color: black; */
  font-weight: bold;
}

main {
  --added-h: 70px;
  --main-width: 800px;
}

article {
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
  article {
    padding-left: 10px;
    padding-right: 10px;
  }
}

button {
  padding: 10px 20px;

  border-radius: 6px;
  font-size: 18px;
  background: rgb(245, 90, 90);
  font-weight: 800;
  border: 0;
  --border-color: rgb(136, 26, 7);
  color: white;
  transition: 500ms;
  border-bottom: 3px solid var(--border-color);
  cursor: pointer;
}
</style>
