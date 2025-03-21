<script setup lang="ts">
defineProps({
  // 标题文本
  title: {
    type: String,
    required: true
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['back'])

// 返回上一页
const handleBack = () => {
  emit('back')
}
</script>

<template>
  <div class="app-header">
    <div class="header-content">
      <div class="left-area" v-if="showBack" @click="handleBack">
        <van-icon name="arrow-left" size="20" />
      </div>
      <h1 class="title">{{ title }}</h1>
      <div class="right-area">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
  <!-- 添加占位元素，防止内容被遮挡 -->
  <div class="header-placeholder"></div>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(to right, #0072ff, #00c6ff);
  color: white;
  height: 50px;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  position: relative;
}

.left-area {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  z-index: 2;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: white;
  margin: 0;
  font-weight: 500;
  z-index: 1;
}

.right-area {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  z-index: 2;
}

/* 占位元素，保持与header相同高度，防止内容被遮挡 */
.header-placeholder {
  height: 50px;
}
</style> 