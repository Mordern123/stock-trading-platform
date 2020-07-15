import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import TagFacesRoundedIcon from '@material-ui/icons/TagFacesRounded';
import clsx from 'clsx'


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        flexGrow: 1,
        backgroundColor: "#388e3c",
        [theme.breakpoints.up('sm')]: {
            flexGrow: 'initial',
            minWidth: 344,
        },
    },
    title: {
      color: '#fffde7'
    },
    typography: {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
      // fontWeight: 'bold',
    },
    actionRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 8px 8px 16px',
    },
    icons: {
        marginRight: 0,
    },
    expand: {
        color: "#fffde7",
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: '4px 16px',
        backgroundColor: "#fafafa"
    },
    checkIcon: {
      color: '#4EA852',
      marginRight: '10px'
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
    text: {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
}));

const SnackMessage = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);
    const { stock_id, stock_name, stock_num, stock_price } = props.data

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };

    return (
        <Card className={classes.card} ref={ref}>
            <CardActions classes={{ root: classes.actionRoot }}>
                <TagFacesRoundedIcon className={classes.title}/>
                <Typography variant="body1" className={clsx(classes.typography, classes.title)}>{props.message}</Typography>
                <div className={classes.icons}>
                    <IconButton
                        aria-label="Show more"
                        className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
                        onClick={handleExpandClick}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <IconButton className={classes.expand} onClick={handleDismiss}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Paper className={classes.collapse}>
                  <MenuList>
                    <MenuItem className={classes.text}>
                      <CheckRoundedIcon className={classes.checkIcon}/>
                      <Typography variant="body1" className={classes.text}>{`證券代號： ${stock_id}`}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem className={classes.text}>
                      <CheckRoundedIcon className={classes.checkIcon}/>
                      <Typography variant="body1" className={classes.text}>{`證券名稱： ${stock_name}`}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem className={classes.text}>
                      <CheckRoundedIcon className={classes.checkIcon}/>
                      <Typography variant="body1" className={classes.text}>{`買入數量： ${stock_num*1000} 股`}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem className={classes.text}>
                      <CheckRoundedIcon className={classes.checkIcon}/>
                      <Typography variant="body1" className={classes.text}>{`成交價格： ${stock_price} 元/股`}</Typography>
                    </MenuItem>
                  </MenuList>
                </Paper>
            </Collapse>
        </Card>
    );
});

SnackMessage.propTypes = {
    id: PropTypes.number.isRequired,
};

export default SnackMessage;