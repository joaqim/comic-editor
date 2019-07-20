import React, { Component } from 'react'

import Dropdown from './Dropdown'
import Page from './Page'

import ArrowKeysReact from 'arrow-keys-react'
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import { Stage } from 'react-konva';

const stageStyle = {
	margin: 'auto',
	width: '100%'
}



export default class ComicReader extends Component {
    constructor(props) {
        super(props)

        let curPage = 3;
        let curPanel = 0;

        let page = this.props.comic[curPage];

        console.log(this.props.comic[curPage]);
/*
        let img_src = this.props.comic[curPage]['filename'];

        // If high-quality:
        let img_src_arr = img_src.split(/[\/]+/);
        console.log("Image path arry: " + img_src_arr);
        let img_name = img_src_arr.pop();
        let img_path = img_src_arr.join('/');
        img_src = img_path + '/hq/' + img_name;
        // Endif
        */

        this.state = {
            curPanel: curPanel,
            page: page,
            curPage: curPage,
            pagesCount: this.props.comic.length,
            scaleX: page['scaleX'],
            scaleY: page['scaleY'],
            stageWidth: window.innerWidth,
            stageHeight: window.innerHeight
        }


        this.changePage = this.changePage.bind(this);
        this.nextPage = this.nextPage.bind(this);

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

    fitStageIntoParentContainer = () => {
        console.log('fitStageintoparentcontainer')
        var container = document.querySelector('#stage-parent');

        // now we need to fit stage into parent
        var containerWidth = container.offsetWidth;
        // to do this we need to scale the stage
        var scale = containerWidth / this.state.stageWidth;
        this.setState({
            stageWidth: this.state.stageWidth * scale,
            stageHeight: this.state.stageHeight * scale,
            stageScale: {x: scale, y: scale}
        })

        //this.refs.stage.width(this.state.stageWidth * scale);
        //this.refs.stage.height(this.state.stageHeight * scale);
        ///this.refs.stage.scale({ x: scale, y: scale });
        //this.refs.stage.draw();
    }
    

    resize = () => {
    //this.forceUpdate()
        this.fitStageIntoParentContainer();
        //this.forceUpdate()
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    changePage = (event) => {
        console.log("ComicReader: Event.target.value is", event.target.value);
        this.setState({
            curPage: event.target.value,
            curPanel: 0
        });
    }

    nextPage = () => {
        let newPage = this.state.curPage+1; //TODO: Check four out of bounds
        this.setState({
            curPage: newPage,
            curPanel: 0,
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state == null)
            return true;

        if (this.state.curPage !== nextState.curPage)
            return true;

        if (this.state.stageWidth !== nextState.stageWidth ||
            this.state.stageHeight !== nextState.stageHeight ||
            this.state.stageScale !== nextState.stageScale)
            return true

        return false;
    }

    //<Dropdown options={this.props.comics} value={this.state.curComic} onChange={this.changeComic}/>
    render() {
        console.log('redraw')
        //<Dropdown options={this.props.comic} value={this.state.curPage} onChange={this.changePage}/>
        return(
                <div
            {...ArrowKeysReact.events} tabIndex="1"
            id={'stage-parent'}
                >

                <Stage
            //ref={node => {this.stage=node}}>
            ref='stage'
            style={stageStyle}
            width={this.state.stageWidth}
            height={this.state.stageHeight}
            scale={this.state.stageScale}
                >

                <Page
            page={this.props.comic[this.state.curPage]}
            //width={this.state.width}
            //height={this.state.height}
            />

               </Stage>
               </div>
              )
    }
}

/*
  <Dropdown options={
  Object.values(this.props.comic)
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
  comic={this.props.comic}

  onChange={this.changePage}
  />
*/
