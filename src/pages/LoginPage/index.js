import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction } from "actions";
import { getLocalStorage, setLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant, TxtConstant } from "const";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [isLogginIn, setIsLogginIn] = useState(false);
  
  // Create mutation
  const mutation = useMutation(AuthAction.authLogin, {
                                onMutate: (variables) => {
                                  setIsLogginIn(true);
                                },
                                onError: (error, variables, context) => {
                                  // TODO: Set data so that the notification badge display on screen.
                                  alert(error);
                                },
                                onSuccess: (data, variables, context) => {
                                  if (data.success) {
                                    // TODO: Set data so that the notification badge display on screen.
                                    // alert(TxtConstant.TXT_SUCCESSFULLY_LOGGED_IN);
                                    setLocalStorage(StorageConstant.AUTH_TOKEN, data.token);
                                    window.location.href = PathConstant.PATH_HOME;
                                  } else {
                                    // TODO: Set data so that the notification badge display on screen.
                                    alert(data.error);
                                  }
                                },
                                onSettled: () => {
                                  setIsLogginIn(false);
                                }
                              });

  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  const onLogin = (username, password) => {
    if (!isLogginIn) {
      mutation.mutate({
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