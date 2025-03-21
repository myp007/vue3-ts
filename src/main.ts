/*
 * @Author: m
 * @Date: 2025-03-17 14:45:02
 * @LastEditTime: 2025-03-17 15:12:48
 * @Description: 
 * @FilePath: \h5\yuerbao\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { setupVant } from './plugins/vant'
import './mock'

// 引入Vant样式
import 'vant/lib/index.css'
import 'vant/es/toast/style'

// 引入全局样式
import './style.css'

const app = createApp(App)

// 安装插件
setupVant(app)
app.use(router)
app.use(pinia)

app.mount('#app')
