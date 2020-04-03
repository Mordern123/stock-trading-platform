import React from "react";
// @material-ui/core
import { List, ListItem, ListItemIcon, ListItemText, Grid } from '@material-ui/core'
import { Folder } from '@material-ui/icons'

const Profile = () => {
  return (
    <Grid container className="ml-5">
      <Grid item xs={6} sm={12} md={6} className="d-flex align-items-center">
        <List>
          {
            [1,2,3,4,5].map(() => (
              <ListItem>
                <ListItemIcon>
                  <Folder />
                </ListItemIcon>
                <ListItemText
                  primary="Single-line item"
                  secondary='Secondary text'
                />
              </ListItem>
            ))
          }
        </List>
      </Grid>
      <Grid item xs={6} sm={12} md={6} className="d-flex align-items-center">
        <List>
          {
            [1,2,3,4,5].map(() => (
              <ListItem>
                <ListItemIcon>
                  <Folder />
                </ListItemIcon>
                <ListItemText
                  primary="Single-line item"
                  secondary='Secondary text'
                />
              </ListItem>
            ))
          }
        </List>
      </Grid>
    </Grid>
  )
}

export default Profile;