import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { TextField, Box } from "@mui/material";
import { Button } from "components";
import sendIcon from "assets/img/sendIcon.png";

const ChatInput = ({ onUpdateNewMessage, ...otherProps }) => {
  const [messageContent, setMessageContent] = useState("");
  const classes = useStyles();

  const onSend = () => {
    if (messageContent !== "") {
      onUpdateNewMessage(messageContent);
      setMessageContent("");
    }
  }

  return (
    <Box className={classes.chatInputWrapper}>
      <Box className={classes.inputType}>
        <TextField
          value={messageContent}
          autoFocus
          onChange={e => setMessageContent(e.target.value)}
          className={classes.input}
          variant="standard"
          InputProps={INPUT_STYLES}
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                onSend()
              }
            }
          }
        />
      </Box>

      <Button onClick={onSend}>
        <img src={sendIcon}></img>
      </Button>

    </Box>
  );
};

ChatInput.propTypes = {
  onUpdateNewMessage: PropTypes.func
};

ChatInput.defaultProps = {
  onUpdateNewMessage: () => {console.error("Unhandled onUpdateNewMessage!")}
};

export default memo(ChatInput);

const INPUT_STYLES = {
  disableUnderline: true,
  style: {
    fontFamily: "RobotoMono",
  }
};

const useStyles = makeStyles(theme => ({
  input: {
    width: "calc(100% - 30px)",
  },

  inputType: {
    paddingBottom: 0,
    width: "calc(100% - 150px)",
    display: "flex",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#CCCCCC",
    marginRight: "10px",
    height: 40,
    borderStyle: "dashed",
  },

  chatInputWrapper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
}));