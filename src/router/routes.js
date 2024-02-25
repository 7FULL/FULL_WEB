const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "viewProfile",
        path: "/viewProfile",
        component: () => import("pages/ViewProfile.vue"),
      },
      {
        name: "passwordRecovery",
        path: "/recoveryPassword/:token",
        component: () => import("pages/PasswordRecovery.vue"),
      },
      { path: "personal", component: () => import("pages/PersonalPage.vue") },
      { path: "tareas", component: () => import("pages/TareasPage.vue") },
      { path: "facturas", component: () => import("pages/FacturasPage.vue") },
      { path: "balance", component: () => import("pages/BalancePage.vue") },
      { path: "personal", component: () => import("pages/PersonalPage.vue") },
      //Para los 404
      {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routes;
