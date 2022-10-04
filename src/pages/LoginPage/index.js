import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }
  
  return (
    <>
      <LoginForm/>
    </>
  )
}

export default memo(LoginPage);