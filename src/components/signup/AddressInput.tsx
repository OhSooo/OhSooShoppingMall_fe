import { useDaumPostcodePopup } from 'react-daum-postcode';
import type { Address as DaumAddress } from 'react-daum-postcode';

/**
 * 주소 입력 값 (백엔드 API 필드명과 동일)
 */
export interface AddressValue {
  shippingPostcode: string;
  address: string;
  shippingAddressDetail: string;
}

const POSTCODE_SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

type Props = {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  error?: string;
  shippingAddressDetailError?: string;
  required?: boolean;
  disabled?: boolean;
};

/**
 * 다음 우편번호 서비스(팝업)로 주소·우편번호를 조회하고, 상세주소를 직접 입력받는 컴포넌트.
 * 회원가입, 온보딩, 내 정보 변경 등에서 재사용.
 */
export default function AddressInput({
  value,
  onChange,
  error,
  shippingAddressDetailError,
  required = false,
  disabled = false,
}: Props) {
  const open = useDaumPostcodePopup(POSTCODE_SCRIPT_URL);

  const handleComplete = (data: DaumAddress) => {
    // 사용자가 선택한 주소 타입에 따라 기본 주소 결정 (Daum 가이드: 사용자가 선택한 값 이용하기)
    let addr = '';
    if (data.userSelectedType === 'R') {
      addr = data.roadAddress;
    } else {
      addr = data.jibunAddress;
    }

    // 도로명 선택 시 참고항목(법정동, 건물명 등) 조합 (도로명주소 시행령 참고항목)
    let extraAddr = '';
    if (data.userSelectedType === 'R') {
      if (data.bname !== '' && /[동로가]$/.test(data.bname)) {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      if (extraAddr !== '') {
        extraAddr = ` (${extraAddr})`;
      }
    }

    onChange({
      shippingPostcode: data.zonecode,
      address: addr + extraAddr,
      shippingAddressDetail: value.shippingAddressDetail,
    });
  };

  const handleOpenPostcode = () => {
    open({ onComplete: handleComplete });
  };

  const handleShippingAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      shippingAddressDetail: e.target.value,
    });
  };

  const inputBorder = (err: string | undefined) =>
    err ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-gray-5)',
        }}
      >
        주소 {required && <span style={{ color: 'var(--color-point-main)' }}>*</span>}
      </label>

      {/* 우편번호 + 주소 찾기 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <input
          type="text"
          value={value.shippingPostcode}
          readOnly
          placeholder="우편번호"
          style={{
            width: '120px',
            padding: '12px 16px',
            fontSize: '15px',
            border: inputBorder(error),
            borderRadius: '6px',
            outline: 'none',
            backgroundColor: 'var(--color-gray-0)',
            color: 'var(--color-gray-5)',
          }}
        />
        <button
          type="button"
          onClick={handleOpenPostcode}
          disabled={disabled}
          style={{
            padding: '12px 16px',
            fontSize: '15px',
            fontWeight: '500',
            color: 'var(--color-white)',
            backgroundColor: disabled ? 'var(--color-gray-3)' : 'var(--color-point-main)',
            border: 'none',
            borderRadius: '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          우편번호 찾기
        </button>
      </div>

      {/* 기본 주소 (읽기 전용) */}
      <input
        type="text"
        value={value.address}
        readOnly
        placeholder="주소를 검색한 뒤 선택하면 자동으로 입력됩니다"
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '15px',
          border: inputBorder(error),
          borderRadius: '6px',
          outline: 'none',
          backgroundColor: 'var(--color-gray-0)',
          color: 'var(--color-gray-5)',
        }}
      />

      {/* 상세주소 */}
      <input
        type="text"
        value={value.shippingAddressDetail}
        onChange={handleShippingAddressDetailChange}
        placeholder="상세주소 (동, 호수 등)"
        maxLength={255}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '15px',
          border: inputBorder(shippingAddressDetailError),
          borderRadius: '6px',
          outline: 'none',
          transition: 'border-color 0.2s',
          backgroundColor: 'var(--color-white)',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
        onBlur={(e) => {
          if (!shippingAddressDetailError) e.target.style.borderColor = 'var(--color-gray-2)';
        }}
      />

      {(error || shippingAddressDetailError) && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-point-main)',
            minHeight: '18px',
          }}
        >
          {error || shippingAddressDetailError}
        </div>
      )}
    </div>
  );
}
