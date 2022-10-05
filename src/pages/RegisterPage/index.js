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

  const onRegister = (username, password) => {
    console.log(`registering in with username ${username}, password ${password}`);    
  }

  return (
    <>
      <RegisterForm onRegister={onRegister}/>
    </>
  )
}

export default memo(RegisterPage);
