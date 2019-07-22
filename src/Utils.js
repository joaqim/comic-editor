import React from 'react'
 

export function loadPanels(page) {
    let panels = [];
    Object.keys(page['panels']).forEach(function(key) {
        //Ensure that the key contais number
        if(!isNaN(key)) { 
            //Ensure that the value is an object
            let val = page['panels'][key];
            if (typeof val == 'object') {
                //val.key = key;
                panels[key] = val;
            }
        }
    });
    return panels
}

export function getImagesArray(comic, hq=false) {
    let images = [];
    Object.keys(comic).forEach(function(page_nr) {
        Object.keys(comic[page_nr]).forEach(function(key) {
            if(hq && key == 'filename_hq') {
                images[parseInt(page_nr)] = {
                    key: parseInt(page_nr),
                    src: comic[page_nr]['filename_hq']
                }
            } else
            if(key == 'filename') {
                images[parseInt(page_nr)] = {
                    key: parseInt(page_nr),
                    src: comic[page_nr]['filename']
                }
            }
        });
    });
    return images;
}

export function getScaledImageCoordinates(
    containerWidth,
    containerHeigh,
    width,
    height,
) {
    var widthRatio = (containerWidth) / width,
        heightRatio = (containerHeight) / height
    var bestRatio = Math.min(widthRatio, heightRatio)
    var newWidth = width * bestRatio,
        newHeight = height * bestRatio
    return {newWidth, newHeight}
}

