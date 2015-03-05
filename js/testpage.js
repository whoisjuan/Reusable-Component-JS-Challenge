/*Code Written by Jason Mussitsch: jmussits@cs.cmu.edu */

/*
 *  Create the Tester object to help in testing the data grid
 */
(function(win) {
	
	var doc = win.document;
	
	/*
	 * This assignment uses the new File and FileReader APIs (still in Working Draft status but supported in
	 * the latest versions of all major browsers) to read test data from a local file.
	 */
	if(typeof(win.File) === "undefined") {
		throw new Error("Browser must support File API: http://caniuse.com/#feat=fileapi");
	}
	if(typeof(win.FileReader) === "undefined") {
		throw new Error("Browser must support FileReader API: http://caniuse.com/#feat=filereader");
	}
	
	var tester = {};
	win.tester = tester;
	
	tester.file_onchange = function(event) {
		this.reader = new FileReader();
		this.reader.onerror = this.filereader_onerror.bind(this);
		this.reader.onload = this.filereader_onload.bind(this);
		
		this.reader.readAsText(event.target.files[0]);
	};
	
	tester.filereader_onerror = function() {
		log("Error reading file: " + this.reader.error.code);
	};
	
	tester.filereader_onload = function() {
		this.runTest(this.reader.result);
	};
	
	tester.grid_ondraw = function(grid) {
		console.log("on draw callback");
	};
	
	tester.destroybutton_onclick = function (event) {
		if(typeof(this.grid_1) !== 'undefined' && this.grid_1 !== null) {
			this.grid_1.destroy();
			delete this.grid_1;
		}
		if(typeof(this.grid_2) !== 'undefined' && this.grid_2 !== null) {
			this.grid_2.destroy();
			delete this.grid_2;
		}
	}
	
	tester.runTest = function(textData) {
		var data = win.JSON.parse(textData);
		
		//Create a new data grid using the first div as its wrapper
		this.grid_1 = new DataGrid(
			{
				"data": data,
				"rootElement": doc.getElementById("gridwrapper1"),
				"pageSize": 10,
				"columns": [
				    {
				        "name": "Company",
				        "align": "left",
				        "width": 200,
				        "dataName": "company"
				    },
				    {
				        "name": "Type",
				        "align": "left",
				        "width": 100,
				        "dataName": "type"
				    },
				    {
				        "name": "Industry",
				        "align": "left",
				        "width": 150,
				        "dataName": "industry"
				    },
				    {
				        "name": "Price",
				        "align": "right",
				        "width": 100,
				        "dataName": "share_price"
				    },
				    {
				        "name": "Market Cap",
				        "align": "right",
				        "width": 100,
				        "dataName": "market_cap"
				    }
				],
				"onDraw": this.grid_ondraw.bind(this)
			}	
		);
		
		//Create another new data grid using the second div as its wrapper
		this.grid_2 = new DataGrid(
			{
				"data": data,
				"rootElement": doc.getElementById("gridwrapper2"),
				"columns": [
				    {
				        "name": "Company",
				        "align": "left",
				        "width": 200,
				        "dataName": "company"
				    },
				    {
				        "name": "Price",
				        "align": "right",
				        "width": 100,
				        "dataName": "share_price"
				    }
				]
			}	
		);
	};
	
	addEvents();
	
	function addEvents() {
		//Attach the file input onchange event to the handler
		doc.getElementById("file").addEventListener("change", tester.file_onchange.bind(tester));
		
		//Attach click handler to destroy grids
		doc.getElementById("destroybutton").addEventListener("click", tester.destroybutton_onclick.bind(tester));
	}
	
	function log(message) {
		if(typeof(win.console !== "undefined")) {
			win.console.log(message);
		}
	}
	
})(window);

/*Code Written by Jason Mussitsch: jmussits@cs.cmu.edu */
