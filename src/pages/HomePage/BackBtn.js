import React, { memo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import { Button } from "components";


const BackBtn = ({ onClick, ...otherProps }) => {
  const classes = useStyles();

  return (
    <Button width={70} height={30} className={classes.backBtn} onClick={onClick}>
      <Box>
        <WestIcon/>
      </Box>
    </Button>
  )
}

BackBtn.propTypes = {
  onClick: PropTypes.func,
}

BackBtn.defaultProps = {}

export default memo(BackBtn);

const useStyles = makeStyles(theme => ({
  backBtn: {
    position: "absolute",
    top: 65,
    left: 10,
    borderRadius: 20,
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