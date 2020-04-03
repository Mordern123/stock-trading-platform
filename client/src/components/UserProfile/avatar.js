import React from "react";
// @material-ui/core
import CardAvatar from "../Card/CardAvatar.js";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Avatar, Badge } from '@material-ui/core';

const StyledBadge = withStyles(theme => ({
  badge: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '50%',
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.8)',
      opacity: 0,
    },
  },
}))(Badge);

const styles = theme => ({
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
})

const useStyles = makeStyles(styles);
const CustomAvatar = () => {
  const classes = useStyles();
  return (
    <CardAvatar profile>
      <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
        <Avatar className={classes.avatar}/>
      </StyledBadge>
    </CardAvatar>
  )
}

export default CustomAvatar;