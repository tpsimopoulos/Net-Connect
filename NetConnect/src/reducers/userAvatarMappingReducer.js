const initState = [];

export const userAvatarMappingReducer = (state = initState, action) => {
  switch (action.type) {
    case "USER_AVATAR_MAPPINGS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
