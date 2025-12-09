export const validationRules = {
  newId: {
    regex: /^[a-zA-Z0-9]*$/,
    min: 2,
    max: 20,
    message: "아이디는 2~20자, 영어/숫자만 사용 가능합니다."
  },

  newName: {
    regex: /^[a-z가-힣]*$/,
    min: 2,
    max: 40,
    message: "이름은 2~40자, 영어/한글만 사용 가능합니다."
  },

  newRegion: {
    regex: /^[가-힣]*$/,
    min: 2,
    max: 5,
    message: "지역명은 2~5자 한글만 사용 가능합니다."
  },

  newPhone: {
    regex: /^0\d{1,2}-\d{3,4}-\d{4}$/,
    message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)"
  },

  newEmail: {
    type: "email",
    message: "이메일 형식이 올바르지 않습니다. (예: example@kh.com)"
  },

  newPoint: {
    min: 0,
    message: "포인트는 0 이상의 숫자여야 합니다."
  }
};
