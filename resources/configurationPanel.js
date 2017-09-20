{
"configurationSettings":[
{
"category":"General",
        "fields":[
        {
        "type":"webmap",
                "conditions":["imagelayer"]
        },
        {
        "type":"appproxies"
        },
        {
        "placeHolder":"Enter the title",
                "label":"Title:",
                "fieldName":"title",
                "type":"string",
                "tooltip":"Provide App Name"
        },
        {
        "placeHolder":"Description",
                "label":"Description:",
                "fieldName":"description",
                "type":"string",
                "tooltip":"Provide exciting info for the App title tooltip.",
                "stringFieldOption":"textarea"
        },
        {
        "type":"boolean",
                "label":"Enable Basemap Gallery",
                "fieldName":"basemapFlag",
                "tooltip":"Basemap Selector"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"scalebarFlag",
                "label":"Enable Scalebar",
                "tooltip":"Display Scalebar",
                "items":[
                {
                "type":"options",
                        "fieldName":"scalebarPosition",
                        "label":"Scalebar Position",
                        "toolbar":"Select the Scalebar position on the map.",
                        "options":[
                        {
                        "label":"Top Left",
                                "value":"top-left"
                        },
                        {
                        "label":"Top Right",
                                "value":"top-right"
                        },
                        {
                        "label":"Bottom Left",
                                "value":"bottom-left"
                        },
                        {
                        "label":"Bottom Right",
                                "value":"bottom-right"
                        },
                        {
                        "label":"Top Center",
                                "value":"top-center"
                        },
                        {
                        "label":"Bottom Center",
                                "value":"bottom-center"
                        }
                        ]
                },
                {
                "type":"options",
                        "fieldName":"scalebarStyle",
                        "label":"Scalebar Style",
                        "toolbar":"Select the style for the scalebar.",
                        "options":[
                        {
                        "label":"Ruler",
                                "value":"ruler"
                        },
                        {
                        "label":"Line",
                                "value":"line"
                        }
                        ]
                },
                {
                "type":"options",
                        "fieldName":"scalebarUnit",
                        "label":"Scalebar Unit",
                        "toolbar":"Select the Scalebar units.",
                        "options":[
                        {
                        "label":"English",
                                "value":"english"
                        },
                        {
                        "label":"Metric",
                                "value":"metric"
                        },
                        {
                        "label":"Both",
                                "value":"dual"
                        }
                        ]
                }
                ]
        },
        {
        "type":"paragraph",
                "value":"Enable search to allow users to find a location or data in the map. Configure the search settings to refine the experience in your app by setting the default search resource, placeholder text, etc."
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"search",
                "label":"Enable search tool",
                "items":[
                {
                "type":"search",
                        "fieldName":"searchConfig",
                        "label":"Configure search tool"
                }
                ]
        }
        ]
},
{
"category":"Theme",
        "fields":[
        {
        "type":"paragraph",
                "value":"Define title header color for the app"
        },
        {
        "type":"color",
                "fieldName":"background",
                "tooltip":"Choose a title header color",
                "label":"Title Header color"
        },
        {
        "type":"color",
                "fieldName":"color",
                "tooltip":"Choose a text color for the app",
                "label":"Text color"
        },
        {
        "type":"paragraph",
                "value":"Use the Custom css option to paste css that overwrites rules in the app."
        },
        {
        "type":"string",
                "fieldName":"customstyle",
                "tooltip":"Enter custom css",
                "label":"Custom css"
        }
        ]
},
{
"category":"Operational Layers",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align: justify;font-family: verdana;'>The Operational Layers tool allows users to change the visibility of non-imagery layers (feature layers or tile layers, for example), as well as to view the legend of each non-imagery layer. This tool is not required if the user will be working with one operational layer and not turning it on and off.</p>"
        },
        {
        "type":"boolean",
                "fieldName":"operationalLayersFlag",
                "label":"Enable Operational Layers tool"
        }
        ]
},
{
"category":"Imagery Layers",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align:justify;font-family: verdana;margin-bottom:0px;'>Select and configure the tools users will be able to access to visualize imagery layers in the app. All imagery tools interact with the active imagery layer. Additionally, the Compare and Change Detection tools require that two layers be set, an active layer and a comparison layer. This is accomplished using the Image Selector tool. <br/><br>If the Layer Selector tool is enabled, users will be able to change the active and comparison layers in the app using two dropdown menus that list all the imagery layers from the associated web map.</p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"layersFlag",
                "label":"Enable Layer Selector",
                "tooltip":"Imagery Layer Selector.",
                "items":[
                {
                "type":"paragraph",
                        "value":"<p style='text-align:justify;font-family:verdana;margin-bottom:0px;'>Use the dropdown lists to set the default active and comparison layers in the app.</p>"
                },
                {
                "type":"layerAndFieldSelector",
                        "fieldName":"primaryLayer",
                        "label":"Active Layer: ",
                        "tooltip":"Select the Active Layer",
                        "layerOptions":{
                        "supportedTypes":[
                                "ImageServiceLayer"
                        ]
                        }
                },
                {
                "type":"layerAndFieldSelector",
                        "fieldName":"secondaryLayer",
                        "label":"Comparison Layer: ",
                        "tooltip":"Select the Comparison Layer",
                        "layerOptions":{
                        "supportedTypes":[
                                "ImageServiceLayer"
                        ]
                        }
                }
                ]
        },
        {
        "type":"paragraph",
                "value":"<p style='text-align:justify;font-family: verdana;margin:20px 0px 0px 0px;'>The Renderer tool allows the user to set service functions and stretch on the active layer in the app. In the app, a dropdown menu will be automatically populated with any service functions associated with the active layer in the associated web map.</p>"
        },
        {
        "type":"boolean",
                "fieldName":"rendererFlag",
                "label":"Enable Renderer Tool",
                "tooltip":""
        },
        {
        "type":"paragraph",
                "value":"<p style='text-align:justify;font-family: verdana;margin:20px 0px 0px 0px;'>The Compare tool enables a vertical swipe to compare the active layer with the comparison layer. (Note: If no comparison layer is selected, or the comparison image is the same as the active image, the vertical swipe will compare the active layer with the basemap.) If a Results layer is present (after performing change detection in the app, for example), you can also compare the active and comparison layers with the Results layer using either transparency or a horizontal swipe. </p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"compareFlag",
                "label":"Enable Compare",
                "tooltip":"Compare tool",
                "items":[
                {
                "type":"paragraph",
                        "value":"<p style='text-align:justify;font-family: verdana;margin-bottom:0px;'>The Compare tool will always use a vertical swipe to compare the active layer with the comparison layer. Use the dropdown menu below to choose whether a horizontal swipe or a transparency slider will be used to compare a Results layer (if present) with the imagery layers.</p>"
                },
                {
                "type":"options",
                        "fieldName":"compareMode",
                        "tooltip":"Select compare tools",
                        "label":"Compare Tools",
                        "options":[
                        {
                        "label":"Transparency Slider and Vertical Swipe",
                                "value":"slider"
                        },
                        {
                        "label":"Horizontal Swipe and Vertical Swipe",
                                "value":"swipe"
                        }
                        ]
                }
                ]
        },
        {
        "type":"paragraph",
                "value":"<p style='text-align: justify;font-family: verdana;margin:20px 0px 0px 0px;'>The Export tool saves the topmost visible imagery layer, either to the user's ArcGIS Online account as an imagery layer item or to the user's computer as a TIFF file of the current area of interest.</p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "label":"Enable Export Tool",
                "fieldName":"exportFlag",
                "items":[
                {
                "type":"paragraph",
                        "value":"<p style='text-align: justify;font-family: verdana;margin-bottom:0px;'>Select which export options will be available to the user.</p>"
                },
                {
                "type":"options",
                        "fieldName":"exportType",
                        "label":"Set default Mode: ",
                        "options":[
                        {
                        "label":"Save to Portal",
                                "value":"agol"
                        },
                        {
                        "label":"Save to Disk",
                                "value":"disk"
                        },
                        {
                        "label":"Select in app",
                                "value":"both"
                        }
                        ]
                }
                ]
        }
        ]
},
{
"category":"Image Selector",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align: justify;font-family: verdana;'>The Image Selector Tool allows users to filter and set specific images as the active and comparison layers. In the app, the tool will display all the rasters from the active imagery layer that intersect with the current screen extent on a slider, as a dropdown list, or both.<br><br><br/>When configuring the tool, choose the following:<br><br>(1) A display option. Use a slider, a dropdown list, or both to choose specific images.<br>(2) The minimum zoom level at which the tool will be available. At low zoom levels, no filtering is applied.<br>(3) The Search Screen Extent (%). If a small value is chosen, searches will return imagery only from the central part of the screen.<br>(4) Whether to activate Enable AutoRefresh. If the viewing extent changes, Enable AutoRefresh will update the display list and find similar images for the new extent.<br>(5) Whether or not to show distinct values on the slider or dropdown menu. If this is checked on, unique values will appear only once, and all images matching that value will be displayed when selected (for example, all images with the same acquisition date). If checked off, a distinct entry for each image in the extent will appear. </p>"
        },
        {
        "type":"conditional",
                "fieldName":"imageSelectorFlag",
                "tooltip":"",
                "condition":false,
                "label":"Enable Image Selector Tool",
                "items":[
                {
                "type":"options",
                        "fieldName":"displayOptions",
                        "tooltip":"",
                        "label":"Display:",
                        "options":[
                        {
                        "label":"Slider",
                                "value":"slider"
                        },
                        {
                        "label":"Dropdown List",
                                "value":"dropdown"
                        },
                        {
                        "label":"Slider and Dropdown List",
                                "value":"both"
                        }
                        ]
                },
                {
                "type":"Number",
                        "fieldName":"zoomLevel",
                        "label":"Minimum Zoom Level",
                        "tooltip":"",
                        "constraints":{
                        "min":0,
                                "max":23,
                                "places":0
                        }
                },
                {
                "type":"Number",
                        "fieldName":"searchScreenExtent",
                        "label":"Search Screen Extent (%)",
                        "tooltip":"",
                        "constraints":{
                        "min":1,
                                "max":100,
                                "places":0
                        }
                },
                {
                "type":"boolean",
                        "fieldName":"enableAutoRefresh",
                        "label":"Enable AutoRefresh",
                        "toottip":""
                },
                {
                "type":"boolean",
                        "fieldName":"distinctImages",
                        "label":"Show distinct values on slider or in a dropdown",
                        "tooltip":"If turned on, slider or dropdown will merge all the images together with same attribute value."
                },
                {
                "type":"paragraph",
                        "value":"<p style='text-align: justify;font-family: verdana;margin:20px 0px -10px; 0px;'>Below, check the box next to each imagery layer you wish to be searchable, then select one attribute per imagery layer by which to sort the images (for example, you might select AcquisitionDate to sort satellite imagery chronologically).</p>"
                },
                {
                "type":"multilayerandfieldselector",
                        "fieldName":"imageSelectorLayer",
                        "label":"Imagery Layers",
                        "tooltip":"Set imagery layers properties.",
                        "layerOptions":{
                        "supportedTypes":[
                                "ImageServiceLayer"
                        ]
                        },
                        "fieldOptions":{
                        "supportedTypes":[
                                "esriFieldTypeSmallInteger",
                                "esriFieldTypeInteger",
                                "esriFieldTypeSingle",
                                "esriFieldTypeDouble",
                                "esriFieldTypeString",
                                "esriFieldTypeDate",
                                "esriFieldTypeOID",
                                "esriFieldTypeGeometry",
                                "esriFieldTypeBlob",
                                "esriFieldTypeRaster",
                                "esriFieldTypeGUID",
                                "esriFieldTypeGlobalID",
                                "esriFieldTypeXML"
                        ]
                        }
                }
                ]
        }
        ]
},
{
"category":"Image Date",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align: justify;font-family: verdana;'>Image Date will display the date of the most central image from the active layer in the theme header next to the app name.</p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"imageDateFlag",
                "label":"Enable Image Date",
                "items":[
                {
                "type": "string",
                        "fieldName": "imageDateLabel",
                        "label": "Label: ",
                        "tooltip": "",
                        "stringFieldOption": "textbox",
                        "placeHolder": ""
                },
                {
                "type":"paragraph",
                        "value":"<p style='text-align: justify;font-family: verdana;margin-bottom:0px;'>Check the box next to all the imagery layers that will display a date when selected as the app's active layer, then select one date field for each layer.</p>"
                },
                {
                "type":"multilayerandfieldselector",
                        "fieldName":"imageDateLayer",
                        "label":"Imagery Layers",
                        "tooltip":"Select date field for each imagery layer.",
                        "layerOptions":{
                        "supportedTypes":[
                                "ImageServiceLayer"
                        ]
                        },
                        "fieldOptions":{
                        "supportedTypes":[
                                "esriFieldTypeDate"
                        ]
                        }
                }
                ]
        }
        ]
},
{
"category":"Change Detection",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align: justify;font-family: verdana;'>The Change Detection widget allows users to calculate the difference between the active and comparison layers. The result of the tool will be added as a new Results layer, which can be added to the dropdown list of image services available to your app using the Layer Selector tool. Assuming the active layer date is later than the comparison date, increases are shown in green and decreases are shown in magenta.<br><br>To use this tool, Image Selector must be enabled.<br></p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"changeDetectionFlag",
                "label":"Enable Change Detection Tool",
                "tooltip":"",
                "items":[
                {
                "type":"paragraph",
                        "value":"<p style='text-align: justify;font-family: verdana;margin-bottom:0px;'>Select which change detection options you wish to be available to app users. Before performing the change detection, the Difference option converts both imagery layers into grayscale, while the rest of the options calculate indexes for both imagery layers. Index options include Vegetation Index (Normalized Difference Vegetation Index), Soil Adjusted Vegetation Index, Water Index (Normalized Difference Water Index), and Burn Index (Normalized Burn Ratio). </p>"
                },
                {
                "type":"boolean",
                        "fieldName":"difference",
                        "label":"Difference"
                },
                {
                "type":"boolean",
                        "fieldName":"veg",
                        "label":"Vegetation Index",
                        "tooltip":"Normalized Difference Vegetation Index, or NDVI"
                },
                {
                "type":"boolean",
                        "fieldName":"savi",
                        "label":"Soil Adjusted Vegetation Index",
                        "tooltip":"SAVI"
                },
                {
                "type":"boolean",
                        "fieldName":"water",
                        "label":"Water Index",
                        "tooltip":"Normalized Difference Water Index, or NDWI"
                },
                {
                "type":"boolean",
                        "fieldName":"burn",
                        "label":"Burn Index",
                        "tooltip":"Normalized Burn Ratio, or NBR"
                }
                ]
        }
        ]
},
{
"category":"Image Measurement",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align:justify;font-family: verdana;'>The Image Measurement tool allows you to perform measurements on image services with mensuration capability. Mensuration applies geometric rules to find the height, area, or location of a feature.</p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"measurementFlag",
                "label":"Enable Image Measurement",
                "items":[
                {
                "type":"paragraph",
                        "value":"<p style='text-align:justify;font-family: verdana;margin-bottom:0px;'>Select the units that will be displayed in-app using the dropdown menus.</p>"
                },
                {
                "type":"options",
                        "fieldName":"angularUnit",
                        "label":"Default Angular Unit",
                        "tooltip":"Unit of measure for angular measurement.",
                        "options":[
                        {
                        "label":"Radians",
                                "value":"esriDURadians"
                        },
                        {
                        "label":"Degrees",
                                "value":"esriDUDecimalDegrees"
                        }
                        ]
                },
                {
                "type":"options",
                        "fieldName":"linearUnit",
                        "label":"Default Linear Unit",
                        "tooltip":"Unit of measure for linear measurement.",
                        "options":[
                        {
                        "label":"Inches",
                                "value":"esriInches"
                        },
                        {
                        "label":"Feet",
                                "value":"esriFeet"
                        },
                        {
                        "label":"Yards",
                                "value":"esriYards"
                        },
                        {
                        "label":"Miles",
                                "value":"esriMiles"
                        },
                        {
                        "label":"Nautical Miles",
                                "value":"esriNauticalMiles"
                        },
                        {
                        "label":"Millimeters",
                                "value":"esriMillimeters"
                        },
                        {
                        "label":"Centimeters",
                                "value":"esriCentimeters"
                        },
                        {
                        "label":"Decimeters",
                                "value":"esriDecimeters"
                        },
                        {
                        "label":"Meters",
                                "value":"esriMeters"
                        },
                        {
                        "label":"Kilometers",
                                "value":"esriKilometers"
                        }
                        ]
                },
                {
                "type":"options",
                        "fieldName":"areaUnit",
                        "label":"Default Area Unit",
                        "tooltip":"Unit of measure for area measurement.",
                        "options":[
                        {
                        "label":"Sq Inches",
                                "value":"esriSquareInches"
                        },
                        {
                        "label":"Sq Feet",
                                "value":"esriSquareFeet"
                        },
                        {
                        "label":"Sq Yards",
                                "value":"esriSquareYards"
                        },
                        {
                        "label":"Acres",
                                "value":"esriAcres"
                        },
                        {
                        "label":"Sq Miles",
                                "value":"esriSquareMiles"
                        },
                        {
                        "label":"Sq Millimeters",
                                "value":"esriSquareMillimeters"
                        },
                        {
                        "label":"Sq Centimeters",
                                "value":"esriSquareCentimeters"
                        },
                        {
                        "label":"Sq Decimeters",
                                "value":"esriSquareDecimeters"
                        },
                        {
                        "label":"Sq Meters",
                                "value":"esriSquareMeters"
                        },
                        {
                        "label":"Ares",
                                "value":"esriAres"
                        },
                        {
                        "label":"Hectares",
                                "value":"esriHectares"
                        },
                        {
                        "label":"Sq Kilometers",
                                "value":"esriSquareKilometers"
                        }
                        ]
                },
                {
                "type":"boolean",
                        "fieldName":"popupMeasurementFlag",
                        "label":"Display Measure Results in a Pop-up."
                },
                {
                "type":"paragraph",
                        "value":"<p style='text-align:justify;font-family: verdana;'>If you check Display Measure Results in a Pop-up, the measurements will be displayed in a pop-up window instead of within the image measurement tool.</p>"
                }
                ]
        }
        ]
},
{
"category":"Editor",
        "fields":[
        {
        "type":"paragraph",
                "value":"<p style='text-align:justify;font-family: verdana;margin-bottom:0px;'>The Editor tool allows users to edit feature layers (to pinpoint locations, delineate boundaries, or add additional notes, among other uses).<br><br><br>Enable the Editor tool and select the feature layers that users will be able to edit in-app. This tool requires editable hosted feature layers in the app's web map.</p>"
        },
        {
        "type":"conditional",
                "condition":false,
                "fieldName":"editFlag",
                "label":"Enable Edit Tool",
                "items":[
                {
                "label":"Turn on the layers to allow editing.<br />For each editable feature layer, select the feature layer field in which to record the date from the active image. (optional)",
                        "fieldName":"featureLayers",
                        "type":"multilayerandfieldselector",
                        "tooltip":"Select the feature layer field in which to record the date from the active image.",
                        "layerOptions":{
                        "supportedTypes":[
                                "FeatureLayer"
                        ]
                        },
                        "fieldOptions":{
                        "supportedTypes":[
                                "esriFieldTypeDate"
                        ]
                        }
                },
                {
                "label":"For each editable feature layer, select the feature layer field in which to record the height from the active image. (optional)",
                        "fieldName":"featureLayersHeightField",
                        "type":"multilayerandfieldselector",
                        "tooltip":"Select the feature layer field in which to record the height from the active image.",
                        "layerOptions":{
                        "supportedTypes":[
                                "FeatureLayer"
                        ]
                        },
                        "fieldOptions":{
                        "supportedTypes":[
                                "esriFieldTypeSmallInteger",
                                "esriFieldTypeInteger",
                                "esriFieldTypeSingle",
                                "esriFieldTypeDouble",
                                "esriFieldTypeString"
                        ]
                        }
                }
                ]
        }
        ]
}
],
        "values":{
                "background":"#000",
                "color":"#fff",
                "includelayeropacity":false,
                "basemapFlag":false,
                "scalebarFlag":false,
                "scalebarUnit":"metric",
                "scalebarStyle":"ruler",
                "scalebarPosition":"bottom-left",
                "operationalLayersFlag":false,
                "layersFlag":false,
                "primaryLayer":{
                "id":null
                },
                "secondaryLayer":{
                "id":null
                },
                "imageSelectorFlag":false,
                "displayOptions":"slider",
                "zoomLevel":8,
                "searchScreenExtent":75,
                "enableAutoRefresh":false,
                "distinctImages": false,
                "imageSelectorLayer":"",
                "imageDateFlag":false,
                "imageDateLabel":"",
                "imageDateLayer":"",
                "compareFlag":false,
                "compareMode":"slider",
                "changeDetectionFlag":false,
                "difference":false,
                "veg":false,
                "savi":false,
                "water":false,
                "burn":false,
                "rendererFlag":false,
                "exportFlag":false,
                "exportType":"agol",
                "measurementFlag":false,
                "angularUnit":"esriDUDecimalDegrees",
                "linearUnit":"esriMeters",
                "areaUnit":"esriSquareMeters",
                "popupMeasurementFlag":false,
                "editFlag":false,
                "featureLayers":"",
                "featureLayersHeightField":"",
                "search":false,
                "units":"english"
        }
}