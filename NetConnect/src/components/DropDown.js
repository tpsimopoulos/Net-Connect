import React, { useState } from "react";
import { Menu } from "semantic-ui-react";

function DropDown({ post_id, onClick, actionName }) {
  const [postOptionsClicked, setPostOptionsClicked] = useState(false);
  return (
    <>
      <div
        onClick={() => setPostOptionsClicked(!postOptionsClicked)}
        class="menu-icon"
      >
        <i className="ellipsis horizontal icon"></i>
        {postOptionsClicked ? (
          <div className="dropdown-content">
            <div className="menu-item" onClick={() => onClick(post_id)}>
              <i className="trash alternate icon" />
              <span className="menu-action">{actionName}</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default DropDown;
