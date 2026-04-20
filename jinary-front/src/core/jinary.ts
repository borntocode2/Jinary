interface JinaryMeta {                                                                                                                   
    protobufSize: number;
    jsonSize: number;                                                                                                                      
    rawHex: string;
}

interface JinaryResponse<T> {
    data: T;                                                                                                                               
    meta: JinaryMeta;
}

async function get<T>(
    url: string,
    decodeFunction: (binary: Uint8Array) => T
  ): Promise<JinaryResponse<T>> {                                                                                                          
    const response = await fetch(url, {
        headers: { Accept: 'application/x-protobuf' },
      });

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const binaryData = new Uint8Array(arrayBuffer);
      const protobufSize = binaryData.byteLength;

      // 주입받은 디코딩 함수 실행
      const decoded = decodeFunction(binaryData);

      // JSON 크기 비교 로직 (메타데이터용)
      const jsonSize = new TextEncoder().encode(
        JSON.stringify(decoded),
      ).byteLength;

      return {
        data: decoded,
        meta: {
          protobufSize,
          jsonSize,
          rawHex: Array.from(binaryData.slice(0, 50))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' '),
        },
      };
  } 

export const jinary = { get };
export type { JinaryMeta, JinaryResponse };