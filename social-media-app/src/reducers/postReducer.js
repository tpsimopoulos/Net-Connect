const initState = {};

const postReducer = (state = initState, action) => {
  switch (action.type) {
    case "POST_ADDED":
      console.log({ ...state, ...action.payload });
    default:
      return state;
  }
};

export default postReducer;
