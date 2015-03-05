// Data Grid Object Constructor Function

function DataGrid(arguments) {
    // State Trackers //
    var currentPage = 0;
    var sortedFirstTime = true;
    var prevColumnRef = 0;
    var sortbyColumnRef = 0
    // Attributes
    this.rootElement = arguments.rootElement;
    this.columns = arguments.columns;
    this.pageSize = arguments.pageSize;
    this.data = arguments.data;
    this.onDraw = arguments.onDraw
    //With this variables the closures can access the parent data.
    var callback = arguments.onDraw
    var tableHTML = "" //initial empty html
    var targetDiv = arguments.rootElement;
    var columns = arguments.columns;
    var numberColumns = columns.length;
    var companyData = sortData(arguments.data, columns[sortbyColumnRef].dataName);

    ////conditional to find out if a pageSize was provided.////
    if ((isNaN(arguments.pageSize) || (dataSize <= arguments.pageSize)) == true) {
        var pageSizeNumber = 0;
    } else {
        var pageSizeNumber = arguments.pageSize;
    }
    var dataSize = companyData.length;
    var totalPages = Math.ceil(dataSize / pageSizeNumber);
    var divAttribute = targetDiv.getAttribute('id');

    css = document.createElement("style");
    css.id = "style"+divAttribute;
    css.type = "text/css";
    css.innerHTML = "#data" + divAttribute + " tr:nth-child(odd) td:nth-child(" + (sortbyColumnRef + 1) + ") {background-color: rgb(218, 243, 245);}" + " #data" + divAttribute + " tr:nth-child(even) td:nth-child(" + (sortbyColumnRef + 1) + "){background-color: rgb(218, 230, 245);}";
    document.body.appendChild(css);

    //Methods
    this.destroy = function() { //Destroy Tables and Clean Choose File.
        tableHTML = ""
        targetDiv.innerHTML = tableHTML;
        ////
        var prevTableStyles = document.getElementById("style"+divAttribute);
        prevTableStyles.parentNode.removeChild(prevTableStyles);
        // Adding the styles after cleaning the document //
        css = document.createElement("style");
        css.type = "text/css";
        css.id = "style"+divAttribute;
        css.innerHTML = "";
        document.body.appendChild(css);
    }
    //this.destroy = function() { window.location.reload();} ////Destroy Tables by Reloading
    //Helper Functions
    function renderPagers() {
        finalColumnSize = pagersPosition();
        if (pageSizeNumber == 0) {
            tableHTML = tableHTML + '' // pager not rendered if no pageSize provided (pageSizeNumber == 0) 
        } else if (currentPage == 0) {
            tableHTML = tableHTML + '<div style="padding-left:'+ (finalColumnSize-173)+'px;" class="paginator" id=pager' + divAttribute + '"><a href="javascript:void(0)" id=prev' + divAttribute + ' style="color:gray; pointer-events: none; cursor: default;">< Previous </a>' + (currentPage + 1) +
                ' of ' + totalPages + '<a href="#" id=next' + divAttribute + '> Next ></a></div>' //pager if in first position
        } else if (currentPage + 1 == totalPages) {
            tableHTML = tableHTML + '<div style="padding-left:'+ (finalColumnSize-173)+'px;" class="paginator" id=pager' + divAttribute + '"><a href="javascript:void(0)" id=prev' + divAttribute + '>< Previous </a>' + (currentPage + 1) +
                ' of ' + totalPages + '<a href="#" id=next' + divAttribute + ' style="color:gray;pointer-events: none; cursor: default;"> Next ></a></div>' //pager if in last position
        } else {
            tableHTML = tableHTML + '<div style="padding-left:'+ (finalColumnSize-173)+'px;" class="paginator" id=pager' + divAttribute + '"><a href="javascript:void(0)" id=prev' + divAttribute + '>< Previous </a>' + (currentPage + 1) +
                ' of ' + totalPages + '<a href="javascript:void(0)" id=next' + divAttribute + '> Next ></a></div>' //pager if in between
        }
    }

    function renderTable() {
        tableHTML = tableHTML + '<table id="data' + divAttribute + '">' + '<tr id="header' + divAttribute + '">' //Open Table Tag and Table Header
        for (var i = 0; i < numberColumns; i++) { //Looping through columns data to set the Headers names.
            tableHTML = tableHTML + '<th><a href="javascript:void(0)" title="Sort by ' + columns[i]['name'] + '" id=column' + i.toString() + '>' + columns[i]['name'] + '</a></th>'
        }
        tableHTML = tableHTML + '</tr>' //end of header row
        // Adding Data //
        // This Conditional Statement adjusts the variables depending if pageSize was provided or not //
        if (pageSizeNumber == 0) {
            loopStart = 0
            loopSize = dataSize
        } else {
            loopStart = (currentPage * pageSizeNumber)
            loopSize = (pageSizeNumber + (pageSizeNumber * currentPage))
        } // End of -pageSize Conditional //
        for (var w = (0 + loopStart); w < loopSize; w++) { // We loop over the total amount of JSON elements and add a row for each.
            tableHTML = tableHTML + '<tr class=row' + w.toString() + '>'; // opening data rows and numbering rows.
            for (var z = 0; z < numberColumns; z++) { //We then loop over the total number of data columns so we can add a element per column.
                var dataNameRef = columns[z].dataName; //This variable is created to extract the dataName so we can retrieve the element data later.
                try { // this allows the table to be rendered even when it gets our of loop.
                    tableHTML = tableHTML + '<td style="width:' + columns[z].width + 'px;text-align:' + columns[z].align + '">' + companyData[w][dataNameRef] + '</td>' //We add the JSON company data to each column.
                } catch (err) {}
            }
            tableHTML = tableHTML + '</tr>' // end of data rows
        }
        tableHTML = tableHTML + '</table>' // end of table
        targetDiv.innerHTML = tableHTML;
    }
    //// Pagers Clickers (Previous and Next) ////
    function attachEvents() {
        //By hiding the pager a undefined error in objects without a pageSize is generated.
        //This stops the execution, so an easy fix is to do a try and catch and keep the approach
        //of not generating the pagers.
        try {
            clickElementPrev = document.getElementById("prev" + divAttribute);
            clickElementNext = document.getElementById("next" + divAttribute);
            clickElementNext.onclick = function() {
                currentPage = currentPage + 1;
                tableHTML = ""
                renderPagers();
                renderTable();
                attachEvents();
                attachEventsTableHeader();
                onDrawCallback(callback);
            }
        } catch (err) {}
        try {
            clickElementPrev.onclick = function() {
                currentPage = currentPage - 1;
                tableHTML = ""
                renderPagers();
                renderTable();
                attachEvents();
                attachEventsTableHeader();
                onDrawCallback(callback);
            }
        } catch (err) {}
    }

    //// Table Sorting Function ////
    function sortData(unsortedData, dataRef) {
        unsortedData.sort(function(a, b) {
            var keyA = a[dataRef];
            var keyB = b[dataRef];
            if (typeof keyA == "string") {
                keyA = keyA.toLowerCase();
                keyB = keyB.toLowerCase();
            }
            if (keyA < keyB) {
                return -1;
            }
            if (keyA > keyB) {
                return 1;
            }
            return 0;
        })
        return unsortedData;
    }

    function attachEventsTableHeader() {
        clickElement = document.getElementById("header" + divAttribute);
        clickElement.addEventListener("click", function(clickEv) { // clickEv is clicked header.
            if (clickEv.target && clickEv.target.id.slice(0, 6) == "column") {
                sortbyColumnRef = Number(clickEv.target.id.slice(6, 7));
                tableHTML = ""
                // Conditional to Determine How to Sort Data.//
                if (sortedFirstTime == false) {
                    companyData = sortData(companyData, columns[sortbyColumnRef].dataName);
                    sortedFirstTime = true;
                    prevColumnRef = sortbyColumnRef;
                } else if ((sortedFirstTime == true) && (prevColumnRef == sortbyColumnRef)) {
                    companyData = companyData.reverse();
                } else if ((sortedFirstTime == true) && (prevColumnRef !== sortbyColumnRef)) {
                    companyData = sortData(companyData, columns[sortbyColumnRef].dataName)
                    prevColumnRef = sortbyColumnRef;
                }
                renderPagers();
                renderTable();
                attachEvents();
                attachEventsTableHeader();
                sortedColumnStyle();
                onDrawCallback(callback);
            }
        });
    }
    //This functions provide styles that indicate current sorted column//
    function sortedColumnStyle() {
        // This sanitizes the document by looking for previous embedded styles//
        var prevTableStyles = document.getElementById("style"+divAttribute);
        prevTableStyles.parentNode.removeChild(prevTableStyles);
        // Adding the styles after cleaning the document //
        css = document.createElement("style");
        css.type = "text/css";
        css.id = "style"+divAttribute;
        css.innerHTML = "#data" + divAttribute + " tr:nth-child(odd) td:nth-child(" + (sortbyColumnRef + 1) + ") {background-color: rgb(218, 243, 245);}" + " #data" + divAttribute + " tr:nth-child(even) td:nth-child(" + (sortbyColumnRef + 1) + "){background-color: rgb(218, 230, 245);}";
        document.body.appendChild(css);
    }

    function onDrawCallback(callback) {
        if (typeof(callback) == "function") {
            callback();
        }
    }

    function pagersPosition(){
        var totalColumnSize = 0
        var totalObjectColumns = 0
        for (var z = 0; z < numberColumns; z++) {
            totalColumnSize = totalColumnSize + columns[z].width;
            totalObjectColumns = totalObjectColumns + 1;
            }
        return totalColumnSize + (totalObjectColumns*21)   
    }
    renderPagers();
    renderTable();
    attachEvents();
    attachEventsTableHeader();
    onDrawCallback(callback);
};