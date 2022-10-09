import React, { memo, useState } from "react";
import UserPage from "./UserPage";
import ChatPage from "./ChatPage";
import BackBtn from "./BackBtn";

const HomeBox = () => {
  const [userID, setUserID] = useState("vietanh");

  return (
    <>
      {
        userID === "" 
          ? <UserPage setUserID={setUserID} />
          : <ChatPage userID={userID}/>
      }
      {
        userID !== ""
          ? <BackBtn onClick={() => setUserID("")}/>
          : <></>
      }
    </>
  )
}

export default memo(HomeBox);
