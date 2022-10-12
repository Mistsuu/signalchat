import React, { memo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { getApproxString } from "utils/buffer.util";

const UserTitle = ({ children: title, ...otherProps }) => {
  const classes = useStyles();
  return (
    <Box className={classes.chatTitle}>
      {getApproxString(title)}
    </Box>
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
    paddingTop: 10,
    width: "100%",
    fontSize: 45,
  },
}));