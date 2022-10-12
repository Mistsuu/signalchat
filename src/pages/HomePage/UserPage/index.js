import React, { memo } from "react";
import PropTypes from "prop-types";
import UserBox from "./UserBox";

const UserPage = ({setUserID, ...otherProps}) => {
  return (
    <>
      <UserBox setUserID={setUserID}/>
    </>
  )
}

UserPage.propTypes = {
  setUserID: PropTypes.func,
}

UserPage.defaultProps = {
  setUserID: (userID) => {}
}

export default memo(UserPage);