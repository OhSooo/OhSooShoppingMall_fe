import { useState } from 'react';
import PageShell from '../../../components/common/PageShell';
import SignupPage_Email from './SignupPage_Email';
import SignupPage_Password from './SignupPage_Password';
import SignupPage_UserInfo from './SignupPage_UserInfo';

type SignupStep = 1 | 2 | 3;

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);

  const steps = [
    { number: 1, label: '이메일 인증' },
    { number: 2, label: '비밀번호 설정' },
    { number: 3, label: '회원 정보 입력' },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as SignupStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    }
  };

  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 0 80px 0',
        }}
      >
        {/* 회원가입 타이틀 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--color-black)',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          회원가입
        </h1>

        {/* Step 인디케이터 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          {/* 연결선 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: 'var(--color-gray-1)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: 'var(--color-point-main)',
              zIndex: 1,
              width: `${((currentStep - 1) / 2) * 100}%`,
              transition: 'width 0.3s',
            }}
          />

          {/* Step 버블들 */}
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isActive || isCompleted ? 'var(--color-point-main)' : 'var(--color-gray-1)',
                    color: isActive || isCompleted ? 'var(--color-white)' : 'var(--color-gray-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                  }}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    color: isActive || isCompleted ? 'var(--color-point-main)' : 'var(--color-gray-3)',
                    fontWeight: isActive ? '600' : '400',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 단계별 컨텐츠 */}
        <div style={{ width: '100%' }}>
          {currentStep === 1 && <SignupPage_Email onNext={handleNext} />}
          {currentStep === 2 && <SignupPage_Password onNext={handleNext} onPrev={handlePrev} />}
          {currentStep === 3 && <SignupPage_UserInfo onPrev={handlePrev} />}
        </div>
      </div>
    </PageShell>
  );
}
