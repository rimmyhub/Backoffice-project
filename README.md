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
