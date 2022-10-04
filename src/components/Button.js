import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

const Button = ({ onClick, width, height, children, className, ...otherProps }) => {
  const classes = useStyles();
  return (
    <>
      <Box 
        className={clsx(classes.buttonSurface, className)}
        onClick={onClick}
        width={width}
        height={height}
      >
        {children 
          ? React.cloneElement(
              children, {
                width: "100%",
                height: "100%"
              }
            )
          : <></>
        }
      </Box>
    </>
  )
}

Button.defaultProps = {
  onClick: () => {},
  width: 37,
  height: 33.5,
  className: "",
};

Button.propTypes = {
  onClick: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
};

export default memo(Button);

const useStyles = makeStyles(theme => ({
  buttonSurface: {
    userSelect: "none",
    display: "flex",
    textAlign: "center",
    cursor: "pointer",
    background: "#f0f0f0",
    padding: 1,
    border: "solid 2.5px",
    borderRadius: 5,
    borderColor: "#191919",
    boxShadow: "0 5px #191919",
    '&:hover': {
      backgroundColor: "#cacbcc"
    },
    '&:active': {
      backgroundColor: "#cacbcc",
      transform: "translateY(4px)",
      boxShadow: "0 1px #191919"
    }
  },
}));