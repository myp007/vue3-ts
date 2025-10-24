<script setup lang="ts">
import { ref, defineEmits,defineProps } from 'vue'
import { showToast } from 'vant'
import { updatePwd } from '@/api/user'
const props = defineProps({
  show: Boolean,
  username: String
})

const emit = defineEmits(['update:show', 'passwordChanged'])

const password = ref('')
const confirmPassword = ref('')
const isChangingPassword = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 修改密码
const changePassword = async () => {
  if (!password.value || !confirmPassword.value) {
    showToast('กรุณากรอกรหัสผ่านของคุณ')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showToast('รหัสผ่านที่คุณป้อนสองครั้งไม่ตรงกัน')
    return
  }
  
  isChangingPassword.value = true
  let params = {
    password:password.value,
  }
  await updatePwd(params)
  isChangingPassword.value = false
    showToast('เปลี่ยนรหัสผ่านสำเร็จแล้ว')
    closePopup()
    password.value = ''
    confirmPassword.value = ''
    emit('passwordChanged',params)
}

// 关闭弹窗
const closePopup = () => {
  emit('update:show', false)
}
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <van-popup 
    :show="props.show" 
    close-on-click-overlay
    :overlay="true"
    position="center"
    class="custom-popup"
    @update:show="$emit('update:show', $event)"
  >
    <div class="popup-container">
      <div class="popup-header">
        <div class="popup-title">เปลี่ยนรหัสผ่าน</div>
        <div class="close-icon" @click="closePopup">×</div>
      </div>
      <div class="popup-content">
        <div class="popup-form">
          <div class="form-row account-row">
            บัญชี：{{ props.username || '-' }}
          </div>
          <div class="form-row">
            <van-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="กรุณากรอกรหัสผ่านใหม่"
              class="custom-field"
            >
            <template #right-icon>
                <van-icon
                  :name="showPassword ? 'eye-o' : 'closed-eye'"
                  class="password-eye-icon"
                  @click="togglePasswordVisibility"
                />
              </template>
            </van-field>
          </div>
          <div class="form-row">
            <van-field
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="กรุณากรอกรหัสผ่านใหม่อีกครั้ง"
              class="custom-field"
              right-icon="eye-o"
            >
            <template #right-icon>
                <van-icon
                  :name="showConfirmPassword ? 'eye-o' : 'closed-eye'"
                  class="password-eye-icon"
                  @click="toggleConfirmPasswordVisibility"
                />
              </template>
            </van-field>
          </div>
        </div>
        <div class="popup-action">
          <van-button 
            type="primary" 
            block 
            :loading="isChangingPassword"
            class="action-button"
            @click="changePassword"
          >
          ปรับเปลี่ยนทันที
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

.form-row {
  margin-bottom: 15px;
}

.account-row {
  font-size: 15px;
  color: #000000;
  padding: 0 0 10px;
  text-align: left;
}

:deep(.custom-field) {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
}

:deep(.van-field__right-icon) {
  color: #999;
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
</style> 