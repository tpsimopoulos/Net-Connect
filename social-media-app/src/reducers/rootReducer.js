import { authReducer } from "./authReducer";
import { postImageUploadReducer } from "./postImageUploadReducer";
import { userAvatarMappingReducer } from "./userAvatarMappingReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer,
  uploadedImage: postImageUploadReducer,
  userAvatars: userAvatarMappingReducer,
});

export default rootReducer;
