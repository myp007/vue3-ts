<script setup lang="ts">
import { ref ,onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { showSuccessToast, showToast,showLoadingToast,closeToast  ,Dialog } from 'vant';
import AppHeader from '@/components/layout/AppHeader.vue'
import GameAccountBindPopup from '@/components/GameAccountBindPopup.vue'
import { getGoodsList} from '@/api/user'
import { submitOrder} from '@/api/product'
// 导入商品图片
import coin8 from '../assets/images/8.png'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const roleInfo = computed(() => userStore.roleInfo)
// 是否已绑定游戏账号
const hasBindGameAccount = computed(() => userStore.hasBindGameAccount)

// 页面加载状态
const loading = ref(false)
// 刷新状态
const refreshing = ref(false)
// 购买弹窗显示
const showBuyDialog = ref(false)
// 选中的商品
const selectedProduct = ref<any>(null)

// 游戏账号绑定弹窗
const showGameBindDialog = ref(false)
const gameBindStep = ref('query')

// 商品列表
interface productItem {
    id: number
    amount: string
    img:string
    name:string
}

const productsList = ref<productItem[]>([])

// 页面初始化
onMounted(() => {
  
  // 加载商品列表
  fetchProducts()
})

// 模拟获取商品列表
const fetchProducts = async () => {
  loading.value = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  
  let list: any = await getGoodsList({
    page:1,
    pageSize:20
  })
  productsList.value = list.list
  loading.value = false
  refreshing.value = false
  closeToast();
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  fetchProducts()
}

// 去绑定游戏账号
const goToBindGameAccount = () => {
  showGameBindDialog.value = true
  gameBindStep.value = 'query'
}

// 处理游戏账号绑定成功
// 处理游戏账号绑定成功
const handleGameAccountBound = (gameAccount: { roleId: string, nickName: string }) => {
  // 更新用户信息中的游戏账号
  userStore.bindGameAccount({
    roleId: gameAccount.roleId,
    nickName: gameAccount.nickName
  })
}

// 选择商品
const selectProduct = (product: any) => {
  // 如果未绑定游戏账号，显示提示
  if (!hasBindGameAccount.value) {
    // 显示提示绑定游戏账号后再购买
    showToast('请先绑定游戏账号')
    return
  }
  
  // 显示购买弹窗
  selectedProduct.value = product
  showBuyDialog.value = true
}

// 确认购买
const confirmBuy =async () => {
  if (!selectedProduct.value) return
  showLoadingToast ({
    message: '购买中...',
    forbidClick: true,
    duration: 0
  })
  await submitOrder({
    productId:selectedProduct.value.id
  })
  
  closeToast()
    showSuccessToast('购买成功')
    showBuyDialog.value = false
    selectedProduct.value = null
    router.push('/records')
}

// 取消购买
const cancelBuy = () => {
  showBuyDialog.value = false
  selectedProduct.value = null
}

// 退出登录
const logout = () => {
  Dialog.confirm({
    title: '提示',
    message: '确定要退出登录吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    // 清除本地存储的绑定信息
    localStorage.removeItem('gameAccountBound')
    localStorage.removeItem('gameAccount')
    
    userStore.logout()
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<template>
  <div class="home-container">
    <!-- 使用AppHeader组件 -->
    <AppHeader title="商城">
      <template #right>
        <div class="logout-icon" @click="logout">
          <van-icon name="exit" size="18" />
        </div>
      </template>
    </AppHeader>
    
    <!-- 商品列表视图 -->
    <template v-if="hasBindGameAccount">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="refresh-view">
        <div class="product-grid">
          <div 
            v-for="product in productsList" 
            :key="product.id" 
            class="product-item"
          >
            <!-- <div class="yuan"></div> -->
            <div class="product-count">{{ product.name }}</div>
            <div class="product-img">
              <img :src="product.img || coin8" :alt="product.name" />
            </div>
            <div class="price-btn" @click="selectProduct(product)">￥{{ product.amount }}</div>
          </div>
        </div>
      </van-pull-refresh>
    </template>
    <!-- 未绑定游戏账号时显示绑定提示 -->
    <div v-else class="bind-account-container">
      <p class="bind-tip">请先绑定您的游戏账号</p>
      <van-button type="primary" block class="bind-btn" @click="goToBindGameAccount">
        点击绑定
      </van-button>
    </div>
    
    <!-- 商品购买确认弹窗 -->
    <van-popup
      v-model:show="showBuyDialog"
      :overlay="true"
      position="center"
      close-on-click-overlay
      class="custom-popup"
      @close="cancelBuy"
    >
      <div class="popup-container">
        <div class="popup-header">
          <div class="popup-title">商品购买</div>
          <div class="close-icon" @click="cancelBuy">×</div>
        </div>
        <div v-if="selectedProduct" class="popup-content">
          <div class="product-detail">
            <img :src="selectedProduct.image || coin8" alt="商品图片" class="product-image" />
           
            <div class="product-info">
              <div class="product-count-label">{{ selectedProduct.name }}</div>
              <div class="product-price-label">￥{{ selectedProduct.amount }}</div>
            </div>
          </div>
          
          <div class="game-account-info" v-if="roleInfo?.roleId">
            <img src="../assets/images/9.png" alt="游戏" class="game-avatar" />
            <div class="game-detail">
              <div class="game-name">{{ roleInfo.nickName }}</div>
              <div class="game-id">ID:{{ roleInfo.roleId }}</div>
            </div>
          </div>
          
          <van-button 
            type="primary" 
            block 
            class="purchase-btn"
            @click="confirmBuy"
          >
            去付款
          </van-button>
        </div>
      </div>
    </van-popup>
    
    <!-- 游戏账号绑定弹窗 -->
    <GameAccountBindPopup
      :show="showGameBindDialog"
      :step="gameBindStep"
      @update:show="showGameBindDialog = $event"
      @update:step="gameBindStep = $event"
      @game-account-bound="handleGameAccountBound"
    />
    <div class="bottom-view"><a>下载游戏了解更多内容！</a></div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0 0 24px;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
}

.logout-icon {
  color: white;
  cursor: pointer;
}

/* 商品列表样式 */
.refresh-view{
  min-height: calc(100vh - 180px);
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
}

.product-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}
.yuan{
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -11px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  clip-path: ellipse(100% 50% at 50% 50%);
  background: #dce4f3;
}
.product-count {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.product-img {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.price-btn {
  width: 100%;
  padding: 8px 0;
  background-color: #1989fa;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}

/* 绑定账号提示样式 */
.bind-account-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
  text-align: center;
  z-index: 1;
}

.bind-tip {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.bind-btn {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  width: 80%;
  margin: 0 auto;
}

/* 购买弹窗样式 */
.custom-popup {
  width: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}

.popup-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
}

.popup-header {
  position: relative;
  padding: 15px 0;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 20px;
  color: #010101;
  font-weight: bold;
}

.close-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.popup-content {
  padding: 20px;
}

.product-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  background-color: #FFF8E1;
  padding:10px 15px;
  border-radius: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  object-fit: contain;
  flex-shrink: 0;
}

.yellow-arrow {
  margin: 0 10px;
  transform: rotate(90deg);
}

.product-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.product-count-label {
  font-size: 16px;
  color: #000;
  margin-bottom: 5px;
}

.product-price-label {
  font-size: 18px;
  color: #ff6600;
  font-weight: bold;
}

.game-account-info {
  display: flex;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  align-items: center;
}

.game-avatar {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  margin-right: 15px;
}

.game-detail {
  flex: 1;
  text-align: left;
}

.game-name {
  font-size: 14px;
  color: #000;
  font-weight: bold;
}

.game-id {
  font-size: 12px;
  color: #333;
  margin-top: 5px;
}

.purchase-btn {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background-color: #1989fa;
}
</style> 