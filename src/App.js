import React from 'react'
import { hot } from 'react-hot-loader'

import pages from './pages.json'

import 'typeface-roboto'


class Body extends React.Component {

constructor(props) {
	super(props)
	//this.state = {
      //	ticketValidityTime:  4.5e6
//	}
	}

    render() {
		//<img src={require(JSON.)}
		//{arr.map(item => <
		//{arr.map(0)}
        return (
		<Page/>
        )
    }
}

class Page extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			images: [],
			image: null,
			currentPage: 0,
			hasError: null
		}
		this.retrieveImages= this.retrieveImages.bind(this)
	}

	//componentDidCatch(error, info) { this.setState({hasError: true}); console.log(error + ' - ' + info); }

	retrieveImages = () => {
		var image_arr = [];
		var img = null;
		let comp = this;
		Object.keys(pages).forEach(function(key) {
			image_arr.push(pages[key]['filename'])
			img = pages[key]['filename']
			//console.log(pages[key]['filename'])
		});
		//comp.setState({images: image_arr})
		comp.setState({image: img})
		console.log(img)
		image_arr.map(name => `<img src='${require.context(name)}' alt='${name}' />`);
	}

	componentDidMount() {
    		return this.retrieveImages()
      		//.then(images => this.setState({images}))
      		//.catch(error => this.setState({error}))
  	}

	render() {
		//return <img src={require(this.state.image)}/>
		//return <img src={this.state.image}/>
	}
}

const pathToComic = require.context('./images', true);

function importAll(r) {
	let images = {};
	r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
	return images;
}

class Example extends React.Component {
  constructor(props) {
	super(props)
	this.state = {
		images: []
	}
	this.setState({images: importAll(require.context('./images', true, /\.(png|jpe?g|svg)$/))});
	}
  render() {
    return (
      <div>
        {Object.keys(pages).map(key => (
          <div>
            {pages[key].type}
//pages.map(name => `<img src='${pathToComic(name, true)}' alt='${name}' />`);

           <img src={pathToComic(pages[key].filename)} key={key} />
          </div>
        ))}
      </div>
    );
  }
}

const App = () => (
    <div> <Example/> </div>
)

export default hot(module)(App)
