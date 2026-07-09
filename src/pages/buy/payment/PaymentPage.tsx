import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { createPayment } from '../../../api/payment/paymentApi';
import { getMe } from '../../../api/users/userApi';
import PageTitle from '../../../components/common/PageTitle';
import Button from '../../../components/common/Button';

export interface PaymentPageState {
  orderId: number;
  finalPrice: number;
  orderName?: string;
  customerName?: string;
}

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentPageState | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentRef = useRef<any>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/order', { replace: true });
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const meRes = await getMe();
        if (cancelled) return;

        const customerKey = meRes.data ? `user_${meRes.data.userId}` : ANONYMOUS;

        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        if (cancelled) return;

        // 결제창 SDK (API 개발 연동 키로 사용 가능)
        paymentRef.current = tossPayments.payment({ customerKey });
        if (!cancelled) setSdkReady(true);
      } catch (err) {
        console.error('[Toss Payment Error]', err);
        if (!cancelled) setError('결제 모듈을 불러오는 중 오류가 발생했습니다.');
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  const handlePay = async () => {
    if (!paymentRef.current || !state) return;
    setPaying(true);
    setError(null);

    try {
      // 결제하기 클릭마다 항상 새 paymentId — 백엔드가 기존 READY를 무효화하고 새 레코드 생성
      const res = await createPayment({
        orderId: state.orderId,
        amount: state.finalPrice,
        currency: 'KRW',
        method: 'CARD',
        provider: 'TOSS',
        orderName: state.orderName ?? `오쑤 쇼핑몰 주문 ${state.orderId}`,
        customerName: state.customerName,
      });
      const paymentId = res.paymentId;
      const tossOrderId = res.tossOrderId;

      await paymentRef.current.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: state.finalPrice,
        },
        orderId: tossOrderId,
        orderName: state.orderName ?? `오쑤 쇼핑몰 주문 ${state.orderId}`,
        customerName: state.customerName,
        successUrl: `${window.location.origin}/payment/pending?paymentId=${paymentId}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '결제 중 오류가 발생했습니다.';
      setError(msg);
      setPaying(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden', width: '100%', maxWidth: '560px' }}>
        <PageTitle title="Payment" />

        <div style={{ padding: '24px 28px 40px' }}>

          {/* 주문 요약 */}
          {state && (
            <div
              style={{
                padding: '24px',
                backgroundColor: 'var(--color-gray-0)',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--color-gray-4)' }}>
                {state.orderName ?? `주문 번호 ${state.orderId}`}
              </p>
              <p style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: 'var(--color-black)' }}>
                {state.finalPrice.toLocaleString()}원
              </p>
            </div>
          )}

          {/* 결제 수단 안내 */}
          {sdkReady && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                border: '1px solid var(--color-gray-1)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>💳</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>
                  신용카드 / 체크카드
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-gray-3)' }}>
                  토스 결제창에서 카드를 선택할 수 있습니다
                </p>
              </div>
            </div>
          )}

          {/* SDK 로딩 중 */}
          {!sdkReady && !error && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '32px 0',
                color: 'var(--color-gray-4)',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '3px solid var(--color-gray-1)',
                  borderTop: '3px solid var(--color-point-main)',
                  borderRadius: '50%',
                  animation: 'spin 0.9s linear infinite',
                }}
              />
              결제 모듈을 불러오는 중...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-point-main)',
                fontSize: '14px',
                margin: '16px 0',
              }}
            >
              {error}
            </p>
          )}

          {/* 결제하기 버튼 */}
          {state && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'var(--color-gray-0)',
                borderRadius: '6px',
                marginTop: '20px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-black)' }}>
                총 {state.finalPrice.toLocaleString()}원
              </span>
              <Button
                variant="primary"
                onClick={handlePay}
                disabled={!sdkReady || paying}
                style={{ padding: '10px 28px' }}
              >
                {paying ? '처리 중...' : '결제하기'}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
