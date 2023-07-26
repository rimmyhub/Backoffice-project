# Backoffice

## 변경사항(공유)

- 리프레시 토큰 모델 생성(uuid4, refresh_token, user_id)
- OrderDetail 테이블에서 수량 컬럼 추가
- Client와 Restaurant 테이블의 phone_num을 String으로 수정
- Restaurant 테이블에 total_income(총 수익) 컬럼 추가

## Rest API

| Content              | Method     | Path                                       |
| -------------------- | ---------- | ------------------------------------------ |
| 회원가입(고객)       | `[post]`   | '/signup/clients'                          |
| 회원가입(사장)       | `[post]`   | '/signup/owners'                           |
| 로그인(고객)         | `[post]`   | '/login/client'                            |
| 로그인(사장)         | `[post]`   | '/login/owner'                             |
| 개인정보 조회(사장)  | `[get]`    | '/mypage/owners'                           |
| 개인정보 수정(사장)  | `[put]`    | '/mypage/owners'                           |
| 비밀번호 수정(사장)  | `[put]`    | '/mypage/owners/password'                  |
| 개인정보 조회(고객)  | `[get]`    | '/mypage/clients'                          |
| 개인정보 수정(고객)  | `[put]`    | '/mypage/clients'                          |
| 비밀번호 수정(고객)  | `[put]`    | '/mypage/clients/password'                 |
| 메뉴 조회            | `[get]`    | '/restaurant/:restaurant_id/menu'          |
| 메뉴 등록            | `[post]`   | '/restaurant/:restaurant_id/menu'          |
| 메뉴 수정            | `[put]`    | '/restaurant/:restaurant_id/menu/:menu_id' |
| 메뉴 삭제            | `[delete]` | '/restaurant/:restaurant_id/menu/:menu_id' |
| 주문 하기            | `[post]`   | '/order'                                   |
| 주문 조회(고객/사장) | `[get]`    | '/order/:client_id'                        |
| 주문 받기(사장)      | `[patch]`  | 'order-receive/:order_id'                  |
| 음식점 전체 조회     | `[get]`    | '/restaurant'                              |
| 개별 음식점 조회     | `[get]`    | '/restaurant/:restaurant_id'               |
| 음식점 수정          | `[put]`    | '/restaurant/:restaurant_id'               |
| 음식점 삭제          | `[delete]` | '/restaurant/:restaurant_id'               |
| 리뷰 조회            | `[get]`    | '/review/:restaurant_id'                   |
| 리뷰 작성            | `[post]`   | '/review/:order_id'                        |
| 리뷰 수정            | `[put]`    | '/review/:order_id'                        |
| 리뷰 삭제            | `[delete]` | '/review/:order_id'                        |

## Render page

| Page                      | Path                                  |
| ------------------------- | ------------------------------------- |
| 메인페이지                | '/'                                   |
| 회원가입 (고객/사장)      | '/join/:userType'                     |
| 로그인 페이지 (고객/사장) | '/login/:userType'                    |
| 마이페이지 (고객/사장)    | '/mypage'                             |
| 상세 페이지 (음식점 메뉴) | '/sub-page/:restaurant_id'            |
| 주문 정보                 | '/sub-page/:restaurant_id/order-page' |

## Feedback

- 로그인 페이지로 이동하는데 sign-in/user와 sign-in/owner를 썼었는데, 저희 팀은 줄곧 고객은 client로 통해왔기 때문에 client라는 단어를 계속 고수해야 할 것 같습니다.
- REST API에서는 user, owner, client, post와 같은 특정 대상을 지칭하는 명사는 늘 복수형으로 작성할 것을 강조해 왔습니다.
- 로그인 ejs에서 login 함수의 파라미터명으로 'param'을 쓰면 함수만 봤을 때 param이 무엇을 지칭하는지 알 수 없습니다.
- 클라이언트와 오너 작동 분리 과정을 좀 더 고민하셔서 동일한 코드가 최대한 반복 작성되지 않도록 시도해 보시는 것을 추천합니다.

```javascript
const existUser = await User.findByPk(user_id);
if (!existUser) return res.send({ message: '유저 정보가 없습니다.' });
```

- 만약 유저 정보 존재 유무를 파악하기 위해 위 코드와 같이 작성한 케이스가 있었습니다. 저는 변수명을 짓는 것에 문제가 있다고 봅니다. 변수명은 그 이름을 통해서 코드 실행의 결과가 어느정도 예측되어야 한다고 보는데 `existUser` 라는 변수명을 보면 존재 유무에 따라 `true` 혹은 `false`값을 담고 있을 것 같습니다. 하지만 실제 코드는 유저 아이디를 기준으로 유저 정보를 조회하는 코드로서 유저의 정보를 담게 됩니다. 그렇다면 existUser 보다는 그냥 user를 하거나 userInfo가 더 낫다고 생각합니다.

# 피드백을 적어보았습니다.

```javascript
getMenu = async ({ restaurant_id }) => {
  return await Menu.findAll({
    where: { restaurant_id },
    attributes: [
      'menu_id',
      'restaurant_id',
      'name',
      'menu_image',
      'price',
      'sold_out',
      'createdAt',
      'updatedAt',
    ],
    order: [['createdAt', 'DESC']],
  });
};
```

- attributes는 테이블에서 일부 컬럼을 선별해서 뽑고 싶을 때에 사용합니다. 하지만 위 코드에서는 Menu테이블에 존재하는 8개의 모든 컬럼을 뽑고 있습니다. 즉 attributes를 안쓰는 것과 동일한 결과를 얻으므로 attributes는 없어도 될 것 같습니다.

---

```javascript
getMenu = ({ restaurant_id }) => {
  ...
}
```

기존 코드에서 `async` 만 지워봤는데요. async만 제거해서 보면 좀 더 함수처럼 보일 것 같아서 지워봤습니다. 아시다시피 함수에서 `()`에는 `파라미터`라고 부르는 변수를 받는 자리입니다. 위 코드처럼 파라미터를 받는 자리에 그냥 restaurant_id를 받는 것과 { restaurant_id }로 받는 것에는 차이가 있으며 개인적으로 { restaurant_id }와 같이 오브젝트 형태로 받는 것은 상당한 혼란을 초래할 수 있다고 생각하기에 지양해야 한다고 생각합니다.

예시를 들어보면 좋을 것 같습니다.

```javascript
// 예제 1
const print = (number) => {
  console.log(number);
};
print(3); // 3이 출력됩니다.

// 예제 2
const print = ({ number }) => {
  console.log(number);
};
print(3); // undefined가 출력됩니다.
```

위 코드는 입력한 값을 터미널에 찍어주는 기능을 의도한 함수입니다.  
예제 1은 3이 출력되지만 예제 2는 undefined가 출력됩니다.

예제 1에서 print() 라는 함수의 파라미터값으로 3을 넘겨줍니다. 그러면 print함수가 정의된 const print 함수로 가서 `let number = 3`이 됩니다. 그래서 3이 정상적으로 출력됩니다.

하지만 예제 2의 경우 print() 함수가 숫자 3을 넘겨주면 const print 함수의 파라미터에 { number }가 있으므로 `let { number } = 3`이 됩니다. 이 상황은 뭐라 정의할 수 없는 상황입니다. 일반적으로 위와 같은 코드는 아래 코드 처럼 쓰입니다.

```javascript
// 구조 분해
let { number } = { number: 3 };
console.log(number); // 3이 나옵니다.
```

그러므로 예제 2에서 3이 출력되도록 하려면 아래처럼 해야 합니다.

```javascript
// 예제 2
const print = ({ number }) => {
  console.log(number);
};
print({ number: 3 }); // 3이 출력됩니다.
```

얼핏봐도 상당히 머리가 복잡해지는 코드인 것을 확인할 수 있습니다.

그래서 기존 menu나 restaurant API 코드에서는 기대하는 결과를 얻기 위해서 컨트롤러, 서비스, 레포지토리에 이르기까지 전부 함수 파라미터를 `(menu_id)`가 아닌 `({ menu_id })`와 같은 오브젝트 형태로 주는 것입니다. 이렇게하면 헷갈리고 오류 발생 가능성이 높아지므로 정석적인 방법인 예제 1처럼 전달하는 것이 바람직합니다.

---
