# Jinary Backend

Jinary는 스프링부트 개발자가 평소처럼 DTO를 사용하면서도, 실제 HTTP 바디는 Protobuf 바이너리로 주고받을 수 있게 만드는 실험용 라이브러리입니다.

이 저장소는 지금 다음 구조로 나뉘어 있습니다.

- [jinary-core](/Users/ralph/BackEnd/Jinary/Jinary-Backend/jinary-core)
- [jinary-spring-boot-starter](/Users/ralph/BackEnd/Jinary/Jinary-Backend/jinary-spring-boot-starter)
- [demo](/Users/ralph/BackEnd/Jinary/Jinary-Backend/demo)

## 핵심 아이디어

- 개발자는 `.proto` 파일을 직접 작성하지 않습니다.
- 컨트롤러에서는 JSON DTO를 다루듯 `UserPayload` 같은 자바 객체를 그대로 사용합니다.
- `jinary-core`가 DTO 구조를 보고 내부적으로 Protobuf 스키마를 만들고 바이너리로 직렬화합니다.
- `jinary-spring-boot-starter`가 스프링 MVC에 컨버터를 자동 등록합니다.
- 클라이언트는 `application/x-jinary` 또는 `application/x-protobuf` 형태의 바이너리를 주고받을 수 있습니다.

예제 DTO는 [UserPayload.java](/Users/ralph/BackEnd/Jinary/Jinary-Backend/demo/src/main/java/jinary/jinarybackend/dto/UserPayload.java:1) 입니다.

```java
public record UserPayload(
        Integer id,
        String name,
        String email
) {
}
```

### 1. 바이너리 요청을 DTO로 자동 역직렬화 후 JSON으로 응답

엔드포인트:

```http
POST /test/json-from-binary
Content-Type: application/x-jinary
Accept: application/json
```

컨트롤러 메소드:

```java
@Jinary
@PostMapping(
        value = "/test/json-from-binary",
        consumes = JinaryMediaTypes.APPLICATION_JINARY,
        produces = MediaType.APPLICATION_JSON_VALUE
)
public UserPayload jsonFromBinary(@RequestBody UserPayload request) {
    return request;
}
```

의미:

- 클라이언트는 `UserPayload`에 해당하는 Protobuf 바이너리를 보냅니다.
- 컨트롤러는 `@RequestBody UserPayload request`로 바로 받습니다.
- 즉, 개발자는 바이너리 파싱 코드를 직접 작성하지 않아도 됩니다.
- 반환은 `UserPayload`이므로 최종 응답은 JSON으로 나갑니다.

이 메소드는 "바이너리 입력 + DTO 처리 + JSON 출력" 흐름을 보여줍니다.

### 2. 바이너리 raw bytes를 직접 받아 JSON 문자열로 변환

엔드포인트:

```http
POST /test/json-from-raw-binary
Content-Type: application/x-jinary
Accept: application/json
```

컨트롤러 메소드:

```java
@PostMapping(
        value = "/test/json-from-raw-binary",
        consumes = JinaryMediaTypes.APPLICATION_JINARY,
        produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<byte[]> jsonFromRawBinary(@RequestBody byte[] payload) {
    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(jinaryCodec.toJson(payload, UserPayload.class).getBytes(StandardCharsets.UTF_8));
}
```

의미:

- 컨트롤러가 바이너리 `byte[]` 자체를 직접 받습니다.
- `jinaryCodec.toJson(payload, UserPayload.class)`를 사용해 해당 바이너리를 JSON으로 변환합니다.
- 결과적으로 "바이너리 데이터를 받아서 자동으로 JSON으로 직렬화해주는 메소드" 예제입니다.

이 방식은 다음 상황에 유용합니다.

- DTO 자동 바인딩 대신 raw payload를 직접 받고 싶은 경우
- 디버깅용 변환 API가 필요한 경우
- 게이트웨이/프록시처럼 바이너리를 받아 JSON으로 바꿔 전달해야 하는 경우

## 모듈 역할

- `jinary-core`
  `@Jinary`, 스키마 생성, 바이너리 인코딩/디코딩 같은 순수 로직을 담당합니다.
- `jinary-spring-boot-starter`
  스프링 부트 자동 설정과 `HttpMessageConverter` 등록을 담당합니다.
- `demo`
  실제 사용 예제와 테스트를 담고 있는 샘플 애플리케이션입니다.
