import React, { memo, useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import ChatInput from "./ChatInput";
import ChatItem from "./ChatItem";
import ChatTitle from "./ChatTitle";
import { SystemConstant, QueryConstant } from "const";
import { ConversationAction } from "actions";


const ChatBox = ({ userID, ...otherProps }) => {
  const [messages, setMessages] = useState([]);
  const classes = useStyles();
  
  // -------------------------------- Query message every 1 second. --------------------------------

  const getMessages = async ({ queryKey }) => {
    const [_, userID] = queryKey;
    const messageRecords = await ConversationAction.fetchMessagesFromDB(userID);
    setMessages(messageRecords
                  .sort((leftRecord, rightRecord) => rightRecord.timestamp - leftRecord.timestamp) 
                  .map(messageRecord => ({ content: messageRecord.message, side: messageRecord.side })));

    return messageRecords;
  }
  useQuery(['messages', userID], getMessages, { refetchInterval:100 });

  // -------------------------------- Send new message to the other side. --------------------------------

  const onUpdateNewMessage = (newMessageContent) => {
    let newMessage = {
      content: newMessageContent,
      side: SystemConstant.CHAT_SIDE_TYPE.our,
    }

    sendMessageMutation.mutate({
      receipientUserID: userID, 
      message: newMessage.content
    });

    setMessages([ newMessage, ...messages ]);
  }

  const sendMessageMutation = useMutation(ConversationAction.sendMessage, {
    onError: (error, variables, context) => {
      // TODO: Set data so that the notification badge display on screen.
      alert(error);
    },
    onSuccess: (data, variables, context) => {
      if (data.error) {
        // TODO: Set data so that the notification badge display on screen.
        alert(data.error);
      }
    },
  })

  // -------------------------------- Some view here. --------------------------------

  return (
    <>
      <ChatTitle>
        {userID}
      </ChatTitle>
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

ChatBox.propTypes = {
  userID: PropTypes.string,
};
ChatBox.defaultProps = {
  userID: "",
};

export default memo(ChatBox);

const useStyles = makeStyles(theme => ({
  messageWindow: {
    height: "calc(100% - 190px)",
    margin: 20,
    marginTop: 5,
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