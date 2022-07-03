import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

const MainWindow = ({ children, ...otherProps }) => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.windowStyle}>
        {children}
      </Box>
    </>
  )
}

export default memo(MainWindow);

const useStyles = makeStyles(theme => ({
  windowStyle: {
    borderStyle: "solid",
    borderColor: "black",
    height: "100vh",
    borderRadius: "4.5px",
    border: "5px"
  }
}))