import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader'

import { Konva } from 'konva'
import ReactDOM from 'react-dom'
import { Stage, Layer, Rect } from 'react-konva'

import './App.css'

import Dropdown from './Dropdown.js'
import MyImage from  './MyImage.js'
import Panel from './Panel.js'
import ComicReader from './ComicReader.js'

import database from '../dist/comics_hq.json';
const comic_name = 'Vol.28 Ch.0263 - Pirate Nami and the Sky Knight vs. Vice Captains Hotori and Kotori (gb) [PowerManga]';
//const comic_name = 'Vol.01 Ch.0001 - ROMANCE DAWN - The Dawn of the Adventure (gb) [PowerManga]';
const comic = database["One Piece"][comic_name];

function App() {
    return (
            <ComicReader comic={comic}/>
    )
}

export default hot(module)(App)
