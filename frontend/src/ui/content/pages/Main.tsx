import * as React from 'react';

import { Typography } from '@material-ui/core';

export const Main: React.FC = () => {
  return (
    <>
      {[...Array(100)].map((i) => (
        <Typography key={i}>Hello World!</Typography>
      ))}
    </>
  );
};
