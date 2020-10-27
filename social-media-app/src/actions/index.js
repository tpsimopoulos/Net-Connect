import firebase from "../firebase";
import "firebase/firestore";

export const addPost = (post) => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection("posts")
      .add({
        ...post,
        createdAt: new Date(),
        likes: 0,
        replies: 0,
        postReshared: false,
        reshares: 0,
        usersWhoReshared: [],
        usersWhoLiked: [],
      })
      .then((docRef) => {
        getFirestore()
          .collection("users")
          .where("username", "==", post.postAuthor)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((user) => {
              getFirestore()
                .collection("users")
                .doc(user.id)
                .update({
                  authoredPosts: firebase.firestore.FieldValue.arrayUnion(
                    docRef.id
                  ),
                });
            });
          });
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
            authoredPosts: [],
            resharedPosts: [],
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

// if reshare is true and username equals loggedInUser, throw error (you can only retweet once)
// user can only retweet original post once
export const resharePost = (post_id, loggedInUser, originalPostId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const post = obj.data();
        const { postReshared, postAuthor, postResharer } = post;
        // post reshared and post resharer is logged in
        if (postReshared && postResharer === loggedInUser) {
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .delete()
            .then(() => {
              getFirestore()
                .collection("posts")
                .doc(originalPostId)
                .update({
                  reshares: firebase.firestore.FieldValue.increment(-1),
                  usersWhoReshared: firebase.firestore.FieldValue.arrayRemove(
                    loggedInUser
                  ),
                });
            });
        } else {
          return post;
        }
      })
      .then((post) => {
        // prevents user from resharing the ORIGINAL post
        const { usersWhoReshared } = post;
        if (usersWhoReshared.includes(loggedInUser)) {
          throw "User Already Reshared";
        } else {
          // recording which users have reshared this post
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              usersWhoReshared: firebase.firestore.FieldValue.arrayUnion(
                loggedInUser
              ),
            })
            .then(() => {
              // adding 1 to the original post's reshare count
              getFirestore()
                .collection("posts")
                .doc(post_id)
                .update({
                  reshares: firebase.firestore.FieldValue.increment(1),
                })
                .then(() => {
                  // retrieve that updated document
                  getFirestore()
                    .collection("posts")
                    .doc(post_id)
                    .get()
                    .then((obj) => {
                      const post = obj.data();
                      return post;
                    })
                    // add a new document (new post) with contents from the above document plus
                    // two additional properties
                    .then((post) => {
                      getFirestore()
                        .collection("posts")
                        .add({
                          ...post,
                          originalPostId: post_id,
                          postResharer: loggedInUser,
                          postReshared: true,
                          reshareDate: new Date(),
                        })
                        // get reference to this new document and append to user's resharedPosts
                        // the reference to this document
                        .then((docRef) => {
                          getFirestore()
                            .collection("users")
                            .where("username", "==", post.postAuthor)
                            .get()
                            .then((querySnapshot) => {
                              querySnapshot.forEach((user) => {
                                getFirestore()
                                  .collection("users")
                                  .doc(user.id)
                                  .update({
                                    resharedPosts: firebase.firestore.FieldValue.arrayUnion(
                                      docRef.id
                                    ),
                                  });
                              });
                            });
                        });
                    });
                });
            });
        }
      })
      .catch((err) => console.log(err));
  };
};

// export const fetchPosts = () => {
//   return (dispatch, getState, { getFirebase, getFirestore }) => {

//   }
// }

// export const likePost = (post_id, PostLiker) => {
//   return (dispatch, getState, { getFirebase, getFirestore }) => {
//     getFirestore()
//       .collection("posts")
//       .doc(post_id)
//       .get()
//       .then((obj) => {
//         const post = obj.data();
//         const { usersWhoLiked } = post;
//         if (usersWhoLiked.includes(PostLiker)) {
//           throw "You can only like post once";
//         }
//       })
//       .then(() => {
//         getFirestore()
//           .collection("posts")
//           .doc(post_id)
//           .update({ likes: firebase.firestore.FieldValue.increment(1) });
//       })
//       .catch((err) => console.log(err));
//   };
// };
