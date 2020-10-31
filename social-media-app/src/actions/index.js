import firebase from "../firebase";
import "firebase/firestore";
import _ from "lodash";

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

export const resetPassword = (email) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirebase()
      .auth()
      .sendPasswordResetEmail(email)
      .then((obj) =>
        console.log(obj, "Password reset email sent, please check your inbox.")
      );
  };
};

export const resharePost = (post_id, loggedInUser, originalPostId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const post = obj.data();
        const {
          usersWhoReshared,
          postReshared,
          postAuthor,
          postResharer,
        } = post;
        // if post reshared and post resharer is logged in, delete reshare and decrement original post reshares
        if (postReshared && postResharer === loggedInUser) {
          console.log("FIRST IF");
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
          // else if post wasn't reshared and logged in user not in usersWhoReshared,
          // user is trying to reshare a post never reshared by them before
        } else if (
          !postReshared &&
          !post.usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log("SECOND IF");
          // increment reshares on original post by 1
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              reshares: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              // retrieve that updated post
              getFirestore()
                .collection("posts")
                .doc(post_id)
                .get()
                .then((obj) => {
                  // creating a reshared post under that user's name with the updated original post info
                  const post = obj.data();
                  getFirestore()
                    .collection("posts")
                    .add({
                      ...post,
                      originalPostId: post_id,
                      postResharer: loggedInUser,
                      postReshared: true,
                      reshareDate: new Date(),
                    })
                    // get reference to this new post and append to user's resharedPosts in profile
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
                          return docRef;
                        })
                        .then((docRef) => {
                          getFirestore()
                            .collection("posts")
                            .doc(post_id)
                            .get()
                            .then((obj) => {
                              // since post has now been reshared, append the reshared post id to user in usersWhoReshared array in original post
                              const post = obj.data();
                              getFirestore()
                                .collection("posts")
                                .doc(post_id)
                                .set({
                                  ...post,
                                  usersWhoReshared: {
                                    ...post.usersWhoReshared,
                                    [loggedInUser]: docRef.id,
                                  },
                                });
                            });
                        });
                    });
                });
            });
          // if user clicks on original post and they are in the usersWhoReshared array...
        } else if (
          !postReshared &&
          usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log("THIRD IF");
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .get()
            .then((obj) => {
              const { usersWhoReshared } = obj.data();
              // find the reshared post id in original post's usersWhoReshared object
              for (const user in usersWhoReshared) {
                if (user === loggedInUser) {
                  const resharedPost = usersWhoReshared[user];
                  // delete that reshared post
                  getFirestore()
                    .collection("posts")
                    .doc(resharedPost)
                    .delete()
                    .then(() => {
                      getFirestore()
                        .collection("posts")
                        .doc(post_id)
                        .get()
                        .then((obj) => {
                          const { usersWhoReshared } = obj.data();
                          // then remove the user from usersWhoReshared object
                          getFirestore()
                            .collection("posts")
                            .doc(post_id)
                            .update({
                              usersWhoReshared: _.omit(usersWhoReshared, [
                                loggedInUser,
                              ]),
                              reshares: firebase.firestore.FieldValue.increment(
                                -1
                              ),
                            });
                        });
                    });
                }
              }
            })
            .catch((err) => console.log(err));
        }
      });
  };
};

// NEED TO ADD AN ID REFERENCE TO RESHARED POST IN THE ORIGINAL POST EVERY TIME YOU APPEND TO USERSWHORESHARED

export const likePost = (post_id, loggedInUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const post = obj.data();
        const { usersWhoLiked } = post;
        // if user already liked post, decrement likes by 1 and remove user from usersWhoLiked
        if (usersWhoLiked.hasOwnProperty(loggedInUser)) {
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              likes: firebase.firestore.FieldValue.increment(-1),
              usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
            });
        } else {
          // Else if they are liking the post for the first time, increment post likes by 1
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              likes: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              // get that post and add the logged in user to the usersWhoLiked object
              getFirestore()
                .collection("posts")
                .doc(post_id)
                .get()
                .then((obj) => {
                  const post = obj.data();
                  getFirestore()
                    .collection("posts")
                    .doc(post_id)
                    .set({
                      ...post,
                      usersWhoLiked: {
                        ...post.usersWhoLiked,
                        [loggedInUser]: post_id,
                      },
                    });
                  // .then((docRef) => {
                  //   getFirestore()
                  //     .collection("users")
                  //     .where("username", "==", post.postAuthor)
                  //     .get()
                  //     .then((querySnapshot) => {
                  //       querySnapshot.forEach((user) => {
                  //         getFirestore()
                  //           .collection("users")
                  //           .doc(user.id)
                  //           .update({
                  //             likedPosts: firebase.firestore.FieldValue.arrayUnion(
                  //               docRef.id
                  //             ),
                  //           });
                  //       });
                  //       return docRef;
                  //     });
                  // });
                });
            })
            .catch((err) => console.log(err));
        }
      });
  };
};
