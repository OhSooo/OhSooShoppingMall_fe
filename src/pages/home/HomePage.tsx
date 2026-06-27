import { Link } from 'react-router-dom';

function ProductCard({ to = '/item/1' }: { to?: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        aspectRatio: '1',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-gray-1)',
        borderRadius: '8px',
        textDecoration: 'none',
      }}
    />
  );
}

function ProductCardWide({ to = '/item/1' }: { to?: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        width: '100%',
        height: '80px',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-gray-1)',
        borderRadius: '6px',
        textDecoration: 'none',
      }}
    />
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-point-main)', margin: '0 0 12px' }}>
      {label}
    </p>
  );
}

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
      {/* 히어로 배너 */}
      <div
        style={{
          position: 'relative',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          marginBottom: '24px',
          backgroundColor: 'var(--color-point-sub)',
          padding: '40px 40px 0',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minHeight: '180px',
        }}
      >
        {/* 좌측 텍스트 */}
        <div style={{ paddingBottom: '32px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--color-black)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            피부 깊은 곳에서 차오르는
            <br />
            투명한 푸른빛
          </h1>
        </div>
        {/* 우측 상품 이미지 영역 */}
        <div
          style={{
            width: '160px',
            height: '160px',
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: '8px 8px 0 0',
            flexShrink: 0,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 상단 배너 슬라이더 영역 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <div style={{ width: '80px', height: '60px', backgroundColor: 'var(--color-gray-1)', borderRadius: '6px' }} />
            <div style={{ width: '80px', height: '60px', backgroundColor: 'var(--color-gray-1)', borderRadius: '6px' }} />
          </div>

          {/* Sale Product */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-gray-1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <SectionLabel label="Sale Product" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCard key={i} />
              ))}
            </div>
          </div>

          {/* Popular Product */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-gray-1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <SectionLabel label="Popular Product" />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardWide key={i} />
                ))}
              </div>
              <div
                style={{
                  width: '160px',
                  flexShrink: 0,
                  backgroundColor: 'var(--color-gray-0)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-1)',
                }}
              />
            </div>
          </div>

          {/* New Product */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-gray-1)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <SectionLabel label="New Product" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '160px',
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-1)',
                    borderRadius: '6px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 우측 사이드바 */}
        <div style={{ width: '140px', flexShrink: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-point-main)', margin: '0 0 10px' }}>
            Recommand
            <br />
            Product
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '140px',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-gray-1)',
                  borderRadius: '6px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
