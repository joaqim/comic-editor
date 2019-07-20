import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { parse } from 'path'

//import json from './030.json'

import Konva from 'konva'
import ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Image } from 'react-konva'
import useImage from 'use-image'
//import URLImage from './URLImage.js'

//import Cropper from 'react-easy-crop'

//import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import Portal from './Portal.js';

import PropTypes from 'prop-types';

//import KeyHandler, { KEYPRESS } from 'react-key-handler';
import ArrowKeysReact from 'arrow-keys-react'
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import './App.css';

//import test from './comics/30/030.png'

//import 'typeface-roboto'


const HQ = true;

function createPanels(page) {
	let panels = [];
    	Object.keys(page['panels']).forEach(function(key) {

	console.log(key + "-" + page['panels'][key]);
	var val = page['panels'][key];
	switch(key) {
	case 'img_size':
		console.log("size: "+val);
		//size = val;
		break;
	case 'filename':
		console.log("filename: "+val);
		//img_src = val;
		break;
	case 'num_panels':
		console.log("num_panels: "+val);
		break
	case 'comic_title':
		break;
	case 'scaleX':
		break;
	case 'scaleY':
		break;
	default:
		if (typeof page['panels'][key] != 'object') break;
		console.log("else: ");
		console.log(val);
		//panels.push(val);
		panels[key] = val
		break;
	}})

	console.log(panels);
	return panels
}

class Panel extends React.Component {

	constructor(props) {
		super(props)
		this.state = { active: false };

		this.toggleActiveState = this.toggleActiveState.bind(this);
  	}

  toggleActiveState () {
	console.log('toggleActiveState');
//	alert('toggleActiveState');
    this.setState({
      active: !this.state.active
    });
  }


	componentDidMount() {
	var ghost = new Konva.Tween({
        	node: this.rect,
        	duration: 0.6,
        	opacity: 0.7
      	});
//	ghost.play();
	//ghost.to({opacity: 1})

	}
	componentWillMount() {
		if (this.props.active) {
			this.setState({active: true})
		}
	}

	render = () => {
	const stroke = this.props.active ? '' : 'black';
	const fill = this.props.active ? '' : 'black';
	const opacity = this.props.active ? 0 : 0.7;
	//const stroke = 'red';
return (
        //<Div className='img-wrapper' onClick={this.toggleActiveState} >
	<Rect
		x={this.props.x}
		y={this.props.y}
		onClick={this.toggleActiveState}
		//className={`zoom-img ${this.state.active}`}
		width={this.props.width}
		height={this.props.height}
		fill={fill}
		stroke={stroke}
		shadowBlur={5}
		opacity={opacity}
		ref={node => {
              		this.rect = node;
            	}}
		/>
	//</Div>
)
	}
}


function gcd (a, b) {
	return (b == 0) ? a : gcd (b, a%b);
}

class MyImage extends Component {
  state = {
    image: null
  };

  static propTypes = {
    image: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.updateImage();
  }

  componentDidUpdate() {
    this.updateImage();
  }


  updateImage() {
    const image = new window.Image();
    image.src = this.props.image;
    image.onload = () => {
        this.setState({
            image: image
        });
    };
  }

  render() {
    return <Image image={this.state.image} x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} scaleX={this.props.scaleX} scaleY={this.props.scaleY}/>;
  }
}

class Dropdown extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    //console.log("Event.target.value is", event.target.value);
    this.setState({ value: event.target.value });
    this.props.onChange(event);
  }
//value={this.props.value}>
  render() {
    return (
     <select onChange={this.handleChange} defaultValue={this.props.value}>
      {this.props.options.map((item, index) => <option key={index}>{index}</option>)}
    </select>
    )
  }

}

const stageStyle = {
	margin: 'auto',
	width: '100%'
}

var onLeftButton = function() {
	console.log("onLeftButton");
	App.prevPanel();
}

function getCrop(panel, offsetX=0, offsetY=0) {
	if (panel === undefined) {
		//alert("Panel is undefined")
		console.log("Panel is undefined")
	}
		var scaleWidth = window.innerWidth / panel.width;
		var scaleHeight = window.innerHeight / panel.height;
		var scale = Math.min(scaleWidth + offsetX, scaleHeight + offsetY);

		var scaleX = 0;
		var scaleY = 0;
		var x = 0;
		var y = 0;

		//   ----
		//  |    |
		//   ----
		if(panel.width>panel.height) {
			scaleX = scale;
			scaleY = scale;
			x = (-panel.x *scale);
			y = (-panel.y *scale);
			//y += (this.props.img.height - (panel.height*scale) * scale)/4
		}
		//   --
		//  |  |
		//  |  |
		//   --
		else
		if (panel.height>panel.width) {
			scaleX = scale;
			scaleY = scale;
			x = -panel.x *scale;
			y = -panel.y *scale;

		} else {
			scaleX = 1;
			scaleY = 1;
		}


		let gutter = 30;
		//let scaleOffsetX = scaleX / gutter;
		//let scaleOffsetX = scaleX / gutter;

		let scaleOffsetX = 0;
		let scaleOffsetY = 0;

		var crop = {
			x: x + offsetX - gutter,
			y: y + offsetY - gutter,
			scale: {
				x: scaleX + scaleOffsetX,
				y: scaleY + scaleOffsetY
			}
		}

	return crop;
}


class Page extends React.Component {
	constructor(props) {
		super(props);
		this.newPage = this.newPage.bind(this);
		this.newPanel = this.newPanel.bind(this);

		console.log(this.props);

		let curPanel = this.props.curPanel ? this.props.curPanel : 0;
		if(this.props.panel === undefined) {
			var panel = this.props.panels[curPanel];
		}
		if(panel != undefined) {
			var crop = getCrop(panel);
		} else {
			var crop = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
		}

		this.state = {
			curPanel: curPanel,
			panel: panel,
			crop: crop,
			panelView: true
		}
	}
componentDidMount() {
	if(this.state.panelView) this.zoomOn();
}

componentDidUpdate(prevProps) {
  if (this.props.curPanel !== prevProps.curPanel || this.props.panels !== prevProps.panels) {
	let curPanel = this.props.curPanel;
	let panel = this.props.panels[curPanel];
	this.setState({
		curPanel: curPanel,
		panel: this.props.panels[curPanel],
		crop: getCrop(panel)
	});
  }

   if(this.state.panelView) this.zoomOn();
}

zoomOn() {

	if (!this.state.panelView) return;
	//TODO: Dynamic speed ( x amount of pixels/second )
	if (this.state.crop.scaleX !== this.state.crop.scaleX) { // Looking for NaN, maybe should be compared to undefined ?, (NaN can never equal itself )
		return;
	}
	console.log("Crop: ")
	console.log(this.state.crop);
	var tween = new Konva.Tween({
        	node: this.layer,
        	duration: 0.6,
        	x: this.state.crop.x,
        	y: this.state.crop.y,
        	scaleX: this.state.crop.scale.x,
        	scaleY: this.state.crop.scale.y,
		easing: Konva.Easings['ElasticEase']
      	});
	tween.play();
}

shouldComponentUpdate(nextProps, nextState) {
      if (this.state == null)
        return true;

      if (this.state.curPanel != nextState.curPanel || this.props.curPage != nextProps.curPage || this.props.img.src != nextProps.img.src)
        return true;

      return false;
  }

newPanel = (event) => {
    	console.log("newPanel: Event.target.value is", event.target.value);
    	let curPanel = event.target.value;
	this.setState({
		curPanel: curPanel,
        /*
		panel: this.props.panels[curPanel],
        crop: getCrop(this.props.panels[curPanel])
        */
    	});
        //this.props.newPanel(event);
}

newPage  = (event) => {
	let curPanel = 0;
	this.setState({
		curPage: event.targe.value,
/*
		panel: this.props.panels[curPanel],
		crop: getCrop(this.props.panels[curPanel])
*/
	})
    	this.props.onChange(event);
}

	//<Dropdown options={this.props.comic} value={this.props.curPage} onChange={this.newPage}/>
	//<Stage style={stageStyle} x={this.props.offsetX} y={this.props.offsetY}  width={this.props.img.width + this.props.offsetX} height={this.props.img.height + this.props.offsetY}>
render() {
	console.log("Page Render");
	console.log(this.state.curPanel);
return (
<div>
<div style={stageStyle} id="stage-parent">
	<Dropdown options={this.props.panels} value={this.state.curPanel} onChange={this.newPanel}/>

	<Stage style={stageStyle} x={this.props.offsetX} y={this.props.offsetY}  width={window.innerWidth + this.props.offsetX} height={window.innerHeight + this.props.offsetY} ref={node => {this.stage=node}}>
	<Layer ref={node => {this.layer=node}}>
			<MyImage
				image={this.props.img.src}
				x={this.props.offsetX}
				y={this.props.offsetY}
				width={this.props.img.width + this.props.offsetY}
				height={this.props.img.height + this.props.offsetY}
				scaleX={this.props.img.scaleX}
				scaleY={this.props.img.scaleY}
			/>

			{this.props.panels.map((item, index) => (
				<Panel key={index} active={index == this.state.curPanel} x={item.x + this.props.offsetX} y={item.y + this.props.offsetY} width={item.width + this.props.offsetX} height={item.height + this.props.offsetY}/>)
			)}
	</Layer>
	</Stage>
</div>
</div>

)}



}

//import * 'underscore';
import _ from 'lodash'

function find(obj, key) {
  if (obj.value && obj.value.indexOf(key) > -1){
    return true;
  }
  if (obj.children && obj.children.length > 0){
    return obj.children.reduce(function(obj1, obj2){
      return find(obj1, key) || find(obj2, key);
    }, {});
  }
  return false;
}

function deepWalk(collection, childKeys, iteratee) {

  // create a partial _.each with an iterator that will
  // recursively traverse properties from the `childKeys` array
  var each = _.partial(_.each, _, function(value, index) {
    // invoke iteratee callback
    iteratee(value, index);
	console.log({value, index});
    // only recursively iterate over properties found in childKeys
    _(value).pick(childKeys).each(each);
  });

  // invoke iteration
  each(collection);

}

		//if (typeof json[key] != 'object') break;
function loadComic(data) {
	let comic = [];
	console.log(data);
    	Object.keys(data).forEach(function(key) {
		console.log(key);
		let key_int = parseInt(key, 10);
/*
		switch(key){
		case 'filename':
			comics['filename']  = data[key];
			break
		case 'img_size':
			comics['img_size']  = {x: data[key][0], y: data[key][1]};
			break
		default:
*/
			comic[key_int] = data[key]; // Turn json keys into array indices (hopefully)
	});
	return comic;

//console.log(_.map(data, (el => _.pick(el, ['file']))));
/*
    var search = _.filter(_.keys(data), function (key) {
    	var obj = data[key];
    	return _.every(query, function (val, queryKey) {
        	console.log({obj, queryKey, val});
        	return ((obj, queryKey) === val);
    });
});
*/

}
//const database = require('./comics/database.json');
//loadData(database[0], 'file');

/*
deepWalk(database, ['type'], function(value) {
  if(_.includes(['file'], value.content_id)) {
    // do whatever you want here..
    console.log(value);
  }
});
*/

//const page = comics[30][0];

//const json = require('./somics/'+database[19]);
//const json = require('./comics/Vol.01 Ch.0001 - ROMANCE DAWN - The Dawn of the Adventure (gb) [PowerManga]/020.json');

//const json = require('./030.json');
//const json = require('./comics/30/030.json');



//const req = require.context('./comics', true, /\.(png|jpe?g|svg)$/);





class ComicReader extends React.Component {
	constructor(props) {
		super(props)

		let curPage = 0;
		let curPanel = 0;
		console.log(this.props.comic[curPage]);
		let img_src = this.props.comic[curPage]['filename'];

// If high-quality:
		//let img_src_arr = img_src.split(/[\/]+/);
		//console.log("Image path arry: " + img_src_arr);
		//let img_name = img_src_arr.pop();
		//let img_path = img_src_arr.join('/');
		//img_src = img_path + '/hq/' + img_name;
// Endif
		this.state = {
			comic: this.props.comic,
			img_src: img_src,
			curPanel: curPanel,
			page: this.props.comic[curPage],
			panels: createPanels(this.props.comic[curPage]),
			curPage: curPage,
			pagesCount: this.props.comic.length
		}


		this.changePage = this.changePage.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.nextPanel = this.nextPanel.bind(this);

 ArrowKeysReact.config({
      left: () => {
        console.log('left key detected.');
	this.nextPanel();
      },
      right: () => {
        console.log('right key detected.');
      },
      up: () => {
        console.log('up key detected.');
      },
      down: () => {
        console.log('down key detected.');
	this.nextPage();
      }
    });


	}

changePage = (event) => {
    	console.log("ComicReader: Event.target.value is", event.target.value);
	let curPage = event.target.value;
	let curPanel = 0;

	this.setState({
		curPage: event.target.value,
		curPanel: 0
	});
    /*
	let page = this.state.comic[curPage];
	let newPanels = createPanels(page);
	this.setState({
		curPage: curPage,
		curPanel: curPanel,
		page: page,
		img_src: page['filename'],
		panels: createPanels(page),
		panel: newPanels[curPanel],
		crop: newPanels[curPanel]
	});
    this.updatePage();
*/
}

updatePage = ()  => {
	let curPage = this.state.curPage;
	let curPanel = 0;
	let page = this.state.comic[curPage];
	let newPanels = createPanels(page);
	this.setState({
		curPage: curPage,
		curPanel: curPanel,
		page: page,
		img_src: page['filename'],
		panels: createPanels(page),
		panel: newPanels[curPanel],
		crop: newPanels[curPanel]
	});
}


nextPage = () => {
	let newPage = this.state.curPage+1;
	this.setState({
		curPage: newPage,
		curPanel: 0,
	})
/*
	if(newPage < this.state.comic.length) {
		let newPageObj = this.props.comic[newPage];
		this.setState({
			curPage:  newPage,
			curPanel: 0,
			img_src: newPageObj['filename'],
			page: newPageObj,
			panels: createPanels(newPageObj),
			width: newPageObj['img_size'][0],
			height: newPageObj['img_size'][1],
			scaleX: newPageObj['scaleX'],
			scaleY: newPageObj['scaleY']
		});
	}
*/
}

nextPanel = () => {
	let newPanel = this.state.curPanel+1;
	if(newPanel < this.state.panels.length) {
		this.setState({
			curPanel: newPanel
//			panel: this.state.panels[newPanel]
		});
	} else {
		this.nextPage();
	}
}


componentDidUpdate(prevProps, prevState) {
  if (this.state.curPage !== prevState.curPage || this.state.panels !== prevState.panels) {
	this.updatePage();
/*
	let curPanel = this.state.curPanel;
	let panel = this.state.panels[curPanel];
	this.setState({
		curPanel: curPanel,
		panel: this.state.panels[curPanel],
		crop: getCrop(panel),
		panels: createPanels(this.props.comic[this.state.curPage]),
	});
*/

  }
}

shouldComponentUpdate(nextProps, nextState) {
      if (this.state == null)
        return true;

      if (this.state.curPage != nextState.curPage || this.state.curPanel != nextState.curPanel)
        return true;

      return false;
  }

fitStageIntoParentContainer() {
        var container = document.querySelector('#stage-parent');
	let stageWidth = window.innerWidth;
	let stageHeight = window.innerHeight;

        // now we need to fit stage into parent
        var containerWidth = container.offsetWidth;
        // to do this we need to scale the stage
        var scale = containerWidth / stageWidth;

        this.stage.width(stageWidth * scale);
        this.stage.height(stageHeight * scale);
        this.stage.scale({ x: scale, y: scale });
        this.stage.draw();
      }



	//<Dropdown options={this.props.comics} value={this.state.curComic} onChange={this.changeComic}/>
	render() {
	//console.log('redraw')
	//<Dropdown options={this.state.comic} value={this.state.curPage} onChange={this.changePage}/>
	return(
<div {...ArrowKeysReact.events} tabIndex="1">
	<Dropdown options={
		Object.values(this.state.comic)
	} value={this.state.curPage} onChange={this.changePage}/>
	<Page 	img={{
			src: this.state.img_src,
			width: this.state.page['img_size'][0],
			height: this.state.page['img_size'][1],
			scaleX: this.state.scaleX,
			scaleY: this.state.scaleY
		}}
		curPanel={this.state.curPanel}
		panels={this.state.panels}
		offsetX={0}
		offsetY={0}
		curPage={this.state.curPage}
		curPage={this.state.curPanel}
		comic={this.state.comic}

		onChange={this.changePage}
	/>
</div>
	)
	}
}

//import database from '../comics/comics.json';
//import database from '../comics/current/comics.json';

//import database from '../dist/comics_hq.json';
import database from '../dist/comics.json';
console.log("Database: ");
console.log(database);

const comic_name = 'Vol.28 Ch.0263 - Pirate Nami and the Sky Knight vs. Vice Captains Hotori and Kotori (gb) [PowerManga]';
//const comic_name = 'Vol.01 Ch.0001 - ROMANCE DAWN - The Dawn of the Adventure (gb) [PowerManga]';
//const comic = loadComic(database["One Piece"][comic_name]); // Loads one comic -> multiple pages

/*
const comic = database["One Piece"][comic_name];
console.log("Comic: ");
console.log(comic);


class App extends React.Component {
	constructor(props) {
		super(props)

        const comic = database["One Piece"][comic_name];
        console.log("Comic: ");
        console.log(comic);


		this.state = {
			comic: comic
		}
 	this.handleChange = this.handleChange.bind(this);

  }
  handleChange = (event) => {
    console.log("Event.target.value is", event.target.value);
    //this.setState({ value: event.target.value });
  }

	render() {
		return (
		<ComicReader comic={this.state.comic} onChange={this.handleChange}/>

		)
	}
}

export default hot(module)(App)
