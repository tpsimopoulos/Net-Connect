const initState = {
  authResult: null,
  loginErrorField: null,
  signUpResult: null,
  signUpErrorField: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESSFUL":
      return { ...state, authResult: null, loginErrorField: null };
    case "EMAIL_LOGIN_FAILED":
      return { ...state, authResult: action.payload, loginErrorField: "email" };
    case "PASSWORD_LOGIN_FAILED":
      return {
        ...state,
        authResult: action.payload,
        loginErrorField: "password",
      };
    case "SIGNUP_SUCCESSFUL":
      return { ...state, signUpResult: null, signUpErrorField: null };
    case "EMAIL_SIGNUP_FAILED":
      return {
        ...state,
        signUpResult: action.payload,
        signUpErrorField: "email",
      };
    case "PASSWORD_SIGNUP_FAILED":
      return {
        ...state,
        signUpResult: action.payload,
        signUpErrorField: "password",
      };
    default:
      return state;
  }
};

export default authReducer;
