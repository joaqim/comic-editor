import React, { Component } from 'react'
import { Image } from 'react-konva'
import PropTypes from 'prop-types'

export default class MyImage extends Component {
    state = {
        img: {
            image: null,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            scaleY: 1,
            scaleX: 1,
        },
    };

    static propTypes = {
        page: PropTypes.any.isRequired,
    };

   // componentDidMount() {
    componentWillMount() {
        this.updateImage();
    }

    componentDidUpdate() {
        this.updateImage();
    }

    updateImage() {
       // if(typeof this.state.img === 'undefined' || typeof this.state.img.src === 'undefined') {
        //    return;
        //}
        if(typeof this.props.page === 'undefined' || typeof this.props.page['filename_hq'] === 'undefined') return;


        const image = new window.Image();
        let img_src = this.props.page['filename_hq'];
        image.src = 'https://comic-editor.s3.eu-north-1.amazonaws.com/' + img_src;

        image.onload = () => {
        this.setState({
            img: {
                image: image,
                /*
                width: this.props.page['img_size'][0],
                height: this.props.page['img_size'][1],
                */
            },
            /*
            scaleX: this.props.page['scaleX'],
            scaleY: this.props.page['scaleY'],
            x: this.props.x,
            y: this.props.x
            */
        })
        };

    }

    render() {
        return <Image
        image={this.state.img.image}
        /*
        x={this.state.img.x}
        y={this.state.img.y}
        */
        //width={this.state.img.width}
        //height={this.state.img.height}
        /*
        scaleX={this.state.img.scaleX}
        scaleY={this.state.img.scaleY}
        */
        />;
    }
}

