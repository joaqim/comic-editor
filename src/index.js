import React from 'react'
import { render } from 'react-dom'
import App from './App6'
//import App from './App_test'

import registerServiceWorker from './registerServiceWorker';

const root = document.createElement('div')
document.body.appendChild(root)

render(<App/>, root);
registerServiceWorker();
