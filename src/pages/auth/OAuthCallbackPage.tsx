import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';
import { reissueAccessToken } from '../../api/auth/login/loginApi';
import { getMeWithToken } from '../../api/users/userApi';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        // Step A: Access Token 발급받기
        const tokenResponse = await reissueAccessToken();
        
        if (!tokenResponse.data) {
          throw new Error('토큰 재발급 응답 데이터가 없습니다.');
        }

        const { accessToken, tokenType, expiresIn } = tokenResponse.data;

        // Access Token을 localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('tokenType', tokenType);
        localStorage.setItem('tokenExpiresIn', expiresIn.toString());
        
        // 만료 시간 계산하여 저장
        const expiresAt = Date.now() + expiresIn * 1000;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());

        // Step B: 내 정보 조회해서 온보딩 여부 판단
        const meResponse = await getMeWithToken(accessToken);
        
        if (!meResponse.data) {
          throw new Error('사용자 정보 조회 응답 데이터가 없습니다.');
        }

        const user = meResponse.data;

        // role 저장
        if (user.role) {
          localStorage.setItem('role', user.role);
        }

        // Step C: 라우팅
        if (user.onboarded) {
          // 온보딩 완료 → 홈으로 이동
          navigate('/', { replace: true });
        } else {
          // 온보딩 미완료 → 온보딩 페이지로 이동
          navigate('/onboarding', { replace: true });
        }
      } catch (error: any) {
        console.error('OAuth 콜백 처리 실패:', error);
        setStatus('error');
        setErrorMessage(
          error?.message || '소셜 로그인 처리 중 오류가 발생했습니다.'
        );
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    })();
  }, [navigate]);

  if (status === 'error') {
    return (
      <PageShell>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--color-black)',
            }}
          >
            로그인 처리 실패
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-gray-4)',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-gray-3)',
            }}
          >
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--color-point-main)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-black)',
          }}
        >
          로그인 처리 중...
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-gray-4)',
          }}
        >
          잠시만 기다려주세요.
        </p>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </PageShell>
  );
}
