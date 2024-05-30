const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/StreamingList.vue"),
      },
      {
        name: "ads",
        path: "/ads",
        component: () => import("pages/AdsPage.vue"),
      },
      {
        name: "viewProfile",
        path: "/viewProfile",
        component: () => import("pages/ViewProfile.vue"),
      },
      {
        name: "streaming",
        path: "/streaming/:name",
        component: () => import("pages/ViewStreaming.vue"),
      },
      {
        name: "streamings",
        path: "/streamings",
        component: () => import("pages/StreamingList.vue"),
      },
      {
        name: "passwordRecovery",
        path: "/recoveryPassword/:token",
        component: () => import("pages/PasswordRecovery.vue"),
      },
      {
        name: "support",
        path: "/support",
        component: () => import("pages/SupportPage.vue")
      },
      //Para los 404
      {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routes;
