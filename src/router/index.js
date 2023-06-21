import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/signup",
    component: () => import("../view/SignUp.vue"),
    name: "signup"
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("../view/SignIn.vue"),
  },
  {
    path: "/",
    component: () => import("../view/Home.vue"),
    name: "home",
  },

  {
    path: "/book",
    component: () => import('../view/Book.vue'),
    name: "book"
  }
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
