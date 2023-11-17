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
        postLikers: [],
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
          console.log("FIRST resharePost IF");
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
          console.log("SECOND resharePost IF");
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
          console.log("THIRD resharePost IF");
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

export const likePost = (post_id, loggedInUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // retrieving the post the user clicked like button on
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const post = obj.data();
        const {
          postReshared,
          postResharer,
          usersWhoLiked,
          usersWhoReshared,
          likes,
          postLikers,
          originalPostId,
        } = post;
        // if loggedInUser clicked like button on the original post,
        // and if loggedInUser already liked the post,
        // and if loggedInUser didn't reshare the post
        // decrement likes by 1 and remove user from usersWhoLiked
        if (
          !postReshared &&
          usersWhoLiked.hasOwnProperty(loggedInUser) &&
          !usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log("FIRST");
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              likes:
                likes > 0 ? firebase.firestore.FieldValue.increment(-1) : 0,
              usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
            })
            .then(() => {
              // removing liked post from likedPosts array property on user's profile
              getFirestore()
                .collection("users")
                .where("username", "==", loggedInUser)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((user) => {
                    getFirestore()
                      .collection("users")
                      .doc(user.id)
                      .update({
                        likedPosts: firebase.firestore.FieldValue.arrayRemove(
                          post_id
                        ),
                      });
                  });
                });
            });
        }
        // if loggedInUser clicked like button on the original post
        // and if loggedInUser already liked the post
        // and if loggedInUser reshared the post
        else if (
          !postReshared &&
          usersWhoLiked.hasOwnProperty(loggedInUser) &&
          usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log("SECOND");
          // decrement original post likes by 1 and remove user from usersWhoLiked object
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .update({
              likes:
                likes > 0 ? firebase.firestore.FieldValue.increment(-1) : 0,
              usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
            })
            .then(() => {
              // decrement reshared post likes and remove loggedInUser from postLikers array
              getFirestore()
                .collection("posts")
                .doc(post_id)
                .get()
                .then((obj) => {
                  const { usersWhoReshared } = obj.data();
                  if (usersWhoReshared.hasOwnProperty(loggedInUser)) {
                    const resharedPost = usersWhoReshared[loggedInUser];
                    getFirestore()
                      .collection("posts")
                      .doc(resharedPost)
                      .update({
                        likes: firebase.firestore.FieldValue.increment(-1),
                        postLikers: firebase.firestore.FieldValue.arrayRemove(
                          loggedInUser
                        ),
                      });
                  }
                });
            })
            .then(() => {
              // removing liked post from likedPosts array property on user's profile
              getFirestore()
                .collection("users")
                .where("username", "==", loggedInUser)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((user) => {
                    getFirestore()
                      .collection("users")
                      .doc(user.id)
                      .update({
                        likedPosts: firebase.firestore.FieldValue.arrayRemove(
                          post_id
                        ),
                      });
                  });
                });
            });
        }
        // if loggedInUser clicked like button on a reshared post and they are the postResharer
        else if (postReshared && postResharer === loggedInUser) {
          console.log("THIRD");
          // Check and see if reshared post has been liked by loggedInUser already
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .get()
            .then((obj) => {
              const { postLikers, originalPostId } = obj.data();
              // if user doesn't currently like reshared post
              if (!postLikers.includes(loggedInUser)) {
                console.log("BOO");
                // add user to postLikers array and increment likes by 1
                getFirestore()
                  .collection("posts")
                  .doc(post_id)
                  .update({
                    likes: firebase.firestore.FieldValue.increment(1),
                    postLikers: firebase.firestore.FieldValue.arrayUnion(
                      loggedInUser
                    ),
                  })
                  // then increment the original post by 1 and add loggedInUser to usersWhoLiked
                  .then(() => {
                    getFirestore()
                      .collection("posts")
                      .doc(originalPostId)
                      .update({
                        likes: firebase.firestore.FieldValue.increment(1),
                        usersWhoLiked: {
                          ...originalPostId.usersWhoLiked,
                          [loggedInUser]: post_id,
                        },
                      });
                  });
              } // if user clicked on reshared post and currently likes it, remove user from postLikers array and decrement likes by 1
              else if (postLikers.includes(loggedInUser)) {
                console.log("HELLO");
                // in reshared post, decrement likes by one and remove loggedInUser from postLikers array
                getFirestore()
                  .collection("posts")
                  .doc(post_id)
                  .update({
                    likes: firebase.firestore.FieldValue.increment(-1),
                    postLikers: firebase.firestore.FieldValue.arrayRemove(
                      loggedInUser
                    ),
                  })
                  // then decrement the original post by 1 and remove loggedInUser from usersWhoLiked
                  .then(() => {
                    getFirestore()
                      .collection("posts")
                      .doc(originalPostId)
                      .update({
                        likes: firebase.firestore.FieldValue.increment(-1),
                        usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
                      });
                  });
              }
            });
        }
        // if user clicked like button on original post and they don't currently like it
        else if (!postReshared && !usersWhoLiked.hasOwnProperty(loggedInUser)) {
          console.log("FOURTH");
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .get()
            .then((obj) => {
              const post = obj.data();
              // increment likes by 1 and add loggedInUser to usersWhoLiked object
              getFirestore()
                .collection("posts")
                .doc(post_id)
                .update({
                  likes: firebase.firestore.FieldValue.increment(1),
                  usersWhoLiked: {
                    ...post.usersWhoLiked,
                    [loggedInUser]: post_id,
                  },
                })
                .then(() => {
                  // add the liked post id to the loggedInUser's profile property of likedPosts
                  getFirestore()
                    .collection("users")
                    .where("username", "==", loggedInUser)
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach((user) => {
                        getFirestore()
                          .collection("users")
                          .doc(user.id)
                          .update({
                            likedPosts: firebase.firestore.FieldValue.arrayUnion(
                              post_id
                            ),
                          });
                      });
                    });
                })
                .then(() => {
                  // if logged in user has reshared this post,
                  // increment reshared post by 1 and add loggedInUser to postLikers array
                  getFirestore()
                    .collection("posts")
                    .doc(post_id)
                    .get()
                    .then((obj) => {
                      const { usersWhoReshared } = obj.data();
                      if (usersWhoReshared.hasOwnProperty(loggedInUser)) {
                        const resharedPost = usersWhoReshared[loggedInUser];
                        getFirestore()
                          .collection("posts")
                          .doc(resharedPost)
                          .update({
                            likes: firebase.firestore.FieldValue.increment(1),
                            postLikers: firebase.firestore.FieldValue.arrayUnion(
                              loggedInUser
                            ),
                          });
                      }
                    });
                });
            });
        }
      })
      .catch((err) => console.log(err));
  };
};
