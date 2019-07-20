import React, { Component } from 'react'
import { Image } from 'react-konva'
import PropTypes from 'prop-types'

export default class MyImage extends Component {
    state = {
        img: {
            image: null,
            src: this.props.page['filename_hq'], //TODO: if hq
            width: this.props.page['img_size'][0],
            height: this.props.page['img_size'][1],
            scaleX: this.props.page['scaleX'],
            scaleY: this.props.page['scaleY'],
            scaleX: 1,
            scaleY: 1,
            x: this.props.x,
            y: this.props.x
        },
    };

    static propTypes = {
        page: PropTypes.any.isRequired,
    };

    componentDidMount() {
        this.updateImage();
    }

    componentDidUpdate() {
        this.updateImage();
    }

    updateImage() {
        if(typeof this.state.img === 'undefined' || typeof this.state.img.src === 'undefined') {
            return;
        }
        const image = new window.Image();
        image.src = 'https://comic-editor.s3.eu-north-1.amazonaws.com/' + this.state.img.src;

        image.onload = () => {
            this.setState({
                img: {image: image}
            });
        };
/*
        Konva.Image.fromUrl('https://comic-editor.s3.eu-north-1.amazonaws.com/' + this.state.img.src, function(image) {
            this.setState({
                img: {image: image}
            });
        });
        */

    }

    render() {
        return <Image
        image={this.state.img.image}
        x={this.state.img.x}
        y={this.state.img.y}
        width={this.state.img.width}
        height={this.state.img.height}
        /*
        scaleX={this.state.img.scaleX}
        scaleY={this.state.img.scaleY}
        */
        />;
    }
}

