var landsat_5_1991 = ee.ImageCollection('LANDSAT/LT05/C01/T1')
  .filterDate('1991-01-01', '1991-12-31');

var landsat_8_2021 = ee.ImageCollection('LANDSAT/LC08/C01/T1')
  .filterDate('2021-01-01', '2021-12-31');

// Set visualization parameters
var vis_params = {
  bands: ['B4', 'B3', 'B2'],
  max: 128
}

// Create maps and add image layers
var leftMap = ui.Map();
var rightMap = ui.Map();
var landsat_5_1991_img = ui.Map.Layer(landsat_5_1991, vis_params);
var landsat_8_2021_img = ui.Map.Layer(landsat_8_2021, vis_params);
var landsat_5_1991_layer = leftMap.layers();
var landsat_8_2021_layer = rightMap.layers();
landsat_5_1991_layer.add(landsat_5_1991_img);
landsat_8_2021_layer.add(landsat_8_2021_img);

// Create and add labels
var landsat_5_1991_label = ui.Label('Landsat 5 1991 RGB');
landsat_5_1991_label.style().set('position', 'bottom-left');
var landsat_8_2021_label = ui.Label('Landsat 8 2021 RGB');
landsat_8_2021_label.style().set('position', 'bottom-right');
leftMap.add(landsat_5_1991_label);
rightMap.add(landsat_8_2021_label);

// Remove controls
leftMap.setControlVisibility(false);
rightMap.setControlVisibility(false);

// Create split panel
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  wipe: true,
  style: {stretch: 'both'}
});

ui.root.clear();
ui.root.add(splitPanel);

// Link maps
var linker = ui.Map.Linker([leftMap, rightMap]);

leftMap.centerObject(landsat_5_1991, 14);