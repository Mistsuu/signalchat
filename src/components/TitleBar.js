import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { AppInteractor } from "interactor";
import { AppConstant } from "const";

const TitleBar = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.titleBar}>
        <Box 
          className={classes.closeButton} 
          onClick={AppInteractor.closeWindow}
        />
        <Box 
          className={classes.maximiseButton} 
          onClick={AppInteractor.maximizeWindow}
        />
        <Box 
          className={classes.minimiseButton} 
          onClick={AppInteractor.minimizeWindow}
        />

        <Box className={classes.titleBarDraggableRegion}>
          {AppConstant.APP_NAME_STR}
        </Box>

      </Box>
    </>
  )
}

export default memo(TitleBar);

const useStyles = makeStyles(theme => ({
  titleBarDraggableRegion: {
    WebkitAppRegion: "drag",
    width: "calc(100% - 80px)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    lineHeight: "40px",
    fontFamily: "RobotoMono",
    fontWeight: "bold"
  },
  titleBar: {
    height: "45px",
    display: "flex",
    background: "black"
  },
  minimiseButton: {
    borderStyle: "solid",
    background: "#ffee37",
    borderRadius: "50%",
    borderWidth: 2,
    width: "16px",
    height: "16px",
    margin: "16px 0.5px",
    '&:hover' : {
      background: "#ffd166"
    }
  },
  maximiseButton: {
    borderStyle: "solid",
    background: "#07ffbd",
    borderRadius: "50%",
    borderWidth: 2,
    width: "16px",
    height: "16px",
    margin: "16px 0.5px",
    '&:hover' : {
      background: "#06d6a0"
    }
  },
  closeButton: {
    borderStyle: "solid",
    background: "#ff3352",
    borderRadius: "50%",
    borderWidth: 2,
    width: "16px",
    height: "16px",
    margin: "16px 0.5px 0px 14px",
    '&:hover' : {
      background: "#c42741"
    }
  },
}))