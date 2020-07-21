import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { useHistory } from 'react-router'
import { apiClass_add_post, apiClass_get_post_all } from '../api'
import { handle_error } from '../tools'
import moment from 'moment'
import delay from 'delay'

const colors = [
  "#a5d6a7", //綠
  "#90caf9", //藍
  "#f48fb1", //粉紅
  "#fff59d", //黃
  "#b39ddb", //紫
  "#ffab91", //橘
  "#bcaaa4", //咖啡
  "#80cbc4", //藍綠
]

const useStyles = makeStyles(theme => ({
  "@global": {
    ch_font: {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif !important",
    }
  },
  root: {
    height: '220px',
    maxHeight: '220px',
    opacity: 0.8,
    "&:hover": {
      cursor: 'pointer',
      opacity: 1,
    },
  },
  title: {
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.warning.dark,
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  cardContainer: {
    position: 'relative',
    minHeight: '60vh'
  }
}));

export const Discussion = function() {
  const classes = useStyles();
  const [open, set_open] = React.useState(false)
  const [checkShow, set_checkShow] = React.useState(false)
  const [data, set_data] = React.useState([])
  const [title, set_title] = React.useState("")
  const [content, set_content] = React.useState("")
  const [loading, set_loading] = React.useState(false)
  const [blocking, set_blocking] = React.useState(false)
  const [msg, set_msg] = React.useState(null)
  const [random_colors, set_random_colors] = React.useState([])
  const history = useHistory()

  const close = () => {
    set_open(false)
    set_checkShow(false)
  }

  const onChange = (e) => {
    let type = e.currentTarget.getAttribute("id")
    if(type === "title") {
      set_title(e.target.value)

    } else if(type === "content") {
      set_content(e.target.value)
    }
  }

  const submit = async() => {
    //防呆
    if(blocking) {
      return
    } else {
      set_blocking(true)
    }
    try {
      await apiClass_add_post({title, content})
      update()

      await delay(2000)
      set_title("")
      set_content("")
      set_checkShow(false)

    } catch (error) {
      handle_error(error, history)
      set_checkShow(false)
    }
    set_blocking(false)
  }

  const check = () => {
    if(title && content) {
      if(title.length > 50) {
        alert("標題字數需小於50個字")
        return
      }
      if(content.length > 800) {
        alert("內容字數需小於800個字")
        return
      }
      set_checkShow(true)
    } else {
      alert("需先輸入內容")
    }
  }

  const update = async() => {
    set_loading(true)
    
    try {
      let res = await apiClass_get_post_all()
      let c = res.data.map(() => {
        let color = colors[Math.floor(Math.random() * colors.length)]; //隨機顏色
        return color
      })
      await delay(2000)
      set_data(res.data)
      set_random_colors(c)
      set_loading(false)

    } catch (error) {
      handle_error(error, history)
      set_loading(false)
    }

  }

  const onClick = (msg) => {
    set_msg(msg)
    set_open(true)
  }
  
  //載入所有文章
  React.useEffect(() => {
    update()
  }, [])
  
  return (
    <React.Fragment>
      <div className="row mb-4">
        <div className="col">
          <div style={{borderRadius: '3px', overflow: 'hidden'}}>
            <TextField
              style={{backgroundColor: '#fff176'}}
              className="w-100"
              label={<span className="ch_font">標題</span>}
              variant="filled"
              InputProps={{
                id: "title",
                className: "ch_font",
                onChange: onChange,
                value: title
              }}
              placeholder="不可超過50個字"
            />
            <TextField
              style={{backgroundColor: '#fff59d'}}
              className="w-100 ch_font"
              label={<span className="ch_font">內容</span>}
              multiline
              rows="4"
              variant="filled"
              InputProps={{
                id: "content",
                className: "ch_font",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={check} disabled={blocking}>
                      <SendRoundedIcon fontSize="large" />
                    </IconButton>
                  </InputAdornment>
                ),
                onChange: onChange,
                value: content
              }}
              placeholder="不可超過800字"
            />
          </div>
        </div>
      </div>
      <Paper elevation={loading ? 2 : 0}>
        <div className={classes.cardContainer}>
          <div className="row">
            {data.map((item, i) => {
              return (
                <div key={i} className="col-xs-12 col-sm-6 col-md-3">
                  <MsgCard msg={item} color={random_colors[i]} onClick={onClick}/>
                </div>
              )
            })}
          </div>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Paper>
      <MsgDialog msg={msg} open={open} close={close}/>
      <AlertDialog open={checkShow} close={close} submit={submit} blocking={blocking}/>
    </React.Fragment>
  );
}

const MsgCard = function({ msg, color, onClick }) {
  const classes = useStyles();
  const { title, content, user, createdAt } = msg

  return (
    <Card className={clsx("mb-3", classes.root)} raised style={{backgroundColor: color}} onClick={() => onClick(msg)}>
      <CardContent className="h-100">
        <Typography className={clsx("ch_font", classes.title)} color="textSecondary" gutterBottom>
          {moment(createdAt).calendar(null, { lastWeek: 'dddd HH:mm' })}
        </Typography>
        <Typography
          className="ch_font overflow-hidden"
          variant="h5"
          component="h2"
          style={{
            textOverflow: 'ellipsis',
            height: '20%',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Typography>
        <Typography className="mt-2 mb-3 ch_font" color="textSecondary" style={{fontSize: '0.8rem'}}>
          {user.student_id}
        </Typography>
        <Typography
          className="ch_font overflow-hidden"
          variant="body2"
          component="p"
          style={{
            textOverflow: 'ellipsis',
            height: '40%',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal'
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

const MsgDialog = function({ msg, open, close}) {
  const classes = useStyles();
  if(msg) {
    return (
      <Dialog
          fullWidth
          open={open}
          onClose={close}
          maxWidth='md'
        >
        <DialogTitle>
          <Typography className="ch_font" variant="h6">{msg.title}</Typography>
          <Typography className={clsx("ch_font", classes.title)} color="textSecondary" gutterBottom>
            {moment(msg.createdAt).calendar(null, { lastWeek: 'dddd HH:mm' })}
          </Typography>
          <IconButton className={classes.closeButton} onClick={close}>
            <CloseIcon />
          </IconButton>
          </DialogTitle>
        <DialogContent>
          <DialogContentText className="ch_font">
            {msg.content}
          </DialogContentText>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          /> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={()=>{}} color="primary">
            Disagree
          </Button>
          <Button onClick={()=>{}} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    )
  } else return null
}

const AlertDialog = function({ open, close, submit, blocking }) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>
        <Typography className="ch_font" variant="h6">{"確定要送出嗎?"}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="ch_font">
          送出後全部人都會看見你的發文，記得大家遵守網路秩序和平討論😄
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className="ch_font" onClick={close} color="primary">
          取消
        </Button>
        <Button className="ch_font" onClick={submit} color="primary" disabled={blocking}>
          確定送出
        </Button>
      </DialogActions>
      <Backdrop open={blocking}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  )
}
