# 데이터베이스 마이그레이션 가이드

## input_records 테이블에 transaction_uuid 컬럼 추가

### 목적

IWRP 중량 업데이트 시 중복 레코드 생성을 방지하기 위해 `transaction_uuid` 컬럼을 추가합니다.

### 마이그레이션 방법

#### 방법 1: Supabase Dashboard에서 직접 실행

1. Supabase Dashboard에 로그인
2. SQL Editor로 이동
3. 다음 SQL을 실행:

```sql
-- transaction_uuid 컬럼 추가
ALTER TABLE input_records
ADD COLUMN IF NOT EXISTS transaction_uuid UUID;

-- 고유 인덱스 추가 (중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS idx_input_records_transaction_uuid
ON input_records(transaction_uuid)
WHERE transaction_uuid IS NOT NULL;

-- 컬럼 설명 추가
COMMENT ON COLUMN input_records.transaction_uuid IS '중복 투입 방지를 위한 트랜잭션 고유 식별자';
```

#### 방법 2: 마이그레이션 파일 사용

마이그레이션 파일이 `supabase/migrations/add_transaction_uuid_to_input_records.sql`에 생성되어 있습니다.

Supabase CLI를 사용하는 경우:

```bash
supabase db push
```

### 변경 사항 확인

마이그레이션 후 다음 API를 호출하여 컬럼이 추가되었는지 확인:

```
GET /api/debug/check-schema
```

응답 예시:

```json
{
  "success": true,
  "columns": [
    "id",
    "user_id",
    "input_amount",
    "input_type",
    "input_date",
    "robot_code",
    "transaction_uuid", // <- 새로 추가된 컬럼
    "created_at",
    "updated_at"
  ]
}
```

### 코드 변경 사항

1. **usePythonSerialPort.ts**: IWRP 응답 처리 시 UUID 생성 및 전달
2. **useTestMode.ts**: 테스트 모드에서도 UUID 생성 및 전달
3. **ActionButtons.tsx**: IWRP API 호출 시 UUID 생성 및 전달
4. **update-weight API**:
   - `transaction_uuid` 필수 파라미터로 추가
   - 중복 체크 로직 추가
   - 같은 UUID로 이미 레코드가 있으면 중복 삽입 방지

### 동작 방식

1. IWRP 명령 실행 시 `crypto.randomUUID()`로 고유 UUID 생성
2. UUID를 `update-weight` API에 전달
3. API에서 해당 UUID로 기존 레코드 조회
4. 이미 존재하면 → 중복으로 판단하고 새 레코드 생성 안 함
5. 존재하지 않으면 → 새 레코드 생성 (UUID 포함)

### 주의사항

- 기존 레코드는 `transaction_uuid`가 NULL입니다 (정상 동작)
- 새로운 IWRP 요청부터 UUID가 저장됩니다
- UUID는 각 IWRP 명령마다 새로 생성되므로 고유성이 보장됩니다
