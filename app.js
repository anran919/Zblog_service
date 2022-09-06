const express = require('express')
const userRouter = require('./src/router/user')
// const mysql = require('mysql')
const cors = require('cors')
// const session = require('express-session')
// const { expressjwt: jwt } = require("express-jwt");

const app = express()
// 配置跨域中间件
app.use(cors())
app.use(express.json())
//配置表单解析中间件
app.use(express.urlencoded({ extended: true }))

// 自定义全局中间件
app.use((req,res,next)=>{
  res.cc= function (err,status =1) {
      res.send(
        {
          status,
          message : err instanceof Error ? err.message : err
        }
      )
  }
  next()
})

// 配置路由中间件
app.use(userRouter)

app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '请求成功!',
    data: '绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？'
  })
})
// 错误处理
app.use((err, req, res) => {
  const data = {}
  if (err) {
    data = {
      code: 300,
      message: '请求出错!',
    }
  } else {
    data = {
      code: 200,
      message: '请求成功!',
      data: '绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？'
    }
  }
  res.json(data)
})

app.listen('3007', () => {
  console.log(' 🚗🚗🚗   express start successful on 127.0.0.1:3007  🚗🚗🚗  ');
})
