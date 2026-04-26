# [03.16]

🔍 명령어 해부하기

```
npx pbjs -t static-module -w commonjs -o src/proto/user_proto_bundle.js src/proto/user.proto
```

### npx pbjs (명령어 실행):

Node.js에게 protobufjs 패키지 안에 있는 pbjs라는 번역기(변환 도구)를 실행시키는 명령어

### -t static-module (Target, 변환 타겟):

가볍고 빠른 정적 자바스크립트 모듈(Static Module) 형태로 번역

.proto 파일을 실행 중에 무겁게 해석하지 않고, 미리 자바스크립트 코드로 다 만들어서 속도를 극대화하는 옵션

### -w commonjs (Wrapper, 모듈 포장 방식):

변환된 코드를 CommonJS 방식으로 만듦 (참고로 Vite 환경에서는 이 부분을 -w es6로 바꿔주면 최신 import/export 문법으로 만들어짐)

### -o src/proto/user_proto_bundle.js (Output, 결과물 위치):

변환이 다 끝나면, 결과물을 이 경로에 새로운 js 파일로 저장.

### src/proto/user.proto (Input, 원본 파일 위치):

백엔드에서 변환 할 파일을 가리킴

--> package.json에 단축키 생성했습니다.

```
npm run proto:gen
```

---

# 다음 작업: 코어 API 확장

현재 `core/jinary.ts`에는 `jinary.get()` 하나만 존재합니다.
axios처럼 범용적으로 사용할 수 있도록 코어 API를 확장해야 합니다.

## 구현 목표

### 1. `jinary.create(config)` — 인스턴스 생성
- baseURL, 공통 헤더, timeout 등 설정을 담는 인스턴스를 생성
- 매 요청마다 전체 URL을 쓰지 않고, 상대 경로만으로 요청 가능

```typescript
const client = jinary.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { Authorization: 'Bearer token' }
});

client.get('/users', decodeFunction);
```

### 2. POST 메서드 추가
- 바이너리 데이터를 서버로 보내는 것도 지원

```typescript
client.post('/users', bodyData, decodeFunction);
```

### 3. 요청 옵션 확장
- timeout: 요청 제한 시간
- headers: 요청별 커스텀 헤더
- 기타 필요한 설정 추가

## 현재 구조

```
src/
├── core/
│   └── jinary.ts       ← 여기를 확장
├── hook/
│   └── useJinary.ts    ← 코어를 감싸는 React 래퍼 (코어 확장 후 연동)
```
