import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { SystemConstant } from "const";

const ChatItem = ({ data, ...otherProps }) => {
  let classes = useStyles();
  return data.side === SystemConstant.CHAT_SIDE_TYPE.our
    ? (
        <Box className={clsx(classes.chatItem, classes.ourChat)}>
          <Box className={clsx(classes.chatText, classes.ourChatText)}>
            {data.content}
          </Box>
        </Box>
      )
    : (
        <Box className={classes.chatItem}>
          <Box className={clsx(classes.chatText, classes.theirChatText)}>
            {data.content}
          </Box>
        </Box>
      );
}

ChatItem.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
    side: PropTypes.number
  })
}

export default memo(ChatItem);

const useStyles = makeStyles(theme => ({
  chatText: {
    maxWidth: "80%",
    marginTop: 12,
    marginBottom: 12,
    lineHeight: "24px",
    padding: "10px 20px",
    borderRadius: 25,
    position: "relative",
    color: "white",
    textAlign: "center",
    fontFamily: "RobotoMono",
    lineBreak: "anywhere",
    borderStyle: "solid",
    borderColor: "#1d1e1f",
  },
  ourChatText: {
    color: "white",
    background: "#0b93f6",
    alignSelf: "flex-end",
  },
  theirChatText: {
    background: "#e5e5ea",
    color: "black",
  },
  ourChat: {
    flexDirection: "row-reverse",
  },
  chatItem: {
    display: "flex"
  }
}));
