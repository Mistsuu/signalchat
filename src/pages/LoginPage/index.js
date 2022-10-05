import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction } from "actions";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [isLogginIn, setIsLogginIn] = useState(false);
  
  // Create mutation
  const mutation = useMutation(AuthAction.authLogin, {
                                onMutate: (variables) => {
                                  setIsLogginIn(true);
                                },
                                onError: (error, variables, context) => {
                                  console.log("error", error);
                                },
                                onSuccess: (data, variables, context) => {
                                  console.log("yey", data);
                                },
                                onSettled: () => {
                                  setIsLogginIn(false);
                                }
                              });

  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
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