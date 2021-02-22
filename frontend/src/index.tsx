import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './ui/components/App';
import { reportWebVitals } from './util/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log); // see https://bit.ly/CRA-vitals
