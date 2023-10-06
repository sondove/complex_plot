# Creating a complex novem visual

![complex visual](https://novem.no/p/vxpY5.png)

In this example we'll use [novem](https://novem.no/) + [observable plots](https://observablehq.com/plot/getting-started)
to create a complex visualisation.

The live output can be viewed at [https://novem.no/p/vxpY5](https://novem.no/p/vxpY5)

## Getting started
This repo contains all the code neccessary to replicate the above plot and consists of two "parts".

The primary job is done by `create_plot.py` which fetches data, creates the novem chart object and 
synchronizes all the data.

The second part is the JavaScript and CSS that is used to render and style the charts. Novem allows for 
user supplied JavaScript and CSS that is rendered in a sandbox.

If you want to do live editing of the javascript you can either use the novem cli to open the file in your
default editor with `novem -p complex_test -e config/custom/custom.js` or use our [vscode extension](https://marketplace.visualstudio.com/items?itemName=novem.novem-vscode).
