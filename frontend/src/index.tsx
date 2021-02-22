import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './ui/App';
import { MicrosoftAuthenticationProvider } from './util/authentication/microsoft';
import { reportWebVitals } from './util/reportWebVitals';

(async () => {
  const authentication = new MicrosoftAuthenticationProvider();
  await authentication.authenticate();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );

  reportWebVitals(/*console.log*/); // see https://bit.ly/CRA-vitals
})();
