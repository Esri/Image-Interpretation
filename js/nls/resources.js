/*global define */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
    root: ({
        map: {
            error: "Unable to create map"
        },
        nav: {
            "close": "Close"
        },
        basemap: {
          title: "Basemap Gallery"
          
        },
        operationalLayers: {
          title: "Operational Layers",
          error: "No operational layers in the map."
        },
        layerSelector: {
            active: "Active Layer",
            comparison: "Comparison Layer",
            other: "Other",
            result: "Result",
            title: "Layer Selector",
            resultSave: "Add the Result layer in the comparison layer list",
            copy: "Copy active layer to comparison layer.",
            swap: "Swap active and comparison layer.",
            layerError: "Layer is set as Active Layer. Please select different layer."
        },
        renderer: {
            title: "Renderer",
            stretch: "Stretch Parameters",
            stretchType: "Stretch Type",
            dra: "DRA",
            draText: "Dynamic Range Adjustment updates enhancement based on current view",
            gamma: "Gamma",
            apply: "Apply",
            top: "Exclude top",
            bottom: "Exclude bottom",
            topText: " Exclude top x percentage of histogram",
            bottomText: " Exclude bottom x percentage of histogram",
            stdDev: "# of Std. Dev",
            layer: "Current Layer",
            error: "No visible Imagery Layers in the map."
        },
        imageSelector: {
            title: "Image Selector",
            enable: "Enable Image Selector",
            secondary: "Set Active as Comparison Layer.",
            dropDown: "Show images in drop down list.",
            refresh: "Refresh query based on current extent.",
            show: "Show",
            age: "Age",
            zoom: "Zoom in to select images.",
            error: "No visible Imagery Layers in the map.",
            error1: "Field is not specified.",
            error2: "No OBJECTID field.",
            error3: "No Category field.",
            error4: "Cannot perform action for layer.",
            error5: "Services pre 10.2.1 not supported.",
            error6: "No scenes in current extent.",
            error7: "Number of footprints selected exceed 20. Only first 20 will be displayed. Press OK not to warn again.",
            slider: "Show images on slider."
        },
        changeDetection: {
            title: "Change Detection",
            mode: "Mode",
            method: "Method",
            positive: "Positive Difference",
            negative: "Negative Difference",
            threshold: "Threshold",
            difference: "Difference",
            apply: "Apply",
            error: "Change Detection works with two image from different dates from the same service.<br />First use Image Selector to define one image, then click on the <img src='images/down.png' height='14'/> button and select the second image.<br />Return to this control to proceed with change detection."
        },
        editor: {
            title: "Editor",
            error: "No Edit Layer selected.",
            error1: "Access denied. Layers cannot be edited."
        },
        measurement: {
            title: "Image Measurement",
            error: "Mensuration Capabilities not supported."
        },
        export: {
            title: "Export",
            mode: "Mode",
            titleText: "Title",
            description: "Description",
            tags: "Tags",
            submit: "Submit",
            pixel: "Pixel Size",
            outsr: "Output Spatial Reference",
            renderer: "Current Renderer",
            extent: "Define Extent",
            text: "If Current Renderer is checked, the rendering<br /> is exported, else the original data values<br/>will be exported.",
            error: "No visible imagery layers on the map.",
            error1: "Title is required.",
            error2: "Tag(s) is required."

        },
        compare: {
            title: "Compare",
            slider: "Transparency Slider",
            hSwipe: "Horizontal Swipe",
            vSwipe: "Vertical Swipe",
            error: "No visible Imagery Layers available for comparison.",
            identicalLayerError: "Active and Comparison Layer are identical."
        }
    }),
    "ar": 1,
    "cs": 1,
    "da": 1,
    "de": 1,
    "es": 1,
    "et": 1,
    "fi": 1,
    "fr": 1,
    "he": 1,
    "hr": 1,
    "it": 1,
    "ja": 1,
    "ko": 1,
    "lt": 1,
    "lv": 1,
    "nl": 1,
    "nb": 1,
    "pl": 1,
    "pt-br": 1,
    "pt-pt": 1,
    "ro": 1,
    "ru": 1,
    "su": 1,
    "sr": 1,
    "sv": 1,
    "tr": 1,
    "th": 1,
    "vi": 1,
    "zh-cn": 1,
    "zh-hk": 1,
    "zh-tw": 1
});
