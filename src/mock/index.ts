import Mock from 'mockjs'

// 模拟延迟
Mock.setup({
  timeout: '300-600'
})

// 用户相关接口
Mock.mock('/api/user/login', 'post', {
  code: 200,
  message: '登录成功',
  data: {
    token: '@guid',
    userInfo: {
      id: '@id',
      username: '@name',
      avatar: '@image("200x200")',
      createTime: '@datetime'
    }
  }
})

Mock.mock('/api/user/register', 'post', {
  code: 200,
  message: '注册成功'
})

Mock.mock('/api/user/info', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    id: '@id',
    username: '@name',
    avatar: '@image("200x200")',
    createTime: '@datetime'
  }
})

// 商品相关接口
Mock.mock('/api/products', 'get', {
  code: 200,
  message: '获取成功',
  'data|10': [{
    id: '@id',
    name: '@ctitle(5, 10)',
    price: '@float(10, 1000, 2, 2)',
    image: '@image("300x300")',
    description: '@cparagraph(1, 3)',
    stock: '@integer(0, 100)'
  }]
})

// 购买记录相关接口
Mock.mock('/api/records', 'get', {
  code: 200,
  message: '获取成功',
  'data|5-10': [{
    id: '@id',
    productId: '@id',
    product: {
      id: '@id',
      name: '@ctitle(5, 10)',
      price: '@float(10, 1000, 2, 2)',
      image: '@image("300x300")'
    },
    quantity: '@integer(1, 5)',
    totalPrice: '@float(10, 5000, 2, 2)',
    createTime: '@datetime',
    'status|1': ['待发货', '已发货', '已完成']
  }]
}) 