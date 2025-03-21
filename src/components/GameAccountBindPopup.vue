<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { showToast } from 'vant'
import { queryRole ,bindRole} from '@/api/user'
// 导入游戏图片
import gameLogo from '../assets/images/9.png'

const props = defineProps({
  show: Boolean,
  step: {
    type: String,
    default: 'query' // 'query' 或 'confirm'
  }
})

const emit = defineEmits(['update:show', 'update:step', 'gameAccountBound'])

// 查询状态
const queryGameId = ref('')
const isQueryingGame = ref(false)

// 绑定状态
const gameAccountInfo = ref({
  avatar:'',
  roleId: '',
  nickName: '玩家昵称'
})
const isBindingGame = ref(false)

// 查询游戏账号
const queryGameAccount = async () => {
  if (!queryGameId.value) {
    showToast('请输入游戏ID')
    return
  }
  
  isQueryingGame.value = true
  let gameUser:any = await queryRole ({roleId:queryGameId.value})
  isQueryingGame.value = false
    gameAccountInfo.value = {
      avatar:gameUser?.avatar,
      roleId: gameUser.roleId,
      nickName: gameUser.nickNmae,
    }
    
    // 切换到确认绑定步骤
    emit('update:step', 'confirm')
}

// 确认绑定游戏账号
const confirmBindGame = async () => {
  isBindingGame.value = true
  let bindInfo:any = await bindRole ({
    roleId:gameAccountInfo.value.roleId,
    avatar:gameAccountInfo.value.avatar,
    nickName: gameAccountInfo.value.nickName
  })
  if(bindInfo){
    isBindingGame.value = false
    // 保存绑定信息到本地存储
    localStorage.setItem('gameAccountBound', 'true')
    localStorage.setItem('roleInfo', JSON.stringify({
      avatar:gameAccountInfo.value.avatar,
      roleId: gameAccountInfo.value.roleId,
      nickName: gameAccountInfo.value.nickName
    }))
    showToast('游戏账号绑定成功')
    closePopup()
    // 通知父组件已绑定
    emit('gameAccountBound', gameAccountInfo.value)
  }else{
    closePopup()
    showToast('游戏账号绑定失败')
  }
}

// 关闭弹窗
const closePopup = () => {
  emit('update:show', false)
  // 重置状态
  queryGameId.value = ''
  // 延迟重置步骤，避免弹窗关闭时闪烁
  setTimeout(() => {
    emit('update:step', 'query')
  }, 300)
}
</script>

<template>
  <van-popup 
    :show="show" 
    position="center"
    :overlay="true"
    close-on-click-overlay
    class="custom-popup"
    @update:show="$emit('update:show', $event)"
  >
    <!-- 查询游戏账号弹窗 -->
    <div v-if="props.step === 'query'" class="popup-container">
      <div class="popup-header">
        <div class="popup-title">游戏账号绑定</div>
        <div class="close-icon" @click="closePopup">×</div>
      </div>
      <div class="popup-content">
        <div class="popup-form">
          <van-field
            v-model="queryGameId"
            placeholder="请输入游戏ID"
            class="custom-field"
          />
        </div>
        <div class="popup-action">
          <van-button 
            type="primary" 
            block 
            :loading="isQueryingGame"
            class="action-button"
            @click="queryGameAccount"
          >
            查询
          </van-button>
        </div>
      </div>
    </div>

    <!-- 游戏账号绑定确认弹窗 -->
    <div v-else-if="props.step === 'confirm'" class="popup-container">
      <div class="popup-header">
        <div class="popup-title">游戏账号绑定</div>
        <div class="close-icon" @click="closePopup">×</div>
      </div>
      <div class="popup-content">
        <div class="game-account-preview">
          <img :src="gameAccountInfo.avatar ||gameLogo" alt="游戏" class="game-avatar" />
          <div class="game-account-info">
            <div class="game-nickname">{{ gameAccountInfo.nickName }}</div>
            <div class="game-id-display">ID:{{ gameAccountInfo.roleId }}</div>
          </div>
        </div>
        <div class="popup-action">
          <van-button 
            type="primary" 
            block 
            :loading="isBindingGame"
            class="action-button"
            @click="confirmBindGame"
          >
            立即绑定
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.custom-popup {
  width: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}

.popup-container {
  background: #fff;
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

.popup-form {
  margin-bottom: 20px;
}

:deep(.custom-field) {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
}

.popup-action {
  margin-top: 30px;
}

.action-button {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background-color: #1989fa;
  border: none;
}

/* 游戏账号预览样式 */
.game-account-preview {
  display: flex;
  align-items: center;
  padding: 15px ;
  justify-content: flex-start;
  background: #eef6ff;
  border-radius: 8px;
}

.game-avatar {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  margin-right: 15px;
}

.game-account-info {
  text-align: left;
}

.game-nickname {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.game-id-display {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style> 