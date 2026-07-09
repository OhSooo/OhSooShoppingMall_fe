import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPayment } from '../../../api/payment/paymentApi';

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const paymentKey = searchParams.get('paymentKey');
    const paymentIdStr = searchParams.get('paymentId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !paymentIdStr || !amount) {
      navigate(
        '/payment/fail?errorCode=INVALID_PARAMS&errorMessage=' +
          encodeURIComponent('결제 정보가 올바르지 않습니다.'),
        { replace: true },
      );
      return;
    }

    const run = async () => {
      try {
        const paymentId = parseInt(paymentIdStr, 10);
        const amountNum = Number(amount);

        await confirmPayment(paymentId, {
          paymentId,
          paymentKey,
          amount: amountNum,
        });

        navigate('/payment/success', { replace: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : '결제 확인 중 오류가 발생했습니다.';
        navigate('/payment/fail?errorCode=CONFIRM_FAILED&errorMessage=' + encodeURIComponent(msg), {
          replace: true,
        });
      }
    };

    run();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 48px 48px' }}>
      <div
        className="page-card"
        style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '560px' }}
      >
        <div
          style={{
            margin: '0 auto 36px',
            width: '56px',
            height: '56px',
            border: '5px solid var(--color-gray-1)',
            borderTop: '5px solid var(--color-point-main)',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 12px',
          }}
        >
          결제를 처리하고 있습니다
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-gray-4)', margin: 0 }}>
          잠시만 기다려 주세요. 창을 닫거나 뒤로 가지 마세요.
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
