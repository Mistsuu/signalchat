import React, { memo, useState } from "react";
import { Navigate } from "react-router-dom";
import HomeBox from "./HomeBox";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";

const HomePage = () => {
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