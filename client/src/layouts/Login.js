import React, { useState } from 'react';
import { useHistory } from 'react-router'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { apiUser_login, apiUser_login_key } from '../api';
import crypto from 'crypto'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const [student_id, set_stu_id] = useState(null)
  const [password, set_psd] = useState(null);
  const [remember, setRemember] = useState(false);
  const [count, setCount] = useState(0);

  const sha512 = (password, secret) => {
    const value = crypto.createHmac('sha512', secret)
      .update(password)
      .digest('hex')
    return value
  }

  const handleRemember = (e) => {
    setRemember(!remember)
  }

  const submit = async (e) => {
    e.preventDefault()
    if(student_id && password) {
      const key_res = await apiUser_login_key({student_id})
      if(key_res.data) {
        const hashValue = sha512(password, key_res.data)
        const user_res = await apiUser_login({student_id, hashValue})
        const { status, payload } = user_res.data
        
        if(status) {
          //本地儲存
          localStorage.clear()
          localStorage.setItem("user", payload._id)
          localStorage.setItem("isAuthenticated", true)
          if(remember) {
            let userData = {student_id, password}
            localStorage.setItem("remember", JSON.stringify(userData))
          }
          history.replace("/admin")
        } else {
          alert(payload)
        }
      } else {
        alert("無此用戶!")
      }
    } else {
      alert("輸入不能為空!")
    }
  }

  React.useEffect(() => {
    const user_json = localStorage.getItem("remember")
    if(user_json) {
      const userData = JSON.parse(user_json)
      set_stu_id(userData.student_id)
      set_psd(userData.password)
      setRemember(true)
      setCount(count+1)
    }
  }, [])
  
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            登入
          </Typography>
          <form key={count} className={classes.form} onSubmit={submit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="學號"
              autoFocus
              onChange={(e) => set_stu_id(e.target.value)}
              defaultValue={student_id}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="密碼"
              type="password"
              autoComplete="current-password"
              onChange={(e) => set_psd(e.target.value)}
              defaultValue={password}
            />
            <FormControlLabel
              control={
                <Checkbox
                  key={remember}
                  checked={remember}
                  onClick={handleRemember}
                  value="remember"
                  color="primary"
                />
              }
              label="記住我"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              登入
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  忘記密碼?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"還沒有帳號? 創建一個吧"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}