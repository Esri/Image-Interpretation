# Image-Interpretation

Imagery Interpretation is a configurable app template that offers a range of tools that enable users to better extract meaning from imagery.

[View it live](http://edn1.esri.com/quickstart-map-js/)

![App](https://raw.github.com/Esri/quickstart-map-js/master/quickstart-map-js.png)?

## Features
* Visualize both imagery layers and non-imagery layers from the app’s web map 
* Select specific images from a layer to visualize and compare
* Render imagery using the service functions associated with the layer in the web map
* Compare images using swipe and transparency
* Perform change detection to compare two images or to compare calculated indexes for vegetation, burned area, and water
* Perform image measurement on imagery layers that have mensuration capabilities 
* Edit feature layers
* Export an imagery layer to the user’s local machine, or as layer in the user’s ArcGIS Online account

## Use Cases
Imagery interpretation is of interest to many industries for a wide variety of applications. Examples include:
* A forester identifying possible bark beetle infestation by reviewing Landsat imagery
* A farmer using NAIP imagery to identify his land and record crop types
* An image analyst recording the location of an aircraft identified from high resolution satellite imagery
* A property appraiser recording notes about newly constructed houses, including calculating building heights in-app

## Requirements
### Software
* ArcGIS Online subscription or ArcGIS Portal

### Supported Devices
* Apps created with this template are responsively designed for display on desktops, mobile phones, and tablets  using all [browsers supported by ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/reference/browsers.htm).

### Data Requirements
* Creating an app with this template requires a web map with at least one imagery layer. 

## Instructions
1. To deploy this application, download the template from Portal/ArcGIS Online and unzip it.
2. Copy the unzipped folder containing the web app template files, such as index.html, to your web server. You can rename the folder to change the URL through which users will access the application. By default the URL to the app will be `http://<Your Web Server>/<app folder name>/index.html`
3. Change the sharing host, found in defaults.js inside the config folder for the application, to the sharing URL for ArcGIS Online or Portal. For ArcGIS Online users, keep the default value of www.arcgis.com or specify the name of your organization.
	- ArcGIS Online Example:  `"sharinghost": location.protocol + "//" + â€œ<your organization name>.maps.arcgis.com`
	- Portal Example where `arcgis` is the name of the Web Adaptor: `"sharinghost": location.protocol + "//" + "webadaptor.domain.com/arcgis"`
4. If you are using Portal or a local install of the ArcGIS API for JavaScript, change all references to the ArcGIS API for JavaScript in index.html to refer to your local copy of the API. Search for the references containing `"//js.arcgis.com/3.21"` and replace this portion of the reference with the url to your local install.
	- For example: `"//webadaptor.domain.com/arcgis/jsapi/jsapi"` where `arcgis` is the name of your Web Adaptor.
5. Copy a group ID from Portal/ArcGIS Online and replace the default group ID in the applicationâ€™s default.js file. You can now run the application on your web server or configure the application further.

> **Note:** If your application edits features in a feature service, contains secure services or web maps that aren't shared publicly, or generate requests that exceed 200 characters, you may need to set up and use a proxy page. Common situations where you may exceed the URL length are using complex polygons as input to a task or specifying a spatial reference using well-known text (WKT). For details on installing and configuring a proxy page see [Using the proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html). If you do not have an Internet connection, you will need to access and deploy the ArcGIS API for JavaScript documentation from [developers.arcgis.com](https://developers.arcgis.com/).


## Resources
* Find more information about [Esri's configurable apps](http://www.esri.com/software/configurable-apps).
* [Esri's ArcGIS Online Help](http://resources.arcgis.com/en/help/arcgisonline/) describes how to create web maps and web map applications in the ArcGIS Online ecosystem.
* Check out the [GitHub repo for Web AppBuilder image services widgets](https://github.com/Esri/WAB-Image-Services-Widgets) for more information about building configurable imagery apps with ArcGIS.

## Issues
Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing
Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at 

http://www.apache.org/licenses/LICENSE-2.0. 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [license.txt](https://raw.github.com/Esri/Imagery-Interpretation/master/license.txt) file.