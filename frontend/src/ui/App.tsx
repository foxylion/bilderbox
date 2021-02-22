import * as React from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';

import { theme } from './theme';
import { Header } from './components/Header';
import { Content } from './content/Content';
import { baseUrl } from '../util/baseUrl';

export const App: React.FC = () => {
  const basename = new URL(baseUrl).pathname;
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <HashRouter basename={basename}>
          <Header />
          <Content />
        </HashRouter>
      </ThemeProvider>
    </>
  );
};
