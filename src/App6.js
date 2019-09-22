import React from 'react'
import { hot } from 'react-hot-loader'

import ScrollLock, { TouchScrollable } from 'react-scrolllock'

import CR from './CR2';

import './App.css'

function App() {
	return(
		<ScrollLock>
		<CR/>
		</ScrollLock>
	)
}
