import React from 'react'
import { hot } from 'react-hot-loader'

import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import CR from './CR'
//import ComicReader from './ComicReader2'

import './App.css'

import database from '../comics_test_hq_6.json';
const comic_name = "One Piece - Digital Colored Comics"
const comics = database[comic_name]

export function loadComics(database) {
	let comics = [];
	Object.keys(database[comic_name]).forEach(function(key, index) {
		let val = database[comic_name][key]
		if (typeof val == 'object'){
			val['key'] = key;
			comics[index] = val;
		}
	});
	return comics;
}

//import database from '../comics_test_hq.json';
//const comics = database["One Piece"]

//import database from '../comics_test.json';
//const comics = database

const documentWidth = document.documentElement.clientWidth;
const windowWidth = window.innerWidth;
const scrollBarWidth = windowWidth - documentWidth;
 //padding-right: {ScrollBarWidth}px;

    //return(<ScrollLock><CR comics={loadComics(database)} hq={false} page_nr={1}/></ScrollLock>)
function App() {
    return(<ScrollLock><CR comics={loadComics(database)} hq={false} panelView={false} comic_nr={1} page_nr={3}/></ScrollLock>)
}

export default hot(module)(App)
