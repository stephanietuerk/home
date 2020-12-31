
		var rColor = "#f4003d",
			dColor = "#2437ff",
			dMapColor = "#394bff",
			oColor = "#f6b500",
			initialColor = "#cccccc" //light grey
			dkGrey = "#bbbbbb";
		// Queue up datasets using d3 Queue
		d3.queue()
		    .defer(d3.json, "PA_CensusTracts_2010.json") 
		    .defer(d3.tsv, "CT_AllData.tsv")
		    .defer(d3.json, "PA_Cities.json")
		    .await(makeViz); 

		function makeViz(error, pa, tractdata, cities) {
			if (error) throw error;
			//
			//
			//PROCESS AND FORMAT VOTE DATA
			///////////////////////////////////////////////////
			var usp2016MarginByTract = {},
		  		usp2012MarginByTract = {},
		  		uspChangeMarginByTract = {},
		  		uss2016MarginByTract = {},
		  		uss2012MarginByTract = {},
		  		ussChangeMarginByTract = {},
		  		usc2016MarginByTract = {},
		  		usc2012MarginByTract = {},
		  		uscChangeMarginByTract = {};
		  	//US PRESIDENT data
		  	tractdata.forEach(function(d) {
		  		var dem16 = +d.USP_DEM_2016,
		  			rep16 = +d.USP_REP_2016,
		  			oth16 = +d.USP_OTH_2016,
		  			dem12 = +d.USP_DEM_2012,
		  			rep12 = +d.USP_REP_2012,
		  			oth12 = +d.USP_OTH_2012;
		  		var tot16 = dem16 + rep16 + oth16,
		  			tot12 = dem12 + rep12 + oth12;
		  		var margin16 = (rep16 - dem16)/tot16,
		  			margin12 = (rep12 - dem12)/tot12,
		  			change = margin16 - margin12;
		  		usp2016MarginByTract[d.GEO_ID] = margin16,
		  		usp2012MarginByTract[d.GEO_ID] = margin12,
		  		uspChangeMarginByTract[d.GEO_ID] = change;
		  	});
		  	//US SENATE data
		  	tractdata.forEach(function(d) {
		  		var dem16 = +d.USS_DEM_2016,
		  			rep16 = +d.USS_REP_2016,
		  			oth16 = +d.USS_OTH_2016,
		  			dem12 = +d.USS_DEM_2012,
		  			rep12 = +d.USS_REP_2012,
		  			oth12 = +d.USS_OTH_2012;
		  		var tot16 = dem16 + rep16 + oth16,
		  			tot12 = dem12 + rep12 + oth12;
		  		var margin16 = (rep16 - dem16)/tot16,
		  			margin12 = (rep12 - dem12)/tot12,
		  			change = margin16 - margin12;
		  		uss2016MarginByTract[d.GEO_ID] = margin16,
		  		uss2012MarginByTract[d.GEO_ID] = margin12,
		  		ussChangeMarginByTract[d.GEO_ID] = change;
		  	});
		  	//US CONGRESS DATA
		  	tractdata.forEach(function(d) {
		  		var dem16 = +d.USC_DEM_2016,
		  			rep16 = +d.USC_REP_2016,
		  			oth16 = +d.USC_OTH_2016,
		  			dem12 = +d.USC_DEM_2012,
		  			rep12 = +d.USC_REP_2012,
		  			oth12 = +d.USC_OTH_2012;
		  		var tot16 = dem16 + rep16 + oth16,
		  			tot12 = dem12 + rep12 + oth12;
		  		var margin16 = (rep16 - dem16)/tot16,
		  			margin12 = (rep12 - dem12)/tot12,
		  			change = margin16 - margin12;
		  		if (tot16 != 0) {
		  			usc2016MarginByTract[d.GEO_ID] = margin16;	
		  		}
		  		if (tot12 != 0) {
		  			usc2012MarginByTract[d.GEO_ID] = margin12;
		  		}
		  		if (tot16 != 0 && tot12 != 0) {
		  			uscChangeMarginByTract[d.GEO_ID] = change;
		  		}
		  		else {
			  		usc2016MarginByTract[d.GEO_ID] = "ERROR";
			  		usc2012MarginByTract[d.GEO_ID] = "ERROR";
			  		uscChangeMarginByTract[d.GEO_ID] = "ERROR";
			  	}
		  	});
		  	var usp2016TotalsByTract = {};
		  	tractdata.forEach(function(d) {
		  		var dem16 = +d.USP_DEM_2016,
		  			rep16 = +d.USP_REP_2016,
		  			oth16 = +d.USP_OTH_2016;
		  		var tot16 = dem16 + rep16 + oth16;
		  		usp2016TotalsByTract[d.GEO_ID] = tot16;
		  	});
		  	//
			//
			//PROCESS AND FORMAT DEMOGRAPHIC DATA
			///////////////////////////////////////////////////
			var popChangeByTract = {},
				popDenByTract = {},
				popDenChangeByTract = {},
		  		nonWhiteByTract = {},
		  		nonWhiteChangeByTract = {},
		  		unemployByTract = {},
		  		unemployChangeByTract = {},
		  		collegeByTract = {},
		  		collegeChangeByTract = {},
		  		incomeByTract = {},
		  		incomeChangeByTract = {};
		  	
		  	tractdata.forEach(function(d) {
		  		var popChange = +d.TOTALPOP_CHANGE,
		  			popDen = +d.POPDEN_2015,
		  			popDenChange = +d.POPDEN_CHANGE,
		  			nonWhite = +d.NONWHITE_2015,
		  			nonWhiteChange = +d.NONWHITE_CHANGE,
		  			unempl = +d.UNEMPLOY_2015,
		  			unemplChange = +d.UNEMPLOY_CHANGE,
		  			college = +d.COLLEGE_2015,
		  			collegeChange = +d.COLLEGE_CHANGE,
		  			income = +d.INC_2015,
		  			incomeChange = +d.INC_CHANGE;
		  		if (isNaN(popChange)) {
		  			popChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {popChangeByTract[d.GEO_ID] = popChange;}
		  		if (isNaN(popDen)) {
		  			popDenByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {popDenByTract[d.GEO_ID] = popDen;}
		  		if (isNaN(popDenChange)) {
		  			popDenChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {popDenChangeByTract[d.GEO_ID] = popDenChange;}
		  		if (isNaN(nonWhite)) {
		  			popChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {nonWhiteByTract[d.GEO_ID] = nonWhite;}
		  		if (isNaN(nonWhiteChange)) {
		  			nonWhiteChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {nonWhiteChangeByTract[d.GEO_ID] = nonWhiteChange;}
		  		
		  		if (isNaN(unempl)) {
		  			unemployByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {unemployByTract[d.GEO_ID] = unempl;}
		  		
		  		if (isNaN(unemplChange)) {
		  			unemployChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {unemployChangeByTract[d.GEO_ID] = unemplChange;}
		  		if (isNaN(college)) {
		  			collegeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {collegeByTract[d.GEO_ID] = college;}
		  		if (isNaN(collegeChange)) {
		  			collegeChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {collegeChangeByTract[d.GEO_ID] = collegeChange;}
		  		if (isNaN(income)) {
		  			incomeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {incomeByTract[d.GEO_ID] = income;}
	
				if (isNaN(incomeChange)) {
		  			incomeChangeByTract[d.GEO_ID] = "ERROR";
		  		}
		  		else {incomeChangeByTract[d.GEO_ID] = incomeChange;}
		  	});
		  	
		  	var usp2016Margins = d3.values(usp2016MarginByTract),
		  		usp2012Margins = d3.values(usp2012MarginByTract),
		  		uspChangeMargins = d3.values(uspChangeMarginByTract),
		  		usp2016Totals = d3.values(usp2016TotalsByTract),
		  		popChange = d3.values(popChangeByTract),
		  		popDen = d3.values(popDenByTract),
		  		popDenChange = d3.values(popDenChangeByTract),
		  		nonWhite = d3.values(nonWhiteByTract),
		  		nonWhiteChange = d3.values(nonWhiteChangeByTract),
		  		unemploy = d3.values(unemployByTract),
		  		unemployChange = d3.values(unemployChangeByTract),
		  		college = d3.values(collegeByTract),
		  		collegeChange = d3.values(collegeChangeByTract),
		  		income = d3.values(incomeByTract),
		  		incomeChange = d3.values(incomeChangeByTract);
		  	//Set initial variables for visualizations
		  	var voteMapDate = "2016",
				voteMapRace = "PRESIDENT";
			var demoVar = "POPULATION DENSITY",
				demoChange = "NO CHANGE";
			//
			//
			//Make VOTE MAP
			///////////////////////////////////////////////////
			//Make container
			var voteMapBoxWidth = 900,
			    voteMapBoxHeight = 540;
			var voteMapContainer = d3.select("#votemap")
				.append("svg")
			    .attr("width", voteMapBoxWidth)
			    .attr("height", voteMapBoxHeight);
			var voteG = voteMapContainer.append("g");
			//container for mouse events
			var mapZoomBox = voteMapContainer.append("rect")
				.attr("class", "click-overlay")
				.attr("width", voteMapBoxWidth)
				.attr("height", voteMapBoxHeight)
				.on("mouseover", function() {
					mapZoomBox
						.style("stroke", initialColor)
			    		.style("stroke-width", "3px")
			    		.style("stroke-linecap", "butt")
			    		.style("stroke-dasharray", "2, 3");
				})
				.on("mouseout", function() {
					mapZoomBox
						.style("stroke", "none");
				})
			
			//Set projection information
		  	var voteProjection = d3.geoAlbers()
			    .rotate( [77.1945,0] )
	    		.center( [0, 41.2033] );
			    
	    	var votePath = d3.geoPath()
			    .projection(voteProjection)
			    .pointRadius(function(d) {
		    		if (+d.properties.Population > 1000000) {return (5);}
		    		if (+d.properties.Population >100000) {return (3);}
		    		else {return (2);}
		    	});
		  	
		  	var allTracts = topojson.feature(pa, pa.objects.PA_CensusTracts_2010);

		  	voteProjection
		  		.scale(1)
		  		.translate([0,0]);
		  	
		  	var b = votePath.bounds(allTracts),
			    s = .95 / Math.max((b[1][0] - b[0][0]) / voteMapBoxWidth, (b[1][1] - b[0][1]) / voteMapBoxHeight),
			    t = [(voteMapBoxWidth - s * (b[1][0] + b[0][0])) / 2, (voteMapBoxHeight - s * (b[1][1] + b[0][1])) / 2];
			
			voteProjection
		    	.scale(s)
		    	.translate(t);
		    
		    var zoom = d3.zoom()
		    	.scaleExtent([1,10])
		    	.on("zoom", zoomed);
		    
		    voteMapContainer
				.call(zoom);
		    
		    //Set colors
		    var voteColorRed = d3.scaleLinear()
	      		.domain([0,1])
	      		.range(['#f8e5e6','#dd0035']);
	      	var voteColorBlue = d3.scaleLinear()
	      		.domain([-1,0])
	      		.range(['#3c5bff', '#d2e4ff']);
	      	var changeColorRed = d3.scaleLinear()
	      		.domain([0,.5])
	      		.range(['#f8e5e6','#dd0035']);
	      	var changeColorBlue = d3.scaleLinear()
	      		.domain([-0.5,0])
	      		.range(['#3c5bff', '#e6f0ff']);
	      	var voteColor = d3.scaleThreshold()
	      		.domain([-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0])
	      		.range(['#3c5bff','#5c79ff','#7c98ff','#9cb7ff','#bcd6ff','#ffd5d4','#f8aab4','#f17f94','#ea5574','#dd0035']);
	      	var seePlaces = "ON";
	      	//Make map geometry elements
		  	voteG.append("g")
			    .selectAll("path")
		    	.data(topojson.feature(pa, pa.objects.PA_CensusTracts_2010).features) 
		      	.enter().append("path")
		      	.attr("class", "tracts vote-tracts tracts-non-brushed")
		      	.attr("tractno", function(d) {return d.properties.GEO_ID;})
		      	.attr("d", votePath)
		      	.style("fill", function(d) { 
		      		var tract = d.properties.GEO_ID;
		      		if (usp2016MarginByTract[tract] == "ERROR") {return initialColor;}
		      		else {
		      			if (usp2016MarginByTract[tract] >= 0) {
		      				return voteColorRed(usp2016MarginByTract[tract]);
		      			} 
		      			if (usp2016MarginByTract[tract] < 0) {
		      				return voteColorBlue(usp2016MarginByTract[tract]);
		      			}}
		      	})
		      	.style ("stroke", function(d) { 
		      		var tract = d.properties.GEO_ID;
		      		if (usp2016MarginByTract[tract] == "ERROR") {return initialColor;}
		      		else {
		      			if (usp2016MarginByTract[tract] >= 0) {
		      				return voteColorRed(usp2016MarginByTract[tract]);
		      			} 
		      			if (usp2016MarginByTract[tract] < 0) {
		      				return voteColorBlue(usp2016MarginByTract[tract]);
		      			}}
		      	})
		      	.style("stroke-width", "0.8px");
		    
		    voteG.selectAll(".city")
		    	.data(topojson.feature(cities, cities.objects.PA_Cities).features)
		    	.enter().append("path")
		    	.attr("d", votePath)
		    	.attr("class", "city")
		    	.attr("visibility", function(d) {
		    		if (seePlaces == "ON") {
		    			if (+d.properties.Population >= 28500) {return "visible";}
		    			else {return "hidden";}
		    		}
		    		if (seePlaces == "OFF") {return "hidden";}
		    		});
		    
		    voteG.selectAll(".city-label")
		    	.data(topojson.feature(cities, cities.objects.PA_Cities).features)
		    	.enter().append("text")
		    	.attr("class", "city-label")
		    	.attr("transform", function(d) {return "translate(" + voteProjection(d.geometry.coordinates) + ")"; })
		    	.attr("visibility", function(d) {
		    		if (seePlaces == "ON") {
		    			if (+d.properties.Population >= 28500) {return "visible"}
		    			else {return "hidden";}
		    		}
		    		if (seePlaces == "OFF") {return "hidden";}
		    		})
		    	.attr("dy", function(d) {
		    		if (d.properties.City == "Bethlehem" || d.properties.City == "Philadelphia" || d.properties.City == "Pittsburgh") {return "-.35em";}
		    		// if (d.properties.City == "Wilkinsburg" || d.properties.City == "Monroesville" || d.properties.City == "Upper St. Clair") {return "1.3em";}
		    		else {return ".7em";}})
		    	.attr("x", function(d) { return d.geometry.coordinates[0] > -77.1945 ? -5 : 5; })
    			.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -77.1945 ? "end" : "start"; })
    			.text(function(d) {return d.properties.City;});
		    
		    var exploreText = voteMapContainer.append("text")
				.attr("class", "map-text")
				.attr("x", voteMapBoxWidth - 15)
				.attr("y", 45)
				.text("zoom and move map to explore"); 

			var howText = voteMapContainer.append("text")
				.attr("class", "map-text-sm")
				.attr("x", voteMapBoxWidth - 15)
				.attr("y", 535)
				.text("double click or pinch to zoom");
			
			var placeNamesText = voteMapContainer.append("text")
				.attr("class", "map-sel-text")
				.attr("x", voteMapBoxWidth - 15)
				.attr("y", 25)
				.text(function() {
					if (seePlaces == "ON") {return "placenames: on";}
					if (seePlaces == "OFF") {return "placenames: off";}
				});
			
			var placeNamesBox = voteMapContainer.append("rect")
				.attr("class", "click-overlay")
				.attr("width", 120)
				.attr("height", 20)
				.attr("x", voteMapBoxWidth - 125)
				.attr("y", 10)
				.on("click", togglePlaceNames)
				.on("mouseover", function(d) {d3.select(this).style("cursor", "pointer");})
				.on("mouseout", function(d) {d3.select(this).style("cursor", "default");});
			
			var resetTextBox = voteMapContainer.append("rect")
				.attr("class", "click-overlay-variable")
				.attr("id", "resetClickOverlay")
				.attr("width", 120)
				.attr("height", 30)
				.attr("x", voteMapBoxWidth - 125)
				.attr("y", 30)
				.attr("pointer-events", "none")
				.on("click", resetZoom)
				.on("mouseover", function(d) {d3.select(this).style("cursor", "pointer");})
				.on("mouseout", function(d) {d3.select(this).style("cursor", "default");});
			//
			//
			//Make Selector Buttons and Dynamic Titles
			////////////////////////////////////////////////////
			//Make container
			var selBoxWidth = 900,
				selBoxHeight = 300;
			var selContainer = d3.select("#selector")
				.append("svg")
				.attr("width", selBoxWidth)
				.attr("height", selBoxHeight);
			var voteLegendY = 15,
				voteTitleY = 80,
				voteSelectorY = 120,
				demoSelectorY = 165,
				demoTitleY = 245,
				demoLegendY = 265;
			var demoSelBoxWidth = 900,
				demoSelBoxHeight = 110;
			//Make legend
			var voteLegendBoxWidth = selBoxWidth,
				voteLegendBoxHeight = 38,
				voteLegendBarWidth = 530,
				voteLegendBarHeight = 9,
				voteLabelsNum = 5;
			var voteLegendBox = selContainer.append("svg")
				.attr("width", voteLegendBoxWidth)
				.attr("height", voteLegendBoxHeight)
				.attr("y", voteLegendY);
			var voteLegend = voteLegendBox.append("g")
				.attr("class", "vote-legend")
				.each(makeVoteLegend);
			var demoLegendBox = selContainer.append("svg")
				.attr("width", voteLegendBoxWidth)
				.attr("height", voteLegendBoxHeight)
				.attr("y", demoLegendY);
				
			var demoLegend = demoLegendBox.append("g")
				.attr("class", "demo-legend")
				.each(makeVoteLegend);
			// var voteSelBoxWidth = 900,
			// 	voteSelBoxHeight = 100;
			// var voteSelContainer = d3.select("#voteselector")
			// 	.append("svg")
			// 	.attr("width", voteSelBoxWidth)
			// 	.attr("height", voteSelBoxHeight);
			// var demoSelBoxWidth = 900,
			// 	demoSelBoxHeight = 100;
			// var demoSelContainer= d3.select("#demoselector")
			// 	.append("svg")
			// 	.attr("width", demoSelBoxWidth)
			// 	.attr("height", demoSelBoxHeight);
			
			//Set dimension variables
			var voteDateLabels = ["2016", "2012", "CHANGE"],
				voteRaceLabels = ["PRESIDENT", "US SENATE", "US CONGRESS"];
			var demoVarLabels = ["POPULATION DENSITY", "PERCENT NON-WHITE", "UNEMPLOYMENT RATE", "EDUCATION", "INCOME"],
				demoChangeLabels = ["CHANGE 2010-2015"];
			var voteDateBoxWidth = 250,
				voteDateBoxHeight =18,
				voteRaceBoxWidth = 250,
				voteRaceBoxHeight = 18,
				voteSelSpacing = 15;
			var voteDateButtonWidth = voteDateBoxWidth/(voteDateLabels.length),
				voteDateButtonHeight = voteDateBoxHeight,
				voteRaceButtonWidth = voteRaceBoxWidth/(voteRaceLabels.length),
				voteRaceButtonHeight = voteRaceBoxHeight;
			var demoButtonWidth = voteDateButtonWidth,
				demoButtonHeight = 30;
			var demoVarBoxWidth = demoButtonWidth*demoVarLabels.length,
				demoVarBoxHeight = demoButtonHeight,
				demoChangeBoxWidth = demoButtonWidth*demoChangeLabels.length,
				demoChangeBoxHeight = demoButtonHeight
				demoSelSpacing = 15;
			var voteDateContainer = selContainer.append("svg")
				.attr("class", "voteMapBtn-container")
				.attr("width", voteDateBoxWidth)
				.attr("height", voteDateBoxHeight)
				.attr("x", ((selBoxWidth/2)-(voteDateBoxWidth)-voteSelSpacing))
				.attr("y", voteSelectorY);
			var voteRaceContainer = selContainer.append("svg")
				.attr("class", "voteMapBtn-container")
				.attr("width", voteRaceBoxWidth)
				.attr("height", voteRaceBoxHeight)
				.attr("x", ((selBoxWidth/2)+voteSelSpacing))
				.attr("y", voteSelectorY);
			var demoVarContainer = selContainer.append("svg")
				.attr("class", "demoBarsBtn-container")
				.attr("width", demoVarBoxWidth)
				.attr("height", demoVarBoxHeight)
				.attr("x", ((selBoxWidth/2)-voteDateBoxWidth-voteSelSpacing))
				.attr("y", demoSelectorY);
			var demoChangeContainer = selContainer.append("svg")
				.attr("class", "demoBarsBtn-container")
				.attr("width", demoChangeBoxWidth)
				.attr("height", demoChangeBoxHeight)
				.attr("x", ((selBoxWidth/2)-voteDateBoxWidth+demoSelSpacing+(demoButtonWidth*demoVarLabels.length)))
				.attr("y", demoSelectorY);
			var voteMapTitle = selContainer.append("text")
				.attr("class", "voteMap-title")
				.attr("x", selBoxWidth/2)
				.attr("y", voteTitleY);
			var demoBarsTitle = selContainer.append("text")
				.attr("class", "demoBars-title")
				.attr("x", selBoxWidth/2)
				.attr("y", demoTitleY)
			var voteDateButtons = voteDateContainer.selectAll("g")
				.data(voteDateLabels)
				.enter()
				.append("g")
				.attr("class", "date-buttons");
			var voteRaceButtons = voteRaceContainer.selectAll("g")
				.data(voteRaceLabels)
				.enter()
				.append("g")
				.attr("class", "race-buttons");
			var demoVarButtons = demoVarContainer.selectAll("g")
				.data(demoVarLabels)
				.enter()
				.append("g")
				.attr("class", "demoVar-buttons");
			var demoChangeButtons = demoChangeContainer.selectAll("g")
				.data(demoChangeLabels)
				.enter()
				.append("g")
				.attr("class", "demoChange-buttons");
			//make colored rectangle of date buttons
			voteDateButtons.append("rect")
				.attr("class", function(d) {
					if (voteMapDate == d) {return "voteMapSelBtn-rect-date voteMapSelBtn-rect-press";}
					else {return "voteMapSelBtn-rect-date voteMapSelBtn-rect-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("width", voteDateButtonWidth)
				.attr("height", voteDateButtonHeight)
				.attr("x", function(d,i) {return voteDateButtonWidth*i;})
				.attr("y", 0)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleVoteDateButtonClick);
			//make colored rectangle of race buttons
			voteRaceButtons.append("rect")
				.attr("class", function(d) {
					if (voteMapRace == d) {return "voteMapSelBtn-rect-race voteMapSelBtn-rect-press";}
					else {return "voteMapSelBtn-rect-race voteMapSelBtn-rect-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("width", voteRaceButtonWidth)
				.attr("height", voteRaceButtonHeight)
				.attr("x", function(d,i) {return voteRaceButtonWidth*i;})
				.attr("y", 0)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleVoteRaceButtonClick);
			//make colored rectangle of demo variable buttons
			demoVarButtons.append("rect")
				.attr("class", function(d) {
					if (demoVar == d) {return "demoBarsSelBtn-rect-vars demoBarsSelBtn-rect-press";}
					else {return "demoBarsSelBtn-rect-vars demoBarsSelBtn-rect-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("width", demoButtonWidth)
				.attr("height", demoButtonHeight)
				.attr("x", function(d,i) {return demoButtonWidth*i;})
				.attr("y", 0)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleDemoVarButtonClick);
			//make colored rectangle of demo change button
			demoChangeButtons.append("rect")
				.attr("class", function(d) {
					if (demoChange == "CHANGE") {return "demoBarsSelBtn-rect-change demoBarsSelBtn-rect-press";}
					else {return "demoBarsSelBtn-rect-change demoBarsSelBtn-rect-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("width", demoButtonWidth)
				.attr("height", demoButtonHeight)
				.attr("x", function(d,i) {return demoButtonWidth*i;})
				.attr("y", 0)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleDemoChangeButtonClick);
			//make text of date buttons
			voteDateButtons.append("text")
				.attr("class", function(d) {
					if (voteMapDate == d) {return "voteMapSelBtn-text-date voteMapSelBtn-text-press";}
					else {return "voteMapSelBtn-text-date voteMapSelBtn-text-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("x", function(d,i) {return ((voteDateButtonWidth*i) + (voteDateButtonWidth/2));
				})
				.attr("y", voteDateButtonHeight/2)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleVoteDateButtonClick)
	            .text(function(d) {return d;});
	        //make text of race buttons
	        voteRaceButtons.append("text")
				.attr("class", function(d) {
					if (voteMapRace == d) {return "voteMapSelBtn-text-race voteMapSelBtn-text-press";}
					else {return "voteMapSelBtn-text-race voteMapSelBtn-text-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("x", function(d,i) {return ((voteRaceButtonWidth*i) + (voteRaceButtonWidth/2));
				})
				.attr("y", voteRaceButtonHeight/2)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleVoteRaceButtonClick)
	            .text(function(d) {return d;});
	        //make text of demo variable buttons
	        demoVarButtons.append("text")
				.attr("class", function(d) {
					if (demoVar == d) {return "demoBarsSelBtn-text-vars demoBarsSelBtn-text-press";}
					else {return "demoBarsSelBtn-text-vars demoBarsSelBtn-text-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("x", function(d,i) {return ((demoButtonWidth*i) + (demoButtonWidth/2));
				})
				.attr("y", demoButtonHeight/2)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleDemoVarButtonClick)
	            .text(function(d) {return d;})
	            .call(wrap, demoButtonWidth-6);
    
	        //make text of demo change button
	        demoChangeButtons.append("text")
				.attr("class", function(d) {
					if (demoChange == "CHANGE") {return "demoBarsSelBtn-text-change demoBarsSelBtn-text-press";}
					else {return "demoBarsSelBtn-text-change demoBarsSelBtn-text-noPress";}
				})
				.attr("buttonVal", function(d) {return d;})
				.attr("x", function(d,i) {return ((demoButtonWidth*i) + (demoButtonWidth/2));
				})
				.attr("y", demoButtonHeight/2)
				.on("mouseover", handleSelButtonMouseover)
				.on("mouseout", handleSelButtonMouseout)
				.on("click", handleDemoChangeButtonClick)
	            .text(function(d) {return d;})
	            .call(wrap, demoButtonWidth-6);
	        //box outlines
			voteDateContainer.append("rect")
	        	.attr("width", voteDateBoxWidth)
	        	.attr("height", voteDateBoxHeight)
	        	.style("fill", "none")
	        	.style("stroke", dkGrey)
	        	.style("stroke-width", "2px");
	        voteRaceContainer.append("rect")
	        	.attr("width", voteDateBoxWidth)
	        	.attr("height", voteDateBoxHeight)
	        	.style("fill", "none")
	        	.style("stroke", dkGrey)
	        	.style("stroke-width", "2px");
	        demoVarContainer.append("rect")
	        	.attr("width", demoVarBoxWidth)
	        	.attr("height", demoVarBoxHeight)
	        	.style("fill", "none")
	        	.style("stroke", dkGrey)
	        	.style("stroke-width", "2px");
	        demoChangeContainer.append("rect")
	        	.attr("width", demoChangeBoxWidth)
	        	.attr("height", demoChangeBoxHeight)
	        	.style("fill", "none")
	        	.style("stroke", dkGrey)
	        	.style("stroke-width", "2px");
	        //style dynamic title of map
	        voteMapTitle
	        	.text(getVoteMapTitle(voteMapDate, voteMapRace));
	   
	        //style dynamic title of demoBars
	        demoBarsTitle
	        	.text(getDemoBarsTitle(demoVar, demoChange));
			
			//
		    //
		    //MAKE Bar Chart
		    ////////////////////////////////////////////////////
		    
		    var barChartWidth = 920
		    	barMargin = {top: 20, right: 5, bottom: 20, left: 60},
		    	barPadding = {top: 40, right: 40, bottom: 40, left: 40},
		    	barOuterWidth = 870,
		    	barOuterHeight = popChange.length + barMargin.top + barPadding.top + barMargin.bottom + barPadding.bottom,
		    	barChartHeight = barOuterHeight,
			    barInnerWidth = barOuterWidth - barMargin.left - barMargin.right,
			    barInnerHeight = barOuterHeight - barMargin.top - barMargin.bottom,
			    barWidth = barInnerWidth - barPadding.left - barPadding.right,
			    barHeight = barInnerHeight - barPadding.top - barPadding.bottom,
			    colorBarWidth = 30,
			    brushMargin = {top: 20, right: 10, bottom: 20, left: 40};
			    // colorMargin = {top: 20, right: 5, bottom: 20, left: 5};
			

			//define number of quantiles for ticks along Y axis
			//controls scales of y grid lines as well as values on static y axis
			//numQuants = 5 -> five quantiles shown on Y axis (i.e. 0.2, 0.4, 0.6, 0.8, 1)
			var numQuants = 10;
			var formatPercent = d3.format(".0%");
			
			//gets data name according to selected variable
			var demoData = getDemoVarName();
			
			//sorts data according to selected variable
        	var tractdataSorted = tractdata.sort(function(a, b) {
        		if(!isFinite(a[demoData] && !isFinite(b[demoData]))) {
					return 0;
				}
				if( !isFinite(a[demoData]) ) {
			        return 1;
			    }
			    if( !isFinite(b[demoData]) ) {
			        return -1;
			    }
				return +b[demoData] > +a[demoData] ? 1 : +b[demoData] < +a[demoData] ? -1 : 0;
        	});

            var barChartContainer = d3.select("#barchart").append("svg")
            	.attr("width", barChartWidth)
	        	.attr("height", barChartHeight)
	        	.attr("x", 0)
	        	.attr("y", 0);
	  		
	  		//this will pick up brushing drag on the color bar - make bar wider than visible graphics to facilitate this
			var barsColorBar = barChartContainer.append("svg")
	        	.attr("width", colorBarWidth + 20)
	        	.attr("height", barHeight)
	        	.attr("x", barChartWidth - brushMargin.right - colorBarWidth - 20)
	        	.attr("y", barMargin.top + barPadding.top)
	        	.on("click", handleColorBarsClick);
	        
	        //"drag to select in map" label text
	        var colorBarLabel = barChartContainer.append("text")
	       		.attr("class", "colorBar-label")
	       		.attr("x", barChartWidth - colorBarWidth - brushMargin.right + (colorBarWidth/2) - 10)
	       		.attr("y", 8)
	       		.text("drag to")
	       		.append("tspan")
	       		.text("select")
	       		.attr("x", barChartWidth - colorBarWidth - brushMargin.right + (colorBarWidth/2) - 10)
	       		.attr("dy", "1.3em")
	       		.append("tspan")
	       		.text("tracts")
	       		.attr("x", barChartWidth - colorBarWidth - brushMargin.right + (colorBarWidth/2) - 10)
	       		.attr("dy", "1.3em")
	       		.append("tspan")
	       		.text("in map")
	       		.attr("x", barChartWidth - colorBarWidth - brushMargin.right + (colorBarWidth/2) - 10)
	       		.attr("dy", "1.3em");
	       	
			var barsContainer = barChartContainer.append("svg")
	            .attr("width", barOuterWidth)
	            .attr("height", barOuterHeight)
	            .append("g")
	            .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");
	        
	        //g for chart
	        var innerBars = barsContainer.append("g")
	        	.attr("transform", "translate(" + barPadding.left + "," + barPadding.top + ")");
			
			//get min and max values of variable
			var demoVarMin = d3.min(getDemoVar()),
				demoVarMax = d3.max(getDemoVar());
			
			//scales for use with various axes
			
			//use with top and bottom axes
			//takes in demo variable, returns x position along axis
			var barsX = d3.scaleLinear()
				.domain([demoVarMin, demoVarMax]).nice()
			    .range([0, barWidth]);
			
			//use with floating Y axis
			//takes in GEO_ID, returns y position along axis
			var barsY = d3.scaleBand()
				.domain(tractdataSorted.map(function(d) {
					return d.GEO_ID;
				}))
				.rangeRound([0, barHeight]);
			
			//use with Y grid
			var barsYGrid = d3.scaleLinear()
				.domain([0, 1])
			    .range([0, barHeight]);
			
			//Axes Assignments (pt 1)
			//axis assignment for x grid lines
			var xGridLines = d3.axisBottom()
				.scale(barsX)
				.tickSize(-barHeight, 0, 0)
			    .tickFormat("");
			
			//Make Chart Graphical Elements
			//axis assignment for y grid lines
			var yGridLines = d3.axisLeft()
				.scale(barsYGrid)
				.ticks(numQuants*Math.round(barHeight/barWidth))
				.tickSize(-barWidth, 0, 0)
			    .tickFormat("");
			
			// add X gridlines
			// add Y gridlines
			innerBars.append("g")			
			    .attr("class", "grid")
			    .attr("transform", "translate(0," + barHeight + ")")
			    .call(xGridLines);
			
			innerBars.append("g")
				.attr("class", "grid")
			    .call(yGridLines);
			
			//append color bars
			var colorBars = barsColorBar.selectAll(".color-bar")
				.data(tractdataSorted)
				.enter()
			  .append("rect")
			  .attr("class", "color-bar")
			  	.attr("y", function (d) {
	                return barsY(d.GEO_ID);
	            })
	            .attr("height", function(d) {
	            	if (isNaN(getDemoData(d))) {
	            		return 0;
	            	}
	            	else {return 1;}
	            })
	            .attr("x", 10)
	            .attr("width", 30)
	            .style("fill", function(d) {
	            	var tract = d.GEO_ID;
	            	return (getVoteColor(tract));
	            	});
			  	// .style("opacity", "1");
	        
	        //append bars
	        innerBars.selectAll(".bar")
	            .data(tractdataSorted)
	            .enter()
	          .append("rect")
	            .attr("class", "bar")
	            .attr("y", function (d) {
	                return barsY(d.GEO_ID);
	            })
	            .attr("height", function(d) {
	            	if (isNaN(getDemoData(d))) {
	            		return 0;
	            	}
	            	else {return 1;}
	            })
	            .attr("x", function(d) {
	            	if (isNaN(getDemoData(d))) {
	            		return 0;
	            	}
	            	else {return barsX(Math.min(0, getDemoData(d)));}
	            })
	            .attr("width", function(d) {
	            	if (isNaN(getDemoData(d))) {
	            		return 0;
	            	}
	                else {return Math.abs(barsX(getDemoData(d))-barsX(0));}
	            })
	            .style("fill", function(d) {
	            	var tract = d.GEO_ID;
	            	return (getVoteColor(tract));
	            	});
			  	// .style("opacity", "1");
			
			// innerBars.append("g")
			//     .attr("class", "x axis")
			//     .attr("id", "demoXAxisTop")
			//     .attr("transform", "translate(0," + -10 + ")")
			//     .call(barsXAxisTop);
			// innerBars.append("g")
			//     .attr("class", "x axis")
			//     .attr("id", "demoXAxisBottom")
			//     .attr("transform", "translate(0," + barHeight + ")")
			//     .call(barsXAxisBottom);    
			// innerBars.append("g")
			//     .attr("class", "y axis")
			//     .attr("id", "demoYAxis")
			//     .attr("transform", "translate(" + barsX(0) + ",0)")
			//     .call(barsYAxis);
			// tractdata = tractdata.sort(function(a, b) {
   //          		return d3.ascending(a.GEO_ID, b.GEO_ID);
   //          	});
   			
   			//array of strings of values of quantile breaks
	        //must be called after bars are appended
			// var quantileVals = getQuantileValues(numQuants, demoVarMin, demoVarMax);
			var quantileVals = getQuantileValues(numQuants, demoData, demoVar, demoChange);
			
			//scale for use with static Y axis
			//evenly spaces array of strings along y axis height
			var barsYQuantiles = d3.scalePoint()
				.domain(quantileVals)
				.range([0, barHeight]);
			
			//Axes Assignments (pt 2)
			//top X axis
			var barsXAxisTop = d3.axisTop()
			    .scale(barsX)
			    .tickFormat(getTickFormat(demoVar, demoChange));
			
			//bottom X axis
			var barsXAxisBottom = d3.axisBottom()
				.scale(barsX)
				.tickFormat(getTickFormat(demoVar, demoChange));
			
			//Y axis that moves with data
			var barsZeroAxis = d3.axisLeft()
			    .scale(barsY)
			    .tickSize(0)
			    .tickFormat("");
			
			//static Y axis on left side of chart
			var barsYAxis = d3.axisLeft()
				.scale(barsYQuantiles);
			
			//Make axis elements
			//top X Axis
			innerBars.append("g")
			    .attr("class", "x axis")
			    .attr("id", "demoXAxisTop")
			    .attr("transform", "translate(0," + -10 + ")")
			    .call(barsXAxisTop);
			
			//bottom X Axis (duplicates top X Axis)
			innerBars.append("g")
			    .attr("class", "x axis")
			    .attr("id", "demoXAxisBottom")
			    .attr("transform", "translate(0," + (barHeight + 10) + ")")
			    .call(barsXAxisBottom);    
			
			//static left-aligned Y axis to show quantiles
			innerBars.append("g")
			    .attr("class", "y axis")
			    .attr("id", "demoYAxis")
			    .attr("transform", "translate(" + -10 + ",0)")
			    .call(barsYAxis);
			
			//dynamic Y axis that shifts with data
			innerBars.append("g")
			    .attr("class", "zero axis")
			    .attr("id", "demoZeroAxis")
			    .attr("transform", "translate(" + barsX(0) + ",0)")
			    .call(barsZeroAxis);
			
			var chartXLabel = getChartLabels(demoVar, demoChange)[0],
				chartYLabel = getChartLabels(demoVar, demoChange)[1];
			
			//top X axis title
			innerBars.append("text")
				.attr("class", "chart-label")
				.attr("y", -40)
				.attr("x", barWidth)
				.text(chartXLabel);
			
			//top Y axis title
			innerBars.append("text")
				.attr("class", "chart-yaxis-label")
				.attr("y", 0)
				.attr("x", -19)
				.text(chartYLabel)
				.call(wrapBottom, barPadding.left);
				
			//define brushing
			var barBrush = d3.brushY()
				.extent([[0, 0], [colorBarWidth+20, barHeight]])
				.on("brush", highlightBrushedTracts);
			
			barsColorBar.append("g")
				.attr("class", "brush")
				.call(barBrush);
			
	        
	        // //add a value label to the right of each bar
	        // innerBars.append("text")
	        //     .attr("class", "label")
	        //     //y position of the label is halfway down the bar
	        //     .attr("y", function (d) {
	        //         return y(d.name) + y.rangeBand() / 2 + 4;
	        //     })
	        //     //x position is 3 pixels to the right of the bar
	        //     .attr("x", function (d) {
	        //         return x(d.value) + 3;
	        //     })
	        //     .text(function (d) {
	        //         return d.value;
	        //     });
		    


		    //
	       	//
	       	//FUNCTIONS WITHIN drawMap function
	       	////////////////////////////////////////////////////
	       	//
	       	//
	       	//MAP FUNCTIONS
	       	////////////////////////////////////////////////////
		    
		    function zoomed() {
		    //Controls zoom behavior of map
		    //Turns on labels of smaller city when zoom level reaches 3
		    //Turns on bounding box for map when zoomed
		    //Scales placename labels on zoom
		    	voteG.attr("transform", d3.event.transform);
		    	
		    	var zoomScale = d3.zoomTransform(this).k;
		    	
		    	//controls scale and visibility of cities
		    	voteG.selectAll(".city")
		    		.attr("d", votePath.pointRadius(function(d) {
		    		if (+d.properties.Population > 1000000) {return (5/zoomScale);}
		    		if (+d.properties.Population > 100000) {return (3/zoomScale);}
		    		else {return (2/zoomScale);}
		    		}))
		    		.attr("visibility", function(d) {
		    			if (seePlaces == "ON") {
		    				if (zoomScale >= 1.7) {return "visible";}
		    				if (zoomScale < 1.7) {
		    					if (+d.properties.Population >= 28500) {return "visible";}
		    					if (+d.properties.Population < 28500) {return "hidden";}
		    				}
		    			}
		    		if (seePlaces == "OFF") {return "hidden";}
		    		});
		    	
		    	//controls scale and visibility of city labels
		    	voteG.selectAll(".city-label")
		    		.style("font-size", function() {return 9/zoomScale + "px";})
		    		.attr("visibility", function(d) {
		    			if (seePlaces == "ON") {
		    				if (zoomScale >= 1.7) {return "visible";}
		    				if (zoomScale < 1.7) {
		    					if (+d.properties.Population >= 28500) {return "visible";}
		    					if (+d.properties.Population < 28500) {return "hidden";}
		    				}
		    			}
		    		if (seePlaces == "OFF") {return "hidden";}
		    		})
		    		.attr("dy", function(d) {
			    		if (d.properties.City == "Bethlehem" || d.properties.City == "Philadelphia" || d.properties.City == "Pittsburgh") {return -.35/zoomScale+"em";}
			    		if (d.properties.City == "Wilkinsburg" || d.properties.City == "Monroeville" || d.properties.City == "Upper St. Clair") {return 3/zoomScale+"em";}
			    		else {return .7/zoomScale+"em";}})
			    	.attr("x", function(d) { return d.geometry.coordinates[0] > -77.1945 ? -7/zoomScale : 7/zoomScale; })
	    			.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -77.1945 ? "end" : "start"; });
	    		
	    		//
	    		exploreText
	    			.text(function() {
	    				if (zoomScale >= 1.2) {
	    					return "reset map";}
	    				else {return "zoom and move map to explore";}
	    			})
	    			.style("fill", function() {
	    				if (zoomScale >= 1.2) 
	    					return "black";
	    			});
	    		
	    		howText
	    			.text(function() {
	    				if (zoomScale >= 1.2) {
	    					return "";}
	    				else {return "double click or pinch to zoom";}
	    			})

	    		placeNamesText
	    			.style("fill", function() {
	    				if (zoomScale >= 1.2) 
	    					return "black";
	    			});
	    		
	    		resetTextBox
	    			.attr("pointer-events", function() {
	    				if (zoomScale >= 1.2) {
	    					return "all";
	    				}
	    				else {return "none";}
	    			});
	    			
	    		//turns on dashed map bounding box on zoom
	    		//makes reset button
		    	if (d3.zoomTransform(this).k != 1) {
			    	mapZoomBox
			    		.style("stroke", initialColor)
			    		.style("stroke-width", "3px")
			    		.style("stroke-linecap", "butt")
			    		.style("stroke-dasharray", "2, 3");
			    }
			    //turns off dashed map bounding box when zoom back out to 1
			    if (d3.zoomTransform(this).k == 1) {
			    	mapZoomBox
			    		.style("stroke", "none");
			    }
		    }
		    function resetZoom() {
				voteMapContainer
					.transition()
					.duration(750)
						.call(zoom.transform, d3.zoomIdentity);
			}
		    function togglePlaceNames () {
		    //controls visibility of placenames on map via user input
				if (seePlaces == "ON") {
					var newSeePlaces = "OFF";
					placeNamesText
						.text("placenames: off");
					voteG.selectAll(".city")
						.attr("visibility", "hidden");
					voteG.selectAll(".city-label")
						.attr("visibility", "hidden");
				}
				if (seePlaces == "OFF") {
					var newSeePlaces = "ON";
					placeNamesText
						.text("placenames: on");
					voteG.selectAll(".city")
						.attr("visibility", function(d) {
							if (+d.properties.Population >= 28500) {return "visible";}
							else {return "hidden";}	
						});
					voteG.selectAll(".city-label")
						.attr("visibility", function(d) {
							if (+d.properties.Population >= 28500) {return "visible";}
							else {return "hidden";}	
						});
				}
				seePlaces = newSeePlaces;
			}
			//
	       	//
	       	//SELECTOR FUNCTIONS
	       	////////////////////////////////////////////////////
		    //SELECTOR FUNCTIONS
	       	//
	       	//Functions to register new selection
	       	////////////////////////////////////////////////////
	       	function handleVoteDateButtonClick(d) {
		    	d3.selectAll(".voteMapSelBtn-rect-date").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("voteMapSelBtn-rect-press", true)
		    		.classed("voteMapSelBtn-rect-noPress", false);
		    	d3.selectAll(".voteMapSelBtn-rect-date").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("voteMapSelBtn-rect-press", false)
		    		.classed("voteMapSelBtn-rect-noPress", true);
		    	d3.selectAll(".voteMapSelBtn-text-date").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("voteMapSelBtn-text-press", true)
		    		.classed("voteMapSelBtn-text-noPress", false);
		    	d3.selectAll(".voteMapSelBtn-text-date").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("voteMapSelBtn-text-press", false)
		    		.classed("voteMapSelBtn-text-noPress", true);
				voteMapDate = d; 
				console.log(voteMapDate);
				console.log(voteMapRace);
				// updateVoteMapTitle(); 
				// updateVoteMap();
				// updateDemoBars();
				voteMapTitle
	        		.text(getVoteMapTitle(voteMapDate, voteMapRace));
				voteLegendBox.selectAll("*")
					.remove();
				demoLegendBox.selectAll("*")
					.remove();
				var voteLegend = voteLegendBox.append("g")
					.attr("class", "vote-legend")
					.each(makeVoteLegend);
				var demoLegend = demoLegendBox.append("g")
					.attr("class", "demo-legend")
					.each(makeVoteLegend);
				updateVoteMap();
				updateDemoBars();
		    }
		    function handleVoteRaceButtonClick(d) {
		    //updates global variable to newly chosen var via mouse click
		    //reclasses buttons when one is clicked
		    //reclassing changes graphic attributes to show new button as "selected" and others as "unselected"
		    	
		    	d3.selectAll(".voteMapSelBtn-rect-race").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("voteMapSelBtn-rect-press", true)
		    		.classed("voteMapSelBtn-rect-noPress", false);
		    	d3.selectAll(".voteMapSelBtn-rect-race").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("voteMapSelBtn-rect-press", false)
		    		.classed("voteMapSelBtn-rect-noPress", true);
		    	d3.selectAll(".voteMapSelBtn-text-race").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("voteMapSelBtn-text-press", true)
		    		.classed("voteMapSelBtn-text-noPress", false);
		    	d3.selectAll(".voteMapSelBtn-text-race").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("voteMapSelBtn-text-press", false)
		    		.classed("voteMapSelBtn-text-noPress", true);
				voteMapRace = d; 
				console.log(voteMapDate);
				console.log(voteMapRace);
				// updateVoteMapTitle(); 
				// updateVoteMap();
				// updateDemoBars();
				voteMapTitle
	        		.text(getVoteMapTitle(voteMapDate, voteMapRace));
				updateVoteMap();
				updateDemoBars();
		    }
		    function handleDemoVarButtonClick(d) {
		    //updates global variable to newly chosen var via mouse click
		    //reclasses buttons when one is clicked
		    //reclassing changes graphic attributes to show new button as "selected" and others as "unselected"
		    	
		    	d3.selectAll(".demoBarsSelBtn-rect-vars").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("demoBarsSelBtn-rect-press", true)
		    		.classed("demoBarsSelBtn-rect-noPress", false);
		    	d3.selectAll(".demoBarsSelBtn-rect-vars").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("selBtn-rect-hover", false)
		    		.classed("demoBarsSelBtn-rect-press", false)
		    		.classed("demoBarsSelBtn-rect-noPress", true);
		    	d3.selectAll(".demoBarsSelBtn-text-vars").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("demoBarsSelBtn-text-press", true)
		    		.classed("demoBarsSelBtn-text-noPress", false);
		    	d3.selectAll(".demoBarsSelBtn-text-vars").filter(function() {return this.getAttribute("buttonVal") != d;})
		    		.classed("demoBarsSelBtn-text-press", false)
		    		.classed("demoBarsSelBtn-text-noPress", true);
				demoVar = d; 
				console.log(demoVar);
				console.log(demoChange);
				demoBarsTitle
	        		.text(getDemoBarsTitle(demoVar, demoChange));
				// updateDemoBarsTitle(); 
				updateDemoBars();
		    }
		    function handleDemoChangeButtonClick(d) {
		    //reclasses buttons when one is clicked
		    //reclassing changes graphic attributes to show new button as "selected" and others as "unselected"
		    	
		    	if (demoChange == "NO CHANGE") { 
					var demoChangeNew = "CHANGE";
				}
				if (demoChange == "CHANGE") {
					var demoChangeNew = "NO CHANGE";
				}
				
		    	if (demoChangeNew == "CHANGE") {
			    	d3.selectAll(".demoBarsSelBtn-rect-change")
			    		.classed("selBtn-rect-hover", false)
			    		.classed("demoBarsSelBtn-rect-press", true)
			    		.classed("demoBarsSelBtn-rect-noPress", false);
			    	d3.selectAll(".demoBarsSelBtn-text-change")
			    		.classed("demoBarsSelBtn-text-press", true)
			    		.classed("demoBarsSelBtn-text-noPress", false);
		    	}
		    	if (demoChangeNew == "NO CHANGE") {
		    		d3.selectAll(".demoBarsSelBtn-rect-change")
		    			.classed("selBtn-rect-hover", false)
			    		.classed("demoBarsSelBtn-rect-press", false)
			    		.classed("demoBarsSelBtn-rect-noPress", true);
			    	d3.selectAll(".demoBarsSelBtn-text-change")
			    		.classed("demoBarsSelBtn-text-press", false)
			    		.classed("demoBarsSelBtn-text-noPress", true);
		    	}
		    	demoChange = demoChangeNew;
				
				demoBarsTitle
	        		.text(getDemoBarsTitle(demoVar, demoChange));
				console.log(demoVar);
				console.log(demoChange);
				// updateDemoBarsTitle(); 
				updateDemoBars();
		    }


		    //SELECTOR FUNCTIONS
	       	//
	       	//Functions to update elements based on new selection
	       	////////////////////////////////////////////////////
	        function getVoteMapTitle(voteMapDate, voteMapRace) {
		    //updates map title according to selected date and race variables
        		if (voteMapDate == "CHANGE") {
        			var dateText = "Change in Margin, 2012 - 2016";
        		}
        		else {
        			var dateText = voteMapDate;
        		}
        		if (voteMapRace == "PRESIDENT") {
        			var mapText = "US Presidential";
        		}
        		if (voteMapRace == "US SENATE") {
					var mapText = "US Senate";
        		}
        		if (voteMapRace == "US CONGRESS") {
        			var mapText = "US Congressional";
        		}
        		return mapText + " Election: " + dateText;
		        		
		    }


		    function getDemoBarsTitle(demoVar, changeVar) {
		    //updates bar chart title according to selected demographic variables
    			if (demoVar == "PERCENT NON-WHITE") {
    				var demoVarText = "Non-White, Non-Hispanic Population";
    			}
    			if (demoVar == "UNEMPLOYMENT RATE") {
    				var demoVarText = "Unemployment Rate";
    			}
    			if (demoVar == "EDUCATION") {
    				var demoVarText = "Population with Bachelor's Degree";
    			}
    			if (demoVar == "INCOME") {
    				var demoVarText = "Median Income";
    			}
    			if (demoChange == "NO CHANGE") {
    				var demoChangeText = "",
    					demoDateText = "2015";
    				if (demoVar == "POPULATION DENSITY") {
    					var demoVarText = "Population Density";
    				}
    			}
    			if (demoChange == "CHANGE") {
    				var demoChangeText = "Change in ",
    					demoDateText = "2010-2015";
    				if (demoVar == "POPULATION DENSITY") {
    					var demoVarText = "Population";
    				}
    			}
    			return demoChangeText + demoVarText + " by Census Tract";
		    }


		    function updateVoteMap(d) {
		    //updates map colors according to selected date and race variables
				
				d3.selectAll(".vote-tracts").filter(function() {return this.getAttribute("class") != "tracts-brushed";})
			    // d3.selectAll(".vote-tracts")
			      	.transition()
				     	.duration(400)	
				     	.style("fill", function(d) {
				     		var tract = d.properties.GEO_ID;
				     		return getVoteColor(tract); 
				     	})
				      	.style("stroke", function(d) {
				     		var tract = d.properties.GEO_ID;
				     		return getVoteColor(tract);
				     	}); 		
				d3.selectAll(".tracts-brushed")
					.transition()
				     	.duration(400)	
				     	.style("fill", function(d) {
				     		var tract = d.properties.GEO_ID;
				     		return getVoteColor(tract); 
				     	});
		    }


		    function updateDemoBars(d) {
			//updates bar chart according to selected demographic variables
				var demoData = getDemoVarName();



				//remove old grid lines
				d3.selectAll(".grid")
					.remove();
 
    			//sort data according to selected demographic
            	//data sort handles NaNs and puts them at bottom of chart
            	var tractdataSorted = tractdata.sort(function(a, b) {
            		if(!isFinite(a[demoData] && !isFinite(b[demoData]))) {
						return 0;
					}
					if( !isFinite(a[demoData]) ) {
				        return 1;
				    }
				    if( !isFinite(b[demoData]) ) {
				        return -1;
				    }
					return +b[demoData] > +a[demoData] ? 1 : +b[demoData] < +a[demoData] ? -1 : 0;
            	});
            	var demoVarMin = d3.min(getDemoVar()),
					demoVarMax = d3.max(getDemoVar());
				//scales for use with various axes
			
				//use with top and bottom axes
				//takes in demo variable, returns x position along axis
            	var barsX = d3.scaleLinear()
					.domain([demoVarMin, demoVarMax]).nice()
				    .range([0, barWidth]);
				
				//use with floating Y axis
				//takes in GEO_ID, returns y position along axis
				var barsY = d3.scaleBand()
					.domain(tractdataSorted.map(function(d) {
						return d.GEO_ID;
					}))
					.rangeRound([0, barHeight]);
				
				//use with Y grid
				var barsYGrid = d3.scaleLinear()
					.domain([0, 1])
				    .range([0, barHeight]);
				
				//Axes Assignments (pt 1)
				//axis assignment for x grid lines
				var xGridLines = d3.axisBottom()
					.scale(barsX)
					.tickSize(-barHeight, 0, 0)
				    .tickFormat("");
				
				//Make Chart Graphical Elements
				//axis assignment for y grid lines
				var yGridLines = d3.axisLeft()
					.scale(barsYGrid)
					.ticks(numQuants*Math.round(barHeight/barWidth))
					.tickSize(-barWidth, 0, 0)
				    .tickFormat("");

				// add new X gridlines
				// add new Y gridlines
				innerBars.append("g")			
				    .attr("class", "grid")
				    .attr("transform", "translate(0," + barHeight + ")")
				    .call(xGridLines);
				
				innerBars.append("g")
					.attr("class", "grid")
				    .call(yGridLines);
				
				//update selector bars
			    d3.selectAll(".color-bar")
					.transition()
						.duration(1200)
					  	.attr("y", function (d) {
			                return barsY(d.GEO_ID);
			            })
			            .attr("height", function(d) {
			            	if (isNaN(getDemoData(d))) {
			            		return 0;
			            	}
			            	else {return 1;}
			            })
			            .style("fill", function(d) {
			            	var tract = d.GEO_ID;
			            	return (getVoteColor(tract));
			            	});
		        //update chart bars
		        d3.selectAll(".bar")
		        	.raise()
		            .transition()
				     	.duration(1200)
		            	.attr("y", function (d) {
			                return barsY(d.GEO_ID);
			            })
			            .attr("height", function(d) {
			            	if (isNaN(getDemoData(d))) {
			            		return 0;
			            	}
			            	else {return 1;}
			            })
			            .attr("x", function(d) {
			            	if (isNaN(getDemoData(d))) {
			            		return 0;
			            	}
			            	else {return barsX(Math.min(0, getDemoData(d)));}
			            })
			            .attr("width", function(d) {
			            	if (isNaN(getDemoData(d))) {
			            		return 0;
			            	}
			                else {return Math.abs(barsX(getDemoData(d))-barsX(0));}
			            })
			            .style("fill", function(d) {
			            	var tract = d.GEO_ID;
			            	return getVoteColor(tract);
			            });
			    
			    console.log(demoData);
			    
			    //array of strings of values of quantile breaks
		        //must be called after bars are appended
				
				var quantileVals = getQuantileValues(numQuants, demoData, demoVar, demoChange);
				
				//scale for use with static Y axis
				//evenly spaces array of strings along y axis height
				var barsYQuantiles = d3.scalePoint()
					.domain(quantileVals)
					.range([0, barHeight]);
				
				//Axes Assignments (pt 2)
				//top X axis
				var barsXAxisTop = d3.axisTop()
				    .scale(barsX)
				    .tickFormat(getTickFormat(demoVar, demoChange));
				
				//bottom X axis
				var barsXAxisBottom = d3.axisBottom()
					.scale(barsX)
					.tickFormat(getTickFormat(demoVar, demoChange));
				
				//Y axis that moves with data
				var barsZeroAxis = d3.axisLeft()
				    .scale(barsY)
				    .tickSize(0)
				    .tickFormat("");
				
				//static Y axis on left side of chart
				var barsYAxis = d3.axisLeft()
					.scale(barsYQuantiles);
				
				//remove old axes
				d3.select("#demoXAxisTop")
				    .remove();
				d3.select("#demoXAxisBottom")
				    .remove();
				d3.select("#demoYAxis")
				    .remove();
				d3.select("#demoZeroAxis")
				    .remove();
				d3.selectAll(".chart-label")
					.remove();
				d3.selectAll(".chart-yaxis-label")
					.remove();
				
				//Make axis elements
				//top X Axis
				innerBars.append("g")
				    .attr("class", "x axis")
				    .attr("id", "demoXAxisTop")
				    .attr("transform", "translate(0," + -10 + ")")
				    .call(barsXAxisTop);
				//bottom X Axis (duplicates top X Axis)
				innerBars.append("g")
				    .attr("class", "x axis")
				    .attr("id", "demoXAxisBottom")
				    .attr("transform", "translate(0," + (barHeight + 10) + ")")
				    .call(barsXAxisBottom);    
				//static left-aligned Y axis to show quantiles
				innerBars.append("g")
				    .attr("class", "y axis")
				    .attr("id", "demoYAxis")
				    .attr("transform", "translate(" + -10 + ",0)")
				    .call(barsYAxis);
				//dynamic Y axis that shifts with data
				innerBars.append("g")
				    .attr("class", "zero axis")
				    .attr("id", "demoZeroAxis")
				    .attr("transform", "translate(" + barsX(0) + ",0)")
				    .call(barsZeroAxis);
				var chartXLabel = getChartLabels(demoVar, demoChange)[0],
					chartYLabel = getChartLabels(demoVar, demoChange)[1];
				
				//top X axis title
				innerBars.append("text")
					.attr("class", "chart-label")
					.attr("y", -40)
					.attr("x", barWidth)
					.text(chartXLabel);
				
				//top Y axis title
				innerBars.append("text")
					.attr("class", "chart-yaxis-label")
					.attr("y", 0)
					.attr("x", -19)
					.text(chartYLabel)
					.call(wrapBottom, barPadding.left);
			}

			function updateVoteMapTitle() {
		    	
		    	voteMapTitle
		        	.text(function() {
		        		if (voteMapDate == "CHANGE") {
		        			var dateText = "Change in Margin, 2012 - 2016";
		        		}
		        		else {
		        			var dateText = voteMapDate;
		        		}
		        		if (voteMapRace == "PRESIDENT") {
		        			var mapText = "US Presidential";
		        		}
		        		if (voteMapRace == "US SENATE") {
							var mapText = "US Senate";
		        		}
		        		if (voteMapRace == "US CONGRESS") {
		        			var mapText = "US Congressional";
		        		}
		        		return mapText + " Election: " + dateText;
		        		});
		    }
		    function updateDemoBarsTitle() {
		    	demoBarsTitle
		    		.text(function() {
		    			if (demoVar == "PERCENT NON-WHITE") {
		    				var demoVarText = "Non-White, Non-Hispanic Population (% of total)";
		    			}
		    			if (demoVar == "UNEMPLOYMENT RATE") {
		    				var demoVarText = "Unemployment Rate";
		    			}
		    			if (demoVar == "EDUCATION") {
		    				var demoVarText = "% of Population with Bachelor's Degree";
		    			}
		    			if (demoVar == "INCOME") {
		    				var demoVarText = "Median Income";
		    			}
		    			if (demoChange == "NO CHANGE") {
		    				var demoChangeText = "",
		    					demoDateText = "2015";
		    				if (demoVar == "POPULATION DENSITY") {
		    					var demoVarText = "Population Density";
		    				}
		    			}
		    			if (demoChange == "CHANGE") {
		    				var demoChangeText = "Change in ",
		    					demoDateText = "2010-2015";
		    				if (demoVar == "POPULATION DENSITY") {
		    					var demoVarText = "Population";
		    				}
		    			}
		    			return demoChangeText + demoVarText + " by Census Tract " + "(" + demoDateText +")";
		    		})
		    }
		    //SELECTOR FUNCTIONS
	       	//
	       	//General graphics functions (no data changes)
	       	////////////////////////////////////////////////////
	       	function makeVoteLegend() {
				var legend = d3.select(this)
					.attr("class", "legend");
				var legendPadding = {top: 12, bottom: 12};
				var defs = legend.append("defs");
				var voteColorGradient = defs.append("linearGradient")
	    			.attr("id", "voteColor-gradient")
	    			.attr("x1", "0%")
				    .attr("y1", "0%")
				    .attr("x2", "100%")
				    .attr("y2", "0%");
				voteColorGradient.selectAll("stop")
					.data([
						{offset: "0%", color: '#3c5bff'}, 
				        {offset: "50%", color: '#e6f0ff'}, 
				        {offset: "50%", color: '#f8e5e6'},        
				        {offset: "100%", color: '#dd0035'} 
						])
					.enter().append("stop")
					.attr("offset", function(d) { return d.offset; })   
	    			.attr("stop-color", function(d) { return d.color; });
	    		var voteLegendColorBar = legend.append("rect")
	    			.attr("width", voteLegendBarWidth)
	    			.attr("height", voteLegendBarHeight)
	    			.attr("x", (selBoxWidth/2)-(voteLegendBarWidth/2))
	    			.attr("y", legendPadding.top)
	    			.style("fill", "url(#voteColor-gradient)")
	    		var voteLegendAxis = legend.append("g")
	    			.attr("class", "legend")
	    			.attr("id", "legendAxis")
	    			.attr("transform", "translate(" + ((selBoxWidth/2)-(voteLegendBarWidth/2)) + "," + (voteLegendBarHeight+legendPadding.top) + ")")
	    			.each(makeLegendLabels);
			
			}
			function makeLegendLabels() {
    			var legendLabels = d3.select(this)
    				.attr("class", "legend-labels");
    			var labels = getLabels(voteMapDate, voteLabelsNum);
				labels.forEach(function(label, index) {
					legendLabels.append("text")
						.attr("class", "legend-labels legend-label-vals")
						.attr("x", index*voteLegendBarWidth/((voteLabelsNum*2)))
						.attr("y", voteLegendBarHeight + 3)
						.text(d3.format(".0%")(label));
				});
				var marginLabel = legendLabels.append("text")
					.attr("class", "legend-labels-title legend-labels")
					.attr("x", voteLegendBarWidth/2)
					.attr("y", -14)
					.text(function() {
						if (voteMapDate != "CHANGE") {return "vote margin";}
	    				if (voteMapDate == "CHANGE") {return "change in margin";}
					});
				var demLabel = legendLabels.append("text")
					.attr("class", "legend-labels")
					.attr("x", -5)
					.attr("y", -4)
					.text("Democrat")
					.style("text-anchor", "end")
					.style("dominant-baseline", "middle");
				var repLabel = legendLabels.append("text")
					.attr("class", "legend-labels")
					.attr("x", voteLegendBarWidth+5)
					.attr("y", -4)
					// .attr("y", voteLegendBarHeight + 3)
					.text("Republican")
					.style("text-anchor", "start")
					.style("dominant-baseline", "middle");
				
				}
			function getLabels(voteMapDate, voteLabelsNum){
	    				
    				if (voteMapDate == "CHANGE") {var labelMax = 0.5;}
	    			if (voteMapDate != "CHANGE") {var labelMax = 1;}
		    		var labelsRight = Array.from(new Array(voteLabelsNum + 1),(val,index)=>index*labelMax/voteLabelsNum);
		    		var labelsLeft = Array.from(new Array(voteLabelsNum),(val,index)=>((voteLabelsNum-index)*labelMax)/voteLabelsNum);
		    			
		    		var labels = labelsLeft.concat(labelsRight);
		    		return labels;
	    	}
		    
		    function handleSelButtonMouseover(d) {
		    	d3.select(this).style("cursor", "pointer");
		    	d3.selectAll(".voteMapSelBtn-rect-date").filter(function() {return this.getAttribute("buttonVal") == d;}).filter(".voteMapSelBtn-rect-noPress")
		    		.classed("selBtn-rect-hover", true);
		    	d3.selectAll(".voteMapSelBtn-rect-race").filter(function() {return this.getAttribute("buttonVal") == d;}).filter(".voteMapSelBtn-rect-noPress")
		    		.classed("selBtn-rect-hover", true);
		    	d3.selectAll(".demoBarsSelBtn-rect-vars").filter(function() {return this.getAttribute("buttonVal") == d;}).filter(".demoBarsSelBtn-rect-noPress")
		    		.classed("selBtn-rect-hover", true);
		    	d3.selectAll(".demoBarsSelBtn-rect-change").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", true);
		    	d3.selectAll(".demoBarsSelBtn-text-change").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-text-hover", true);
		    }
		    function handleSelButtonMouseout(d) {
		    	d3.select(this).style("cursor", "default");
		    	d3.selectAll(".voteMapSelBtn-rect-date").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false);
		    	d3.selectAll(".voteMapSelBtn-rect-race").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false);
		    	d3.selectAll(".demoBarsSelBtn-rect-vars").filter(function() {return this.getAttribute("buttonVal") == d;}).filter(".demoBarsSelBtn-rect-noPress")
		    		.classed("selBtn-rect-hover", false);
		    	d3.selectAll(".demoBarsSelBtn-rect-change").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-rect-hover", false);
		    	d3.selectAll(".demoBarsSelBtn-text-change").filter(function() {return this.getAttribute("buttonVal") == d;})
		    		.classed("selBtn-text-hover", false);
		    }
			//
	       	//
	       	//HELPER functions 
	       	////////////////////////////////////////////////////
			function getDemoData(d) {
				if (demoChange == "NO CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						// if (isNaN(+d.POPDEN_2015)) {
						// 	return 
						// }
						// else {return +d.POPDEN_2015;}
						return +d.POPDEN_2015;
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return +d.NONWHITE_2015;
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return +d.UNEMPLOY_2015;
					}
					if (demoVar == "EDUCATION") {
						return +d.COLLEGE_2015;
					}
					if (demoVar == "INCOME") {
						return +d.INC_2015;
					}
				}
				if (demoChange == "CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return +d.POPDEN_CHANGE;
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return +d.NONWHITE_CHANGE;
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return +d.UNEMPLOY_CHANGE;
					}
					if (demoVar == "EDUCATION") {
						return +d.COLLEGE_CHANGE;
					}
					if (demoVar == "INCOME") {
						return +d.INC_CHANGE;
					}
				}
			}
			function getDemoVar() {
				if (demoChange == "NO CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return popDen;
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return nonWhite;
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return unemploy;
					}
					if (demoVar == "EDUCATION") {
						return college;
					}
					if (demoVar == "INCOME") {
						return income;
					}
				}
				if (demoChange == "CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return popDenChange;
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return nonWhiteChange;
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return unemployChange;
					}
					if (demoVar == "EDUCATION") {
						return collegeChange;
					}
					if (demoVar == "INCOME") {
						return incomeChange;
					}
				}
			}
			function getDemoVarName() {
				if (demoChange == "NO CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return "POPDEN_2015";
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return "NONWHITE_2015";
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return "UNEMPLOY_2015";
					}
					if (demoVar == "EDUCATION") {
						return "COLLEGE_2015";
					}
					if (demoVar == "INCOME") {
						return "INC_2015";
					}
				}
				if (demoChange == "CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return "TOTALPOP_CHANGE";
					}
					if (demoVar == "PERCENT NON-WHITE") {
						return "NONWHITE_CHANGE";
					}
					if (demoVar == "UNEMPLOYMENT RATE") {
						return "UNEMPLOY_CHANGE";
					}
					if (demoVar == "EDUCATION") {
						return "COLLEGE_CHANGE";
					}
					if (demoVar == "INCOME") {
						return "INC_CHANGE";
					}
				}
			}
			function getQuantileValues(numQuants, demoData, demoVar, demoChange) {
				var quantiles = Array.from(new Array(numQuants - 1),(val,index)=>(index+1)/numQuants);
				var varArray = [];
				tractdataSorted.forEach(function(d) {
					varArray.push(+d[demoData]);
					});
				var varArrayLen = varArray.length;
				var formatVal = getTickFormat(demoVar, demoChange);
				if (demoChange == "NO CHANGE") {
				
					var quantVals = [formatVal(Math.round(d3.max(varArray))).toString()];
					quantiles.forEach(function(quantValue) {
						var quantVal = (formatVal(Math.round(varArray[Math.round(quantValue*varArrayLen)]))).toString();
						quantVals.push(quantVal);
					});
					quantVals.push(formatVal(Math.round(d3.min(varArray))).toString());
					return quantVals;
				}
				if (demoChange == "CHANGE") {
					var quantVals = [formatVal(d3.max(varArray)).toString()];
					quantiles.forEach(function(quantValue) {
						var quantVal = varArray[Math.round(quantValue*varArrayLen)];
						if (quantVal >= 0.01) {
							var quantValForm = d3.format(".0%")(quantVal).toString();
						}
						if (quantVal < 0.01) {
							var quantValForm = d3.format(".1%")(quantVal).toString();
						}
					
						quantVals.push(quantValForm);
					});
					quantVals.push(formatVal(d3.min(varArray)).toString());
					return quantVals;
				}
			}
			function getTickFormat(demoVar, demoChange) {
				if (demoChange == "CHANGE")
					return d3.format(".0%");
				if (demoChange == "NO CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						return d3.format(",.0f");
					}
					if (demoVar == "PERCENT NON-WHITE") {
	    				return function(d) {return d + "%";};
	    			}
	    			if (demoVar == "UNEMPLOYMENT RATE") {
	    				return function(d) {return d + "%";};
	    			}
	    			if (demoVar == "EDUCATION") {
	    				return function(d) {return d + "%";};
	    			}
	    			if (demoVar == "INCOME") {
	    				return d3.format("$,.0f");
	    			}
	    		}
			}
		    function getVoteColor(tract) {
      			if (voteMapDate == "2016" && voteMapRace == "PRESIDENT") {
      				if (usp2016MarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (usp2016MarginByTract[tract] >= 0) {
		      				return voteColorRed(usp2016MarginByTract[tract]);
		      			} 
		      			if (usp2016MarginByTract[tract] < 0) {
		      				return voteColorBlue(usp2016MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "2016" && voteMapRace == "US SENATE") {
      				if (uss2016MarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (uss2016MarginByTract[tract] >= 0) {
		      				return voteColorRed(uss2016MarginByTract[tract]);
		      			} 
		      			if (uss2016MarginByTract[tract] < 0) {
		      				return voteColorBlue(uss2016MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "2016" && voteMapRace == "US CONGRESS") {
      				if (usc2016MarginByTract[tract] == "ERROR") {return initialColor;}
	      			else {
	      				if (usc2016MarginByTract[tract] >= 0) {
		      				return voteColorRed(usc2016MarginByTract[tract]);
		      			} 
		      			if (usc2016MarginByTract[tract] < 0) {
		      				return voteColorBlue(usc2016MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "2012" && voteMapRace == "PRESIDENT") {
      				if (usp2012MarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (usp2012MarginByTract[tract] >= 0) {
		      				return voteColorRed(usp2012MarginByTract[tract]);
		      			} 
		      			if (usp2012MarginByTract[tract] < 0) {
		      				return voteColorBlue(usp2012MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "2012" && voteMapRace == "US SENATE") {
      				if (uss2012MarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (uss2012MarginByTract[tract] >= 0) {
		      				return voteColorRed(uss2012MarginByTract[tract]);
		      			} 
		      			if (uss2012MarginByTract[tract] < 0) {
		      				return voteColorBlue(uss2012MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "2012" && voteMapRace == "US CONGRESS") {
      				if (usc2012MarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (usc2012MarginByTract[tract] >= 0) {
		      				return voteColorRed(usc2012MarginByTract[tract]);
		      			} 
		      			if (usc2012MarginByTract[tract] < 0) {
		      				return voteColorBlue(usc2012MarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "CHANGE" && voteMapRace == "PRESIDENT") {
      				if (uspChangeMarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (uspChangeMarginByTract[tract] >= 0) {
		      				return changeColorRed(uspChangeMarginByTract[tract]);
		      			} 
		      			if (uspChangeMarginByTract[tract] < 0) {
		      				return changeColorBlue(uspChangeMarginByTract[tract]);
		      			}
		      		}
      			}
      			if (voteMapDate == "CHANGE" && voteMapRace == "US SENATE") {
      				if (ussChangeMarginByTract[tract] == "ERROR") {return initialColor;}
      				else {
	      				if (ussChangeMarginByTract[tract] >= 0) {
		      				return changeColorRed(ussChangeMarginByTract[tract]);
		      			} 
		      			if (ussChangeMarginByTract[tract] < 0) {
		      				return changeColorBlue(ussChangeMarginByTract[tract]);
		      			}
		      		}
      			}	
      			if (voteMapDate == "CHANGE" && voteMapRace == "US CONGRESS") {
      				if (uscChangeMarginByTract[tract] == "ERROR") {return initialColor;}
	      			else {
	      				if (uscChangeMarginByTract[tract] >= 0) {
		      				return changeColorRed(uscChangeMarginByTract[tract]);
		      			} 
		      			if (uscChangeMarginByTract[tract] < 0) {
		      				return changeColorBlue(uscChangeMarginByTract[tract]);
		      			}
		      		}
	      		} 
		    }
			
		    function getChartLabels(demoVar, demoChange) {
				
				if (demoChange == "NO CHANGE") {
					if (demoVar == "POPULATION DENSITY") {
						var xLabel = "population/sq mi",
							yLabel = "population density decile values";
					}
					if (demoVar == "PERCENT NON-WHITE") {
	    				var xLabel = "% of total population",
	    					yLabel = "% non-white decile values";
	    			}
	    			if (demoVar == "UNEMPLOYMENT RATE") {
	    				var xLabel = "% unemployed",
	    					yLabel = "unemployment rate decile values";
	    			}
	    			if (demoVar == "EDUCATION") {
	    				var xLabel = "% of total population",
	    					yLabel = "college degree decile values";
	    			}
	    			if (demoVar == "INCOME") {
	    				var xLabel = "household income",
	    					yLabel = "median income decile values";
	    			}
	    		}
    			if (demoChange == "CHANGE") {
    				if (demoVar == "POPULATION DENSITY") {
						var xLabel = "% change, 2010 - 2015",
							yLabel = "population change decile values";
					}
					if (demoVar == "PERCENT NON-WHITE") {
	    				var xLabel = "% change, 2010 - 2015",
	    					yLabel = "non-white change decile values";
	    			}
	    			if (demoVar == "UNEMPLOYMENT RATE") {
	    				var xLabel = "% change, 2010 - 2015",
							yLabel = "unemployment change decile values";
	    			}
	    			if (demoVar == "EDUCATION") {
	    				var xLabel = "% change, 2010 - 2015",
							yLabel = "college change decile values";
	    			}
	    			if (demoVar == "INCOME") {
	    				var xLabel = "% change, 2010 - 2015",
							yLabel = "income change decile values";
	    			}
	    		}
    				
    			return [xLabel, yLabel];
			}
			function handleColorBarsClick() {
				d3.selectAll(".vote-tracts")
                    .classed("tracts-brushed", false)
                    .style("stroke", function(d) {
				     		var tract = d.properties.GEO_ID;
				     		return getVoteColor(tract);
				    })
			      	.style("stroke-width", "0.8px");
                colorBars
                	.classed("color-bar-brushed", false);
			}
			function highlightBrushedTracts(d) {
                if (d3.event.selection != null) {
                	var brush_coords = d3.brushSelection(this);
                	// set class of elements in brush selection to "color-bar-brushed"
                    colorBars.filter(function (){
                   		var x = d3.select(this).attr("x"),
                       		y = d3.select(this).attr("y");
                   		return isBrushed(brush_coords, y);
               		})
               		.classed("color-bar-brushed", true);
               		// outline tracts in map that correspond to selected bars
               		// note that tract stroke cannot be styled through CSS, as it is originally defined as a function
               		d3.selectAll(".color-bar-brushed")
               			.each(function(d) {
               				var colorBarGeoID = d.GEO_ID;
               				d3.selectAll(".vote-tracts").filter(function() {return this.getAttribute("tractno") == colorBarGeoID;})
               					.raise()
               					.classed("tracts-brushed", true)
               					.style("stroke", "black")
               					.style("stroke-width", "1.5px");
						});
               	}
            }
            
            function isBrushed(brush_coords, y) {
	            var y0 = brush_coords[0],
		            y1 = brush_coords[1];	           
	            return y0 <= y && y <= y1;
        	}
			function getColorDomain(numColors) {
		    	var numColorsRange = Array.from(new Array(numColors),(val,index)=>index+1);
    			if (Math.abs(demoMax) >= Math.abs(demoMin)) {
    				var bins = d3.scaleQuantile()
    					.domain(selDemoPos)
    					.range(numColorsRange);
    				var threshVals = bins.quantiles();
    				if (demoMin >= 0) {
    					threshVals.push(demoMax);
    					return threshVals;
    				}
    				if (demoMin < 0) {
    					var negThreshVals = threshVals.map(function(n){
    						return (n*-1);
    					});
    					negThreshVals.reverse();
    					negThreshVals.push(0);
    					var orderedThreshVals = negThreshVals.concat(threshVals);
    					orderedThreshVals.push(demoMax);
    					return orderedThreshVals;
    				}
    			}
    			if (Math.abs(demoMax) < Math.abs(demoMin)) {
    				var bins = d3.scaleQuantile()
    					.domain(selDemoNeg)
    					.range(numColorsRange);
    				var threshVals = bins.quantiles();
    				var negThreshVals = threshVals.map(function(n){
    						return (n*-1);
    					});
    				negThreshVals.reverse();
    				
    				threshVals.push(0);
    				var orderedThreshVals = threshVals.concat(negThreshVals);
    				orderedThreshVals.push(-demoMin);
    				return orderedThreshVals;
	    		}
	    	}
	    	function getColorRange(numColors) {
	    		var numColorsRange = Array.from(new Array(numColors),(val,index)=>((index+1)/numColors));
	    		if (demoMin >= 0) {
	    			colorVals = [];
    				numColorsRange.forEach(function(value, i){
    					var colorVal = d3.interpolateBuPu(value)
    					colorVals.push(colorVal);
    				})
    				return colorVals;
    			}
    			if (demoMin < 0) {
    				posColorVals = [];
    				negColorVals = [];
    				
    				numColorsRange.forEach(function(value, i){
    					var posColorVal = d3.interpolatePuRd(value),
    						negColorVal = d3.interpolateBlues(value);
    					posColorVals.push(posColorVal);
    					negColorVals.push(negColorVal);
    				})
    				var invNegColorVals = negColorVals;
    				invNegColorVals.reverse();
	    			var	orderedColorVals = invNegColorVals.concat(posColorVals);
    				return orderedColorVals;
    			}	
	    	}
	    	function wrap(text, width) {
	    		text.each(function() {	
	    		var text = d3.select(this),
            		words = text.text().split(" ").reverse(),
            		word,
            		width = demoButtonWidth-6,
            		line = [],
            		lines = 1,
            		lineNumber = 0,
            		lineHeight = 1.1,
            		x = this.getAttribute("x"),
            		y = this.getAttribute("y"),
            		dy = 0,
            		tspan = text.text(null)
            			.append("tspan")
                        .attr("x", x)
                        // .attr("y", y)
                        .attr("dy", dy + "em");
                    while (word = words.pop()) {
			            line.push(word);
			            tspan.text(line.join(" "));
			            if (tspan.node().getComputedTextLength() > width) {
			                line.pop();
			                var lineJoin = line.join(" ");			                
			                tspan.text(line.join(" "))
			                	.attr("y", y-(6));
			                line = [word];
			                tspan = text.append("tspan")
			                            .attr("x", x)
			                            .attr("y", y)
			                            .attr("dy", 6)
			                            // .attr("dy", ++lineNumber * lineHeight + dy + "em")
			                            .text(word);
			                // lines = lineNumber+1;
			            }
			            else {tspan.attr("y", y);}
			        }
				});
	    	}
	    	function wrapBottom(text, width) {
	    		text.each(function() {	
	    		var text = d3.select(this),
            		words = text.text().split(" "),
            		word,
            		line = [],
            		lines = 1,
            		lineNumber = 0,
            		lineHeight = -1.1,
            		x = this.getAttribute("x"),
            		y = this.getAttribute("y"),
            		dy = -1;
            		tspan = text.text(null)
            			.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
                    while (word = words.pop()) {
			            line.push(word);			        
			            tspan.text(line.join(" "));
			            if (tspan.node().getComputedTextLength() > width) {			            
			                line.pop();
			                var lineJoin = line.join(" ");		                
			                tspan.text(line.join(" "));
			                	// .attr("y", y-(6));
			                line = [word];
			                tspan = text.append("tspan")
			                            .attr("x", x)
			                            .attr("y", y)
			                            // .attr("dy", 1)
			                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
			                            .text(word);
			                // lines = lineNumber+1;
			            }
			            else {tspan.attr("y", y);}
			        }
				});
	    	}
		}	