import {createRouter, createWebHashHistory} from "vue-router";

const routes = [{
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue")
},
    {
        path: "/lexicon",
        name: "lexicon",
        component: () => import("@/views/Lexicon.vue")
    }]


const router = createRouter({
    routes,
    history: createWebHashHistory()
})


export default router
