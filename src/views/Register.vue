<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/user'
import { register, sendVerifyCode } from '@/api/user'
import { showToast } from 'vant'

const router = useRouter()
// const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const verifyCode = ref('')
const loading = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
// const agreeProtocol = ref(false)

// 邮箱验证正则
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 计算属性：按钮是否禁用
const isSubmitDisabled = computed(() => {
  if (!email.value || !emailPattern.test(email.value)) {
    return true
  }
  
  if (!verifyCode.value) {
    return true
  }
  
  if (!password.value) {
    return true
  }
  
  if (!confirmPassword.value) {
    return true
  }

  if (password.value !== confirmPassword.value) {
    return true
  }
  
  return false
})

const validateEmail = () => {
  if (!email.value) {
    showToast('请输入邮箱地址')
    return false
  }
  if (!emailPattern.test(email.value)) {
    showToast('请输入正确的邮箱地址')
    return false
  }
  return true
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const startCountdown = async () => {
  if (countdown.value > 0) return
  if (!validateEmail()) return
  
  try {
    let params = {
      email : email.value,
      method:'register'
    }
    await sendVerifyCode(params)
    showToast('验证码已发送')
    countdown.value = 120 // 120秒倒计时
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
    showToast('发送验证码失败')
  }
}

const onSubmit = async () => {
  if (isSubmitDisabled.value) return

  // if (!agreeProtocol.value) {
  //   showToast('请先阅读并同意用户协议和隐私政策')
  //   return
  // }
  
  if (password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await register({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      code: verifyCode.value
    })
    
    showToast('注册成功,请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    showToast('注册失败')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register">
    <div class="register-bg">
      <img src="@/assets/images/login-bg.jpg" alt="背景" />
    </div>
    <div class="register-icons">
      <img src="@/assets/images/login-huli.png" alt="狐狸" class="huli-icon" />
      <img src="@/assets/images/login-logo.png" alt="Logo" class="logo-icon" />
    </div>
    <div class="register-content">
      <div class="form-container">
        <h2 class="title">欢迎注册</h2>
        <van-form @submit="onSubmit" class="register-form">
          <div class="field-container">
            <!-- <div class="field-label">邮箱地址</div> -->
            <van-field
              v-model="email"
              name="email"
              placeholder="请输入邮箱地址"
              class="custom-field"
              center
            />
            <div class="error-message" v-if="email && !emailPattern.test(email)">请输入正确的邮箱地址</div>
          </div>
          
          
          
          <div class="field-container">
            <!-- <div class="field-label">密码</div> -->
            <van-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="请输入密码"
              class="custom-field"
              center
            >
              <template #right-icon>
                <van-icon
                  :name="showPassword ? 'eye-o' : 'closed-eye'"
                  class="password-eye-icon"
                  @click="togglePasswordVisibility"
                />
              </template>
            </van-field>
            <div class="error-message" v-if="password === ''">请输入密码</div>
          </div>
          
          <div class="field-container">
            <!-- <div class="field-label">确认密码</div> -->
            <van-field
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              name="confirmPassword"
              placeholder="请再次输入密码"
              class="custom-field"
              center
            >
              <template #right-icon>
                <van-icon
                  :name="showConfirmPassword ? 'eye-o' : 'closed-eye'"
                  class="password-eye-icon"
                  @click="toggleConfirmPasswordVisibility"
                />
              </template>
            </van-field>
            <div class="error-message" v-if="confirmPassword === ''">请再次输入密码</div>
            <div class="error-message" v-if="confirmPassword && password && confirmPassword !== password">两次输入的密码不一致</div>
          </div>
          <div class="field-container">
            <!-- <div class="field-label">验证码</div> -->
            <div class="verify-field-wrapper">
              <van-field
                v-model="verifyCode"
                name="verifyCode"
                placeholder="请输入验证码"
                class="custom-field"
                maxlength="6"
                center
              />
              <div 
                class="verify-btn" 
                :class="{ disabled: countdown > 0 }"
                @click="startCountdown"
              >
                <span v-if="countdown > 0">重新发送({{ countdown }}s)</span>
                <span v-else>获取验证码</span>
              </div>
            </div>
            <div class="error-message" v-if="verifyCode === ''">请输入验证码</div>
          </div>
          <!-- <div class="agreement-checkbox">
            <van-checkbox v-model="agreeProtocol" shape="round" icon-size="16px">
              <span class="agreement-text">
                我已阅读并同意<span class="highlight">《用户协议》</span>和<span class="highlight">《隐私政策》</span>
              </span>
            </van-checkbox>
          </div> -->

          <div class="submit-btn">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              :disabled="isSubmitDisabled "
              :class="{ 'btn-disabled': isSubmitDisabled }"
            >
              立即注册
            </van-button>
          </div>
          <div class="login-link">
            <span>已有账号？<span class="highlight" @click="goToLogin">立即登录</span></span>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #fff;
  overflow: hidden;
}

.register-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.register-bg img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: -1;
}

.register-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50px;
  left: 5px;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.huli-icon {
  flex-shrink: 0;
  width: 231px;
  height: 224px;
}

.logo-icon {
  flex-shrink: 0;
  width: 93px;
  height: 71px;
  margin-left: -10px;
}


.register-content {
  position: relative;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0;
}

.form-container {
  width: 100%;
  padding: 20px 16px 36px;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: left;
  font-size: 24px;
  color: #010101;
  margin-bottom: 20px;
  font-weight: 600;
}

.register-form {
  width: 100%;
}

.field-container {
  margin-bottom: 16px;
  position: relative;
}

.field-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 400;
  text-align: left;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 2px;
  text-align: left;
}

.verify-field-wrapper {
  display: flex;
  align-items: center;
  background: #f6f7f9;
  border-radius: 8px;
}

.verify-field-wrapper .custom-field {
  flex: 1;
}

.custom-field {
  background: #f6f7f9;
  border-radius: 8px;
  overflow: hidden;
}

.password-eye-icon {
  font-size: 18px;
  color: #999;
  padding: 0 5px;
  cursor: pointer;
}

:deep(.van-field) {
  padding: 10px 12px;
  background-color: #f3f5f7;
  border: none;
}

:deep(.van-field__control) {
  color: #000000;
  font-size: 15px;
  height: auto;
  line-height: 20px;
  text-align: left;
}

:deep(.van-field__control::placeholder) {
  color: #999;
  text-align: left;
}

:deep(.van-field__error-message) {
  text-align: left;
}

:deep(.van-field)::after {
  display: none;
}

.verify-btn {
  height: 40px;
  line-height: 40px;
  color: #0678ff;
  font-size: 15px;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 12px;
  margin-left: 8px;
  text-align: left;
  min-width: 90px;
  border-radius: 8px;
}

.verify-btn.disabled {
  color: #999;
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.agreement-checkbox {
  margin: 16px 0 24px;
  display: flex;
}

.agreement-text {
  font-size: 12px;
  color: #666;
  text-align: left;
}

.agreement-text .highlight {
  color: #1989fa;
}

:deep(.van-checkbox__label) {
  color: #666;
  font-size: 14px;
}

.submit-btn {
  margin-top: 24px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #1989fa, #0678ff);
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.btn-disabled {
  background: #b3b3b3 !important;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.login-link .highlight {
  color: #1989fa;
  cursor: pointer;
}

/* 移动端适配 */
@media screen and (max-width: 375px) {
  .form-container {
    padding: 20px 16px 30px;
  }

  .title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .submit-btn {
    margin-top: 20px;
  }
}

/* iPhone 5/SE 等小屏设备 */
@media screen and (max-width: 320px) {
  .form-container {
    padding: 16px 12px 24px;
  }

  .title {
    font-size: 18px;
    margin-bottom: 14px;
  }
  
  .field-label {
    font-size: 13px;
    margin-bottom: 6px;
  }
}
</style> 