import React, { Component, useEffect, useState } from 'react'
import Konva from 'konva'
import ReactDOM from 'react-dom'
import { Stage, Layer, Group, Rect, Image } from 'react-konva'

import axios from 'axios'

//import { getComicDatabase, getChapterArray, getImagesArray } from './utils/comicUtils.js'

let CR = () => {
	console.log('CR')
	return (<div><b>CR</b></div>)
}

/*
export default class CR extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (<div><b>CR</b></div>)
	}
}



CR.defaultProps = {
	page_nr: 0,
	panel_nr: 0
}
*/

export default CR
