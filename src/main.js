import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
// import store from "./lib/store";


createApp(App).use(router).mount("#app");
