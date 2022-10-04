import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";

const RegisterPage = () => {
  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  return (
    <>
      <h1>Register Page</h1>
    </>
  )
}

export default memo(RegisterPage);
