import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { TextField, Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const ChatInput = ({ onUpdateNewMessage, ...otherProps }) => {
  const [messageContent, setMessageContent] = useState("");
  const classes = useStyles();

  const onClickButton = () => {
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
          InputProps={{
            disableUnderline: true,
            style: {
              fontFamily: "RobotoMono",
            }
          }}
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                onClickButton()
              }
            }
          }
        />
      </Box>

      <Button
        sx={{
          borderRadius: 50
        }}
        variant="outlined"
        onClick={onClickButton}
      >
        send
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

const useStyles = makeStyles(theme => ({
  input: {
    width: "95%",
  },

  inputType: {
    paddingBottom: 0,
    bottom: "10px",
    width: "90%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#CCCCCC",
  },

  chatInputWrapper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
}));