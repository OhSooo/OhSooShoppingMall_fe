import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';
import { loginLocal } from '../../services/auth/loginService';
import PasswordInput from '../../components/common/PasswordInput';
import { API_BASE_URL } from '../../api/config';

// 소셜 로그인 Provider 타입
type SocialProvider = 'google' | 'naver' | 'kakao';

// 소셜 로그인 설정
const socialLoginConfig: Record<
  SocialProvider,
  { label: string; bgColor: string; textColor: string; hoverBg: string }
> = {
  google: {
    label: '구글 계정으로 로그인',
    bgColor: 'var(--color-white)',
    textColor: 'var(--color-black)',
    hoverBg: 'var(--color-gray-1)',
  },
  naver: {
    label: '네이버 계정으로 로그인',
    bgColor: '#03C75A',
    textColor: '#FDFDFD',
    hoverBg: '#02b351',
  },
  kakao: {
    label: '카카오 계정으로 로그인',
    bgColor: '#FEE500',
    textColor: 'var(--color-black)',
    hoverBg: '#e6cf00',
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // 폼 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 소셜 버튼 hover 상태
  const [hoveredSocial, setHoveredSocial] = useState<SocialProvider | null>(null);

  const redirect = useMemo(() => {
    const raw = params.get('redirect');
    if (!raw) return '/';
    try {
      const decoded = decodeURIComponent(raw);
      return decoded.startsWith('/') ? decoded : '/';
    } catch {
      return '/';
    }
  }, [params]);

  // 로컬 로그인 처리
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await loginLocal({ email, password });
      
      // 로그인 성공 시 role은 서버에서 받아오거나 별도 API로 조회해야 할 수 있음
      // 현재는 기본값으로 설정 (필요시 수정)
      localStorage.setItem('role', 'USER');

      navigate(redirect, { replace: true });
    } catch (error: any) {
      // 에러 메시지 표시
      const errorMessage = error?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider: SocialProvider) => {
    // 백엔드 OAuth2 인증 URL로 이동
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '40px 0 80px 0',
        }}
      >
        {/* 로그인 타이틀 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--color-black)',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          로그인
        </h1>

        {/* 로컬 로그인 폼 */}
        <form
          onSubmit={handleLocalLogin}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* 이메일 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '1px solid var(--color-gray-2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-gray-2)')}
            />
            {/* 이메일 유효성 검사 메시지 영역 (나중에 사용) */}
            <div style={{ minHeight: '18px' }}></div>
          </div>

          {/* 비밀번호 입력 */}
          <PasswordInput
            id="password"
            label="비밀번호"
            value={password}
            onChange={setPassword}
            placeholder="비밀번호를 입력하세요"
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-white)',
              backgroundColor: isLoading ? 'var(--color-gray-3)' : 'var(--color-point-main)',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
            }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 비밀번호 재발급 / 회원가입 링크 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '16px',
            fontSize: '13px',
          }}
        >
          <Link
            to="/password-reset"
            style={{
              color: 'var(--color-gray-4)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-point-main)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gray-4)')}
          >
            비밀번호 재발급
          </Link>
          <span style={{ color: 'var(--color-gray-2)' }}>|</span>
          <Link
            to="/signup"
            style={{
              color: 'var(--color-gray-4)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-point-main)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gray-4)')}
          >
            회원가입
          </Link>
        </div>

        {/* 구분선 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '40px 0',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-1)' }} />
          <span style={{ fontSize: '13px', color: 'var(--color-gray-3)' }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-1)' }} />
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {(Object.keys(socialLoginConfig) as SocialProvider[]).map((provider) => {
            const config = socialLoginConfig[provider];
            const isHovered = hoveredSocial === provider;

            return (
              <button
                key={provider}
                type="button"
                onClick={() => handleSocialLogin(provider)}
                onMouseEnter={() => setHoveredSocial(provider)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: config.textColor,
                  backgroundColor: isHovered ? config.hoverBg : config.bgColor,
                  border: provider === 'google' ? '1px solid var(--color-gray-2)' : 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {/* 소셜 아이콘 (간단한 텍스트 아이콘으로 대체) */}
                <span style={{ fontSize: '18px', fontWeight: '700' }}>
                  {provider === 'google' && 'G'}
                  {provider === 'naver' && 'N'}
                  {provider === 'kakao' && 'K'}
                </span>
                {config.label}
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
