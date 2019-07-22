import React, { Component } from 'react'
import { Rect } from 'react-konva'
import { Tween } from 'konva'


export default class Panel extends Component {
	constructor(props) {
		super(props)
		this.state = { active: false };
		this.toggleActiveState = this.toggleActiveState.bind(this);
  	}

  toggleActiveState () {
    this.setState({
      active: !this.state.active
    });
      this.props.changePanel(this.props.panel_nr)
  }

    componentDidMount() {
        var ghost = new Tween({
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
    componentWillReceiveProps(nextProps) {
        if(nextProps.active !== this.props.active) {
            this.setState({active: nextProps.active})
        }
    }
           //<Div className='img-wrapper' onClick={this.toggleActiveState} >
    render = () => {
        const stroke = this.state.active ? '' : 'black';
        const fill = this.state.active ? '' : 'black';
        const opacity = this.state.active ? 0 : 0.2;
        return (
                <Rect
            onTap={this.toggleActiveState}
            x={this.props.x}
            y={this.props.y}
            onClick={this.toggleActiveState}
            width={this.props.width}
            height={this.props.height}
            fill={fill}
            //stroke={stroke}
            stroke={'red'}
            shadowBlur={30}
            opacity={opacity}
		    ref={node => {
              	this.rect = node;
            }}
		        />
        )
	}
}

