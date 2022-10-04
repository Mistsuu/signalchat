import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Box, TextField } from "@mui/material";
import { Button } from "components";
import { PathConstant } from "const";

const RegisterForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  return (
    <Box className={classes.loginAreaWrapper}>
      <Box className={classes.titleText}>
        Register
      </Box>

      {/* Username */}
      <Box className={classes.inputType}>
        <TextField
          placeholder="username"
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
          placeholder="password"
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

      {/* Button */}
      <Box className={classes.btnHolder}>
        <Button width={120} className={classes.overrideBtn}>
          <Box className={classes.btnText}>
            Register
          </Box>
        </Button>
      </Box>

      {/* Change to register? */}
      <Link to={PathConstant.PATH_LOGIN} className={classes.loginText}>
        ... or login
      </Link>
    </Box>
  )
}

export default memo(RegisterForm);

const INPUT_STYLES = {
  disableUnderline: true,
  style: {
    fontFamily: "RobotoMono",
  }
};

const useStyles = makeStyles(theme => ({
  overrideBtn: {
    borderRadius: 15,
    border: "solid 3px",
    boxShadow: "none",
  },

  loginText: {
    fontFamily: "RobotoMono",
    color: "#999999",
    fontSize: 12,
  },

  btnHolder: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
  },

  btnText: {
    fontFamily: "RobotoMono",
    fontWeight: "bold",
  },

  titleText: {
    fontFamily: "RobotoMono",
    fontSize: 35,
    fontWeight: "bold",
    paddingBottom: "10px",
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