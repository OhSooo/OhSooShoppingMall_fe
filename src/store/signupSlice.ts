import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface SignupState {
  // 1단계: 이메일 인증
  email: string;
  verificationCode: string;
  isCodeSent: boolean;
  isCodeVerified: boolean;

  // 2단계: 비밀번호
  password: string;
  passwordConfirm: string;

  // 3단계: 회원 정보
  name: string;
  birth: string;
  gender: Gender;
  phone: string;
  address: string;
  shippingPostcode: string;
  shippingAddressDetail: string;
}

const initialState: SignupState = {
  email: '',
  verificationCode: '',
  isCodeSent: false,
  isCodeVerified: false,
  password: '',
  passwordConfirm: '',
  name: '',
  birth: '',
  gender: 'MALE',
  phone: '',
  address: '',
  shippingPostcode: '',
  shippingAddressDetail: '',
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    // 1단계: 이메일 인증
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      // 이메일 변경 시 인증 상태 초기화
      if (state.isCodeSent) {
        state.isCodeSent = false;
        state.isCodeVerified = false;
        state.verificationCode = '';
      }
    },
    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
      // 인증번호 변경 시 검증 상태 초기화
      if (state.isCodeVerified) {
        state.isCodeVerified = false;
      }
    },
    setCodeSent: (state, action: PayloadAction<boolean>) => {
      state.isCodeSent = action.payload;
    },
    setCodeVerified: (state, action: PayloadAction<boolean>) => {
      state.isCodeVerified = action.payload;
    },

    // 2단계: 비밀번호
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setPasswordConfirm: (state, action: PayloadAction<string>) => {
      state.passwordConfirm = action.payload;
    },

    // 3단계: 회원 정보
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setBirth: (state, action: PayloadAction<string>) => {
      state.birth = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setShippingPostcode: (state, action: PayloadAction<string>) => {
      state.shippingPostcode = action.payload;
    },
    setShippingAddressDetail: (state, action: PayloadAction<string>) => {
      state.shippingAddressDetail = action.payload;
    },

    // 회원가입 데이터 초기화
    resetSignupData: () => initialState,
  },
});

export const {
  setEmail,
  setVerificationCode,
  setCodeSent,
  setCodeVerified,
  setPassword,
  setPasswordConfirm,
  setName,
  setBirth,
  setGender,
  setPhone,
  setAddress,
  setShippingPostcode,
  setShippingAddressDetail,
  resetSignupData,
} = signupSlice.actions;

export default signupSlice.reducer;
