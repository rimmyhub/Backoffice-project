require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Memorystore = require('memorystore')(session);
const express = require('express');
const path = require('path');
const { Server } = require('http');
const socketIo = require('socket.io');
// const viewRouter = require('./views/routes');

const renderRouter = require('./routes/render.router');

const userRouter = require('./routes/users.router');
const reviewRouter = require('./routes/reviews.router');
const restaurantRouter = require('./routes/restaurants.router');
const ownerRouter = require('./routes/owners.router');
const orderRouter = require('./routes/orders.router');
const orderdetailRouter = require('./routes/orderdetails.router');
const menuRouter = require('./routes/menus.router');
const authRouter = require('./routes/auth.router');
// const socketRouter = require('./routes/socket.router');

const HOST = '127.0.0.1';
const PORT = 3000;
const maxAge = 5 * 60 * 1000; // 5분
const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const http = Server(app);
const io = socketIo(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// socketRouter(io); // socket.router.js에서 따로 관리

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new Memorystore({ checkPeriod: maxAge }),
    cookie: {
      maxAge: maxAge, // 5분
    },
  })
);

//ejs 생성
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));

// 로그인 페이지(사장)
app.get('/sign-in/:userType', (req, res) => {
  const { userType } = req.params;
  const data = {
    userType,
  };
  res.render('sign-in', data);
});



// 회원가입 페이지

app.use('/', [
  userRouter,
  reviewRouter,
  restaurantRouter,
  ownerRouter,
  orderRouter,
  // orderdetailRouter,
  menuRouter,
  authRouter,
  renderRouter,
]);

app.use((error, req, res, next) => {
  console.log('error middle ware');
  console.log(error.stack);
});

http.listen(PORT, HOST, () => {
  console.log(PORT, '포트에 접속하였습니다.');
});
