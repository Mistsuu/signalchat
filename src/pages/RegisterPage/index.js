import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthAction } from "actions";
import { getLocalStorage } from "utils/storage.util";
import RegisterForm from "./RegisterForm";
import { PathConstant, StorageConstant } from "const";

const RegisterPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Create mutation
  const mutation = useMutation(AuthAction.authRegister, {
                                onMutate: (variables) => {
                                  setIsRegistering(true);
                                },
                                onError: (error, variables, context) => {
                                  console.log(error);
                                },
                                onSuccess: (data, variables, context) => {
                                  console.log(data);
                                },
                                onSettled: () => {
                                  setIsRegistering(false);
                                }
                              });


  // Redirect to home page if user is logged in!
  if (getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_HOME}/>
  }

  const onRegister = (username, password) => {
    if (!isRegistering) {
      console.log(`registering in with username ${username}, password ${password}`);
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
