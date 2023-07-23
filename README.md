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


## Feedback
- 로그인 페이지로 이동하는데 sign-in/user와 sign-in/owner를 썼습니다. 저희 팀은 줄곧 고객은 client로 통해왔기 때문에 client라는 단어를 계속 고수해야 할 것 같습니다.
- REST API에서는 user, owner, client, post와 같은 특정 대상을 지칭하는 명사는 늘 복수형으로 작성할 것을 강조해 왔습니다.
- 로그인 ejs에서 login 함수의 파라미터명으로 'param'을 쓰면 함수만 봤을 때 param이 무엇을 지칭하는지 알 수 없습니다.
- 클라이언트와 오너 작동 분리 과정을 좀 더 고민하셔서 동일한 코드가 최대한 반복 작성되지 않도록 시도해 보시는 것을 추천합니다.

