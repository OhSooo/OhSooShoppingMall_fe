/* 
  소스 코드 가독성을 높이고 통일시켜주기 위한 Prettier 설정 파일. 

  1) npm install -D @types/node 터미널에 치기
  2) npm install -D prettier eslint-config-prettier 터미널에 치기
  3) Ctrl + , => 검색창에 format on save => Editor: Format On Save 체크 on
  4) 좌측의 '확장' 메뉴에서 Prettier – Code formatter 설치
  5) 파일에서 우클릭 => 문서 서식 프로그램(Format Document With…) 
    => 기본 서식 프로그램 구성(Configure Default Formatter) 클릭 
    => Prettier – Code formatter 선택
  6) vsCode 껐다가 다시 키기

*/

export default {
  // 세미콜론 사용
  semi: true,

  // 작은따옴표 사용
  singleQuote: true,

  // 들여쓰기 2칸
  tabWidth: 2,

  // 마지막 쉼표 (diff 깔끔)
  trailingComma: 'es5',

  // 한 줄 최대 길이
  printWidth: 100,
};
