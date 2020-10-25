import firebase from "../firebase";
import "firebase/firestore";

export const addPost = (post) => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection("posts")
      .add({
        ...post,
        likes: 0,
        retweets: 0,
        replies: 0,
        reshare: false,
        reshares: 0,
        createdAt: new Date(),
      })
      .then(() => {
        dispatch({ type: "POST_ADDED", payload: post });
      })
      .catch((err) => console.log(err));
  };
};

export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    getFirebase()
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => dispatch({ type: "LOGIN_SUCCESSFUL" }))
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            dispatch({ type: "EMAIL_LOGIN_FAILED", payload: err.message });
            break;
          case "auth/wrong-password":
            dispatch({ type: "PASSWORD_LOGIN_FAILED", payload: err.message });
            break;
        }
      });
  };
};

export const signUp = (credentials) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirebase()
      .auth()
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then((res) => {
        getFirestore()
          .collection("users")
          .doc(res.user.uid)
          .set({
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            initials: credentials.firstName[0] + credentials.lastName[0],
            username: credentials.username,
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESSFUL" });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            dispatch({ type: "EMAIL_SIGNUP_FAILED", payload: err.message });
            break;
          case "auth/weak-password":
            dispatch({ type: "PASSWORD_SIGNUP_FAILED", payload: err.message });
            break;
        }
      });
  };
};

// query for original post and invoke add post on it
export const resharePost = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(id)
      .update({ reshares: firebase.firestore.FieldValue.increment(1) })
      .then(() => {
        getFirestore()
          .collection("posts")
          .doc(id)
          .get()
          .then((obj) => {
            return obj.data();
          })
          .then((obj) => {
            getFirestore()
              .collection("posts")
              .add({ ...obj, reshare: true, reshareDate: new Date() });
          })
          .catch((err) => console.log(err));
      });
  };
};

export const likePost = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(id)
      .update({ likes: firebase.firestore.FieldValue.increment(1) });
  };
};

// export const fetchPosts = () => {
//   return async (dispatch, getState, { getFirebase, getFirestore }) => {
//     await getFirestore()
//       .collection("posts")
//       .get()
//       querySnapshot
//       // .then((obj) => dispatch({ type: "REQUESTED_POST_DETAIL", payload: obj }));
//   };
// };
