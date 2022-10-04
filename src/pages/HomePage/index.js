import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { getLocalStorage } from "utils/storage.util";
import { PathConstant, StorageConstant } from "const";

const HomePage = () => {
  if (!getLocalStorage(StorageConstant.IS_LOGGED_IN)) {
    return <Navigate to={PathConstant.PATH_LOGIN}/>
  }

  return (
    <>
      <h1>Home Page</h1>
    </>
  )
}

export default memo(HomePage);