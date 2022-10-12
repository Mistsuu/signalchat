import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { Button } from "components";
import { SystemConstant } from "const";

const UserItem = ({ children:username, onClick, ...otherProps }) => {
  let classes = useStyles();
  return (
    <Button className={classes.userItem} width={"100%"} height={60} onClick={onClick}>
      <Box>
        {username}
      </Box>
    </Button>
  )
}

UserItem.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func,
}

export default memo(UserItem);

const useStyles = makeStyles(theme => ({
  userItem: {
    borderStyle: "solid",
    fontFamily: "RobotoMono",
    lineBreak: "anywhere",
    borderColor: "#1d1e1f",
    fontWeight: "bolder",
    marginTop: 10,
    fontSize: 20,
    border: 10,
    padding: 5,
    borderRadius: 10,
    boxShadow: "none",
    '&onclick': {}
  }
}));
