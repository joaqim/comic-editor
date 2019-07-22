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

export default class ComicReader extends Component {
    constructor(props) {
        super(props)

        let scaleX = 1;
        let scaleY = 1;

        if(this.props.hq) {
            scaleX = page['scaleX'];
            scaleY = page['scaleY'];
        }

        let pages = this.props.comics[this.props.comic_nr];


        this.state = {
            comic_nr: this.props.comic_nr,
            page_nr: this.props.page_nr,
            panel_nr: this.props.panel_nr,

            pages: pages,

            img_arr: getImagesArray(pages, this.props.hq)

        }
    }

    render() {
    return (
            <div>
            </div>
    )
    }
}

ComicReader.defaultProps = {
    page_nr: 0,
    panel_nr: 0
};
