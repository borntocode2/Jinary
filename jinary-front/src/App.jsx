import React from 'react';                                                                                         
import { useJinary } from './hook/useJinary';                                                                      
import { decodeUserList } from './proto/user_proto_bundle.js';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  // Math.log()로 단위를 결정합니다
  // 예: 1500 → log(1500)/log(1024) ≈ 1.05 → floor → 1 → "KB"
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function App() {
  const { data, loading, error, meta, fetchData } = useJinary(                                                       
    BACKEND_URL,  
    decodeUserList
  );

  const savedPercent = meta.jsonSize > 0                                                                             
    ? ((1 - meta.protobufSize / meta.jsonSize) * 100).toFixed(1)
    : '0';

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
        Jinary PoC - 바이너리 통신 데모
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        백엔드({BACKEND_URL})에서 Protobuf 바이너리를 받아 디코딩합니다.
      </p>

      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: '14px 32px',
          fontSize: '16px',
          cursor: loading ? 'wait' : 'pointer',
          background: loading ? '#ccc' : '#aa3bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        {loading ? '요청 중...' : '백엔드에서 바이너리 데이터 받기'}
      </button>

      {error && (
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            background: '#fff5f5',
            border: '1px solid #ff6b6b',
            color: '#c92a2a',
            marginBottom: '24px',
          }}
        >
          {error}
        </div>
      )}
      {data && (
        <div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #ff6b6b',
                background: '#fff5f5',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                JSON
              </div>
              <div
                style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}
              >
                {formatBytes(meta.jsonSize)}
              </div>
              <div
                style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}
              >
                {meta.jsonSize.toLocaleString()} bytes
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #51cf66',
                background: '#f0fff4',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#51cf66',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Protobuf
              </div>
              <div
                style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}
              >
                {formatBytes(meta.protobufSize)}
              </div>
              <div
                style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}
              >
                {meta.protobufSize.toLocaleString()} bytes
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #aa3bff, #7c3aed)',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Protobuf가 JSON보다
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
              {savedPercent}% 작음
            </div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>
              {data.users.length}명 기준 |{' '}
              {formatBytes(meta.jsonSize - meta.protobufSize)} 절감
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: '#1e1e2e',
              color: '#a6e3a1',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#cdd6f4',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}
            >
              Protobuf 바이너리 미리보기 (처음 50바이트, 16진수)
            </div>
            <code
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                wordBreak: 'break-all',
                lineHeight: '1.8',
                display: 'block',
                background: 'transparent',
                padding: 0,
                color: '#a6e3a1',
                borderRadius: 0,
              }}
            >
              {meta.rawHex}
            </code>
          </div>
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              background: '#fafafa',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#333',
              }}
            >
              디코딩 검증 (처음 3명)
            </div>
            {data.users.slice(0, 3).map((user, i) => (
              <div
                key={i}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  background: 'white',
                  border: '1px solid #eee',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                <strong>{user.name}</strong>
                <span style={{ color: '#999', marginLeft: '8px' }}>
                  {user.id} | {user.email} | {user.age}세
                </span>
              </div>
            ))}
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              백엔드 바이너리 → Protobuf 디코딩 → JS 객체 복원 성공
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
