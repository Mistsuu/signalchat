import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction } from "actions";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Create mutation
  const mutation = useMutation(AuthAction.authRegister, {
                                onMutate: (variables) => {
                                  setIsRegistering(true);
                                },
                                onError: (error, variables, context) => {
                                  // TODO: Set data so that the notification badge display on screen.
                                  console.log("error register", error);
                                },
                                onSuccess: (data, variables, context) => {
                                  if (data.success) {
                                    // TODO: Set data so that the notification badge display on screen.
                                    console.log("register set success notification badge");
                                    window.location.href = PathConstant.PATH_LOGIN;
                                  } else {
                                    // TODO: Set data so that the notification badge display on screen.
                                    console.log("register set error notification badge");
                                  }
                                },
                                onSettled: () => {
                                  setIsRegistering(false);
                                }
                              });


  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  const onRegister = (username, password) => {
    if (!isRegistering) {
      mutation.mutate({
        userID: username,
        password: password,
      });
    }
  }

  return (
    <>
      <RegisterForm onRegister={onRegister}/>
    </>
  )
}

export default memo(RegisterPage);
