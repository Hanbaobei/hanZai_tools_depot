import {createApp} from 'vue'
import "./style.css"
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from "@/router/index.js";
import 'virtual:uno.css'
import 'element-plus/dist/index.css'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)

app.mount('#app')
