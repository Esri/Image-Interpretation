///////////////////////////////////////////////////////////////////////////
// Copyright (c) 2013 Esri. All Rights Reserved.
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
    "dojo/_base/lang", "dojo/query",
    "dojo/dom", "dojo/Evented",
    'dojo/dom-construct',
    'esri/dijit/LayerList',
    "dojo/dom-style",
    "dojo/html"


],
        function (
                declare,
                registry,
                lang, query,
                dom, Evented,
                domConstruct,
                LayerList,
                domStyle,
                html) {
            return declare("application.OperationalLayers", [Evented], {
                constructor: function (parameters) {
                    var defaults = {
                        map: null,
                        layers: [],
                        i18n: null
                    };
                    lang.mixin(this, defaults, parameters);
                },
                layerList: null,
                onOpen: function () {
                    if (this.layerList)
                        this.layerList.refresh();
                },
                onClose: function () {
                },
                postCreate: function () {
                    if (this.layers.length > 0) {

                        this.layerList = new LayerList({
                            map: this.map,
                            showLegend: true,
                            showSubLayers: true,
                            showOpacitySlider: true,
                            layers: this.layers,
                            removeUnderscores: true
                        }, "operationalLayerList").startup();

                        var nodes = query(".esriLayerList .esriCheckbox");
                        for (var a = 0; a < nodes.length; a++) {
                            nodes[a].tabIndex = 1;
                        }
                        var nodes = query(".esriToggleButton.esri-icon-right");
                        for (var a = 0; a < nodes.length; a++) {
                            nodes[a].tabIndex = 1;
                        }
                        var nodes = query(".esriLayerList .dijitSliderImageHandle");
                        for (var a = 0; a < nodes.length; a++) {
                            nodes[a].tabIndex = 1;
                        }
                        nodes = query(".esriLayerList .esriTabMenu .esriTabMenuItem");
                        for (a = 0; a < nodes.length; a++) {
                            nodes[a].tabIndex = 1;
                        }
                        this.map.on("update-end", lang.hitch(this, function () {
                            if (this.layerList)
                                this.layerList.refresh();
                        }));
                    } else {
                        html.set(document.getElementById("operationalLayerList"), this.i18n.error);
                    }
                }

            });


        });