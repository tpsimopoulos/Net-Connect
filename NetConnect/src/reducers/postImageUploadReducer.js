const initState = {
  imageUrl: "",
};

export const postImageUploadReducer = (state = initState, action) => {
  switch (action.type) {
    case "IMAGE_UPLOADED_FROM_POSTBOX":
      return { ...state, postboxImage: action.payload };
    case "IMAGE_REMOVED_FROM_POSTBOX_PREVIEW":
      return { ...state, postboxImage: "" };
    default:
      return state;
  }
};
