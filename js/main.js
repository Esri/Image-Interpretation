/*global define,document */
/*jslint sloppy:true,nomen:true */
/*
 | Copyright 2017 Esri
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
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/kernel",
    "dojo/on",
    "dojo/query", "dijit/focus",
    "dojo/Deferred",
    "esri/dijit/Scalebar",
    "esri/dijit/Search", "esri/tasks/locator", "application/SearchSources",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style", "dojo/html",
    "dojo/dom-class",
    "dijit/Dialog", "dojo/parser",
    "dijit/registry",
    "dojo/text!application/templates/Renderer.html", "dojo/text!application/templates/Export.html", "dojo/text!application/templates/Compare.html",
    "dojo/text!application/templates/LayerSelector.html", "dojo/text!application/templates/ImageSelector.html", "dojo/text!application/templates/ChangeDetection.html",
    "dijit/Tooltip",
    "esri/arcgis/utils",
    "application/MapUrlParams",
    "application/Compare", "application/Editor", "application/Basemap", "application/Renderer", "application/OperationalLayers", "application/Export", "application/Measurement", "application/LayerSelector", "application/ImageDate", "application/ImageSelector", "application/ChangeDetection",
    "dojo/domReady!"
], function (
        declare, lang, kernel,
        on, query, focus,
        Deferred, Scalebar, Search, Locator, SearchSources,
        dom, domConstruct, domStyle, html, domClass, Dialog, parser,
        registry, rendererHtml, exportHtml, compareHtml, layerSelectorHtml, imageSelectorHtml, changeDetectionHtml, Tooltip,
        arcgisUtils,
        MapUrlParams, Compare, Editor, Basemap, Renderer, OperationalLayers, Export, Measurement, LayerSelector, ImageDate, ImageSelector, ChangeDetection
        ) {
    return declare(null, {
        config: {},
        containers: [],
        regExp: /\$([^}]+)\}/g,
        startup: function (config) {
            // Set lang attribute to current locale
            document.documentElement.lang = kernel.locale;

            var promise;
            // config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information.

            if (config) {
                this.config = config;
                if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
                    var sharedTheme = this.config.sharedThemeConfig.attributes;
                    this.config.color = sharedTheme.theme.text.color;
                    this.config.background = sharedTheme.theme.body.bg;
                }
                document.getElementById("titleContainer").style.backgroundColor = this.config.background;
                document.getElementById("dockContainer").style.backgroundColor = this.config.background;


                document.getElementById("titleContainer").style.opacity = this.config.backgroundOpacity;

                document.getElementById("dockContainer").style.opacity = this.config.backgroundOpacity;
                document.getElementById("titleText").style.color = this.config.color;
                document.getElementById("primaryDate").style.color = this.config.color;


                var toolContainers = document.getElementsByClassName("toolContainers");
                for (var a = 0; a < toolContainers.length; a++) {
                    toolContainers[a].style.borderBottomColor = this.config.background;
                }
                // Create and add custom style sheet
                if (this.config.customstyle) {
                    var style = document.createElement("style");
                    style.appendChild(document.createTextNode(this.config.customstyle));
                    document.head.appendChild(style);
                }
                dom.byId("titleText").innerHTML = this.config.title ? this.config.title : "Image Interpretation";
                new Tooltip({
                    connectId: ["titleText"],
                    label: this.config.description,
                    position: ['below']
                });

                if (this.config.customstyle) {
                    var style = document.createElement("style");
                    style.appendChild(document.createTextNode(this.config.customstyle));
                    document.head.appendChild(style);
                }

                //supply either the webmap id or, if available, the item info
                var itemInfo = this.config.itemInfo || this.config.webmap;
                // Check for center, extent, level and marker url parameters.
                var mapParams = new MapUrlParams({
                    center: this.config.center || null,
                    extent: this.config.extent || null,
                    level: this.config.level || null,
                    marker: this.config.marker || null,
                    mapSpatialReference: itemInfo.itemData.spatialReference,
                    defaultMarkerSymbol: this.config.markerSymbol,
                    defaultMarkerSymbolWidth: this.config.markerSymbolWidth,
                    defaultMarkerSymbolHeight: this.config.markerSymbolHeight,
                    geometryService: this.config.helperServices.geometry.url
                });

                mapParams.processUrlParams().then(lang.hitch(this, function (urlParams) {
                    promise = this._createWebMap(itemInfo, urlParams);
                }), lang.hitch(this, function (error) {
                    this.reportError(error);
                }));



            } else {
                var error = new Error("Main:: Config is not defined");
                this.reportError(error);
                var def = new Deferred();
                def.reject(error);
                promise = def.promise;
            }
            return promise;
        },
        reportError: function (error) {
            // remove loading class from body
            domClass.remove(document.body, "app-loading");
            domClass.add(document.body, "app-error");
            // an error occurred - notify the user. In this example we pull the string from the
            // resource.js file located in the nls folder because we've set the application up
            // for localization. If you don't need to support multiple languages you can hardcode the
            // strings here and comment out the call in index.html to get the localization strings.
            // set message
            var node = dom.byId("loading_message");
            if (node) {
                if (this.config && this.config.i18n) {
                    node.innerHTML = this.config.i18n.map.error + ": " + error.message;
                } else {
                    node.innerHTML = "Unable to create map: " + error.message;
                }
            }
            return error;
        },
        // create a map based on the input web map id
        _createWebMap: function (itemInfo, params) {
            // set extent from config/url

            //enable/disable the slider
            params.mapOptions.slider = this.config.mapZoom;
            params.mapOptions.sliderPosition = "top-right";
            domClass.add(document.body, "slider-" + this.config.mapZoom);

            // create webmap from item
            return arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: params.mapOptions,
                usePopupManager: true,
                layerMixins: this.config.layerMixins || [],
                editable: true,
                bingMapsKey: this.config.orgInfo.bingKey || ""
            }).then(lang.hitch(this, function (response) {
                this.map = response.map;
                document.title = this.config.title || response.itemInfo.item.title;

                this.config.response = response;

                // remove loading class from body
                domClass.remove(document.body, "app-loading");

                domConstruct.place('<img id="loadingMap" style="position: absolute;top:0;bottom: 0;left: 0;right: 0;margin:auto;z-index:100;display:none;" src="images/loading.gif">', this.map.container);
                this.map.on("update-start", lang.hitch(this, this.showLoading));
                this.map.on("update-end", lang.hitch(this, this.hideLoading));
                window.addEventListener("resize", lang.hitch(this, this.resizeTemplate));
                if (this.config.basemapFlag) {
                    domStyle.set("basemapContainer", "display", "block");
                    this.setupBasemap();
                } else
                    domStyle.set("basemapContainer", "display", "none");
                if (this.config.operationalLayersFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupOperationalLayers();
                } else
                    domStyle.set("operationalLayersContainer", "display", "none");
                if (this.config.layersFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupLayers();
                } else
                    domStyle.set("layerSelectorContainer", "display", "none");
                if (this.config.rendererFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupRenderer();
                } else
                    domStyle.set("rendererContainer", "display", "none");
                if (this.config.imageSelectorFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupImageSelector();
                } else {
                    domStyle.set("imageSelectorContainer", "display", "none");
                }
                if (this.config.changeDetectionFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupChangeDetection();
                } else
                    domStyle.set("changeDetectionContainer", "display", "none");
                if (this.config.exportFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupExport();
                } else
                    domStyle.set("exportContainer", "display", "none");
                if (this.config.imageDateFlag)
                    this.setupImageDate();
                if (this.config.measurementFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupImageMeasurement();
                } else
                    domStyle.set("measurementContainer", "display", "none");
                if (this.config.editFlag) {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupEditor();
                } else
                    domStyle.set("editorContainer", "display", "none");
                if (this.config.compareFlag)
                {
                    domStyle.set("dockContainer", "display", "block");
                    this.setupCompare();
                } else
                    domStyle.set("compareContainer", "display", "none");

                this.setVisibilityEventOnImageryLayer();
                this._setupAppTools();
                this._updateTheme();
                registry.byId("toolsContentContainer").show();
                this.resizeTemplate();
                dojo.connect(registry.byId("toolsContentContainer"), "hide", lang.hitch(this, function (event) {
                    var left = document.getElementById("toolsContentContainer").style.left;
                    var top = document.getElementById("toolsContentContainer").style.top;
                    registry.byId("toolsContentContainer").show();
                    domStyle.set("toolsContentContainer", "top", top);
                    domStyle.set("toolsContentContainer", "left", left);
                    var toolNodesActive = document.getElementsByClassName("selected-widget");
                    if (toolNodesActive.length > 1) {
                        for (var a = 0; a < toolNodesActive.length; a++) {
                            if (toolNodesActive[a].id !== "compareContainer")
                                toolNodesActive[a].click();
                            setTimeout(function () {
                                focus.focus(dom.byId("compareContainer"))
                            }, 100);
                        }

                    } else if (toolNodesActive.length > 0) {
                        var id = toolNodesActive[0].id;
                        toolNodesActive[0].click();
                        setTimeout(function () {
                            focus.focus(dom.byId(id))
                        }, 1500);
                    }
                }));
                return response;
            }), this.reportError);
        },
        resizeTemplate: function () {
            if (window.innerWidth > 1200) {
                document.getElementsByTagName("BODY")[0].style.fontSize = "14px";
                document.getElementById("dockContainer").style.top = "39px";
                document.getElementById("mapDiv").style.marginTop = "39px";
                document.getElementById("mapDiv").style.height = "calc(100% - 39px)";
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "80px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 80px)";

                }

                domConstruct.destroy("toolsContentContainer_underlay");
                domStyle.set("toolsContentContainer", "top", "45px");
                domStyle.set("toolsContentContainer", "left", "85px");

                this.resizeDockContainer("80px", "30px", "25px", "39px", "16px", "5px 9px", "15px", "5px", "-6px", "14px", "3px 2px", "100px", "67px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked");
                }
                this.currentPanelClass = "toolsContentContainerClicked";

            } else if (window.innerWidth > 1000) {
                document.getElementsByTagName("BODY")[0].style.fontSize = "12px";
                document.getElementById("dockContainer").style.top = "35px";
                document.getElementById("mapDiv").style.marginTop = "35px";
                document.getElementById("mapDiv").style.height = "calc(100% - 35px)";
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "60px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 60px)";

                }
                domStyle.set("toolsContentContainer", "top", "40px");
                domStyle.set("toolsContentContainer", "left", "65px");
                this.resizeDockContainer("60px", "26px", "17px", "35px", "14px", "4px 7px", "14px", "4px", "-6px", "14px", "3px 2px", "80px", "57px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked2");
                }
                this.currentPanelClass = "toolsContentContainerClicked2";

            } else if (window.innerWidth > 800) {
                document.getElementsByTagName("BODY")[0].style.fontSize = "10px";
                document.getElementById("dockContainer").style.top = "31px";
                document.getElementById("mapDiv").style.marginTop = "31px";
                document.getElementById("mapDiv").style.height = "calc(100% - 31px)";
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "40px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 40px)";

                }
                domStyle.set("toolsContentContainer", "top", "36px");
                domStyle.set("toolsContentContainer", "left", "45px");
                this.resizeDockContainer("40px", "20px", "10px", "31px", "13px", "3px 5px", "13px", "3px", "-7px", "13px", "2px 2px", "80px", "52px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked3");
                }
                this.currentPanelClass = "toolsContentContainerClicked3";

            } else if (window.innerWidth > 600) {
                document.getElementsByTagName("BODY")[0].style.fontSize = "8px";
                document.getElementById("dockContainer").style.top = "27px";
                document.getElementById("mapDiv").style.marginTop = "27px";
                document.getElementById("mapDiv").style.height = "calc(100% - 27px)";
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "30px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 30px)";

                }
                domStyle.set("toolsContentContainer", "top", "32px");
                domStyle.set("toolsContentContainer", "left", "35px");
                this.resizeDockContainer("30px", "16px", "7px", "27px", "12px", "2px 4px", "11px", "2px", "-8px", "12px", "1px 2px", "70px", "52px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked4");
                }
                this.currentPanelClass = "toolsContentContainerClicked4";

            } else if (window.innerWidth > 500) {
                document.getElementsByTagName("BODY")[0].style.fontSize = "6px";
                document.getElementById("dockContainer").style.top = "22px";
                document.getElementById("mapDiv").style.marginTop = "22px";
                document.getElementById("mapDiv").style.height = "calc(100% - 22px)";
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "25px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 25px)";

                }
                domStyle.set("toolsContentContainer", "top", "27px");
                domStyle.set("toolsContentContainer", "left", "30px");
                this.resizeDockContainer("25px", "13px", "6px", "22px", "11px", "1px 2px", "9px", "0px", "-8px", "11px", "0px 1px", "60px", "47px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked5");
                }
                this.currentPanelClass = "toolsContentContainerClicked5";

            } else {
                document.getElementsByTagName("BODY")[0].style.fontSize = "5px";
                document.getElementById("dockContainer").style.top = "21px";
                document.getElementById("mapDiv").style.marginTop = "21px";
                document.getElementById("mapDiv").style.height = "calc(100% - 21px)";
                domStyle.set("toolsContentContainer", "top", "26px");
                domStyle.set("toolsContentContainer", "left", "25px");
                if (domStyle.get("dockContainer", "display") === "block") {
                    document.getElementById("mapDiv").style.marginLeft = "20px";
                    document.getElementById("mapDiv").style.width = "calc(100% - 20px)";

                }
                this.resizeDockContainer("20px", "10px", "5px", "21px", "10px", "1px 1px", "8px", "0px", "-8px", "10px", "0px 1px", "50px", "42px");
                if (this.currentPanelClass) {
                    domClass.remove("toolsContentContainer", this.currentPanelClass);
                    domClass.add("toolsContentContainer", "toolsContentContainerClicked6");
                }
                this.currentPanelClass = "toolsContentContainerClicked6";

            }



        },
        resizeDockContainer: function (widthHeightValue, iconWH, iconMargin, titleHeight, checkBoxWH, buttonPadding, iconHeight, sliderHeight, sliderTop, sliderBtnWH, textBoxPadding, basemapImageW, basemapImageH) {
            query(".dijitButtonContents").style({
                "padding": buttonPadding
            });
            query(".dijitCheckBox").style({
                width: checkBoxWH,
                height: checkBoxWH
            });
            query(".iconHeight").style({
                height: iconHeight
            });
            query(".dijitSliderBumperH").style({
                height: sliderHeight
            });
            query(".dijitSliderImageHandleH").style({
                top: sliderTop
            });
            query(".dijitSliderBarH").style({
                height: sliderHeight
            });
            query(".dijitSliderButtonInner").style({
                lineHeight: sliderBtnWH
            });
            query(".dijitSliderIncrementIconH").style({
                width: sliderBtnWH,
                height: sliderBtnWH,
                lineHeight: sliderBtnWH

            });
            query(".esriBasemapGalleryThumbnail").style({
                width: basemapImageW,
                height: basemapImageH

            })

            query(".dijitSliderDecrementIconH").style({
                width: sliderBtnWH,
                height: sliderBtnWH,
                lineHeight: sliderBtnWH
            });
            var toolContainers = document.getElementsByClassName("toolContainers");
            var iconNodes = document.getElementsByClassName("iconNode");
            var titleBar = document.getElementsByClassName("titleBar");
            var spanTitleNode = document.getElementsByClassName("titleBarTextSpan");
            for (var a = 0; a < toolContainers.length; a++) {
                toolContainers[a].style.width = widthHeightValue;
                toolContainers[a].style.height = widthHeightValue;
                if (iconNodes[a]) {
                    iconNodes[a].style.width = iconWH;
                    iconNodes[a].style.height = iconWH;

                }
                if (titleBar[a])
                    titleBar[a].style.height = titleHeight;
                if (spanTitleNode[a]) {
                    spanTitleNode[a].style.lineHeight = titleHeight;
                }
            }

        },
        setVisibilityEventOnImageryLayer: function () {
            this.map.on("layer-add", lang.hitch(this, function (response) {
                response.layer.on("visibility-change", lang.hitch(this, function (value) {
                    if (!value.visible) {
                        this.map.onUpdateEnd();
                    }
                }))
            }));
            var layers = this.config.itemInfo.itemData.operationalLayers, layer;
            for (var a = layers.length - 1; a >= 0; a--) {
                var title = layers[a].title || layers[a].layerObject.name || layers[a].id;
                if ((title && (title.charAt(title.length - 1)) === "_") || (layers[a].layerObject && layers[a].layerObject.serviceDataType && layers[a].layerObject.serviceDataType.substr(0, 16) === "esriImageService") || (layers[a].layerType && layers[a].layerType === "ArcGISImageServiceLayer")) {
                    layer = this.map.getLayer(layers[a].id);
                    if (layer) {
                        layer.on("visibility-change", lang.hitch(this, function (value) {
                            if (!value.visible) {
                                this.map.onUpdateEnd();
                            }

                        }));
                    }
                }
            }
        },
        _setupAppTools: function () {

            if (this.config.scalebarFlag) {
                this.scalebar = new Scalebar({
                    map: this.map,
                    attachTo: this.config.scalebarPosition,
                    scalebarStyle: this.config.scalebarStyle,
                    scalebarUnit: this.config.scalebarUnit
                });

            }

            if (this.config.search) {

                if (!Search || !Locator) {
                    return;
                }

                var searchOptions = {
                    map: this.map,
                    useMapExtent: this.config.searchExtent,
                    itemData: this.config.response.itemInfo.itemData
                };

                if (this.config.searchConfig) {
                    searchOptions.applicationConfiguredSources = this.config.searchConfig.sources || [];
                } else {
                    var configuredSearchLayers = (this.config.searchLayers instanceof Array) ? this.config.searchLayers : JSON.parse(this.config.searchLayers);
                    searchOptions.configuredSearchLayers = configuredSearchLayers;
                    searchOptions.geocoders = this.config.locationSearch ? this.config.helperServices.geocode : [];
                }
                var searchSources = new SearchSources(searchOptions);
                var createdOptions = searchSources.createOptions();
                createdOptions.enableButtonMode = true;
                createdOptions.expanded = false;

                if (this.config.searchConfig && this.config.searchConfig.activeSourceIndex) {
                    createdOptions.activeSourceIndex = this.config.searchConfig.activeSourceIndex;
                }

                var search = new Search(createdOptions, domConstruct.create("div", {
                    id: "search"
                }, "mapDiv_root"));

                search.on("select-result", lang.hitch(this, function () {
                    on.once(this.map.infoWindow, "hide", lang.hitch(this, function () {
                        search.clearGraphics();

                        if (this.editorFunction && dom.byId("featureEditor")) {
                            this.editorFunction._destroyEditor();
                            this.editorFunction.createEditor();
                        }
                    }));
                }));
                this._updateTheme();

                search.startup();

                if (query(".searchBtn.searchToggle").length > 0)
                    query(".searchBtn.searchToggle")[0].tabIndex = -1;
                if (query(".arcgisSearch .searchGroup .searchInput").length > 0)
                    query(".arcgisSearch .searchGroup .searchInput")[0].tabIndex = -1;


            } else {
                domClass.add(document.body, "nosearch");
            }
        },
        setupBasemap: function () {
            var basemapDialog = new Dialog({
                title: this.config.i18n.basemap.title,
                content: "<div id='basemapGalleryDiv' style='overflow:auto;height:95%;'></div>",
                style: "background-color:white;border-radius:5px;width:300px;height:200px;",
                id: "basemapDialog",
                draggable: false
            });
            new Tooltip({
                connectId: ["basemapContainer"],
                label: this.config.i18n.basemap.title,
                position: ['before']
            });
            dojo.connect(basemapDialog, "hide", lang.hitch(this, function () {
                domClass.remove("basemapIconNode", "basemapSelected");

            }));
            this.basemapFunction = new Basemap({map: this.map});
            this.basemapFunction.initBasemaps();
            on(dom.byId("basemapContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("basemapIconNode", "basemapSelected")) {
                        domClass.remove("basemapIconNode", "basemapSelected");
                        if (registry.byId("basemapDialog").open)
                            registry.byId("basemapDialog").hide();
                    } else {
                        domClass.add("basemapIconNode", "basemapSelected");
                        registry.byId("basemapDialog").show();
                        domConstruct.destroy("basemapDialog_underlay");
                        domStyle.set("basemapDialog", "left", "auto");
                        domStyle.set("basemapDialog", "right", "20px");
                        domStyle.set("basemapDialog", "top", "220px");
                    }
                }
            }));
        },
        setupImageDate: function () {

            var layers = this.config.itemInfo.itemData.operationalLayers;
            var layer = [];
            if (this.config.imageDateLayer) {
                this.config.imageDateLayer = JSON.parse(this.config.imageDateLayer);
                for (var a = 0; a < layers.length; a++) {
                    for (var b = 0; b < this.config.imageDateLayer.length; b++) {
                        if (this.config.imageDateLayer[b].id === layers[a].id && this.config.imageDateLayer[b].fields.length > 0) {
                            var tempLayer = {
                                dateField: this.config.imageDateLayer[b].fields[0],
                                title: layers[a].title || layers[a].layerObject.name || layers[a].id
                            };
                            layer[layers[a].url.split("//")[1]] = tempLayer;
                            break;
                        }
                    }
                }
            }
            this.imageDate = new ImageDate({map: this.map, layers: layer});
            this.imageDate.postCreate();
            this.imageDate.onOpen();

        },
        setupOperationalLayers: function () {
            new Tooltip({
                connectId: ["operationalLayersContainer"],
                label: this.config.i18n.operationalLayers.title,
                position: ['after']
            });
            var node = domConstruct.create("div", {innerHTML: '<div class="titleBar"><span class="titleBarTextSpan">' + this.config.i18n.operationalLayers.title + '</span></div><br /><div style="margin: 5px;overflow: auto;"><div id="operationalLayerList"></div><br /></div>', id: "operationalLayersNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            var openForFirstTime = true;
            var layers = this.config.itemInfo.itemData.operationalLayers;
            var layersList = [];
            for (var a = layers.length - 1; a >= 0; a--) {
                var title = layers[a].title || layers[a].layerObject.name || layers[a].id;
                if ((title && (title.charAt(title.length - 1)) !== "_") && (title && (title.substr(title.length - 2)) !== "__") && ((layers[a].layerObject && layers[a].layerObject.serviceDataType && layers[a].layerObject.serviceDataType.substr(0, 16) !== "esriImageService") || (layers[a].layerType && layers[a].layerType !== "ArcGISImageServiceLayer"))) {
                    layersList.push({
                        layer: layers[a].layerObject,
                        title: layers[a].title,
                        visibility: layers[a].visibility
                    });
                }
            }

            this.operationalLayersFunction = new OperationalLayers({map: this.map, layers: layersList, i18n: this.config.i18n.operationalLayers});

            on(dom.byId("operationalLayersContainer"), "click", lang.hitch(this, function (event) {

                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("operationalLayersContainer", "selected-widget")) {
                        this.hideContentPanel();
                        domClass.remove("operationalLayersContainer", "selected-widget");
                        this.operationalLayersFunction.onClose();
                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();

                        this.openedWidget = "operationalLayersNode";
                        domClass.add("operationalLayersContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.operationalLayersFunction.postCreate();
                        }
                        this.operationalLayersFunction.onOpen();
                        domStyle.set("operationalLayersNode", "display", "block");

                    }
                }
            }));
        },
        setupLayers: function () {
            new Tooltip({
                connectId: ["layerSelectorContainer"],
                label: this.config.i18n.layerSelector.title,
                position: ['after']
            });
            layerSelectorHtml = this.findAndReplaceStrings(layerSelectorHtml, "layerSelector");
            var node = domConstruct.create("div", {innerHTML: layerSelectorHtml, id: "layerSelectorNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            var openForFirstTime = true;
            this.layerSelectorFunction = new LayerSelector({map: this.map, itemInfo: this.config.itemInfo, primaryLayerID: this.config.primaryLayer.id, secondaryLayerID: this.config.secondaryLayer.id, i18n: this.config.i18n.layerSelector});

            on(dom.byId("layerSelectorContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("layerSelectorContainer", "selected-widget")) {
                        this.hideContentPanel();
                        domClass.remove("layerSelectorContainer", "selected-widget");
                        this.layerSelectorFunction.onClose();
                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "layerSelectorNode";

                        domClass.add("layerSelectorContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.layerSelectorFunction.postCreate();
                        }
                        this.layerSelectorFunction.onOpen();
                        domStyle.set("layerSelectorNode", "display", "block");

                    }
                }
            }));
        },
        setupChangeDetection: function () {
            new Tooltip({
                connectId: ["changeDetectionContainer"],
                label: this.config.i18n.changeDetection.title,
                position: ['after']
            });
            changeDetectionHtml = this.findAndReplaceStrings(changeDetectionHtml, "changeDetection");
            var node = domConstruct.create("div", {innerHTML: changeDetectionHtml, id: "changeDetectionNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            var openForFirstTime = true;
            if (!this.config.veg && !this.config.savi && !this.config.water && !this.config.burn)
                this.config.difference = true;

            this.changeDetectionFunction = new ChangeDetection({map: this.map, changeModes: {difference: this.config.difference, veg: this.config.veg, savi: this.config.savi, water: this.config.water, burn: this.config.burn}, i18n: this.config.i18n.changeDetection});

            on(dom.byId("changeDetectionContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("changeDetectionContainer", "selected-widget")) {
                        this.hideContentPanel();
                        domClass.remove("changeDetectionContainer", "selected-widget");
                        this.changeDetectionFunction.onClose();

                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "changeDetectionNode";
                        domClass.add("changeDetectionContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.changeDetectionFunction.postCreate();
                        }
                        this.changeDetectionFunction.onOpen();
                        domStyle.set("changeDetectionNode", "display", "block");

                    }
                }
            }));
        },
        closeOtherWidgets: function () {
            if (this.openedWidget) {
                dom.byId(this.openedWidget).click();
                domStyle.set(this.openedWidget, "display", "none");
                domClass.remove(this.openedWidget.split("Node")[0] + "Container", "selected-widget");
                this[this.openedWidget.split("Node")[0] + "Function"].onClose();
                this.openedWidget = "";

            }
            if (!this.compareOpened && dom.byId("compareNode")) {
                domStyle.set("compareNode", "display", "none");
            }
        },
        setupEditor: function () {

            new Tooltip({
                connectId: ["editorContainer"],
                label: this.config.i18n.editor.title,
                position: ['after']
            });
            var node = domConstruct.create("div", {innerHTML: "<div class='titleBar'><span class='titleBarTextSpan'>" + this.config.i18n.editor.title + "</span></div><br/><div style='margin:5px;overflow: auto;'><div id='templateDiv'></div><div id='editorDiv'></div><div id='errorEditor'></div><br /></div>", id: "editorNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);

            var openForFirstTime = true;
            var layer = [];

            if (this.config.featureLayers) {
                var featureLayers = JSON.parse(this.config.featureLayers);

                for (var a in featureLayers) {
                    layer.push(this.map.getLayer(featureLayers[a].id));
                }
            }

            this.editorFunction = new Editor({map: this.map, itemInfo: (layer.length > 0 ? layer : null), i18n: this.config.i18n.editor});
            on(dom.byId("editorContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("editorContainer", "selected-widget")) {
                        this.hideContentPanel();
                        domClass.remove("editorContainer", "selected-widget");
                        this.editorFunction.onClose();

                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "editorNode";
                        domClass.add("editorContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.editorFunction.postCreate();
                        }
                        domStyle.set("editorNode", "display", "block");
                        this.editorFunction.onOpen();
                    }
                }
            }));
        },
        setupImageMeasurement: function () {

            var node = domConstruct.create("div", {innerHTML: "<div class='titleBar'><span class='titleBarTextSpan'>" + this.config.i18n.measurement.title + "</span></div><br/><div id='measurementDivContainer' style='margin:5px;overflow: auto;'><div tabindex=8 id='measureWidgetDiv'></div><div id='errorMeasurementDiv' style='color: red;'>" + this.config.i18n.measurement.error + "</div></div><br/>", id: "measurementNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            new Tooltip({
                connectId: ["measurementContainer"],
                label: this.config.i18n.measurement.title,
                position: ['after']
            });

            var openForFirstTime = true;
            var config = {
                angularUnit: this.config.angularUnit,
                linearUnit: this.config.linearUnit,
                areaUnit: this.config.areaUnit,
                displayMeasureResultInPopup: this.config.popupMeasurementFlag
            };
            this.measurementFunction = new Measurement({map: this.map, config: config});

            on(dom.byId("measurementContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("measurementContainer", "selected-widget")) {
                        this.hideContentPanel();

                        domClass.remove("measurementContainer", "selected-widget");

                        this.measurementFunction.onClose();

                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "measurementNode";
                        domClass.add("measurementContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.measurementFunction.postCreate();
                        }
                        this.measurementFunction.onOpen();
                        domStyle.set("measurementNode", "display", "block");
                    }
                }
            }));
        },
        setupExport: function () {

            new Tooltip({
                connectId: ["exportContainer"],
                label: this.config.i18n.export.title,
                position: ['after']
            });
            exportHtml = this.findAndReplaceStrings(exportHtml, "export");
            var node = domConstruct.create("div", {innerHTML: exportHtml, id: "exportNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            var openForFirstTime = true;
            this.exportFunction = new Export({map: this.map,
                exportMode: this.config.exportType, i18n: this.config.i18n.export, portalUrl: this.config.sharinghost});

            on(dom.byId("exportContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("exportContainer", "selected-widget")) {
                        this.hideContentPanel();

                        domClass.remove("exportContainer", "selected-widget");


                        this.exportFunction.onClose();

                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "exportNode";
                        domClass.add("exportContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.exportFunction.postCreate();
                        }
                        this.exportFunction.onOpen();
                        domStyle.set("exportNode", "display", "block");

                    }
                }
            }));
        },
        setupImageSelector: function () {
            imageSelectorHtml = this.findAndReplaceStrings(imageSelectorHtml, "imageSelector");
            var node = domConstruct.create("div", {innerHTML: imageSelectorHtml, id: "imageSelectorNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            new Tooltip({
                connectId: ["imageSelectorContainer"],
                label: this.config.i18n.imageSelector.title,
                position: ['after']
            });

            var layers = this.config.itemInfo.itemData.operationalLayers;

            var layer = [];
            var temp = {
                display: this.config.displayOptions,
                zoomLevel: this.config.zoomLevel,
                searchExtent: this.config.searchScreenExtent,
                autoRefresh: this.config.enableAutoRefresh
            };
            if (this.config.imageSelectorLayer) {
                this.config.imageSelectorLayer = JSON.parse(this.config.imageSelectorLayer);
                for (var a = 0; a < layers.length; a++) {
                    for (var b = 0; b < this.config.imageSelectorLayer.length; b++) {
                        if (this.config.imageSelectorLayer[b].id === layers[a].id && this.config.imageSelectorLayer[b].fields.length > 0) {
                            var tempLayer = {
                                imageField: this.config.imageSelectorLayer[b].fields[0],
                                objectID: this.findField(layers[a].layerObject.fields, "esriFieldTypeOID", new RegExp(/O[a-z]*[_]?ID/i)),
                                category: this.findField(layers[a].layerObject.fields, "esriFieldTypeInteger", new RegExp(/Cate[a-z]*/i)),
                                name: this.findField(layers[a].layerObject.fields, "esriFieldTypeString", new RegExp(/name/i)),
                                title: layers[a].title || layers[a].layerObject.name || layers[a].id
                            };
                            layer[layers[a].url.split("//")[1]] = tempLayer;
                            break;
                        }
                    }
                }
            }

            this.imageSelectorFunction = new ImageSelector({map: this.map, config: temp, layers: layer, i18n: this.config.i18n.imageSelector});
            var openForFirstTime = true;
            on(dom.byId("imageSelectorContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("imageSelectorContainer", "selected-widget")) {
                        this.hideContentPanel();

                        domClass.remove("imageSelectorContainer", "selected-widget");
                        this.imageSelectorFunction.onClose();
                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();
                        this.openedWidget = "imageSelectorNode";
                        domClass.add("imageSelectorContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.imageSelectorFunction.postCreate();
                        }
                        this.imageSelectorFunction.onOpen();
                        domStyle.set("imageSelectorNode", "display", "block");

                    }
                }
            }));
        },
        findField: function (fields, dataType, regExpr) {
            var initialVal = "";
            for (var i in fields) {

                if (fields[i].type === dataType || !dataType) {
                    var str = fields[i].name;
                    if (initialVal === "" && regExpr.test(str)) {
                        initialVal = str;
                        break;
                    }

                }
            }
            return initialVal;
        },
        setupRenderer: function () {
            rendererHtml = this.findAndReplaceStrings(rendererHtml, "renderer");
            var node = domConstruct.create("div", {innerHTML: rendererHtml, id: "rendererNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);

            new Tooltip({
                connectId: ["rendererContainer"],
                label: this.config.i18n.renderer.title,
                position: ['after']
            });

            var openForFirstTime = true;
            this.rendererFunction = new Renderer({map: this.map, i18n: this.config.i18n.renderer});
            on(dom.byId("rendererContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("rendererContainer", "selected-widget")) {
                        this.hideContentPanel();

                        domClass.remove("rendererContainer", "selected-widget");
                        this.rendererFunction.onClose();

                    } else {
                        this.closeOtherWidgets();
                        this.showContentPanel();

                        this.openedWidget = "rendererNode";
                        domClass.add("rendererContainer", "selected-widget");

                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.rendererFunction.postCreate();
                        }
                        this.rendererFunction.onOpen();
                        domStyle.set("rendererNode", "display", "block");

                    }
                }
            }));
        },
        setupCompare: function () {
            new Tooltip({
                connectId: ["compareContainer"],
                label: this.config.i18n.compare.title,
                position: ['after']
            });
            compareHtml = this.findAndReplaceStrings(compareHtml, "compare");
            var node = domConstruct.create("div", {innerHTML: compareHtml, id: "compareNode", style: "display:none;"});
            parser.parse(node);
            domConstruct.place(node, registry.byId("toolsContentContainer").containerNode);
            var openForFirstTime = true;
            this.compareFunction = new Compare({map: this.map, compareTool: this.config.compareMode, i18n: this.config.i18n.compare});

            on(dom.byId("compareContainer"), "click", lang.hitch(this, function (event) {
                if (event.type === "click" || event.which === 13 || event.which === 32) {
                    if (domClass.contains("compareContainer", "selected-widget")) {
                        domClass.remove("compareContainer", "selected-widget");

                        this.compareOpened = false;
                        if (!this.openedWidget || domStyle.get(this.openedWidget, "display") === "none")
                            this.hideContentPanel();
                        else
                            domStyle.set("compareNode", "display", "none");
                        this.compareFunction.onClose();
                    } else {
                        this.compareOpened = true;
                        this.showContentPanel();
                        domClass.add("compareContainer", "selected-widget");
                        if (openForFirstTime) {
                            openForFirstTime = false;
                            this.compareFunction.postCreate();
                        }
                        this.compareFunction.onOpen();
                        domStyle.set("compareNode", "display", "block");

                    }
                }
            }));
        },
        showContentPanel: function () {
            if (domClass.contains("toolsContentContainer", "toolsContentContainerClosed")) { //!this.openedWidget
                domClass.remove("toolsContentContainer", "toolsContentContainerClosed");
                domClass.add("toolsContentContainer", this.currentPanelClass);
                if (this.openedWidget) {
                    domStyle.set(this.openedWidget, "display", "none");
                }
            }
        },
        hideContentPanel: function () {
            if (!this.compareOpened && domClass.contains("toolsContentContainer", this.currentPanelClass)) {
                domClass.add("toolsContentContainer", "toolsContentContainerClosed");
                domClass.remove("toolsContentContainer", this.currentPanelClass);
            } else {
                domStyle.set(this.openedWidget, "display", "none");
            }
        },
        findAndReplaceStrings: function (html, tool) {

            var matches, strings;
            while ((matches = this.regExp.exec(html)) !== null) {
                strings = matches[1].split(".");
                html = html.replace(matches[0], this.config.i18n[tool][strings[3]]);
            }

            return html;
        },
        showLoading: function () {
            domStyle.set("loadingMap", "display", "block");
        },
        hideLoading: function () {
            domStyle.set("loadingMap", "display", "none");


        },
        _updateTheme: function () {
            var bgColor = this.config.background;
            var bgOpacity = Number(this.config.backgroundOpacity);
            var textColor = this.config.color;


            // Set the background color using the configured background color
            // and opacity
            query(".bg").style({
                "background-color": bgColor,
                "opacity": bgOpacity
            });
            query(".esriPopup .pointer").style({
                "background-color": bgColor,
                "opacity": bgOpacity
            });
            query(".esriPopup .titlePane").style({
                "background-color": bgColor,
                "opacity": bgOpacity,
                "color": textColor
            });

            query(".fg").style("color", textColor);
            //query(".esriPopup .titlePane").style("color", textColor);
            query(".esriPopup. .titleButton").style("color", textColor);

            query(".esriSimpleSlider").style({
                "color": textColor,
                "background-color": bgColor,
                "opacity": bgOpacity
            });
            query(".searchCollapsed .searchBtn.searchSubmit").style({
                "color": textColor,
                "background-color": bgColor,
                "opacity": bgOpacity
            });
            // Apply the background color as the arrow border color
            query(".arrow_box").style({
                "border-color": bgColor,
                "opacity": bgOpacity
            });
            query("#basemapContainer").style({
                "background": this.config.background,
                opacity: this.config.backgroundOpacity
            });



        }
    });
});
