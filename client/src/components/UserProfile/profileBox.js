import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Slide, InputLabel, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

const styles = theme => ({
  inputLabel: {
    display: 'flex',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  customTypo: {
    fontFamily: "'Noto Sans TC', sans-serif",
    color: "rgba(68,68,68,0.9)",
    fontSize: '1.5rem'
  },
})
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(styles)
const ProfileBox = (props) => {
  const classes = useStyles();
  const { open, handleClose } = props
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>
        <Typography className={classes.customTypo}>編輯個人資料</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <GridContainer>
          <GridItem xs={12} sm={12} md={5}>
            <CustomInput
              labelText="Company (disabled)"
              id="company-disabled"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <CustomInput
              labelText="Username"
              id="username"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Email address"
              id="email-address"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="First Name"
              id="first-name"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Last Name"
              id="last-name"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="City"
              id="city"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Country"
              id="country"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Postal Code"
              id="postal-code"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
            <CustomInput
              labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
              id="about-me"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                multiline: true,
                rows: 5
              }}
            />
          </GridItem>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          更新
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProfileBox;