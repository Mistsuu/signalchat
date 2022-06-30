import React from "react";
import { AppConstant } from "../../const";
import ChatBox from "./ChatBox";
// import ChatInput from "./ChatInput";

const ChatPage = () => {
  return (
    <>
      <ChatBox side={AppConstant.CHAT_SIDE_TYPE.our}/>
      <ChatBox side={AppConstant.CHAT_SIDE_TYPE.their}/>
    </>
  )
}

export default ChatPage;