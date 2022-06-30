import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

const ChatBox = ({ side, ...otherProps }) => {
  let classes = useStyles();
  return side === AppConstant.CHAT_SIDE_TYPE.our
    ? (
        <Box className={clsx(classes.chatBox, classes.ourChat)}>Our</Box>
      )
    : (
        <Box className={clsx(classes.chatBox, classes.theirChat)}>Their</Box>
      );
}

ChatBox.propTypes = {
  side: PropTypes.number
}

export default memo(ChatBox);

const useStyles = makeStyles(theme => ({
  chatBox: {
    maxWidth: 500,
    marginBottom: 12,
    lineHeight: 24,
    padding: "10px 20px",
    borderRadius: 25,
    position: "relative",
    color: "white",
    textAlign: "center"
  },
  ourChat: {
    color: "white",
    background: "#0b93f6",
    alignSelf: "flex-end",
    flexDirection: "row-reverse"
  },
  theirChat: {
    background: "#e5e5ea",
    color: "black",
  }
}));
