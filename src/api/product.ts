import request from '@/utils/request'

export function submitOrder(data: {
  productId: string; 
  accountNo: string;
  customerName: string;

}) {
  return request({
    url: '/shop/order/store',
    method: 'post',
    data
  })
}
export function getOrderList(data: {
  page: number; 
  pageSize:number;
}) {
  return request({
    url: '/shop/order/getOrderList',
    method: 'post',
    data
  })
}