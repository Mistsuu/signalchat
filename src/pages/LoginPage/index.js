import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  const onLogin = (username, password) => {
    console.log(`log in with username ${username}, password ${password}`);
  }
  
  return (
    <>
      <LoginForm onLogin={onLogin}/>
    </>
  )
}

export default memo(LoginPage);