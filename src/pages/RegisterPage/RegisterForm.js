import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Box, TextField } from "@mui/material";
import { Button } from "components";
import { PathConstant, TxtConstant } from "const";

const RegisterForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  return (
    <Box className={classes.loginAreaWrapper}>
      <Box className={classes.titleText}>
        {TxtConstant.TXT_REGISTER}
      </Box>

      {/* Username */}
      <Box className={classes.inputType}>
        <TextField
          placeholder={TxtConstant.TXT_USERNAME}
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
          placeholder={TxtConstant.TXT_PASSWORD}
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
            {TxtConstant.TXT_REGISTER}
          </Box>
        </Button>
      </Box>

      {/* Change to login? */}
      <Link to={PathConstant.PATH_LOGIN} className={classes.loginText}>
        {TxtConstant.TXT_OR_LOGIN}
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
    marginTop: 20,
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
    boxShadow: "0 3px #212121",
  },

  loginAreaWrapper: {
    width: "100%",
    paddingTop: "200px",
    textAlign: "center",
    paddingLeft: 100,
    paddingRight: 100,
  }
}));