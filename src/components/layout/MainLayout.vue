<script setup lang="ts">

</script>

<template>
  <div class="layout">
    <div class="content">
      <router-view />
    </div>
    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="shop">ร้านค้า</van-tabbar-item>
      <van-tabbar-item replace to="/records" icon="records">บันทึก</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-o">ของฉัน</van-tabbar-item>
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