import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import ChatBox from "./ChatBox";

const ChatPage = () => {
  return (
    <>
      <Box>
        <ChatBox/>
      </Box>
    </>
  )
}

export default memo(ChatPage);