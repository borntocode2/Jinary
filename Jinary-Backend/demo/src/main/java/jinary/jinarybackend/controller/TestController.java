package jinary.jinarybackend.controller;

import jinary.jinarybackend.dto.UserPayload;
import jinary.jinarybackend.jinary.Jinary;
import jinary.jinarybackend.jinary.JinaryCodec;
import jinary.jinarybackend.jinary.JinaryMediaTypes;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
public class TestController {
    private final JinaryCodec jinaryCodec;

    public TestController(JinaryCodec jinaryCodec) {
        this.jinaryCodec = jinaryCodec;
    }

    @GetMapping(value = "/test/json", produces = MediaType.APPLICATION_JSON_VALUE)
    public UserPayload getJsonData() {
        return new UserPayload(202417051, "Sanghwa", "test@skhu.ac.kr");
    }

    @Jinary
    @GetMapping(value = "/test/binary", produces = JinaryMediaTypes.APPLICATION_JINARY)
    public UserPayload getBinaryData() {
        return new UserPayload(202417051, "Sanghwa", "test@skhu.ac.kr");
    }

    @Jinary
    @PostMapping(
            value = "/test/json-from-binary",
            consumes = JinaryMediaTypes.APPLICATION_JINARY,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public UserPayload jsonFromBinary(@RequestBody UserPayload request) {
        return request;
    }

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
}
