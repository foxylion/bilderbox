import * as React from 'react';

import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Collections as CollectionsIcon } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

export const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton>
          <CollectionsIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          BilderboX
        </Typography>
        <div className={classes.grow} />
      </Toolbar>
    </AppBar>
  );
};
