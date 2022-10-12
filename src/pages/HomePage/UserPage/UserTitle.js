import React, { memo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import StringFormat from "string-format";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { getApproxString } from "utils/buffer.util";
import { TxtConstant } from "const";

const UserTitle = ({ children: title, ...otherProps }) => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.chatTitle}>
        {StringFormat(TxtConstant.FM_DISPLAYUSER, getApproxString(title, 10))}
      </Box>
      <Box className={classes.chatAsk}>
        {TxtConstant.TXT_WHO_YOU_LIKE_TO_CHAT}
      </Box>
    </>
  )
};

UserTitle.propTypes = {
  title: PropTypes.string,
};
UserTitle.defaultProps = {
  title: "null"
};

export default memo(UserTitle);

const useStyles = makeStyles(theme => ({
  chatTitle: {
    fontFamily: "RobotoMono",
    fontWeight: "bolder",
    display: "flex",
    justifyContent: "center",
    paddingTop: "2vw",
    width: "100%",
    fontSize: "6vw",
  },

  chatAsk: {
    fontFamily: "RobotoMono",
    fontStyle: "italic",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    fontSize: "2.1vw",
    color: "#a0a0a0",
  },
}));