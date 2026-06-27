import PageTitle from '../../../components/common/PageTitle';

export default function PaymentPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle title="Order" />

        <div style={{ padding: '24px 28px 40px' }}>
          {/* TOSS 결제 위젯 영역 */}
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              border: '1.5px solid var(--color-point-main)',
              borderRadius: '16px',
              minHeight: '520px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'var(--color-point-back)',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-point-main)',
                letterSpacing: '2px',
              }}
            >
              TOSS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
