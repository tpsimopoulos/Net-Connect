const initState = { authResult: null, errorField: null };

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESSFUL":
    case "SIGNUP_SUCCESSFUL":
      return { ...state, authResult: null, errorField: null };
    case "EMAIL_LOGIN_FAILED":
    case "EMAIL_SIGNUP_FAILED":
      return { ...state, authResult: action.payload, errorField: "email" };
    case "PASSWORD_LOGIN_FAILED":
    case "PASSWORD_SIGNUP_FAILED":
      return { ...state, authResult: action.payload, errorField: "password" };
    default:
      return state;
  }
};

export default authReducer;
