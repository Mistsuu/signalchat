import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction, KeyAction } from "actions";
import { getLocalStorage, rmLocalStorage, setLocalStorage } from "utils/storage.util";
import { ApiConstant, PathConstant, StorageConstant, TxtConstant } from "const";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [isLogginIn, setIsLogginIn] = useState(false);
  
  //////////////////////////  MUTATIONS  //////////////////////////

  const loginMutation = useMutation(AuthAction.authLogin, {
    onMutate: (variables) => {
      setIsLogginIn(true);
    },
    onError: (error, variables, context) => {
      // TODO: Set data so that the notification badge display on screen.
      alert(error);
    },
    onSuccess: (data, variables, context) => {
      if (data.success) {
        // Set storage
        setLocalStorage(StorageConstant.AUTH_TOKEN, data.token);
        setLocalStorage(StorageConstant.DEVICE_ID, data.deviceID);
        setLocalStorage(StorageConstant.USER_ID, data.userID);
        // Redirect to /
        window.location.href = ApiConstant.PATH_HOME;
      } 
      else {
        // TODO: Set data so that the notification badge display on screen.
        alert(data.error);
      }
    },
    onSettled: () => {
      setIsLogginIn(false);
    }
  });

  //////////////////////////////////////////////////////////////

  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  const onLogin = (username, password) => {
    if (!isLogginIn) {
      loginMutation.mutate({
        userID: username,
        password: password,
      });
    }
  }
  
  return (
    <>
      <LoginForm onLogin={onLogin}/>
    </>
  )
}

export default memo(LoginPage);