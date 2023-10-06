/*
 * This is a novem custom visualization
 *
 * in this context you have access to the following
 * global variables:
 *
 * `info`   - the novem info object `https://novem.no/docs/plot/custom/#info`
 * `render` - the novem render object `https://novem.no/docs/plot/custom/#render`
 * `node`   - a javascript reference to the dom node you should render into
 * `width`  - the current width of the target
 * `height` - the current height of the target
 *
 * To support your rendering you also have access to the following libraries
 * `R`      - ramda version 29.0,0
 * `d3`     - d3.js version 7.0
 * `Plot`   - Observable plot 0.6
 *
 **/

// Write your code here

// get our data from the `info` object
const data = info.data;
const hdr = info?.metadata?.header
const frac = render.frac;

// define some utility functions
const pd = d3.timeParse("%Y-%m-%d");    // date parser
const yaf= d3.format(".0%");            // y-axis format
const xaf = d3.timeFormat("%d.%m.%Y");  // x-axis format
const lf = d3.format(".2%");            // lable format

// construct background bands
const createBands = R.pipe(
  R.map(R.head),  // Extract dates
  R.map(pd),      // Convert to js date
  R.sort(d3.ascending), // sort
  R.map(d => new Date(d.getFullYear(), d.getMonth())),  // Extract the start of each month
  R.uniq,  // Get unique months
  R.addIndex(R.filter)((_, idx) => idx % 2 === 0), // Take every other month
  R.map(monthStart => [
    monthStart,
    new Date(d3.timeMonth.offset(monthStart, 1) - 86400000) // last day of previous month
  ])
);

// bands contain our date bands and slice of 1st band (first dateis eom)
const bands = createBands(data).slice(1);

// Extract unique months from the daily data
const uniqueMonths = R.pipe(
    R.map(R.head),
    R.map(pd),
    R.map(d => d3.utcMonth(d)),  // Start of each month
    R.uniq
)(data);

// Generate end of month ticks
const endOfMonthTicks = uniqueMonths.map(
  date => d3.utcDay.offset(d3.utcMonth.offset(date, 1), -1)
);

// Line generator
const gl = (i) => ({
  x:d=>pd(d[0]),
  y:d=>+d[i],
  stroke:d=>hdr[i],
  strokeWidth: 2*frac,
})

// Text generator
const gt = (i) => ({
  x:d=>pd(d[0]),
  y:d=>+d[i],
  text: d=> lf(d[i]),
  fill:d=>hdr[i],
  textAnchor: "start",
  dx: +5,
})

// Construct our observable plot
const plot = Plot.plot({
    width: width,
    height: height-33-5-2,
    caption: "this is a test caption",
    marginTop: 20,
    marginRight: 65*frac,
    marginBottom: 100*(frac>1.0?frac*0.75:frac),
    marginLeft: 60*frac,
    y: {
        tickFormat: yaf,
        tickSize: 0, // No tick lines
        ticks: 10,
    },
    x: {
        tickFormat: xaf, // Date format
        ticks: endOfMonthTicks, // end of month lables
        tickRotate: 90, // Rotate ticks by 90 degrees
        tickSize: 0, // No tick lines
    },
    color: {
      type: "ordinal",
      domain: hdr.slice(1),
      range: render.dark?["#dee2e6","#ca5eed","#6e386e"]:["black", "#0184a7", "#17787b"],
      legend: true,
    },
    marks: [

        Plot.rectX(bands, {x1: R.head, x2: R.last, fill: render.dark?"#292929":"#f2f2f2"}),

        Plot.areaY(data, {
          x:d=>pd(d[0]),
          y:d=>+d[3],
          //fillOpacity: 0.2,
          fill:d=>hdr[3]
        }),

        Plot.text([R.last(data)], {...gt(3)}),

        Plot.lineY(data, gl(1)),
        Plot.lineY(data, gl(2)),
        Plot.text([R.last(data)], {...gt(1), dy: +5}),
        Plot.text([R.last(data)], {...gt(2), dy: -5}),

        Plot.ruleY([0]), // Add a horizontal line at y=0

        //Plot.frame(),
    ]
})


// render into dom
node.append(plot)
