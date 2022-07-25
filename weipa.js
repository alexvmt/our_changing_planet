// function to mask unwanted pixels
function mask_unwanted_pixels(image) {
	// Bit 0: Fill
	// Bit 1: Dilated Cloud
	// Bit 2: Unused/Cirrus (high confidence) 
	// Bit 3: Cloud
	// Bit 4: Cloud Shadow	
	var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
	var saturationMask = image.select('QA_RADSAT').eq(0);

	// apply scaling factors to appropriate bands
	var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);

	// replace original bands with scaled ones and apply masks
	return image.addBands(opticalBands, null, true)
		.updateMask(qaMask)
		.updateMask(saturationMask);
	}

// select data from 1991
var landsat_5_1991 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
	.filterDate('1991-01-01', '1991-12-31')
	.map(mask_unwanted_pixels)
	.median();

// select data from 2021
var landsat_8_2021 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
	.filterDate('2021-01-01', '2021-12-31')
	.map(mask_unwanted_pixels)
	.median();

// set visualization parameters Landsat 5
var visualization_landsat_5 = {
	bands: ['SR_B3', 'SR_B2', 'SR_B1'],
	min: 0,
	max: 0.3
	}

// set visualization parameters Landsat 8
var visualization_landsat_8 = {
	bands: ['SR_B4', 'SR_B3', 'SR_B2'],
	min: 0,
	max: 0.3
	}

// create maps and add image layers
var leftMap = ui.Map();
var rightMap = ui.Map();
var landsat_5_1991_img = ui.Map.Layer(landsat_5_1991, visualization_landsat_5);
var landsat_8_2021_img = ui.Map.Layer(landsat_8_2021, visualization_landsat_8);
var landsat_5_1991_layer = leftMap.layers();
var landsat_8_2021_layer = rightMap.layers();
landsat_5_1991_layer.add(landsat_5_1991_img);
landsat_8_2021_layer.add(landsat_8_2021_img);

// create and add labels
var landsat_5_1991_label = ui.Label('Landsat 5 1991 SR RGB');
landsat_5_1991_label.style().set('position', 'bottom-left');
var landsat_8_2021_label = ui.Label('Landsat 8 2021 SR RGB');
landsat_8_2021_label.style().set('position', 'bottom-right');
leftMap.add(landsat_5_1991_label);
rightMap.add(landsat_8_2021_label);

// remove controls
leftMap.setControlVisibility(false);
rightMap.setControlVisibility(false);

// create split panel
var splitPanel = ui.SplitPanel({
	firstPanel: leftMap,
	secondPanel: rightMap,
	wipe: true,
	style: {stretch: 'both'}
	});

ui.root.clear();
ui.root.add(splitPanel);

// link maps
var linker = ui.Map.Linker([leftMap, rightMap]);

// set map center to region of interest
leftMap.setCenter(141.85, -12.55, 12);