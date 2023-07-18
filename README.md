# Backoffice

백오피스 프로젝트

## 작업 시작 전

터미널에서 아래와 같이 입력해주세요.

1. .gitmessage 생성과 등록, 그리고 .gitignore를 생성합니다.

```zsh
source ./src/git_init
```

2. 패키지를 설치합니다.

```zsh
npm install
```

## 지켜야할 점

에러처리는 컨트롤러에서 작성합니다.

## 변경사항
- 리프레시 토큰 모델 생성(uuid4, refresh_token, user_id)
