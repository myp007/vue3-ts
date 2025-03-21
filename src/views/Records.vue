<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getOrderList} from '@/api/product'
import {  showToast } from 'vant';
import AppHeader from '@/components/layout/AppHeader.vue'
import defaultImg from '../assets/images/8.png'
// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  hasMore: true
})

// 购买记录列表
interface recordItem {
    id:number
    uid: number
    amount: string
    img:string
    orderNo:string
    productName:string
    createAt:string
    status:number
}

const records = ref<recordItem[]>([])

// 是否正在加载
const loading = ref(false)
// 是否下拉刷新中
const refreshing = ref(false)
// 是否显示加载提示
const finished = ref(false)

onMounted(() => {
  // 初始化数据
  fetchRecords(true)
})

// 获取记录数据
const fetchRecords = async (isRefresh = false) => {
  if (isRefresh) {
    pagination.page = 1
    finished.value = false
  }
  
  if (!pagination.hasMore && !isRefresh) {
    finished.value = true
    return
  }
  
  loading.value = true
  
    let info : any  = await getOrderList({page:pagination.page, pageSize: pagination.pageSize})
    let list = info.list
    if (pagination.page>1) {
      records.value = [...records.value, ...list]
    } else {
      records.value = list || []
    }
    pagination.hasMore = pagination.pageSize * pagination.page > info.total ? false : true
    
    loading.value = false
    refreshing.value = false
    pagination.page++
    if (!pagination.hasMore) {
      finished.value = true
      
    }
}


// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  pagination.page = 1
  fetchRecords(true)
}

// 上拉加载更多
const onLoad = () => {
  fetchRecords(false)
}

// 查看订单详情
const copy = (order: any) => {
  var aux = document.createElement("input"); 
    aux.setAttribute("value",  order.orderNo); 
    document.body.appendChild(aux); 
    aux.select();
    document.execCommand("copy"); 
    document.body.removeChild(aux);
    showToast('复制订单号: ' + order.orderNo)
  
}
</script>

<template>
  <div class="records-container">
    <!-- 使用AppHeader组件 -->
    <AppHeader title="购买记录" />

    <!-- 购买记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="records?.length > 0 ? '没有更多了' : ''"
        @load="onLoad"
      >
        <div class="records-list" v-if="records?.length > 0">
          <div class="record-item" v-for="record in records" :key="record.id">
            <div class="record-header">
              <div class="order-left">
              <span class="order-no">订单号：{{ record.orderNo }}</span>
              <div class="copy-but" @click="copy(record)">复制</div>
              </div>
              
              <span class="order-time">{{ record.createAt }}</span>
            </div>
            <div class="record-content" >
              <div class="product-info">
                <img :src="record.img || defaultImg" alt="金币" class="product-img" />
                <div class="product-detail">
                  <div class="product-name">{{ record.productName }}</div>
                </div>
              </div>
              <div class="product-price">￥{{ record.amount }}</div>
            </div>
            <div class="record-actions">
              <div class="uid">ID:{{ record.uid }}</div>
              <div>
                <span v-if="record.status == 0" class="delivery-status">未支付</span>
                <span v-else-if="record.status == 1" class="delivery-status status1">支付成功</span>
                <span v-else-if="record.status == 2" class="delivery-status">发货成功</span>
              </div>
              
            </div>
          </div>
        </div>

        <!-- 没有记录时的提示 -->
        <div class="empty-records" v-if="records?.length === 0 && !loading">
          <!-- <img src="../assets/images/empty.png" alt="暂无记录" class="empty-img" /> -->
          <van-empty
          image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
          image-size="80"
          description="暂无购买记录"
        />
          <!-- <p>暂无购买记录</p> -->
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 底部说明 -->
    <div class="footer-note">
      <p>若超过30分钟未收到商品，请联系客服</p>
    </div>
  </div>
</template>

<style scoped>
.records-container {
  padding: 0 0 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
  padding-bottom: 80px;
}

.records-list {
  padding: 10px;
}

.record-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
  color: #999;
}
.order-left{
  flex: 1;
  display: flex;
  align-items: center;
}
.order-no{
  width: 60%;
  text-align: left;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.copy-but{
  border: 1px solid #999;
  border-radius: 10px;
  padding: 1px 8px;
  margin-left: 5px;
}
.order-time{
  flex:1;
  text-align: right;
}
.record-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-right: 10px;
}

.product-detail {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.product-price {
  font-size: 16px;
  color: #f60;
  font-weight: bold;
}

.record-actions {
  border-top: 1px solid #f5f5f5;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
}
.uid{
  color: #999999;
  font-size: 12px;
}
.delivery-status {
  font-size: 12px;
  color: #fff;
}
.status1{
  background: rgb(25, 137, 250);
  padding:2px 5px;
  border-radius: 3px;
}
.empty-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-img {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.empty-records p {
  font-size: 14px;
  color: #999;
}

.footer-note {
  position: fixed;
  left: 0;
  bottom: 50px;
  right: 0;
  height: 30px;
  line-height: 30px;
  background-color: #ffe8ac;
}

.footer-note p {
  font-size: 12px;
  color: #6c5541;
  margin: 0;
}
</style> 