import React, { Component } from 'react'

import Konva from 'konva'
import ReactDOM from 'react-dom';
import { Stage, Layer, Group, Rect, Image } from 'react-konva'

import ArrowKeysReact from 'arrow-keys-react'

import axios from 'axios';

import { loadPanels, getImagesArray } from './Utils'

import Dropdown from './Dropdown'
import ImageViewer from './ImageViewer'
import Panel from './Panel'

import initReactFastclick from 'react-fastclick';
initReactFastclick();

//const comic_name = 'Vol.28 Ch.0263 - Pirate Nami and the Sky Knight vs. Vice Captains Hotori and Kotori (gb) [PowerManga]';
//const comic_name = 'Vol.01 Ch.0001 - ROMANCE DAWN - The Dawn of the Adventure (gb) [PowerManga]';
const comic_name = 'Vol.33 Ch.0309 - The Groggy Monsters (gb) [PowerManga]'
//const comic_name = 'Vol.33 Ch.0308 - Obstacle Warfare (gb) [PowerManga]'

export default class CR extends Component {
    constructor(props) {
        super(props)
        //let page_nr = this.props.page_nr;
        let page_nr = 0;
        let panel_nr = parseInt(this.props.panel_nr);
        //let comic_nr = 309;
        let comic_nr = 1;
        console.log(this.props.comics);

        let pages = this.props.comics[comic_nr];
        let page = pages[page_nr];
        let panels = loadPanels(page);

        console.log(page)
        let panel_count = parseInt(page['panel_count']);

        let scaleX = 1;
        let scaleY = 1;

        if(this.props.hq) {
            scaleX = page['scaleX'];
            scaleY = page['scaleY'];
        }

        var i = 0;
        let crop_arr = Array(panel_count).fill().map(() => this.getCrop(panels[i++], page['img_size'][0], page['img_size'][1], scaleX, scaleY));

        this.state = {
            page_nr: page_nr,
            panel_nr: panel_nr,
            panel_count: panel_count,

	    comic_nr: comic_nr,

            pages: pages,
            page: page,
            panels: panels,


            crop_arr: crop_arr,
            img_arr: getImagesArray(pages, this.props.hq),

            scaleX: scaleX,
            scaleY: scaleY,
            offsetX: 0,
            offsetY: 0,

            hq: this.props.hq,
            panelView: false
        }

        this.refreshComic = this.refreshComic.bind(this);
        this.changeComic = this.changeComic.bind(this);
        this.changePage = this.changePage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.nextPanel = this.nextPanel.bind(this);

        this.stageClick = this.stageClick.bind(this);

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
                this.zoomOut()
            },
            down: () => {
                console.log('down key detected.');
                //this.nextPage();
                this.changePage(parseInt(this.state.page_nr)+1);
            }
        });


        //this.refreshPanels();
        //this.refreshCrops();
        //this.refreshCrops();
        // this.zoomIn();
    }

    stageClick(e){
        //e.preventDefault()
        console.log(e.evt.screenX)
        console.log(e.evt.screenY)

        if(e.evt.screenX < window.innerWidth/2) {
            console.log("Left")
            return
        }
        console.log("Right")
    }

    refreshCrops(){
        let i = 0;
        this.setState({crop_arr: Array(this.state.panel_count).fill().map(() => this.getCrop(this.state.panels[i++], this.state.page['img_size'][0], this.state.page['img_size'][1]))});
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
    }


    resize = () => {
        this.fitStageIntoParentContainer();
        this.forceUpdate()
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)

	var th = this;
    	this.serverRequest = axios.get('https://comic-editor.s3.eu-north-1.amazonaws.com/' + 'comics_hq_newest.json')
         	.then(function(result) {
          	th.setState({
            		jobs: result.data.modules
          	});
       	})
        //this.zoomIn();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }


    getCrop = (panel, width, height,scaleX=0, scaleY=0, offsetX=0, offsetY=0) => {
        if (panel === undefined) {
            console.log("Panel is undefined")
        }
        var scaleWidth = window.innerWidth / panel.width;
        var scaleHeight = window.innerHeight / panel.height;
        var scale = Math.min(scaleWidth + offsetX, scaleHeight + offsetY);

        if (scaleX == 0 || scaleY == 0) {
            scaleX = this.state.scaleX;
            scaleY = this.state.scaleY;
        }

        scaleX = Math.min(scale / scaleX);
        scaleY = Math.min(scale / scaleY);

        var x = 0;
        var y = 0;

        //   ----
        //  |    |
        //   ----
        if(panel.width>panel.height) {
            x = (-panel.x + offsetX) * scale;
            y = (-panel.y + offsetY) * scale;
        }
        //   --
        //  |  |
        //  |  |
        //   --
        else
            if (panel.height>panel.width) {
                x = -(panel.x + offsetX) * scale;
                y = -(panel.y + offsetY) * scale;
            }

        var crop = {
            x: x,
            y: y,
            scaleX: scaleX,
            scaleY: scaleY
        }

        return crop;
    }


    nextPanel = () => {
        console.log('nextPanel')
        let panel_nr = this.state.panel_nr
        let panel_new = 0
        if(panel_nr !== null) {
            panel_new = parseInt(panel_nr)+1
        }
        this.changePanel(panel_new);
    }

    changePanel = (value) => {
        this.setState({panel_nr: value})
    }

    changePanelOld = (value) => {
        if(value >= this.state.panel_count)  {
            this.setState({panel_nr: 0})
            this.nextPage();
        }
        console.log('changePanel(' + value +')')
        if (value == this.state.panel_nr) {
            this.setState({
                panel_nr: null,
                panelView: false
            })
            this.zoomOut()
            return
        }
        this.setState({
            panel_nr: value,
            panelView: true
        })
        this.zoomIn(this.state.crop_arr[value]);
    }

    nextPage() {
        this.changePage(parseInt(this.state.page_nr)+1)
    }

    changePage(value) {
      this.refreshPage(value);
        //this.setState({page_nr: value})
    }

    // Refresh panels, basically
    refreshPanels() {
        console.log('refreshPanels')
        this.setState({
            panel: loadPanels(this.state.pages[this.state.page_nr]),
            panel_count: this.state.pages[this.state.page_nr]['panel_count']
        })
    }

    changeComic = (value) => {
        refreshComic(value)
    }

    refreshComic = (value) => {
        console.log(value)
	this.refreshPage(0, value)
    }
    // Only run on new page
    // Expects that:
    // this.state.page_nr && this.state.panel_nr
    // has been updated before running,  i.e  page_nr += 1, panel_nr = 0
    // Refresh page(URLimage) + panels + crops
    refreshPage = (value, comic_nr=undefined) => {
        console.log('refreshPage nr: ' + value)


        let page_nr = value
        let panel_nr = 0

	if (comic_nr == undefined) {
        	var pages = this.props.comics[this.state.comic_nr];
	} else {
        	var pages = this.props.comics[comic_nr];
	}
        //let pages = this.state.pages
        let page = pages[page_nr]
        let panels = loadPanels(page)
        console.log('new panels: ', panels)

        let panel_count = parseInt(page['panel_count'])
        console.assert(panels.length === panel_count, "Error!")

        let scaleX = 1;
        let scaleY = 1;

        if(this.state.hq) {
            scaleX = page['scaleX'];
            scaleY = page['scaleY'];
        }

        let i = 0;
        let crop_arr = Array(panel_count).fill().map(() => this.getCrop(panels[i++], page['img_size'][0], page['img_size'][1], scaleX, scaleY))

        console.assert(panels.length === crop_arr.length, "Error!")
        this.setState({
            page_nr: page_nr,
            panel_nr: panel_nr,

            pages: pages,
            page: page,

            panels: panels,

            panel_count: panel_count,

            scaleX: scaleX,
            scaleY: scaleY,

            crop_arr: crop_arr

        });

        //this.refreshPanels();
        //this.refreshCrops();
        //this.changePanel(panel_nr)
        this.zoomIn(crop_arr[panel_nr]);
    }

    zoomOut() {
        console.log('zoomOut')
        var crop = this.getCrop({
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        var tween = new Konva.Tween({
            node: this.layer,
            duration: 0.6,
            x: crop.x,
            y: crop.y,
            scaleX: crop.scaleX,
            scaleY: crop.scaleY
        })
        tween.play();
    }

    zoomIn(crop) {
        if(crop === undefined) {
            //crop = this.state.crop_arr[this.state.panel_nr]
            console.log('zoomIn() Failed: Crop is undefined')
            return;
        };
        console.log('zoomIn')
        if (!this.state.panelView || this.state.panel_nr == null) return;
        //TODO: Maybe make sure this.state.crops[] is in range of panel_nr

        //TODO: Dynamic speed/duration  ( x amount of pixels/second )
        var tween = new Konva.Tween({
            node: this.layer,
            duration: 0.6,
            x: crop.x,
            y: crop.y,
            scaleX: crop.scaleX,
            scaleY: crop.scaleY,
            easing: Konva.Easings['ElasticEase']
        });
        tween.play();
    }

    componentDidUpdate(prevProps, prevState) {
        //this.stage.scale({x:2,y:2})
        //this.stage.scale({x:this.state.scaleX,y:this.state.scaleY})

        //if(this.state.page_nr != prevState.page_nr) {
            //this.refreshPage(this.state.page_nr)
        //} else
        if(this.state.panel_nr >= this.state.panel_count || this.state.panel_nr > this.state.panel_count) {
            this.nextPage()
        }
        if(this.state.panel_nr != prevState.panel_nr) {
            this.zoomIn(this.state.crop_arr[this.state.panel_nr])
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
        if(this.state.panel_nr !== nextState.panel_nr)  {
            return true
        }
        if(this.state.panels != nextState.panels) {
            return true
        }
        if(this.state.panel_nr !== nextState.page_nr) {
            return true
        }
        if(this.state.page_nr !== nextState.page_nr) {
            return true
        }
        if(this.state.comic_nr !== nextState.comic_nr) {
            return true
        }

        //return false
    }

    render() {
        console.log('CR render!')
        console.log('Page Nr: ' + this.state.page_nr)
        console.log('Panel Nr: ' + this.state.panel_nr)
        //console.log('Crops: ', this.state.crop_arr)
        //console.log('Panels: ', this.state.panels)

        return (
                <div
            {...ArrowKeysReact.events} tabIndex="1"
            id={'stage-parent'}
                >

                <Dropdown options={Object.keys(this.props.comics)} defaultValue={this.state.comic_nr} onChange={this.refreshComic}/>
                <Dropdown options={Object.keys(this.state.pages)} defaultValue={this.state.page_nr} onChange={this.refreshPage}/>
                <Stage
            ref={node => {this.stage=node}}
            onClick={this.stageClick}
            width={window.innerWidth}
            height={window.innerHeight}
                >
                
                <Layer
            ref={node => {this.layer=node}}
            x={0}
            y={0}
            //onClick={this.onClick}
            //onTap={this.onClick}
                >
                <Rect
            x={0}
            y={0}
            width={window.innerWidth/2}
            height={window.innerHeight}
            fill={'red'}/>
                <Rect
            x={window.innerWidth/2}
            y={0}
            width={window.innerWidth/2}
            height={window.innerHeight}
            fill={'blue'}/>

                <ImageViewer
            images={this.state.img_arr}
            activeImageIndex={parseInt(this.state.page_nr)}
            hq={this.state.hq}
            />
                <Group
            scaleX={this.state.hq ? this.state.scaleX : 1}
            scaleY={this.state.hq ? this.state.scaleY : 1}
                >
                {this.state.panels.map((item) => (
                        <Panel key={item.key} active={item.key == this.state.panel_nr}
                    x={item.x + this.state.offsetX}
                    y={item.y + this.state.offsetY}
                    width={item.width + this.state.offsetX}
                    height={item.height + this.state.offsetY}
                    changePanel={this.changePanel}
                    panel_nr={item.key}
                        />
                ))}

            </Group>

            </Layer>
                </Stage>
                </div>

        )
    }
}


CR.defaultProps = {
    page_nr: 0,
    panel_nr: 0
};
