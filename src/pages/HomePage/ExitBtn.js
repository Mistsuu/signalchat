import React, { memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { Button } from "components";
import { fontWeight } from "@mui/system";

const ExitBtn = ({ onClick, ...otherProps }) => {
  const classes = useStyles();

  return (
    <Button width={"10vw"} height={"3.5vw"} className={classes.backBtn} onClick={onClick}>
      <Box>
        Logout
      </Box>
    </Button>
  )
}

ExitBtn.propTypes = {
  onClick: PropTypes.func,
}

ExitBtn.defaultProps = {}

export default memo(ExitBtn);

const useStyles = makeStyles(theme => ({
  backBtn: {
    fontSize: "2vw",
    position: "absolute",
    bottom: "4vw",
    left: "calc(50% - 5vw)",
    borderRadius: "10vw",
    borderWidth: 1,
    borderColor: "transparent",
    boxShadow: "none",
    background: "#e9e9e9",
    fontFamily: "RobotoMono",
    fontWeight: "bolder",
    '&:active': {
      backgroundColor: "#cacbcc",
      transform: "translateY(2px)",
      boxShadow: "none"
    },
    color: "#808080"
  }
}));