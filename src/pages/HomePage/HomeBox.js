import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import UserPage from "./UserPage";
import ChatPage from "./ChatPage";
import BackBtn from "./BackBtn";
import ExitBtn from "./ExitBtn";

const HomeBox = ({ logOutFn, ...otherProps }) => {
  const [userID, setUserID] = useState("vietanh");

  return (
    <>
      {
        userID === "" 
          ? <UserPage setUserID={setUserID} />
          : <ChatPage userID={userID}/>
      }
      {
        userID !== ""
          ? <BackBtn onClick={() => setUserID("")}/>
          : <ExitBtn onClick={logOutFn}/>
      }
    </>
  )
}

HomeBox.propTypes = {
  logOutFn: PropTypes.func,
}

HomeBox.defaultProps = {}

export default memo(HomeBox);
