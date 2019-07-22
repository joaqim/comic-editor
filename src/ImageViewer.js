import React, { Component } from 'react'
import { Image, Div, Group } from 'react-konva'
import PropTypes from 'prop-types'

import URLImage from './URLImage.js'


export default class ImageViewer extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        images: PropTypes.array,
        activeImageIndex: PropTypes.number,
    };

    static defaultProps = {
        images: [],
        activeImageIndex: 0,
    };

    getImagesToPreload = () => {
        return this.props.images.splice(this.props.activeImageIndex, 2);
        //return this.props.images;
        //return this.props.images.slice(this.props.activeImageIndex, 2);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.activeImageIndex !== this.props.activeImageIndex) {
            return true
        }

        if(nextProps.images !== this.props.images) {
            return true
        }
        return false
    }


    render() {
        console.log('ImageViewer')
        console.log(this.props.images)
        console.log(this.props.activeImageIndex)
        console.log('----')
        //const activeImage = this.props.images[this.props.activeImageIndex];
         //       <URLImage src={activeImage.src} key={activeImage.key} />

            const activeImage = this.props.images[this.props.activeImageIndex];
        return (
            <Group>
                <URLImage hq={this.props.hq} src={activeImage.src} key={activeImage.key}/>
                {this.getImagesToPreload().map((preloadImage) => {
                    return (<URLImage hq={this.props.hq}visible={false} key={preloadImage.key} src={preloadImage.src}/>)
                })}
            </Group>
        );
    }
}
