<script setup lang="ts">

</script>

<template>
  <div class="layout">
    <div class="content">
      <router-view />
    </div>
    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="shop">商城</van-tabbar-item>
      <van-tabbar-item replace to="/records" icon="records">记录</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
    
  </div>
</template>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

</style> 