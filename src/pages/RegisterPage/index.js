import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { getLocalStorage } from "utils/storage.util";
import RegisterForm from "./RegisterForm";
import { PathConstant, StorageConstant } from "const";

const RegisterPage = () => {
  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  return (
    <>
      <RegisterForm/>
    </>
  )
}

export default memo(RegisterPage);
