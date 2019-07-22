import React, { Component } from 'react'
import { Layer, Rect, Group } from 'react-konva'

import MyImage from './MyImage.js'
import URLImage from './URLImage.js'
import Panel from './Panel.js'
import ImageViewer from './ImageViewer.js'
import Dropdown from './Dropdown.js'

function getPanels(page) {
    let panels = [];
    
    Object.keys(page['panels']).forEach(function(key) {

        //console.log(key + "-" + page['panels'][key]);
        var val = page['panels'][key];
        switch(key) {
        case 'img_size':
            //console.log("size: "+val);
            //size = val;
            break;
        case 'filename':
            //console.log("filename: "+val);
            //img_src = val;
            break;
        case 'num_panels':
            //console.log("num_panels: "+val);
            break
        case 'comic_title':
            break;
        case 'scaleX':
            break;
        case 'scaleY':
            break;
        default:
            if (typeof page['panels'][key] != 'object') break;
            //console.log("else: ");
            //console.log(val);
            //panels.push(val);
            panels[key] = val
            break;
        }})

    //console.log(panels);
    return panels
}


export default class Page extends Component {
    constructor(props) {
        super(props)

        //let img_src = this.state.page['filename'];
        
        let curPage = 0;
        let curPanel = 0;
        let panels = getPanels(this.props.comic[curPage]);
        let imgW = this.props.comic[curPage]['img_size'][0];
        let imgH = this.props.comic[curPage]['img_size'][1];
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        this.state = {
            curPanel: curPanel,
            curPage: curPage,
            page: this.props.comic[curPage],
            panels: panels,
            panelCount: this.props.comic[curPage]['panels_num'],
            offsetX: 0,
            offsetY: 0,
            panelView: true,
            /*
            crop: this.getCrop(
                panels[curPanel],
                this.state.page['img_size'][0],
                this.state.page['img_size'][1]
            ),
            */
            scaleX: this.props.comic[curPage]['scaleX'],
            scaleY: this.props.comic[curPage]['scaleY'],
        }

        //console.log("Page: ")
        //console.log(this.state.page)
        //console.log("Panels: ")
        //console.log(this.state.panels)

        this.changePanel = this.changePanel.bind(this);
    }

    componentDidMount() {
       if(this.state.panelView) this.zoomOn();
    }

    
    componentWillMount() {
        this.setState({
            crop: this.getCrop(
                this.state.panels[this.state.curPanel],
                this.state.page['img_size'][0],
                this.state.page['img_size'][1]
            )
        })
    }

    /*
    changePanel = (event) => {
        this.setState({
            curPanel: event.target.value
        })
    }
    */
    changePanel = (value) => {
        //console.log("changePanel")
        if (value == this.state.curPanel) {
            this.setState({
                curPanel: null,
                panelView: false
            })
            this.zoomOut();
            return;
        }
        this.setState({
            curPanel: value,
            panelView: true,
            crop: this.getCrop(
                this.state.panels[value],
                this.state.page['img_size'][0],
                this.state.page['img_size'][1]
            )

        })
        this.zoomOn();
    }

    zoomOut() {
        //console.log('zoomOut')

        var crop = this.getCrop(
            {x: 0,
             y: 0,
             width: window.innerWidth,
             height: window.innerHeight
            }
        )

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

    zoomOn() {
        if (!this.state.panelView) return;
        //TODO: Dynamic speed ( x amount of pixels/second )
        if (this.state.crop.scaleX !== this.state.crop.scaleX) { // Looking for NaN, maybe should be compared to undefined ?, (NaN can never equal itself )
            return;
        }
        
        var tween = new Konva.Tween({
            node: this.layer,
            duration: 0.6,
            x: this.state.crop.x,
            y: this.state.crop.y,
            //y: this.state.crop.y * this.state.scaleY,
            //scaleX: (this.state.crop.scale.x * this.state.scaleX),
            //scaleY: (this.state.crop.scale.y * this.state.scaleY),
            //scaleX: Math.min(this.state.crop.scale.x / this.state.scaleX),
            //scaleY: Math.min(this.state.crop.scale.y / this.state.scaleY),
            scaleX: this.state.crop.scaleX,
            scaleY: this.state.crop.scaleY,
            easing: Konva.Easings['ElasticEase']
        });
        tween.play();
    }


    onClick = (event) => {
        console.log(event)
        //console.log(event.target.parent)
        //console.log(event.parent.pointerPos)
    }

    componentDidUpdate(prevProps, nextState ){
        if(this.state.page !== nextState.page) {
            this.setState({
            curPanel: 0,
            panels: getPanels(this.state.page),
            panelCount: this.state.page['panels_num'],
            panelView: true,
            /*
            crop: this.getCrop(
                panels[curPanel],
                this.state.page['img_size'][0],
                this.state.page['img_size'][1]
            ),
            */
            scaleX: this.state.page['scaleX'],
            scaleY: this.state.page['scaleY']
            });
        }
    }
/*
                <MyImage
            page={this.state.page}
            x={this.state.offsetX}
            y={this.state.offsetY}
                />
                */
    render() {
        //console.log("Crop: ")
        //console.log(this.state.crop);
        console.log(this.props.curPage);
        return (

                <Layer
            ref={node => {this.layer=node}}
            onClick={this.onClick}
            onTap={this.onClick}
                >
                <ImageViewer images={this.props.page} activeImageIndex={parseInt(this.props.curPage)} />
                <Group scaleX={this.state.scaleX} scaleY={this.state.scaleY}>
                {this.state.panels.map((item, index) => (
                        <Panel key={index} active={index == this.state.curPanel}
                    x={item.x + this.state.offsetX}
                    y={item.y + this.state.offsetY}
                    width={item.width + this.state.offsetX}
                    height={item.height + this.state.offsetY}
                    changePanel={this.changePanel}
                    panelNum={index}
                        />


                )
                                      )}
            </Group>
                </Layer>

        )
    }


    getCrop(panel, width=0, height=0, offsetX=0, offsetY=0) {
        if (panel === undefined) {
            //alert("Panel is undefined")
            console.log("Panel is undefined")
        }
        var scaleWidth = window.innerWidth / panel.width;
        var scaleHeight = window.innerHeight / panel.height;
        var scale = Math.min(scaleWidth + offsetX, scaleHeight + offsetY);
        var scaleX = Math.min(scale / this.state.scaleX);
        var scaleY = Math.min(scale / this.state.scaleY);

		var x = 0;
		var y = 0;

		//   ----
		//  |    |
		//   ----
        //offsetY = panel.width/2;
		if(panel.width>panel.height) {
			x = (-panel.x + offsetX) * scale;
			y = (-panel.y + offsetY) * scale;
			//y += (this.props.img.height - (panel.height*scale) * scale)/4
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


		//let gutter = 30;
		//let scaleOffsetX = scaleX / gutter;
		//let scaleOffsetX = scaleX / gutter;

		let scaleOffsetX = 0;
		let scaleOffsetY = 0;

		var crop = {
			x: x,
			y: y,
			scaleX: scaleX + scaleOffsetX,
            scaleY: scaleY + scaleOffsetY
        }

        return crop;
    }
}
