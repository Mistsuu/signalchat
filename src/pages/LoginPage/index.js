import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction, KeyAction } from "actions";
import { getLocalStorage, rmLocalStorage, setLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant, TxtConstant } from "const";
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
      setIsLogginIn(false);
    },
    onSuccess: (data, variables, context) => {
      if (data.success) {
        // Set storage
        setLocalStorage(StorageConstant.USER_ID, data.userID);
        setLocalStorage(StorageConstant.AUTH_TOKEN, data.token);
        setLocalStorage(StorageConstant.DEVICE_ID, data.deviceID);
        
        // Upload keys to server.
        uploadKeyMutation.mutate();
        
      } else {
        // TODO: Set data so that the notification badge display on screen.
        alert(data.error);
        setIsLogginIn(false);
      }
    },
  });

  const uploadKeyMutation = useMutation(KeyAction.initKeys, {
    onError: (error, variables, context) => {
      // Clear storage
      rmLocalStorage(StorageConstant.USER_ID);
      rmLocalStorage(StorageConstant.AUTH_TOKEN);
      rmLocalStorage(StorageConstant.DEVICE_ID);
      
      // TODO: Set data so that the notification badge display on screen.
      alert(TxtConstant.ERR_CANNOT_UPLOAD_KEY_TO_SERVER);
    },
    onSuccess: (data, variables, context) => {
      if (data.success) {
        console.log("done upload keys!");
  
        // TODO: Set data so that the notification badge display on screen.
        // alert(TxtConstant.TXT_SUCCESSFULLY_LOGGED_IN);
  
        // Set storage
        // setLocalStorage(StorageConstant.IS_LOGGED_IN, true);
        
        // Redirect
        // window.location.href = PathConstant.PATH_HOME;
      } else {
        // Clear storage
        rmLocalStorage(StorageConstant.USER_ID);
        rmLocalStorage(StorageConstant.AUTH_TOKEN);
        rmLocalStorage(StorageConstant.DEVICE_ID);

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
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
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