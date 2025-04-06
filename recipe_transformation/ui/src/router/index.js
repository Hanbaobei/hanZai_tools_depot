import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "task",
        component: () => import("@/views/task/index.vue")
    },
    {
        path: "/word",
        name: "word",
        component: () => import("@/views/word/index.vue")
    }
]


const router = createRouter({
    routes,
    history: createWebHashHistory()
})


export default router
