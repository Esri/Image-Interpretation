///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
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
    'dojo/_base/declare', "dojo/Evented", "dojo/_base/lang", "dojo/dom-style", "dojo/dom-construct",
    'esri/dijit/ImageServiceMeasure', "dojo/query"
],
        function (
                declare,
                Evented, lang, domStyle, domConstruct,
                JSImageServiceMeasure, query) {

            return declare("application.Measurement", [Evented], {
                constructor: function (parameters) {
                    var defaults = {
                        map: null,
                        config: null
                    };
                    lang.mixin(this, defaults, parameters);
                },
                imageServiceMeasureWidget: null,
                postCreate: function () {
                    this.inherited(arguments);
                    this.map.on("update-end", lang.hitch(this, this.refreshData));

                },
                createMeasureTool: function () {
                    this.imageServiceMeasureWidget = new JSImageServiceMeasure({
                        map: this.map,
                        layer: this.layer,
                        displayMeasureResultInPopup: this.config.displayMeasureResultInPopup,
                        layout: "toolbar",
                        linearUnit: this.config.linearUnit,
                        angularUnit: this.config.angularUnit,
                        areaUnit: this.config.areaUnit
                    }, "measureWidgetDiv");

                    this.imageServiceMeasureWidget.startup();
                    this.imageServiceMeasureWidget.measureToolbar.on("measure-end", lang.hitch(this, function (response) {
                        if (response.measureResult.hasOwnProperty('height')) {
                            this.map.measuredHeight = response.measureResult.height.value;
                        }
                    }));
                  
                },
                onOpen: function () {
                    this.refreshData();
                    if (this.imageServiceMeasureWidget)
                        this.imageServiceMeasureWidget.startup();

                },
                onClose: function () {
                    if (this.imageServiceMeasureWidget)
                        this.imageServiceMeasureWidget.deactivate();

                },
                refreshData: function () {
                    this.layer = null;
                    if (this.map.primaryLayer) {
                        this.layer = this.map.getLayer(this.map.primaryLayer).mensurationCapabilities ? this.map.getLayer(this.map.primaryLayer) : null;
                    } else {

                        for (var a = this.map.layerIds.length - 1; a >= 0; a--) {


                            var layer = this.map.getLayer(this.map.layerIds[a]);
                            if (layer && layer.serviceDataType && layer.serviceDataType.substr(0, 16) === "esriImageService" && layer.id !== this.map.resultLayer && layer.id !== "resultLayer" && layer.mensurationCapabilities) {

                                this.layer = layer;
                                break;
                            }

                        }
                    }
                    if (this.layer) {
                        if (!this.imageServiceMeasureWidget)
                            this.createMeasureTool();
                        else {
                            if (this.imageServiceMeasureWidget.layer.url !== this.layer.url) {
                                this.imageServiceMeasureWidget.destroy();
                                domConstruct.place("<div id='measureWidgetDiv' style='color:red;'></div>", "measurementDivContainer", "first");
                                this.createMeasureTool();
                            }
                        }

                    }
                    // }
                    if (!this.layer) {
                        domStyle.set("errorMeasurementDiv", "display", "block");
                        domStyle.set("measureWidgetDiv", "display", "none");
                    } else {
                        domStyle.set("errorMeasurementDiv", "display", "none");
                        domStyle.set("measureWidgetDiv", "display", "block");
                    }
                }
            });


        });