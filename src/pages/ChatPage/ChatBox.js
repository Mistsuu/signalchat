import React, { memo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import ChatInput from "./ChatInput";
import ChatItem from "./ChatItem";
import { SystemConstant, QueryConstant } from "const";
import { TestAction } from "actions";

const ChatBox = props => {
  const [messages, setMessages] = useState([]);
  const classes = useStyles();
  
  const onUpdateNewMessage = (newMessageContent) => {
    let newMessage = {
      content: newMessageContent,
      side: SystemConstant.CHAT_SIDE_TYPE.our,
    }

    setMessages([ newMessage, ...messages ]);
  }

  const onFetchOldMessage = () => {
    
  }

  return (
    <>
      <Box className={classes.messageWindow}>
        <Box className={classes.messageInnerWindow}>
          {messages 
            && messages.map((eachMessage, index) => 
                <ChatItem key={index} data={eachMessage}/>
            )}
        </Box>
      </Box>
      <ChatInput onUpdateNewMessage={onUpdateNewMessage}/>
    </>
  );
};

ChatBox.propTypes = {};
ChatBox.defaultProps = {};

export default memo(ChatBox);

const useStyles = makeStyles(theme => ({
  messageWindow: {
    height: "80vh",
    margin: "20px",
    borderRadius: 15,
    borderStyle: "solid",
    padding: "0px 4px 0px 10px",
  },

  messageInnerWindow: {
    height: "100%",
    overflowY: "scroll",
    padding: "0px 10px 6px 10px",
    display: "flex",
    flexDirection: "column-reverse"
  }
}));