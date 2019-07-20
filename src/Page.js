import React, { Component } from 'react'
import { Layer, Rect, Group } from 'react-konva'

import MyImage from './MyImage.js'
import Panel from './Panel.js'

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


export default class Page extends Component {
    constructor(props) {
        super(props)

        //let img_src = this.props.page['filename'];
        
        let curPanel = 0;
        let panels = createPanels(this.props.page);
        let imgW = this.props.page['img_size'][0];
        let imgH = this.props.page['img_size'][1];
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        this.state = {
            curPanel: curPanel,
            panels: panels,
            panelCount: this.props.page['panels_num'],
            offsetX: 0,
            offsetY: 0,
            panelView: true,
            /*
            crop: this.getCrop(
                panels[curPanel],
                this.props.page['img_size'][0],
                this.props.page['img_size'][1]
            ),
            */
            scaleX: this.props.page['scaleX'],
            scaleY: this.props.page['scaleY'],
            scaleWX: Math.min(winW / imgW, imgW / winW),
            scaleWY: Math.min(winH / imgH, imgH / winH),
        }

        console.log(this.state.scaleWX)
        console.log("Page: ")
        console.log(this.props.page)
        console.log("Panels: ")
        console.log(this.state.panels)

        this.changePanel = this.changePanel.bind(this);
    }

    componentDidMount() {
        if(this.state.panelView) this.zoomOn();
    }

    
    componentWillMount() {
        this.setState({
            crop: this.getCrop(
                this.state.panels[this.state.curPanel],
                this.props.page['img_size'][0],
                this.props.page['img_size'][1]
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
        console.log("changePanel")
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
                this.props.page['img_size'][0],
                this.props.page['img_size'][1]
            )

        })
        this.zoomOn();
    }

    zoomOut() {
        console.log('zoomOut')

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
        console.log(event);
    }
    render() {
        console.log("Crop: ")
        console.log(this.state.crop);
        return (

                <Layer
            ref={node => {this.layer=node}}
            onClick={this.onClick}
            onTap={this.onClick}
                >
                <MyImage
            page={this.props.page}
            x={this.state.offsetX}
            y={this.state.offsetY}
                />
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

        /*
        if (panel === undefined) {
            //alert("Panel is undefined")
            console.log("Panel is undefined")
        }
        //console.log(Math.min(width / panel.width, panel.width / width) / this.state.scaleX)

        let mScaleX = Math.min(width / panel.width, panel.width / width);
        let mScaleY = Math.min(height / panel.height, panel.height / height);
        let gutter = 60;
        //   ----
        //  |    |
        //   ----
        if(panel.width>=panel.height) {
            return ({
                x: -(panel.x + gutter) * this.state.scaleX,
                y: -panel.y/2,
                scale: {
                    x: this.state.scaleX * (mScaleX*2),
                    y: this.state.scaleX * (mScaleX*2)
                }
            })
        //   --
        //  |  |
        //  |  |
        //   --
        } else if (panel.height>panel.width) { //TODO: Just else
            return ({
                x: -(panel.x + gutter) * this.state.scaleX,
                y: -panel.y * this.state.scaleY,
                scale: {
                    x: this.state.scaleY * mScaleY,
                    y: this.state.scaleY * mScaleY
                }
            })
        }

*/
        /*
        //width = window.innerWidth;
        //height = window.innerHeight;
        let mScaleX = Math.min(width / panel.width, panel.width / width) * this.state.scaleX;
        let mScaleY = Math.min(height / panel.height, panel.height / height) * this.state.scaleY;
        let gutter = 60;
        //   ----
        //  |    |
        //   ----
        if(panel.width>=panel.height) {
            return ({
                //x: ((panel.x - gutter) * mScaleX * -this.state.scaleX),
                x: (panel.x - gutter) * mScaleX,
                //y: ((-panel.y/2) * mScaleX * this.state.scaleY),
                scale: {
                    x: mScaleX,
                    y: mScaleX
                }
            })
        }
        //   --
        //  |  |
        //  |  |
        //   --
        else if (panel.height>panel.width) {
            return ({
                x: -panel.x * mScaleX,
                y:  -panel.y * mScaleY,
                scale: {
                    x: mScaleY,
                    y: mScaleY 
                }
            })
        }
*/

        /*
          if(width == 0) {
          var scaleWidth = window.innerWidth / panel.width;
          var scaleHeight = window.innerHeight / panel.height;
          } else {
          var scaleWidth = width / panel.width;
          var scaleHeight = height / panel.height;
          }
          console.log(scaleWidth)
          var scale = Math.min(scaleWidth + offsetX, scaleHeight + offsetY);

          var scaleX = 0;
          var scaleY = 0;
          var x = 0;
          var y = 0;

          //   --
          //  |  |
          //  |  |
          //   --
          else
          if (panel.height>panel.width) {
          scaleX = scale;
          scaleY = scale;
          //x = -panel.x *scale;
          //y = -panel.y *scale;
          x = panel.x *scale;
          y = panel.y *scale;


          } else {
          scaleX = scale;
          scaleY = scale1;
          x = panel.x *scale;
          y = panel.y *scale;
          }


          //let gutter = 30 * scale;
          let gutter = 0
          //scaleOffsetX = scaleX / gutter;
          //scaleOffsetY = scaleY / gutter;

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


}

        */
/*
  <Rect
  x={item.x}
  y={item.y}
  width={item.width}
  height={item.width}
  fill={'red'}
  />
*/
/*

  {this.state.panels.map((item, index) => (
  <Panel key={index} active={index == this.state.curPanel} x={item.x + this.state.offsetX} y={item.y + this.state.offsetY} width={item.width + this.state.offsetX} height={item.height + this.state.offsetY}/>)
  )}
*/
/*
  export default class Page extends Component {
  constructor(props) {
  super(props);
  this.newPage = this.newPage.bind(this);
  this.newPanel = this.newPanel.bind(this);

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

  if (this.state.curPanel != nextState.curPanel || this.props.curPage != nextProps.curPage || this.state.img.src != nextProps.img.src)
  return true;

  return false;
  }

  newPanel = (event) => {
  console.log("newPanel: Event.target.value is", event.target.value);
  let curPanel = event.target.value;
  this.setState({
  curPanel: curPanel,
  });
  //this.props.newPanel(event);
  }

  newPage  = (event) => {
  let curPanel = 0;
  this.setState({
  curPage: event.targe.value,
  })
  this.props.onChange(event);
  }

  //<Dropdown options={this.props.comic} value={this.props.curPage} onChange={this.newPage}/>
  //<Stage style={stageStyle} x={this.props.offsetX} y={this.props.offsetY}  width={this.state.img.width + this.props.offsetX} height={this.state.img.height + this.props.offsetY}>
  render() {
  return (
  <div>
  <div style={stageStyle} id="stage-parent">
  <Dropdown options={this.props.panels} value={this.state.curPanel} onChange={this.newPanel}/>

  <Stage style={stageStyle} x={this.props.offsetX} y={this.props.offsetY}  width={window.innerWidth + this.props.offsetX} height={window.innerHeight + this.props.offsetY} ref={node => {this.stage=node}}>
  <Layer ref={node => {this.layer=node}}>
  <MyImage
  image={this.state.img.src}
  x={this.props.offsetX}
  y={this.props.offsetY}
  width={this.state.img.width + this.props.offsetY}
  height={this.state.img.height + this.props.offsetY}
  scaleX={this.state.img.scaleX}
  scaleY={this.state.img.scaleY}
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

*/
