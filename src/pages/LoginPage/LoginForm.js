import React, { memo, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, TextField } from "@mui/material";

const LoginForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  return (
    <Box className={classes.loginAreaWrapper}>
      <Box className={classes.titleText}>
        Login
      </Box>

      {/* Username */}
      <Box className={classes.inputType}>
        <TextField
          value={username}
          autoFocus
          onChange={e => setUsername(e.target.value)}
          className={classes.input}
          variant="standard"
          InputProps={INPUT_STYLES}
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                console.log("enter!")
              }
            }
          }
        />
      </Box>

      {/* Password */}
      <Box className={classes.inputType}>
        <TextField
          value={password}
          autoFocus
          onChange={e => setPassword(e.target.value)}
          className={classes.input}
          variant="standard"
          type="password"
          InputProps={INPUT_STYLES}
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                console.log("enter!")
              }
            }
          }
        />
      </Box>
    </Box>
  )
}

export default memo(LoginForm);

const INPUT_STYLES = {
  disableUnderline: true,
  style: {
    fontFamily: "RobotoMono",
  }
};

const useStyles = makeStyles(theme => ({
  titleText: {
    fontFamily: "RobotoMono",
    fontSize: 35,
    fontWeight: "bold",
    paddingBottom: "10px",
    fontStyle: "bold",
  },

  input: {
    width: "calc(100% - 30px)",
  },

  inputType: {
    paddingBottom: 0,
    marginBottom: 5,
    display: "flex",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    height: 40,
    borderStyle: "solid",
  },

  loginAreaWrapper: {
    width: "100%",
    paddingTop: "200px",
    textAlign: "center",
    paddingLeft: 100,
    paddingRight: 100,
  }
}));