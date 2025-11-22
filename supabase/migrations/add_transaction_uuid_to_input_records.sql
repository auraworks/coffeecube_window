-- input_records 테이블에 transaction_uuid 컬럼 추가
-- 중복 투입 방지를 위한 고유 식별자

-- transaction_uuid 컬럼 추가 (UUID 타입, NULL 허용)
ALTER TABLE input_records
ADD COLUMN IF NOT EXISTS transaction_uuid UUID;

-- transaction_uuid에 고유 인덱스 추가 (중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS idx_input_records_transaction_uuid
ON input_records(transaction_uuid)
WHERE transaction_uuid IS NOT NULL;

-- 컬럼 설명 추가
COMMENT ON COLUMN input_records.transaction_uuid IS '중복 투입 방지를 위한 트랜잭션 고유 식별자';
