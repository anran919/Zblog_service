const express = require('express')
const userRouter = require('./src/router/user')
const articleCateRouter = require('./src/router/article_cate')
const articlesRouter = require('./src/router/articles')
const cors = require('cors')
const { expressjwt: jwt } = require("express-jwt");
const { secretKey} =  require('./src/utils/config')

const app = express()
// 自定义全局中间件
app.use((req,res,next)=>{
  console.log('请求地址 == ',req.path);
  res.cc= function (err,status =1,data) { 
      res.send(
        {
          status,
          message : err instanceof Error ? err.message : err,
          data
        }
      )
  }
  next()
})
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(jwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))
// 配置跨域中间件
app.use(cors())
app.use(express.json())
//配置表单解析中间件
app.use(express.urlencoded({ extended: true }))
// 配置解析 Token 的中间件
app.use(jwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: ['/api/user/register','/api/user/login'] }))
// 配置路由中间件
app.use(userRouter)
app.use('/api/article_cate',articleCateRouter)
app.use('/api/articles',articlesRouter)

app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '请求成功!',
    data: '绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？'
  })
})
// 错误处理
app.use((err, req, res,next) => {
  // fix 获取不到res.cc ,需将自定义统一处理中间件放在token解析中间件之前
  if (err.name == 'UnauthorizedError') return res.cc('身份认证失败!')
  res.cc(err)
})

app.listen('3007', () => {
  console.log(' 🚗🚗🚗   express start successful on 127.0.0.1:3007  🚗🚗🚗  ');
})
