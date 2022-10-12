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
    <Button className={classes.userItem} width={"100%"} height={"8vw"} onClick={onClick}>
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
    marginTop: "1.2vw",
    marginBottom: "1.2vw",
    fontSize: "3vw",
    border: "1vw",
    padding: "1vw",
    borderRadius: "10vw",
    boxShadow: "none",
    '&onclick': {}
  }
}));
