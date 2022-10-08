import React, { memo, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getLocalStorage, setLocalStorage } from "utils/storage.util";
import { useOnceCall } from "utils/fixreact.util";
import { PathConstant, StorageConstant } from "const";

const HomePage = () => {
  useOnceCall(() => {
    console.log('called');
  })

  if (!getLocalStorage(StorageConstant.AUTH_TOKEN)) {
    return <Navigate to={PathConstant.PATH_LOGIN}/>
  }

  return (
    <>
      <h1>Home Page</h1>
    </>
  )
}

export default memo(HomePage);