<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
// import { showToast } from 'vant'
import AppHeader from '@/components/layout/AppHeader.vue'
import PasswordModifyPopup from '@/components/PasswordModifyPopup.vue'
import GameAccountBindPopup from '@/components/GameAccountBindPopup.vue'



const router = useRouter()
const userStore = useUserStore()
const gameLogo = 'https://demo-static.gudagame.com/images/avatar/0.png'
// 用户信息
const userInfo = computed(() => userStore.userInfo)
const roleInfo = computed(() => userStore.roleInfo)
// 是否已绑定游戏账号
const hasBindGameAccount = computed(() => userStore.hasBindGameAccount)

// 修改密码弹窗
const showPasswordDialog = ref(false)

// 游戏账号绑定弹窗
const showGameBindDialog = ref(false)
const gameBindStep = ref('query')

// 页面初始化
onMounted(() => {
  // 从localStorage获取绑定状态
  // const bindStatus = localStorage.getItem('gameAccountBound')
  // const gameAccount = localStorage.getItem('gameAccount')
  
  // if (bindStatus === 'true' && gameAccount) {
  //   userStore.bindGameAccount(JSON.parse(gameAccount))
  // }
})

// 点击绑定游戏账号
const onBindGameAccount = () => {
  showGameBindDialog.value = true
  gameBindStep.value = 'query'
}

// 处理游戏账号绑定成功
const handleGameAccountBound = (gameAccount: { roleId: string, nickName: string,avatar:string }) => {
  // 更新用户信息中的游戏账号
  userStore.bindGameAccount({
    avatar:gameAccount.avatar,
    roleId: gameAccount.roleId,
    nickName: gameAccount.nickName
  })
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储的绑定信息
 
  localStorage.clear()
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile-container">
    <!-- 使用AppHeader组件 -->
    <AppHeader title="ข้อมูลของฉัน" />

    <!-- 用户信息区域 -->
    <div class="user-info-card">
      <div class="info-item">
        <span class="label">บัญชี：</span>
        <span class="value">{{ userInfo?.email || '-' }}</span>
        <van-button type="primary" size="small" class="action-btn" @click="showPasswordDialog = true">
          เปลี่ยนรหัสผ่าน
        </van-button>
      </div>
    </div>

    <!-- 游戏账号区域 -->
    <div class="game-account-card">
      <div class="title">
        <span>บัญชีเกม</span>
        <van-button v-if="hasBindGameAccount" type="primary" size="small" class="action-btn"  @click="onBindGameAccount">
          ปรับปรุงใหม่
        </van-button>
      </div>
      <div v-if="hasBindGameAccount" class="game-account-info">
        <div class="game-logo-wrapper">
          <img :src="roleInfo?.avatar ||gameLogo" alt="" class="game-logo" />
        </div>
        <div class="game-info">
          <div class="game-name">{{ roleInfo?.nickName }}</div>
          <div class="game-id">ID:{{ roleInfo?.roleId }}</div>
        </div>
      </div>
      <div v-else class="no-game-account">
        <p>คุณยังไม่ได้ผูกบัญชีเกมของคุณ</p>
        <van-button type="primary" size="small" class="action-btn"  @click="onBindGameAccount">
          ผูกบัญชี
        </van-button>
      </div>
    </div>

    <!-- 会员ID -->
    <div class="member-id-card" v-if="userInfo">
      <div class="info-item">
        <span class="label">หัวหน้ากิลด์：</span>
        <span class="value">{{ userInfo.uid }}</span>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-btn">
      <button class="logout-button" @click="handleLogout">ออกจากระบบ</button>
    </div>

    <!-- 使用封装的修改密码弹窗组件 -->
    <PasswordModifyPopup 
      :show="showPasswordDialog"
      :username="userInfo?.email"
      @update:show="showPasswordDialog = $event"
    />

    <!-- 使用封装的游戏账号绑定弹窗组件 -->
    <GameAccountBindPopup
      :show="showGameBindDialog"
      :step="gameBindStep"
      @update:show="showGameBindDialog = $event"
      @update:step="gameBindStep = $event"
      @game-account-bound="handleGameAccountBound"
    />
    <div class="bottom-view"><a :href="userInfo?.downloadUrl" target="_blank">ดาวน์โหลดเกมเพื่อเรียนรู้เพิ่มเติม!</a></div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 0 0 24px;
  background-color: #f8f8f8;
  min-height: 100vh;
  color: #333;
}

.user-info-card, .game-account-card, .member-id-card {
  background: #fff;
  border-radius: 8px;
  margin: 16px 16px 0;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 15px;
  text-align: left;
  color: #000000;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 14px;
  color: #000;
}

.value {
  flex: 1;
  font-size: 14px;
  color: #333;
  margin-left: 8px;
  margin-right: 12px;
  text-align: left;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  font-size: 12px;
  min-width: 100px;
}

.game-account-info {
  display: flex;
  align-items: center;
  background: #eef6ff;
  padding: 20px;
  border-radius: 8px;
}

.game-logo-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 12px;
}

.game-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-info {
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
  margin-top: 4px;
}

.no-game-account {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-game-account p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.logout-btn {
  margin-top: 40px;
  padding: 0 16px;
}

.logout-button {
  width: 100%;
  height: 44px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}
</style> 