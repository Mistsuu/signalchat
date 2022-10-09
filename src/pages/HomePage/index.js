import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import HomeBox from "./HomeBox";
import { getLocalStorage, setLocalStorage } from "utils/storage.util";
import { useOnceCall } from "utils/fixreact.util";
import { PathConstant, StorageConstant } from "const";
import { KeyAction } from "actions";

const HomePage = () => {
  useOnceCall(() => {
    if (getLocalStorage(StorageConstant.AUTH_TOKEN)) {
      uploadKeyMutation.mutate();
    }
  })

  //////////////////////////  MUTATIONS  //////////////////////////

  const uploadKeyMutation = useMutation(KeyAction.initKeys, {
    onError: (error, variables, context) => {
      // TODO: Set data so that the notification badge display on screen.
      alert(error);
    },
    onSuccess: (data, variables, context) => {
      if (!data.success) {
        // TODO: Set data so that the notification badge display on screen.
        alert(data.error);
      }
    },
  });

  //////////////////////////////////////////////////////////////

  // Redirect to login page if user is not logged in yet!
  if (!getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_LOGIN}/>
  }

  return (
    <>
      <HomeBox/>
    </>
  )
}

export default memo(HomePage);