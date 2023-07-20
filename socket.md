# socket.io를 활용한 주문 알림 구상

먼저 server.js에 기본 세팅을 합니다.

```javascript
// server.js
const { Server } = require('http');
const socketIo = require('socket.io');

const socketRouter = require('./routes/socket.router');

const http = Server(app);
const io = socketIo(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
socketRouter(io); // socket.router.js에서 따로 관리

// app.listen을 http.listen으로 바꿔야 합니다
http.listen(PORT, HOST, () => {
  console.log(PORT, '포트에 접속하였습니다.');
});
```

socket.router.js파일을 만들어서 굳이 io를 빼주는 이유는 server.js를 최대한 깔끔하게 유지하기 위해서 입니다. 스파르타 강의에서는 socket.io사용을 server.js(또는 app.js)에서 구현하는 예시만 알려줘서 좀 아쉬운 것 같습니다.

그럼 socketRouter파일로 이동해서 백엔드 작업을 진행합니다. 아래 코드를 참조해 주세요.

### 필수조건
고객의 id와 사장의 id가 중복되어서는 안됩니다. 가령 사장 id는 1000001부터 시작한다거나 하는게 좋습니다.  
아래 로직은 고객 id와 사장 id가 중복된다면 올바로 작동하지 않습니다.  
모델에 사장 계정을 처음 생성할 때 강제적으로 id를 1000001로 지정한다면 그 다음부터는 autoIncrease이므로 100%는 아니지만 고객 id과 분리될 수 있습니다.  
확실하게 하기 위해서는 UUID를 쓰는 것이 더 좋습니다.

```javascript
// socket.router.js
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

/*
    알림 기능 구현을 위해 고민해야할 부분은 아래와 같습니다.
    1. 고객이 주문을 등록(결제)하면 해당 가게 사장님에게 알림이 가야합니다.
    -> 많은 사장님들 중 주문을 한 가게 사장님에게만 알림이 가야합니다.

    2. 사장님이 올라온 주문을 접수(접수 승인 버튼을 클릭)하면 해당 주문을 등록했던 고객에게 승인되었다는 알림이 가야합니다.
    -> 많은 고객님들 중 해당 주문을 등록했던 고객에게만 알림이 가야합니다.

    3. 각각의 알림은 고객 또는 사장이 로그인 상태라면 어떤 페이지에 머물고 있든지 알람을 받을 수 있어야 합니다. 즉 주문내역을 확인할 수 있는 mypage에 계속 머물고 있지 않더라도 알림을 받을 수 있어야 합니다.(이 부분은 아직 구현되지 않았습니다.)

    4. 사장님이 알람을 받을 수 있는 기계가 두 대 이상일 것을 고려해야 합니다. 즉 PC와 휴대폰 이렇게 두 대의 디바이스에 로그인되어 있다 하더라도 두 군데에서 모두 알람을 받을 수 있어야 합니다.

    이를 구현하기 위해서는 io.on 또는 io.emit 처럼 전체를 대상으로한 알림을 보내는게 아니라 타겟으로 지정된 소켓을 선별할 수 있어야 합니다.

    아래 코드에 제가 생각했던 선별 방식을 구현했습니다.
  */

// 로그인에 성공하여 페이지에 접속한 모든 클라이언트, 사장의 소켓을 이곳에 보관합니다.
let orderSocketList = [];

module.exports = (io) => {
  // cookieParser를 미들웨어로 지정합니다. 이는 쿠키에서 토큰을 가져오기 위해 필요합니다. 참고로 소켓에서도 쿠키정보를 가져올 수 있습니다.
  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res || {}, next);
  }) // 프론트에서 const socket = io.connect('/'); 이 존재하는 페이지에 접속하면 소켓이 생성됩니다.
    .on('connection', async (socket) => {
      // 지정페이지에 접속하면 해당 유저의 소켓 생성!
      // 쿠키를 토대로 로그인 유무를 판별합니다.
      const req = socket.request;
      const accessToken = req.cookies.accessToken; // 토큰 없으면 undefined
      if (!accessToken) return; // 엑세스 토큰이 없으면 이후 과정은 진행되지 않습니다.

      // 토큰 검증을 진행합니다. (만료되면 에러 뜸)
      let payload;
      try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      } catch (err) {
        console.log(err.message); // jwt expired
        return; // 토큰이 만료되었으면 이후 과정은 진행되지 않습니다.
      }

      // 이후 과정은 로그인한 유저 대상으로 진행되는 기능입니다.

      // client_id 또는 owner_id 획득(payload에 뭐가 들었는지 모르기 때문입니다.)
      const user_id = payload.owner_id ?? payload.client_id;

      // 소켓에 유저(고객 또는 사장) id를 저장합니다.
      // 마치 res.locals.user를 담는 것과 비슷한 개념입니다.
      // 이렇게하면 누가 고객이고 사장인지 알 수 없게 됩니다.
      // 그렇기 때문에 아래 코드는 고객과 사장의 id가 완벽히 구분되어 있어야 제대로 작동합니다.
      // 사장 id는 10000번부터 시작한다거나, 아니면 UUID를 사용하는게 좋습니다.
      socket.data.user_id = user_id;

      // 해당 소켓을 리스트에 추가합니다.
      // 페이지에 접속한 유저정보를 아래 배열에 추가합니다.
      // 참고로 유저가 페이지를 벗어나면 배열에서 삭제됩니다.
      // 그러므로 orderSocketList를 통해 해당 페이지에 현재 몇 명이 접속해 있는지 알 수 있습니다.
      orderSocketList.push(socket);

      /* 
      주문 등록 Flow
        1. 프론트에서 고객이 주문 결제버튼을 누릅니다.
        2. fetch함수를 통해 주문 데이터 생성 API를 요청합니다.
        3. fetch가 성공하면 'SUBMIT_ORDER' 소켓 이벤트를 emit합니다. 이 때 owner_id를 담아서 전달합니다.
        4. 많은 소켓들 중 owner_id와 일치하는 소켓을 찾습니다.
        5. 그 소켓에게 주문 등록 알림 메시지를 보내기위한 socket.emit을 발동합니다.
        6. 프론트에서 owner_id 사장님의 소켓은 socket.on으로 받은 이벤트 즉 주문 등록 알림을 받습니다.
    */

      // 주문 들어온 가게에게 알림을 보내는 이벤트입니다.
      // 여기는 백엔드 단이므로 프론트에서 socket.emit('SUBMIT_ORDER')이 작동되었다고 상상합니다.
      socket.on('SUBMIT_ORDER', (data) => {
        const { owner_id } = data; // emit에게 받은 owner_id입니다.

        /* 
        orderSocketList에서 owner_id가 일치하는 소켓을 찾습니다.
        사장님은 한 분이겠지만 여러 기기에 접속해 있을 수도 있습니다.
        그러므로 owner_id가 동일한 소켓이 여러개일 수도 있습니다.
        (ex. 컴퓨터에서 접속, 아이폰에서 접속, 테블릿에서 접속)
      */

        // filter 메소드를 쓰면 조건에 해당하는 한 개 이상의 소켓을 배열에 담아서 리턴합니다.
        // 참고로 '=>' 이후에 중괄호{}를 안쓰면 return을 의미합니다.
        const owners = orderSocketList.filter((sock) => sock.data.user_id === owner_id);

        // owner_id에 해당하는 소켓을 forEach로 하나씩 꺼내며 socket.emit 이벤트를 발동시킵니다.
        // 그러면 프론트에 있는 socket.on('SUBMIT_ORDER')가 이벤트를 받습니다.
        owners.forEach((sock) => {
          sock.emit('SUBMIT_ORDER', { message: '주문이 들어왔습니다.' });
        });
      });

      /*
      주문 승인 Flow
        1. 사장님이 주문 승인 버튼을 클릭합니다.
        2. 주문의 status를 0에서 1로 바꾸는 API를 fetch합니다.
        3. fetch가 성공하면 socket.emit('APPROVAL_ORDER') 이벤트를 발동합니다. 이 때 client_id 정보를 함께 담아 보냅니다.
        4. 백엔드에서 수 많은 소켓 중 client_id와 일치하는 소켓을 찾습니다.
        5. 해당 소켓에서 주문이 접수되었다는 알림을 보내기 위한 socket.emit 이벤트를 발동합니다.
        6. 프론트에서 client_id 고객이 socket.on을 통해 접수 완료 알림을 받습니다.
    */

      // 주문 승낙 사실을 고객에게 알립니다.
      // 작동방식은 'SUBMIT_ORDER'와 유사합니다.
      socket.on('APPROVAL_ORDER', (data) => {
        const { client_id } = data;
        // 고객은 한 분이지만 여러 기기에 접속해 있을 수도 있습니다.
        const clients = orderSocketList.filter((sock) => sock.data.user_id === client_id);
        clients.forEach((sock) => {
          sock.emit('APPROVAL_ORDER', { message: '주문이 승인되었습니다.' });
        });
      });

      /* 
      유저가 const socket = io.connect('/') 로 지정된 페이지를 벗어나면 orderSocketList 배열에서도 소켓이 제거됩니다.
    */
      socket.on('disconnect', () => {
        orderSocketList.splice(orderSocketList.indexOf(socket), 1);
      });
    });
};
```

여기까지가 백엔드에서의 소켓 구현입니다.

---

프론트 구현 예시도 살펴봅니다. 백엔드에서 봤던 알림 기능의 Flow를 잘 기억해 주세요.

```javascript
// mapage.ejs

/*
  프론트 구현 예시입니다 (1)
  고객이 주문을 '등록' 하면 해당 음식점 사장님에게 알림을 보내는 flow입니다.
*/

// 아래 코드가 존재하는 ejs페이지에 접속하면 무조건 백엔드의 io.on('connection')이 발동합니다.
const socket = io.connect('/');

// (jquery) html랜더 후 자동 실행하는 코드입니다.
$(document).ready(function () {
  // 태그 이름은 임의로 지었으니 변경 가능합니다.
  // 고객이 주문하기 버튼을 눌렀을 경우에 동작을 위한 이벤트 등록
  const orderBtn = document.getElementById('order-button');
  orderBtn.addEventListener('button', () => orders());
});

// 주문 등록 기능을 위한 함수입니다.
async function orders() {
  // 주문하려는 정보를 가져올 수 있는 form 태그를 가져옵니다.
  const menuForm = $('#menu-form');

  // forEach 등의 반복문을 통해 메뉴 id, 수량 정보를 가져옵니다.
  // [{menu_id: 1, count: 2}...]와 같은 형태의 array로 만듭니다.

  // 백엔드에 요청합니다.
  try {
    const res = await fetch('/order', {
      method: 'POST',
      body: data,
    });
    // 성공 결과로 owner_id를 받습니다.
    const { owner_id } = await res.json();

    // owner_id를 소켓 이벤트로 보냅니다.
    socket.emit('SUBMIT_ORDER', { owner_id });
  } catch (err) {
    alert(err.responseJSON.message);
  }
}

// 백엔드로부터 소켓 이벤트를 전달받습니다.
socket.on('SUBMIT_ORDER', (data) => {
  const { message } = data;
  alert(message);
  // 필요하다면 사장님 마이페이지로 이동합니다.(주문 내역 확인할 수 있게)
  // 아래와 같이 강제 이동 설정하면 만약 사장님이 메뉴 등록하고 있는데 강제 이동시키게 되어 컴플레인이 들어올 수도 있음
  document.location.href = '/mypage';
});

// -----------------

/* 
  프론트 구현 예시입니다 (2)
  사장이 접수 대기 상태의 주문을 '승인' 하면 해당 주문을 한 고객에게 알림을 보내는 flow를 구현합니다.
*/

$(document).ready(function () {
  // 사장이 '접수 승낙하기' 버튼을 눌렀을 경우에 동작을 위한 이벤트 등록
  const approvalBtn = document.getElementById('approval-button');
  approvalBtn.addEventListener('submit', (event) => {
    // 접수 승낙하기 버튼을 클릭했을 때 해당하는 주문의 order_id를 가져오는 코드를 구현해 주세요.

    // order_id를 approval() 함수에 담아 보냅니다.
    approval(order_id);
  });
});

async function approval(order_id) {
  // 백엔드에 요청합니다.
  const data = { order_id };
  try {
    const res = await fetch(`/order-receive/${order_id}`, {
      // 경로 수정 필요(/order 아님)
      method: 'PATCH',
      body: data,
    });
    // 성공 결과로 client_id를 받습니다.
    const { client_id } = await res.json();
    // client_id를 소켓 이벤트로 보냅니다.
    socket.emit('APPROVAL_ORDER', { client_id });
  } catch (err) {
    alert(err.responseJSON.message);
  }
}

// 백엔드로부터 소켓 이벤트를 전달받습니다.
socket.on('APPROVAL_ORDER', (data) => {
  const { message } = data;
  alert(message);
  // 고객님 마이페이지로 이동합니다.
  // 이 기능 또한 강제 이동이므로 컴플레인 주의
  document.location.href = '/mypage';
});
```
