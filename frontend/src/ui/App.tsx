import * as React from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';

import { theme } from './theme';
import { Header } from './components/Header';
import { Content } from './content/Content';
import { baseUrl } from '../util/baseUrl';

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <HashRouter basename={baseUrl}>
          <Header />
          <Content />
        </HashRouter>
      </ThemeProvider>
    </>
  );
};
