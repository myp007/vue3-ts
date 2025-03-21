<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { passwordLogin,login, getUserInfo ,sendVerifyCode } from '@/api/user'
import { showSuccessToast, showToast } from 'vant';
const router = useRouter()
const userStore = useUserStore()

// 登录类型：password - 密码登录，code - 验证码登录
const loginType = ref<'password' | 'code'>('password')
const email = ref('')
const password = ref('')
const verifyCode = ref('')
const loading = ref(false)
const countdown = ref(0)
const rememberPassword = ref(false)
const showPassword = ref(false)

// 邮箱验证正则
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 计算属性：表单是否可提交
const isSubmitDisabled = computed(() => {
  // 邮箱验证
  if (!email.value || !emailPattern.test(email.value)) {
    return true
  }
  
  // 密码登录模式
  if (loginType.value === 'password' && !password.value) {
    return true
  }
  
  // 验证码登录模式
  if (loginType.value === 'code' && !verifyCode.value) {
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

const toggleLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'code' : 'password'
}

const startCountdown = async () => {
  if (countdown.value > 0) return
  if (!validateEmail()) return
  
  try {
    let params = {
      email : email.value,
      method:'login'
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
  
  loading.value = true
  try {
    if (loginType.value === 'password') {
      // 密码登录
      const info : any = await passwordLogin({ email: email.value, password: password.value })
      userStore.setToken(info.token)
    // userStore.setUserInfo(mockUserInfo)
      getUser()
      showSuccessToast('登录成功！')
    } else {
      // 验证码登录
      const codeinfo : any  = await login({ email: email.value, code: verifyCode.value })
      userStore.setToken(codeinfo.token)
      getUser()
      showToast('登录成功！')
    }
  } catch (error) {
    console.error('登录失败:', error)
    showToast('登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}

const getUser =async () =>{
  const info : any  = await getUserInfo()

  userStore.setUserInfo(info.userInfo)
  userStore.setRoleInfo(info.roleInfo)
  router.push('/home')
}
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login">
    <div class="login-bg">
      <img src="@/assets/images/login-bg.jpg" alt="背景" />
    </div>
    <div class="login-icons">
      <img src="@/assets/images/login-huli.png" alt="狐狸" class="huli-icon" />
      <img src="@/assets/images/login-logo.png" alt="Logo" class="logo-icon" />
    </div>
    <div class="login-content">
      <div class="form-container">
        <h2 class="title">{{ loginType === 'password' ? '密码登录' : '验证码登录' }}</h2>
        <van-form @submit="onSubmit" class="login-form">
          <div class="field-container">
            <!-- <div class="field-label">邮箱</div> -->
            <van-field
              v-model="email"
              name="email"
              placeholder="请输入邮箱地址"
              class="custom-field"
              clearable
              center
            />
            <div class="error-message" v-if="email && !emailPattern.test(email)">请输入正确的邮箱地址</div>
          </div>
          
          <div class="field-container" v-if="loginType === 'password'">
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
          
          <div class="field-container" v-if="loginType === 'code'">
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
          
          <div class="options-row">
            <div class="login-type-left">
            <van-checkbox v-model="rememberPassword" shape="round" icon-size="16px" v-if="loginType === 'password'">
                <span>记住密码</span>
              </van-checkbox>
            </div>
            <div class="login-type-toggle" @click="toggleLoginType">
              {{ loginType === 'password' ? '验证码登录' : '密码登录' }}
            </div>
          </div>
          
          <div class="submit-btn">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              :disabled="isSubmitDisabled"
              :class="{ 'btn-disabled': isSubmitDisabled }"
            >
              登录
            </van-button>
          </div>
          <div class="register-link">
            <span>还没有账号？<span class="highlight" @click="goToRegister">立即注册</span></span>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #fff;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.login-bg img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: -1;
}

.login-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100px;
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

.login-content {
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

.login-form {
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
}

.verify-field-wrapper .custom-field {
  flex: 1;
}

.custom-field {
  background-color: #f3f5f7;
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
  padding: 0 12px;
  background-color: #f3f5f7;
  border: none;
}

:deep(.van-field__control) {
  color: #000000;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background-color: #f3f5f7 !important;
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
  color: #1989fa;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 12px;
  margin-left: 8px;
  text-align: left;
  min-width: 90px;
  border-radius: 8px;
  background-color: #f0f7ff;
}

.verify-btn.disabled {
  color: #999;
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 24px;
}
.login-type-left{
  display: flex;
  flex: 1;
}
:deep(.van-checkbox__label) {
  color: #666;
  font-size: 14px;
}

.login-type-toggle {
  color: #1989fa;
  font-size: 14px;
  cursor: pointer;
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

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.register-link .highlight {
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