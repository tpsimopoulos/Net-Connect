import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import throttle from "lodash/throttle";
import firebase from "./firebase";
import rootReducer from "./reducers/rootReducer";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import {
  createFirestoreInstance,
  getFirestore,
  reduxFirestore,
} from "redux-firestore";
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase";
import { loadState, saveState } from "./localStorage";

const persistedState = loadState();
const rrfConfig = { userProfile: "users", useFirestoreForProfile: true };
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  compose(
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
    ),
    reduxFirestore(firebase, rrfConfig)
  ),
  persistedState
);

store.subscribe(
  throttle(() => {
    saveState({ firestore: store.getState().firestore });
  }, 1000)
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
