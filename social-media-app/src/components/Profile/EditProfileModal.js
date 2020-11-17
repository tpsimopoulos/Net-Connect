// import React from "react";
// import { Component } from "react";
// import { connect } from "react-redux";
// import { handleFileUpload } from "../Home/PostBox";
// import ProfileAvatar from "./ProfileAvatar";
// import avatar from "../../img/avatar.png";
// class EditProfileModal extends Component {
//   state = {
//     imageUrl: "",
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   render() {
//     return (
//       <div
//         style={{ display: this.props.modalOpen ? "block" : "none" }}
//         className="edit-profile-modal-background"
//         onClick={() => {
//           this.props.handleClickOut();
//         }}
//       >
//         <div className="edit-profile-container">
//           <form
//             className="edit-profile-form"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <label for="avatar-upload">
//               <ProfileAvatar
//                 imageUrl={avatar}
//                 overlay={<i class="camera icon"></i>}
//               />
//             </label>
//             <input
//               type="file"
//               id="avatar-upload"
//               onChange={(e) => this.handleFileUpload(e)}
//             />
//           </form>
//         </div>
//       </div>
//     );
//   }
// }

// export default EditProfileModal;
