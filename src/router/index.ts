import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    { path: '/:catchAll(.*)', redirect: '/champions' },
    {
        path: "/",
        name: "app",
        component: () => import("../layout/AppLayout.vue"),
        children: [
            {
                path: "champions",
                name: "champions",
                component: () => import("../views/Champions.vue")
            },
            {
                path: "champion/:name",
                name: "champion",
                component: () => import("../views/Champion.vue")
            },
            {
                path: "overlay/:name",
                name: "overlay",
                component: () => import("../views/Overlay.vue")
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
