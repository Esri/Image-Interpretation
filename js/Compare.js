///////////////////////////////////////////////////////////////////////////
// Copyright (c) 2017 Esri. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
    'dojo/_base/declare',
    "dijit/registry",
    "dojo/_base/lang",
    "dojo/dom", "dojo/Evented",
    'dojo/dom-construct',
    "esri/dijit/LayerSwipe",
    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dojo/dom-style", "dojo/html",
    "dijit/form/Select"

],
        function (
                declare,
                registry,
                lang,
                dom, Evented,
                domConstruct,
                LayerSwipe, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, domStyle, html) {
            return declare("application.Compare", [Evented], {
                constructor: function (parameters) {
                    var defaults = {
                        map: null,
                        compareTool: null,
                        i18n: null
                    };
                    lang.mixin(this, defaults, parameters);
                },
                layerInfos: [],
                primaryLayerIndex: null,
                secondaryLayerIndex: null,
                primaryLayer: null,
                secondaryLayer: null,
                layerSwipe: null,
                layerList: null,
                previousPrimary: {id: null, renderingRule: null, mosaicRule: null},
                previousSecondary: {id: null, renderingRule: null, mosaicRule: null},
                onOpen: function () {
                    this.refreshData();
                    if (this.map)
                        this.refreshHandler = this.map.on("update-end", lang.hitch(this, this.refreshData));

                },
                onClose: function () {
                    if (this.refreshHandler) {
                        this.refreshHandler.remove();
                        this.refreshHandler = null;
                    }
                    if (this.layerSwipe) {
                        this.layerSwipe.destroy();
                        this.layerSwipe = null;
                    }
                    if (this.layerSwipeHorizontal) {
                        this.layerSwipeHorizontal.destroy();
                        this.layerSwipeHorizontal = null;
                    }
                    this.previousPrimary = {id: null, renderingRule: null, mosaicRule: null};
                    this.previousSecondary = {id: null, renderingRule: null, mosaicRule: null};
                    this.map.onUpdateEnd();
                },
                refreshData: function () {
                    if (this.map.layerIds) {

                        if (this.map.resultLayer || this.map.getLayer("resultLayer")) {
                            this.resultLayer = this.map.resultLayer ? this.map.getLayer(this.map.resultLayer) : this.map.getLayer("resultLayer");
                            if (this.resultLayer.visible) {
                                if (this.compareTool === "slider")
                                    domStyle.set("resultOpacity", "display", "block");
                                else {
                                    domStyle.set("resultOpacity", "display", "none");
                                    if (!this.layerSwipeHorizontal) {
                                        this.createHorizontalSwipe();
                                    }

                                }
                            } else {
                                this.resultLayer = null;
                                domStyle.set("resultOpacity", "display", "none");
                                if (this.layerSwipeHorizontal) {
                                    this.layerSwipeHorizontal.destroy();
                                    this.layerSwipeHorizontal = null;
                                }
                            }
                        } else {
                            this.resultLayer = null;
                            domStyle.set("resultOpacity", "display", "none");
                            if (this.layerSwipeHorizontal) {
                                this.layerSwipeHorizontal.destroy();
                                this.layerSwipeHorizontal = null;
                            }
                        }
                        if (this.map.primaryLayer && this.map.getLayer(this.map.primaryLayer).visible) {
                            this.primaryLayer = this.map.getLayer(this.map.primaryLayer);
                            if (this.map.secondaryLayer && this.map.getLayer(this.map.secondaryLayer).visible) {
                                this.secondaryLayer = this.map.getLayer(this.map.secondaryLayer);
                            } else
                                this.secondaryLayer = null;
                        } else if (this.map.secondaryLayer && this.map.getLayer(this.map.secondaryLayer).visible) {
                            this.secondaryLayer = this.map.getLayer(this.map.secondaryLayer);
                            this.primaryLayer = null;
                        } else {
                            this.primaryLayer = null;
                            this.secondaryLayer = null;

                            for (var i = this.map.layerIds.length - 1; i >= 0; i--) {
                                var layer = this.map.getLayer(this.map.layerIds[i]);
                                if (layer && layer.visible && layer.serviceDataType && layer.serviceDataType.substr(0, 16) === "esriImageService" && layer.id !== this.map.resultLayer && layer.id !== "resultLayer") {
                                    this.primaryLayer = layer;
                                    break;
                                }
                            }
                            for (var j = this.map.layerIds.length - 1; j >= 0; j--) {
                                var layer = this.map.getLayer(this.map.layerIds[j]);
                                if (layer && layer.visible && layer.serviceDataType && layer.serviceDataType.substr(0, 16) === "esriImageService" && layer.id !== this.map.resultLayer && layer.id !== "resultLayer" && this.primaryLayer && layer.id !== this.primaryLayer.id) {
                                    this.secondaryLayer = layer;
                                    break;
                                }
                            }

                        }
                        if (this.secondaryLayer)
                            var secTitle = this.secondaryLayer.title ? this.secondaryLayer.title : (this.secondaryLayer.arcgisProps && this.secondaryLayer.arcgisProps.title) ? this.secondaryLayer.arcgisProps.title : (this.secondaryLayer.name || this.secondaryLayer.id);
                        else
                            var secTitle = "Basemap";

                        if (this.primaryLayer)
                            var priTitle = this.primaryLayer.title ? this.primaryLayer.title : (this.primaryLayer.arcgisProps && this.primaryLayer.arcgisProps.title) ? this.primaryLayer.arcgisProps.title : (this.primaryLayer.name || this.primaryLayer.id);
                        else
                            var priTitle = "Basemap";

                        if (this.resultLayer) {
                            if (this.compareTool === "slider")
                                html.set(document.getElementById("resultLayerDescription"), this.i18n.slider + ":<br/><b>" + (this.resultLayer.title || this.resultLayer.name || this.resultLayer.id) + "</b><br/>  VS     <b>" + ((priTitle === "Basemap" && secTitle !== priTitle) ? secTitle : priTitle) + "</b><br>");
                            else {
                                html.set(document.getElementById("resultLayerDescription"), this.i18n.hSwipe + ":<br/><b>" + (this.resultLayer.title || this.resultLayer.name || this.resultLayer.id) + "</b><br/>  VS     <b>" + ((priTitle === "Basemap" && secTitle !== priTitle) ? secTitle : priTitle) + "</b><br>");
                            }
                            registry.byId("resultOpacity").set("value", 1 - this.resultLayer.opacity);
                        } else
                            html.set(document.getElementById("resultLayerDescription"), "");



                        if (!this.primaryLayer && !this.secondaryLayer && !this.resultLayer)
                            html.set(document.getElementById("noLayerNotification"), this.i18n.error);

                        if (this.primaryLayer) {
                            if (this.previousPrimary.id !== this.primaryLayer.id || (this.primaryLayer.serviceDataType && this.primaryLayer.serviceDataType.substr(0, 16) === "esriImageService" && (this.previousPrimary.renderingRule !== this.primaryLayer.renderingRule || this.previousPrimary.mosaicRule !== this.primaryLayer.mosaicRule)) || !this.layerSwipe) {

                                this.invert = true;
                                this.setSwipe(priTitle, secTitle);
                            } else if (this.secondaryLayer && (this.previousSecondary.id !== this.secondaryLayer.id || (this.secondaryLayer.serviceDataType && this.secondaryLayer.serviceDataType.substr(0, 16) === "esriImageService" && (this.previousSecondary.renderingRule !== this.secondaryLayer.renderingRule || this.previousSecondary.mosaicRule !== this.secondaryLayer.mosaicRule)))) {

                                this.invert = true;
                                this.setSwipe(priTitle, secTitle);
                            }
                        } else if (this.secondaryLayer) {
                            if (this.previousPrimary.id !== this.primaryLayer || (this.previousSecondary.id !== this.secondaryLayer.id || (this.secondaryLayer.serviceDataType && this.secondaryLayer.serviceDataType.substr(0, 16) === "esriImageService" && (this.previousSecondary.renderingRule !== this.secondaryLayer.renderingRule || this.previousSecondary.mosaicRule !== this.secondaryLayer.mosaicRule))) || !this.layerSwipe) {

                                this.invert = false;
                                this.setSwipe(priTitle, secTitle);
                            }
                        } else if (this.layerSwipe) {
                            html.set(document.getElementById("compareLayerDescription"), "");
                            this.layerSwipe.destroy();
                            this.layerSwipe = null;
                            this.map.onUpdateEnd();
                        }
                    }

                },
                postCreate: function () {
                    registry.byId("resultOpacity").on("change", lang.hitch(this, this.changePrimaryOpacity));
                },
                changePrimaryOpacity: function (value) {
                    if (this.resultLayer)
                        this.resultLayer.setOpacity(1 - value);
                },
                setSwipe: function (priTitle, secTitle) {
                    if (document.getElementById("swipewidget") && this.layerSwipe)
                        this.layerSwipe.destroy();
                    html.set(document.getElementById("noLayerNotification"), "");
                    domConstruct.place("<div id='swipewidget'></div>", "mapDiv_root", "first");
                    var layers = [];
                    if (priTitle === secTitle && priTitle === "Basemap") {
                        html.set(document.getElementById("compareLayerDescription"), "");
                    } else if (priTitle === secTitle && this.primaryLayer.id === this.secondaryLayer.id) {
                        html.set(document.getElementById("compareLayerDescription"), this.i18n.vSwipe + ":<br/><b>" + priTitle + "</b><br/>  VS     <b>Basemap</b><br>");
                    } else if (priTitle === secTitle) {
                        html.set(document.getElementById("compareLayerDescription"), this.i18n.vSwipe + ":<br/><b>" + priTitle + "</b><br/>  VS     <b>Basemap</b><br>");
                    } else {
                        if (priTitle !== "Basemap")
                            html.set(document.getElementById("compareLayerDescription"), this.i18n.vSwipe + ":<br/><b>" + priTitle + "</b><br/>  VS     <b>" + secTitle + "</b><br>");
                        else
                            html.set(document.getElementById("compareLayerDescription"), this.i18n.vSwipe + ":<br/><b>" + secTitle + "</b><br/>  VS     <b>" + priTitle + "</b><br>");
                    }
                    if (this.secondaryLayer && this.primaryLayer && (!this.primaryLayer.serviceDataType || !this.secondaryLayer.serviceDataType || this.primaryLayer.serviceDataType.substr(0, 16) !== "esriImageService" || this.secondaryLayer.serviceDataType.substr(0, 16) !== "esriImageService" || ((this.secondaryLayer.renderingRule !== this.primaryLayer.renderingRule) || this.secondaryLayer.mosaicRule !== this.primaryLayer.mosaicRule))) {

                        for (var a in this.map.layerIds) {
                            if (this.map.layerIds[a] === this.primaryLayer.id)
                            {
                                var primaryIndex = parseInt(a);
                            }
                            if (this.map.layerIds[a] === this.secondaryLayer.id)
                            {
                                var secondaryIndex = parseInt(a);
                            }
                        }

                        if (primaryIndex > secondaryIndex) {
                            for (var a = primaryIndex; a > secondaryIndex; a--) {

                                layers.push(this.map.getLayer(this.map.layerIds[a]));

                            }
                        } else {

                            for (var a = secondaryIndex; a > primaryIndex; a--) {
                                layers.push(this.map.getLayer(this.map.layerIds[a]));
                            }
                        }
                    } else
                    {
                        if (this.primaryLayer && this.secondaryLayer && this.secondaryLayer.id !== this.primaryLayer.id) {
                            document.getElementById("noLayerNotification").innerHTML = "<br />" + this.i18n.identicalLayerError;
                            layers.push(this.primaryLayer);
                            layers.push(this.secondaryLayer);
                            var priTitle = this.primaryLayer.title ? this.primaryLayer.title : (this.primaryLayer.arcgisProps && this.primaryLayer.arcgisProps.title) ? this.primaryLayer.arcgisProps.title : (this.primaryLayer.name || this.primaryLayer.id);
                            html.set(document.getElementById("compareLayerDescription"), this.i18n.vSwipe + ":<br/><b>" + priTitle + "</b><br/>  VS     <b>Basemap</b><br>");
                        } else if (this.primaryLayer)
                            layers.push(this.primaryLayer);
                        else if (this.secondaryLayer)
                            layers.push(this.secondaryLayer);

                    }

                    if (layers.length > 0) {
                        this.layerSwipe = new LayerSwipe({
                            type: "vertical",
                            map: this.map,
                            left: parseInt(this.map.width / 2),
                            invertPlacement: this.invert,
                            layers: layers
                        }, dom.byId("swipewidget"));
                        this.layerSwipe.startup();
                    }

                    this.previousPrimary = this.primaryLayer ? {id: (this.primaryLayer.id || null), renderingRule: (this.primaryLayer.renderingRule || null), mosaicRule: (this.primaryLayer.mosaicRule || null)} : {id: null, renderingRule: null, mosaicRule: null};
                    this.previousSecondary = this.secondaryLayer ? {id: (this.secondaryLayer.id || null), renderingRule: (this.secondaryLayer.renderingRule || null), mosaicRule: (this.secondaryLayer.mosaicRule || null)} : {id: null, renderingRule: null, mosaicRule: null};
                    this.map.onUpdateEnd();

                },
                createHorizontalSwipe: function () {

                    if (document.getElementById("swipewidgetHorizontal") && this.layerSwipeHorizontal)
                        this.layerSwipeHorizontal.destroy();
                    domConstruct.place("<div id='swipewidgetHorizontal'></div>", "mapDiv_root", "first");
                    registry.byId("resultOpacity").set("value", 0);
                    if (this.resultLayer) {
                        this.layerSwipeHorizontal = new LayerSwipe({
                            type: "horizontal",
                            top: parseInt(this.map.height / 2),
                            map: this.map,
                            layers: [this.resultLayer]
                        }, dom.byId("swipewidgetHorizontal"));
                        this.layerSwipeHorizontal.startup();
                    }


                }




            });


        });