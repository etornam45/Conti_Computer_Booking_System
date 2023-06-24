<script setup>
import PocketBase from "pocketbase";
import { useRouter } from "vue-router";
import { onMounted, ref, onUnmounted } from "vue";

let router = useRouter();
const pb = new PocketBase("http://127.0.0.1:8090");
let currentUser = pb.authStore.model;

let AllComputers = ref([]);
let bookings = ref([]);

let tadayCurrent = new Date();

let selectedBooking = ref({});

let selectedTime = ref({});

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
      console.log(result);
    });

  await pb
    .collection("bookings")
    .getFullList()
    .then((a) => {
      for (let c = 0; c < AllComputers.value.length; c++) {
        let computer = {
          name: AllComputers.value[c].display_name,
          section: AllComputers.value[c].section,
          id: AllComputers.value[c].id,
          bookings: [],
        };

        for (let booking = 0; booking < a.length; booking++) {
          if (AllComputers.value[c].id == a[booking].computer) {
            computer.bookings.push(
              create_a_booking({
                start: a[booking].start_time,
                end: a[booking].end_time,
                id: a[booking].id,
                code: a[booking].booking_code,
              })
            );
          }
        }
        // console.log(computer);
        AllProccessComputers.value.push(computer);
      }
      // console.log(AllProccessComputers);
    });

  await pb.collection("bookings").subscribe("*", function (e) {
    switch (e.action) {
      case "create":
        AllProccessComputers.value.forEach((com, i) => {
          if (com.id == e.record.computer) {
            AllProccessComputers.value[i].bookings.push(
              create_a_booking({
                start: e.record.start_time,
                end: e.record.end_time,
                id: e.record.id,
                code: e.record.booking_code,
              })
            );
          }
        });
        break;
      case "update":
        AllProccessComputers.value.forEach((comp) => {
          comp.bookings.forEach((book, boodId) => {
            if (book.id == e.record.id) {
              comp.bookings[boodId] = create_a_booking({
                start: e.record.start_time,
                end: e.record.end_time,
                id: e.record.id,
                code: e.record.booking_code,
              });
            }
          });
        });
        break;
      case "delete":
        AllProccessComputers.value.forEach((comp) => {
          comp.bookings.forEach((book, boodId) => {
            if (book.id == e.record.id) {
              comp.bookings.splice(boodId, 1);
            }
          });
        });
        break;

      default:
        break;
    }
  });
});

onUnmounted(async () => {
  await pb.collection("bookings").unsubscribe("*");
});

/**
 * Create a booking with the given parameters.
 * @param {Object} params - The parameters for the booking.
 * @param {string} params.start - The start time of the booking.
 * @param {string} params.end - The end time of the booking.
 * @param {string} params.id - The ID of the booking.
 * @param {string} params.code - The code of the booking.
 * @returns {Object} Returns an object with properties id, code, width, and offset.
 */
function create_a_booking({ start, end, id, code }) {
  // Convert start and end times to Date objects
  let startT = new Date(start);
  let endT = new Date(end);

  // Calculate the width and offset of the booking based on the change rate
  let width = (endT - startT) * changeRate;
  let offset = (startT - tadayCurrent) * changeRate;

  // Return an object with the booking properties
  return {
    id: id,
    code: code,
    width: width,
    offset: offset,
  };
}

function getDrag(event, computer) {
  // console.log(event);
  if(event.type == "dragstart"){
    selectedBooking.value['offset'] = event.offsetX
    selectedBooking.value["computer"] = computer 
    console.log(event.offsetX)
  }else if(event.type == "drag"){
    if(event.offsetX < 790 && event.offsetX > 0){
      console.log(event.offsetX)
      selectedBooking.value['width'] = event.offsetX - selectedBooking.value['offset']
    }

  }else if (event.type == "dragend"){
    let time = {
      start: tadayCurrent.getTime() + new Date().setTime(`${(selectedBooking.value['offset']/65) * 3600 * 1000}`),
      end: tadayCurrent.getTime() + new Date().setTime(`${((selectedBooking.value['width'] + selectedBooking.value['offset'])/65) * 3600 * 1000}`),
    }
    selectedTime.value = {
      start: `${new Date(time.start).getHours()}:${new Date(time.start).getMinutes()}:${new Date(time.start).getSeconds()} `,
      end: `${new Date(time.end).getHours()}:${new Date(time.end).getMinutes()}:${new Date(time.end).getSeconds()} `,
      computer: selectedBooking.value['computer']
    }

    console.log(selectedTime.value)
  }
  // console.log(selectedBooking.value);
}
</script>

<template>
  <main>
    <form action="/">
      <input type="time" placeholder="Start Time" />
      <input type="time" placeholder="End Time" />

      {{ selectedTime.start }}
      {{ selectedTime.end }}
    </form>

    <section>
      <h3>Section A</h3>

      <div v-if="AllProccessComputers.length !== 0">
        <ul style="list-style: none; user-select: none">
          <li v-for="computer in AllProccessComputers" :key="computer.id" dropzon>
            <div
              class="overlay"
              @dragstart="getDrag($event, computer.id)"
              @dragend="getDrag($event, computer.id)"
              @drag="getDrag($event, computer.id)"
              draggable="true"
              style="cursor: col-resize;"
            ></div>

            <div
              class="timeline"
              v-if="computer.section == 'Section A'"
              draggable="false"
            >
              <div draggable="false" class="com-name">{{ computer.name }}</div>
              <div class="timespace">


                <div v-if="selectedBooking.computer == computer.id" class="reltime" :style="{ left: selectedBooking.offset + 'px' , width: selectedBooking.width + 'px'}">
                  {{ Math.ceil(selectedBooking.width / 65 ) }} hrs
                </div>

                <div
                  v-for="book in computer.bookings"
                  :key="book.id"
                  :style="{ left: book.offset + 'px' }"
                  :title="book.code"
                  class="timewidth"
                >
                  <div
                    :style="{
                      width: book.width + 'px',
                      border: '1px solid white',
                      background: '#44ddad',
                      overflow: `hidden`,
                    }"
                  >
                    <span class="blend">
                      {{ book.code }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
main{
  max-width: max-content;
  margin: 0 auto;
}

.com-name{
  /* font-weight: bold; */
  margin-left: -5px;
}

.blend{
  mix-blend-mode: color-burn;
}

.timeline{
  display: flex;
  flex-direction: row;
  background: #517ed1;
  width: 800px;
  /* height: pa; */
  padding: 10px;
  margin-bottom: 5px;
  position: relative;
}

.timespace{
  position: relative;
  /* overflow: hidden; */
}

.timewidth, .reltime{
  position: absolute;
  border: 1px solid #189b8e;
  cursor: pointer;
  text-align: center;
}


.overlay{
  position: absolute;
  height: 100%;
  width: calc(100% - 30px);
  background: rgba(252, 252, 252, 0.349);
  z-index: 3;
  right: 0px;
}

li{
  position: relative;
}

.reltime{
  background: #eb1d02;
  color: aliceblue;
}
</style>
