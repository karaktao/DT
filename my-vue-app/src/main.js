import { createApp } from 'vue'
import '@/assets/less/index.less'
import App from './App.vue'
import router from './router'
//这里ElementPlus我们使用完整引入
import ElementPlus, { paginationEmits } from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from "pinia"

//注册@element-plus/icons-vue图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const pinia = createPinia()
const app =createApp(App)
app.use(ElementPlus)
app.use(router).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}