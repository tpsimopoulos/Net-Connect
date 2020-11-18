import firebase from "../utilities/firebase";
import "firebase/firestore";
import _ from "lodash";

export const addPost = (post) => {
  return (dispatch, getState, { getFirestore }) => {
    // adding a new post to posts collection
    getFirestore()
      .collection("posts")
      .add({
        ...post,
        createdAt: new Date(),
        likes: 0,
        postLikers: [],
        replies: 0,
        resharedPost: false,
        reshares: 0,
        usersWhoReshared: [],
        usersWhoLiked: [],
      })
      .then((docRef) => {
        // adding post id to authoredPosts property of loggedInUsers profile
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
        return docRef;
      })
      .then((docRef) => {
        // updating that post to have a reference id "originId" whose id points to the original post
        getFirestore()
          .collection("posts")
          .doc(docRef.id)
          .get()
          .then((obj) => {
            const post = obj.data();
            getFirestore()
              .collection("posts")
              .doc(docRef.id)
              .set({
                ...post,
                originId: docRef.id,
              });
          });
      })
      .catch((err) => console.log(err));
  };
};

export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    // getFirebase()
    //   .auth()
    //   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    //   .then(() => {
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
            dispatch({
              type: "PASSWORD_LOGIN_FAILED",
              payload: err.message,
            });
            break;
        }
      });
    // });
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
            avatar: "",
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

export const resharePost = (post_id, loggedInUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const clickedPost = obj.data();
        const {
          usersWhoReshared,
          resharedPost,
          postAuthor,
          postResharer,
          originId,
        } = clickedPost;

        if (resharedPost && postResharer === loggedInUser) {
          console.log(
            "loggedInUser clicked reshare button on their reshared post"
          );
          // delete the reshared post
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .delete()
            .then(() => {
              // decrement original post reshares by 1 and remove loggedInUser from usersWhoReshared object
              getFirestore()
                .collection("posts")
                .where("originId", "==", originId)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((post) => {
                    getFirestore()
                      .collection("posts")
                      .doc(post.id)
                      .update({
                        reshares: firebase.firestore.FieldValue.increment(-1),
                        usersWhoReshared: _.omit(usersWhoReshared, [
                          loggedInUser,
                        ]),
                      });
                  });
                });
            });
        } else if (
          !resharedPost &&
          usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "logginInUser clicked reshare button on an original post that they reshared"
          );
          getFirestore()
            .collection("posts")
            .doc(post_id)
            .get()
            .then(() => {
              // decrement original post reshares by 1 and remove loggedInUser from usersWhoReshared object
              getFirestore()
                .collection("posts")
                .where("originId", "==", originId)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((post) => {
                    getFirestore()
                      .collection("posts")
                      .doc(post.id)
                      .update({
                        reshares: firebase.firestore.FieldValue.increment(-1),
                        usersWhoReshared: _.omit(usersWhoReshared, [
                          loggedInUser,
                        ]),
                      });
                  });
                })
                .then(() => {
                  getFirestore()
                    .collection("posts")
                    .where("resharedPost", "==", true)
                    .where("postResharer", "==", loggedInUser)
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach((post) => {
                        getFirestore()
                          .collection("posts")
                          .doc(post.id)
                          .delete();
                      });
                    });
                });
            });
        } else if (resharedPost && postResharer !== loggedInUser) {
          console.log(
            "loggedInUser clicked reshare button on a reshared post they didn't reshare"
          );
          if (usersWhoReshared.hasOwnProperty(loggedInUser)) {
            // loggedInUser trying to reshare a reshared post they have reshared before
            getFirestore()
              .collection("posts")
              .doc(post_id)
              .get()
              .then((obj) => {
                const post = obj.data();
                getFirestore()
                  .collection("posts")
                  .where("originId", "==", post.originId)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((post) => {
                      getFirestore()
                        .collection("posts")
                        .doc(post.id)
                        .update({
                          reshares: firebase.firestore.FieldValue.increment(-1),
                          usersWhoReshared: _.omit(usersWhoReshared, [
                            loggedInUser,
                          ]),
                        });
                    });
                  })
                  .then(() => {
                    getFirestore()
                      .collection("posts")
                      .where("resharedPost", "==", true)
                      .where("postResharer", "==", loggedInUser)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((post) => {
                          getFirestore()
                            .collection("posts")
                            .doc(post.id)
                            .delete();
                        });
                      });
                  });
              });
          } else if (!usersWhoReshared.hasOwnProperty(loggedInUser)) {
            // loggedInUser trying to reshare a reshared post they haven't reshared
            getFirestore()
              .collection("posts")
              .doc(post_id)
              .get()
              .then((obj) => {
                // creating a reshared post under loggedInUsers' name with the updated original post info
                const post = obj.data();
                getFirestore()
                  .collection("posts")
                  .add({
                    ...post,
                    postResharer: loggedInUser,
                    resharedPost: true,
                    reshareDate: new Date(),
                  })
                  .then(() => {
                    getFirestore()
                      .collection("posts")
                      .where("originId", "==", post.originId)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((post) => {
                          getFirestore()
                            .collection("posts")
                            .doc(post.id)
                            .update({
                              reshares: firebase.firestore.FieldValue.increment(
                                1
                              ),
                              usersWhoReshared: {
                                ...usersWhoReshared,
                                [loggedInUser]: post_id,
                              },
                            });
                        });
                      });
                  });
              });
          }
        } else if (
          !resharedPost &&
          !usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "loggedInUser clicked reshare button on an original post they haven't reshared"
          );
          // increment reshares on original post by 1
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
                  postResharer: loggedInUser,
                  resharedPost: true,
                  reshareDate: new Date(),
                })
                // get reference to this reshared post and append to user's resharedPosts in profile
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
                    .then(() => {
                      getFirestore()
                        .collection("posts")
                        .doc(originId)
                        .get()
                        .then((obj) => {
                          // since post has now been reshared, append the reshared post id to user in usersWhoReshared array in original post
                          const post = obj.data();
                          getFirestore()
                            .collection("posts")
                            .doc(originId)
                            .update({
                              usersWhoReshared: {
                                ...post.usersWhoReshared,
                                [loggedInUser]: docRef.id,
                              },
                            })
                            .then(() => {
                              getFirestore()
                                .collection("posts")
                                .where("originId", "==", originId)
                                .get()
                                .then((querySnapshot) => {
                                  querySnapshot.forEach((post) => {
                                    getFirestore()
                                      .collection("posts")
                                      .doc(post.id)
                                      .update({
                                        reshares: firebase.firestore.FieldValue.increment(
                                          1
                                        ),
                                        usersWhoReshared: {
                                          ...usersWhoReshared,
                                          [loggedInUser]: post_id,
                                        },
                                      });
                                  });
                                });
                            });
                        });
                    });
                });
            });
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
          resharedPost,
          postResharer,
          usersWhoLiked,
          usersWhoReshared,
          likes,
          postLikers,
          originId,
        } = post;

        // if loggedInUser clicked like button on an original post they liked AND reshared
        if (
          !resharedPost &&
          usersWhoLiked.hasOwnProperty(loggedInUser) &&
          usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "loggedInUser clicked like button on an original post they liked AND reshared"
          );
          // decrement all posts whose origin is originId
          getFirestore()
            .collection("posts")
            .where("originId", "==", originId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((post) => {
                getFirestore()
                  .collection("posts")
                  .doc(post.id)
                  .update({
                    likes:
                      likes > 0
                        ? firebase.firestore.FieldValue.increment(-1)
                        : 0,
                    postLikers: firebase.firestore.FieldValue.arrayRemove(
                      loggedInUser
                    ),
                    usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
                  });
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
        } // if loggedInUser clicked like button on an original post they liked but DIDN'T reshare
        else if (
          !resharedPost &&
          usersWhoLiked.hasOwnProperty(loggedInUser) &&
          !usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "loggedInUser clicked like button on an original post they liked but DIDN'T reshare"
          );
          // decrement liked post by 1 and remove loggedInUser from usersWhoLiked
          getFirestore()
            .collection("posts")
            .where("originId", "==", originId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((post) => {
                getFirestore()
                  .collection("posts")
                  .doc(post.id)
                  .update({
                    likes:
                      likes > 0
                        ? firebase.firestore.FieldValue.increment(-1)
                        : 0,
                    postLikers: firebase.firestore.FieldValue.arrayRemove(
                      loggedInUser
                    ),
                    usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
                  });
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
        // if loggedInUser clicked like button on an original post they don't currently like BUT reshared
        else if (
          !resharedPost &&
          !usersWhoLiked.hasOwnProperty(loggedInUser) &&
          usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "loggedInUser clicked like button on an original post they don't currently like BUT reshared"
          );
          getFirestore()
            .collection("posts")
            .doc(originId)
            .get()
            .then((obj) => {
              const { usersWhoLiked } = obj.data();
              // increment likes by 1 and add loggedInUser to usersWhoLiked object
              getFirestore()
                .collection("posts")
                .doc(originId)
                .update({
                  usersWhoLiked: {
                    ...usersWhoLiked,
                    [loggedInUser]: post_id,
                  },
                })
                .then(() => {
                  getFirestore()
                    .collection("posts")
                    .where("originId", "==", originId)
                    .get()
                    .then((querySnapshot) => {
                      querySnapshot.forEach((post) => {
                        getFirestore()
                          .collection("posts")
                          .doc(post.id)
                          .update({
                            likes: firebase.firestore.FieldValue.increment(1),
                            postLikers: firebase.firestore.FieldValue.arrayUnion(
                              loggedInUser
                            ),
                          });
                      });
                    });
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
                });
            });
        }
        // if loggedInUser clicked like button on a reshared post and they are the postResharer
        else if (resharedPost && postResharer === loggedInUser) {
          console.log(
            "loggedInUser clicked like button on a reshared post and they are the postResharer"
          );
          getFirestore()
            .collection("posts")
            .doc(originId)
            .get()
            .then((obj) => {
              const { usersWhoLiked } = obj.data();
              // if loggedInUser has liked the reshared post, decrement all posts of same originId by 1...
              if (usersWhoLiked[loggedInUser]) {
                getFirestore()
                  .collection("posts")
                  .where("originId", "==", originId)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((post) => {
                      getFirestore()
                        .collection("posts")
                        .doc(post.id)
                        .update({
                          likes: firebase.firestore.FieldValue.increment(-1),
                          postLikers: firebase.firestore.FieldValue.arrayRemove(
                            loggedInUser
                          ),
                        });
                    });
                  })
                  .then(() => {
                    // remove loggedInUser from the usersWhoLiked object in the original post
                    getFirestore()
                      .collection("posts")
                      .doc(originId)
                      .update({
                        usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
                      });
                  });
              } else if (!usersWhoLiked[loggedInUser]) {
                // if loggedInUser has not liked the reshared post, increment all posts of same originId by 1......
                getFirestore()
                  .collection("posts")
                  .where("originId", "==", originId)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((post) => {
                      getFirestore()
                        .collection("posts")
                        .doc(post.id)
                        .update({
                          likes: firebase.firestore.FieldValue.increment(1),
                          postLikers: firebase.firestore.FieldValue.arrayUnion(
                            loggedInUser
                          ),
                        });
                    });
                  })
                  .then(() => {
                    getFirestore()
                      .collection("posts")
                      .doc(originId)
                      .update({
                        usersWhoLiked: {
                          ...usersWhoLiked,
                          [loggedInUser]: post_id,
                        },
                      });
                  });
              }
            });
        }
        // if loggedInUser clicked like button on a reshared post and they are NOT postResharer
        else if (resharedPost && postResharer !== loggedInUser) {
          if (postLikers.includes(loggedInUser)) {
            getFirestore()
              .collection("posts")
              .where("originId", "==", originId)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((post) => {
                  getFirestore()
                    .collection("posts")
                    .doc(post.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(-1),
                      postLikers: firebase.firestore.FieldValue.arrayRemove(
                        loggedInUser
                      ),
                    });
                });
              })
              .then(() => {
                getFirestore()
                  .collection("posts")
                  .doc(originId)
                  .update({
                    usersWhoLiked: _.omit(usersWhoLiked, loggedInUser),
                  });
              })
              .then(() => {
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
          } else if (!postLikers.includes(loggedInUser)) {
            getFirestore()
              .collection("posts")
              .where("originId", "==", originId)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((post) => {
                  getFirestore()
                    .collection("posts")
                    .doc(post.id)
                    .update({
                      likes: firebase.firestore.FieldValue.increment(1),
                      postLikers: firebase.firestore.FieldValue.arrayUnion(
                        loggedInUser
                      ),
                    });
                });
              })
              .then(() => {
                getFirestore()
                  .collection("posts")
                  .doc(originId)
                  .update({
                    usersWhoLiked: {
                      ...usersWhoLiked,
                      [loggedInUser]: post_id,
                    },
                  });
              })
              .then(() => {
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
              });
          }
        }

        // if loggedInUser clicked like button on a post that hasn't been liked or reshared
        else if (
          !resharedPost &&
          !usersWhoLiked.hasOwnProperty(loggedInUser) &&
          !usersWhoReshared.hasOwnProperty(loggedInUser)
        ) {
          console.log(
            "loggedInUser clicked like button on a post that hasn't been liked or reshared"
          );
          getFirestore()
            .collection("posts")
            .where("originId", "==", originId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((post) => {
                getFirestore()
                  .collection("posts")
                  .doc(post.id)
                  .update({
                    likes: firebase.firestore.FieldValue.increment(1),
                    postLikers: firebase.firestore.FieldValue.arrayUnion(
                      loggedInUser
                    ),
                  });
              });
            })
            .then(() => {
              getFirestore()
                .collection("posts")
                .doc(originId)
                .update({
                  usersWhoLiked: {
                    ...usersWhoLiked,
                    [loggedInUser]: post_id,
                  },
                });
            })
            .then(() => {
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
            });
        }
      })
      .catch((err) => console.log(err));
  };
};

// if post_id is a reshared post, everywhere that origin id is, decrement reshares by 1
export const deletePost = (post_id, loggedInUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("posts")
      .doc(post_id)
      .get()
      .then((obj) => {
        const { originId, usersWhoReshared, usersWhoLiked } = obj.data();
        // decrement original post reshares by 1 and remove loggedInUser from usersWhoReshared object
        getFirestore()
          .collection("posts")
          .where("originId", "==", originId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((post) => {
              getFirestore()
                .collection("posts")
                .doc(post.id)
                .update({
                  reshares: firebase.firestore.FieldValue.increment(-1),
                  usersWhoReshared: _.omit(usersWhoReshared, [loggedInUser]),
                  postLikers: firebase.firestore.FieldValue.arrayRemove(
                    loggedInUser
                  ),
                  likes: firebase.firestore.FieldValue.increment(-1),
                  usersWhoLiked: _.omit(usersWhoLiked, [loggedInUser]),
                });
            });
          })
          .then(() => {
            getFirestore()
              .collection("posts")
              .where("resharedPost", "==", true)
              .where("postResharer", "==", loggedInUser)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((post) => {
                  getFirestore().collection("posts").doc(post.id).delete();
                });
              });
          });
      });
  };
};

// export const changeAvatar = ({ avatar, loggedInUser }) => {
//   return (dispatch, getState, { getFirebase, getFirestore }) => {
//     getFirestore()
//       .collection("users")
//       .where("username", "==", loggedInUser)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((user) => {
//           getFirestore().collection("users").doc(user.id).update({
//             avatar: avatar,
//           });
//         });
//       });
//   };
// };

export const uploadImage = (e, uploadedFromWhere, loggedInUser) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("uploadImage action creator invoked");
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const fileUrl = await fileRef.getDownloadURL();
    // updates user's profile with new avatar
    console.log(uploadedFromWhere);
    if (uploadedFromWhere === "PROFILE") {
      getFirestore()
        .collection("users")
        .where("username", "==", loggedInUser)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((user) => {
            getFirestore().collection("users").doc(user.id).update({
              avatar: fileUrl,
            });
          });
        });
    } else if (uploadedFromWhere === "POSTBOX") {
      dispatch({ type: "IMAGE_UPLOADED_FROM_POSTBOX", payload: fileUrl });
    }
  };
};

export const removeImageFromPostBoxPreview = () => (dispatch) =>
  dispatch({ type: "IMAGE_REMOVED_FROM_POSTBOX_PREVIEW" });

// find all posts where post author and post resharer is equal to user's profile page

export const fetchAvatars = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    getFirestore()
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((user) => {
          const { username, avatar } = user.data();
          dispatch({
            type: "USER_AVATAR_MAPPINGS",
            payload: {
              [username]: {
                username: username,
                avatar: avatar,
              },
            },
          });
        });
      });
  };
};
