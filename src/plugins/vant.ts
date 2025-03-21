/*
 * @Author: m
 * @Date: 2025-03-17 15:11:11
 * @LastEditTime: 2025-03-18 11:24:57
 * @Description: 
 * @FilePath: \h5\yuerbao\src\plugins\vant.ts
 */
import { App } from 'vue'
import {
  Button,
  Form,
  Field,
  CellGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  Image as VanImage,
  Cell,
  Grid,
  GridItem,
  PullRefresh,
  List,
  Toast ,
  Dialog,
  Icon,
  Popup
} from 'vant'

const components = [
  Button,
  Form,
  Field,
  CellGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  VanImage,
  Cell,
  Grid,
  GridItem,
  PullRefresh,
  List,
  Dialog,
  Icon,
  Popup
]

export function setupVant(app: App) {
  components.forEach(component => {
    app.use(component)
  })
}

// 导出Toast方法供组件使用
export { Toast, Dialog, Popup } 