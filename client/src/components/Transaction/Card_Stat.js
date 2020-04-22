import React from 'react'
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Typography from '@material-ui/core/Typography';
import DateRange from '@material-ui/icons/DateRange';
import { convert_money_format } from '../../tools'

const styles = theme => ({
  text: {
    fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
  },
  cardSubTitle: {
    color: theme.palette.text.secondary,
  },
  cardTitle: {
    color: theme.palette.text.primary,
    fontWeight: "300",
  },
  stats: {
    color: "#999",
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
  }
})

function Card_Stat(props) {
  const classes = makeStyles(styles)()
  const { title, updateTime, value, color, icon } = props
  return (
    <Card>
      <CardHeader color={color} stats icon>
        <CardIcon color={color}>
          {icon}
        </CardIcon>
        <div className="pt-2">
          <Typography variant="subtitle1" className={clsx(classes.text,classes.cardSubTitle)}>{title}</Typography>
          <Typography variant="h4" className={clsx(classes.text,classes.cardTitle)}>{convert_money_format(value)}</Typography>
        </div>
      </CardHeader>
      <CardFooter stats>
        <div className={classes.stats}>
          <DateRange />
          {updateTime}
        </div>
      </CardFooter>
    </Card>
  )
}

Card_Stat.propTypes = {
  title: PropTypes.string,
  updateTime: PropTypes.string,
  value: PropTypes.number,
  color: PropTypes.string,
  icon: PropTypes.node
}

export default Card_Stat

