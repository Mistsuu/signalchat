import React, { memo, useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import UserTitle from "./UserTitle";
import UserItem from "./UserItem";
import { StorageConstant } from "const";
import { ConversationAction } from "actions";
import { getLocalStorage } from "utils/storage.util";

const UserBox = ({setUserID, ...otherProps}) => {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  const fetchUsers = async () => {
    var {error, userIDs} = await ConversationAction.fetchAllUsers();
    setUsers(userIDs);
    return userIDs;
  }

  useQuery(['users'], fetchUsers, { refetchInterval:30000 })

  return (
    <>
      <UserTitle>
        {getLocalStorage(StorageConstant.USER_ID)}
      </UserTitle>
      <Box className={clsx(classes.userWindow, "noScrollbar")}>
        {users 
          && users.map(
              user => 
                <UserItem key={user} onClick={() => setUserID(user)}>
                  {user}
                </UserItem>
             )}
      </Box>
    </>
  )
}

UserBox.propTypes = {
  setUserID: PropTypes.func
};

UserBox.defaultProps = {
  setUserID: (userID) => {}
}

export default memo(UserBox);

const useStyles = makeStyles(theme => ({
  userWindow: {
    height: "calc(100% - 190px)",
    margin: 50,
    marginTop: 5,
    borderRadius: 15,
    borderStyle: "dashed",
    padding: "0px 20px 0px 20px",
    border: 10,
    overflowY: "scroll",
  },
}));