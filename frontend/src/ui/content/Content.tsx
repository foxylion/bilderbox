import * as React from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import { Route, Switch } from 'react-router';

import { Main } from './pages/Main';
import { Test } from './pages/Test';
import { Photos } from './pages/Photos';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    marginTop: '60px',
    padding: theme.spacing(2),
  },
}));

export const Content: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Switch>
        <Route path="/photos">
          <Photos />
        </Route>
        <Route path="/test/:path+">
          <Test />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </div>
  );
};
