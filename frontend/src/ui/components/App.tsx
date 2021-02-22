import * as React from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';

import { theme } from '../theme';
import { Header } from './header/Header';
import { Content } from '../content/Content';

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Header />
          <Content />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};
