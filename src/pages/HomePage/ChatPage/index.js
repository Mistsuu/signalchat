import React, { memo } from "react";
import PropTypes from "prop-types";
import ChatBox from "./ChatBox";

const ChatPage = ({ userID, ...otherProps }) => {
  return (
    <>
      <ChatBox userID={userID}/>
    </>
  )
}

ChatPage.propTypes = {
  userID: PropTypes.string,
};
ChatPage.defaultProps = {
  userID: "",
};

export default memo(ChatPage);