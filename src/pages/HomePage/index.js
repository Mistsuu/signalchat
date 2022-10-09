import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import HomeBox from "./HomeBox";
import { getLocalStorage, rmLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant, ApiConstant } from "const";
import { AuthAction, KeyAction } from "actions";
import { useOnceCall } from "utils/fixreact.util";

const HomePage = () => {
  useOnceCall(() => {
    if (getLocalStorage(StorageConstant.AUTH_TOKEN))
      checkAndUploadKeyMutation.mutate();
  })

  //////////////////////////  MUTATIONS  //////////////////////////

  const checkAndUploadKeyMutation = useMutation(KeyAction.checkAndUploadKey, {
    onError: (error, variables, context) => {
      // TODO: Set data so that the notification badge display on screen.
      alert(error);
      // Remove storage
      rmLocalStorage(StorageConstant.AUTH_TOKEN);
      rmLocalStorage(StorageConstant.DEVICE_ID);
      rmLocalStorage(StorageConstant.USER_ID);
      // Redirect to /login
      window.location.href = ApiConstant.PATH_LOGIN;
    },
    onSuccess: (data, variables, context) => {
      if (!data.success) {
        // TODO: Set data so that the notification badge display on screen.
        alert(data.error);
        // Remove storage
        rmLocalStorage(StorageConstant.AUTH_TOKEN);
        rmLocalStorage(StorageConstant.DEVICE_ID);
        rmLocalStorage(StorageConstant.USER_ID);
        // Redirect to /login
        window.location.href = ApiConstant.PATH_LOGIN;
      }
    },
  });

  const logOutMutation = useMutation(AuthAction.authLogout, {
    onSettled: () => {
      // Remove storage
      rmLocalStorage(StorageConstant.AUTH_TOKEN);
      rmLocalStorage(StorageConstant.DEVICE_ID);
      rmLocalStorage(StorageConstant.USER_ID);
      // Redirect to /login
      window.location.href = ApiConstant.PATH_LOGIN;
    }
  })

  //////////////////////////////////////////////////////////////

  // Redirect to login page if user is not logged in yet!
  if (!getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_LOGIN}/>
  }

  return (
    <>
      <HomeBox logOutFn={() => logOutMutation.mutate()}/>
    </>
  )
}

export default memo(HomePage);