// View
'use strict';
function View(){

    var thisView = this;

    //----------------------------------------Classes-------------------------------------------
    /**
     * Each class below represents a entiti on GUI 
     */

    L.Class.extend = function (props) {

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = L.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		L.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = L.Util.extend(L.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	L.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
    };

    L.TextBox = L.Control.extend({
        options: {
            position: 'topright'
        },

        initialize: function (options) {
            this._config = {};
            L.Util.extend(this.options, options);
            this.setConfig(options);
        },

        setConfig: function(options) {
            this._config = {
                'tbid': options.tbid || '',
                'textdefault': options.textdefault || '',
            };
        },

        onAdd: function(map) {
            // create div container in HTML
            var container = 
                L.DomUtil.create('div', 'leaflet-control leaf-bar');
            this._container = container;

            // create text box in container in HTML 
            var textBox = 
                L.DomUtil.create('input','',container);
            textBox.id = this._config.tbid;
            textBox.type = 'text';
            textBox.placeholder = this._config.textdefault;
            this._textBox = textBox;

            // create message box in container in HTML
            var messageBox =
                L.DomUtil.create('div','message text-basic text-border',container);
            this._messageBox = messageBox;

            L.DomEvent
                .addListener(this._textBox, 'keyup', this._onKeyUp, this);
                
            L.DomEvent.disableClickPropagation(this._textBox);

            return this._container;
        },

        // get current text in the box
        getValue: function(){
            return this._textBox.value;
        },

        // reset Value of text box to default
        setValue: function(name){
            this._textBox.value = name;
        }
        ,

        setMessage: function(message){
            this._messageBox.innerHTML = message;
        },

        // update data when text box is changed
        _onKeyUp: function(e){
            myController.actualize();
        }


    });

    L.Button = L.Control.extend({
        options: {
            position: 'topleft'
        },

        initialize: function(options){
            this._config = {};
            L.Util.extend(this.options, options);
            this.setConfig(options);
        },

        setConfig: function(options){
            this._config = {
                sign: options.sign,
                titleButton: options.titleButton
            };
        },

        onAdd: function() {
            // container div in HTML
            var container = document.createElement('div'),
                link = document.createElement('a');
            container.className = 'leaflet-bar';
            container.appendChild(link);
            this._container = container;
            this._link = link;

            // div attributs
            link.href = '#';
            link.title = this._config.titleButton;
            link.innerHTML =  this._config.sign;

            L.DomEvent.on(link, 'click', L.DomEvent.stop);
         
            return container;
        },

        getLink: function() {
            return this._link;
        },

        setDisabled: function(bool){
            if(bool){
                //L.DomUtil.removeClass(this._container, 'leaflet-control');
                L.DomUtil.removeClass(this._container, 'leaflet-bar');
                this._container.style.display = 'none';
            }
            else{
                //L.DomUtil.addClass(this._container, 'leaflet-control');
                L.DomUtil.addClass(this._container, 'leaflet-bar');
                this._container.style.display = 'inline';
            }
        },

        addOn: function(parent) {
            parent.appendChild(this._container);
        },

        addClass: function(className) {
            L.DomUtil.addClass(this._container, className);
        },

        // removeClass: function(className) {
        //     L.DomUtil.removeClass()
        // },

        invisible: function(bool) {
            if(bool) this._container.style.visibility = 'hidden';
            else this._container.style.visibility = 'visible';
        },

        setSign: function(sign) {
            this._link.innerHTML = sign;
        },

        getContainer: function() {
            return this._container;
        }
    });

    L.ColorSelector = L.Control.extend({
        options: {
            position: 'topleft'
        },

        initialize: function(options){
            this._config = {};
            L.Util.extend(this.options, options);
            this.setConfig(options);
        },

        setConfig: function(options){
            this._config = {
                listColor: options.listColor,
                titleBox: options.titleBox
            };
        },

        onAdd: function(map) {
            // container div in HTML
            var container = L.DomUtil.create('div');
            this._container = container;

            var select = L.DomUtil.create('select','leaflet-control leaflet-bar', container);
            this._select = select;
            select.title = this._config.titleBox;
    
            
            for(var i = 0; i < this._config.listColor.length ; i++){
                var option = document.createElement("option",'', container);
                option.text = this._config.listColor[i];
                option.style.background = this._config.listColor[i];
                option.style.color = this._config.listColor[i];
                select.add(option);
                L.DomEvent
                    .on(option, 'click', function(){
                        select.style.background = select.options[select.selectedIndex].value;
                        select.style.color = select.options[select.selectedIndex].value;
                        });
                L.DomEvent.disableClickPropagation(option);
            }
            
            select.style.background = select.options[select.selectedIndex].value;
            select.style.color = select.options[select.selectedIndex].value;
            

            return select;
        },

        getSelect: function(){
            return this._select;
        },

        getColor: function() {
            return this._select.value;
        },

        setColor: function(color) {
            this._select.style.background = color;
            this._select.style.color = color;
            this._select.value = color;
        },
        
        getContainer: function(){
            return this._container;
        }

    });

    L.SelectBox = L.Control.extend({
        options: {
            position: 'topright'
        },

        initialize: function(options){
            this._config = {};
            L.Util.extend(this.options, options);
            this.setConfig(options);
        },

        setConfig: function(options){
            this._config = {
                listOptions: options.listOptions,
                titleBox: options.titleBox
            };
        },

        onAdd: function(map) {
            // container div in HTML
            var container = L.DomUtil.create('div');
            this._container = container;

            var select = L.DomUtil.create('select','leaflet-control leaflet-bar', container);
            this._select = select;
            select.title = this._config.titleBox;
            for(var i = 0; i < this._config.listOptions.length ; i++){
                this.addOption(this._config.listOptions[i]);
            }
            
            L.DomEvent
                .addListener(this._container, 'click', L.DomEvent.stop);
            
            L.DomEvent.disableClickPropagation(this._select);

            return select;
        },

        getSelect: function(){
            return this._select;
        },

        getValue: function() {
            return this._select.value;
        },

        addOption: function(text) {
            var option = document.createElement("option",'',this._container);
            option.text = text;
            this._select.add(option);
            L.DomEvent
                    .on(option, 'click', L.DomEvent.stop)
            L.DomEvent.disableClickPropagation(option);
        },

        removeOption:function(index) {
            this._select.remove(index);
        },

        removeAllOptions:function() {
            for(var i = this._select.options.length-1;i>=0;i--)
            {
                this._select.remove(i);
            }
        },

        setTextOfOption(index, text) {
            this._select.options[index].text = text;
            if(index == this._select.selectedIndex){
                this._select.text = text;
            }
        },

        setSelectedOption(index) {
            this._select.selectedIndex = index;
        }
    });

    L.CheckBoxList = L.Control.extend({
        options: {
            position: 'topright'
        },

        initialize: function(options){
            this._config = {};
            L.Util.extend(this.options, options);
            this.setConfig(options);
        },

        setConfig: function(options){
            this._config = {
                listBoxes: options.listBoxes,
                titleBox: options.titleBox,
            };
        },

        onAdd: function(map) {
            // container div in HTML
            var container = document.createElement('div')
            container.className = 'leaflet-control leaflet-bar';
            this._container = container;
            container.title = this._config.titleBox;

            for(var i = 0; i < this._config.listBoxes.length ; i++){
                this.addCheckBox(this._config.listBoxes[i]);
            }
            
            return container;
        },

        addCheckBox: function(text) {
            // line = checkbox + lineText
            var line = document.createElement("div");
            this._container.appendChild(line);
            // for line break
            line.style.float = 'left';
            line.style.fontSize = "14px";

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style.float = 'left';
            checkbox.className = 'leaflet-control-layers-selector';
            line.appendChild(checkbox);

            var lineText = L.DomUtil.create('div', '',line);
            lineText.style.float = 'left';            
            lineText.innerHTML = text;
            lineText.className = 'text-basic text-border';
            var thisNow = this;
            
            L.DomEvent.on(checkbox, "click", function(){
                var lineIndex = Array.prototype.indexOf.call(thisNow._container.children, line);
                if(checkbox.checked){
                    myController.displayResearch(lineIndex);
                } else {
                    myController.hideResearch(lineIndex);                    
                }
                myController.actualize();
            });
                                
        },

        removeCheckBox: function(index) {
            var line = this._container.children[index];
            this._container.removeChild(line);
        },

        removeAllCheckboxes: function() {
            for(var i = this._container.children.length-1;i>=0;i--)
            {
                this.removeCheckBox(i);
            }
        },

        setTextOfCheckBox: function(index, text) {
            this._container.children[index].children[1].innerHTML = text + "<br>";
        },

        // check the box
        setChecked: function(index, checked) {
            this._container.children[index].children[0].checked = checked;
        },

        // set box to uncheckable (bool = false)/ checkable (bool = true)
        setCheckable: function(index, disabled) {     
            this._container.children[index].children[0].disabled = disabled;
        },

        getChecked: function(index) {
            return this._container.children[index].children[0].checked;
        }

    });

    L.MessageBox = L.Control.extend({
        options: {
            position: "bottomright"
        },

        onAdd: function(map) {
            this._container= L.DomUtil.create('div');
            return this._container;
        },

        setClass: function(className) {
            this._container.className = className;
            this._container.style.float = 'right';  
            this._container.style.margin = '0px 6px 6px 0px';
        },

        update: function(text) {
            this._container.innerHTML = text;
        },

        hide: function(){
            this._container.style.display = 'none';
        },
        show: function(){
            this._container.style.display = 'inline';
        }
    });


    //-----------------------------------------Creater------------------------------------------------

    /**
     * These functions are intended for creating the instances of the classes aboves
     * @return Entite on GUI
     */
    this.createMessageBox = function(map) {
        var res = new L.MessageBox;
        res.addTo(map);

        return res;
    }


    this.createSelector = function(map, list, title){
        var res  = new L.SelectBox({
            listOptions: list,
            titleBox: title
        });
        res.addTo(map);

        return res;
    }
    
    this.createCheckBoxList = function(map, list, title){
        var res  = new L.CheckBoxList({
            listBoxes: list,
            titleBox: title
        });
        res.addTo(map);

        return res;
    }


    this.createColorSelector = function (map, listColor, title){
        var res = new L.ColorSelector({
            listColor: listColor,
            titleBox: title
        });
        res.onAdd(map);

        return res;
    };

    // add Box into Map
    this.createTextBox = function(map, tbid, textdefault) {
        // create box
        var res = new L.TextBox({
            tbid: tbid,
            textdefault: textdefault
        });
        // Display Box on Map
        res.addTo(map);

        return res;
    };

    this.createButton = function(sign, titleButton) {
        var res = new L.Button({sign: sign, titleButton: titleButton});

        res.onAdd();

        return res;
    }

    //--------------------------------------Instances----------------------------------------------
    //---------------------------------------TOP LEFT----------------------------------------------
    // this.nameBox = 
    //     thisView.createTextBox(map,"ResearchBox", "Current Research");

    
    var deleteShape = function (e) {
      if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()){
        var poly = this.editor.deleteShapeAt(e.latlng);
        //var poly = this.editor.deleteShapeAt(e.latlng);
        myController.deletePolygons(poly);
      }
    };
    map.on('layeradd', function (e) {
        if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
        if (e.layer instanceof L.Path) e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
    });

    // when finish drawing
    map.on('editable:drawing:end', function (e) {
        // save Poly
        var index = myController.registrerPoly(e.layer);
        var namePoly = myModel.currentResearch.nameResearch + " " + index;
        e.layer.namePoly = namePoly;
        e.layer.bindTooltip(e.layer.namePoly).openTooltip();
        myController.addOverlays(e.layer, e.layer.namePoly);
        myController.actualize();
        myController.updateMarkers();
    });

    // // when edit 
    // map.on('editable:vertex:dragend', function (e) {
    //     myController.updateMarkers();
    // });
    // map.on('editable:dragend', function (e) {
    //     myController.updateMarkers();
    // });    
    
    // /**
    //  *  Add button for save current research
    //  */ 
    // this.saveResearchButton =
    //     thisView.createButton(map,'↓ ','Save Research');
    // L.DomEvent.on(this.saveResearchButton.getLink(), 'click', function() {
    //                     myController.addResearch();
    //                 });

    // /**
    // *  Add button for reset current research
    // */ 
    // this.resetResearchButton =
    //     thisView.createButton(map,'♺','Reset Research');
    // L.DomEvent.on(this.resetResearchButton.getLink(), 'click', function(){
    //     myController.resetResearch();
    // });

    // /**
    //  *  Add button for remove current research
    //  */
    // this.removeResearchButton =
    //     thisView.createButton(map,'❎','Delete Research');
    // L.DomEvent.on(this.removeResearchButton.getLink(), 'click', function(){
    //     myController.removeResearch();
    // });

    // /**
    //  *  Add button for remove current research
    //  */
    // this.removeAllResearchButton =
    //     thisView.createButton(map,'❌','Delete All Researchs');
    // L.DomEvent.on(this.removeAllResearchButton.getLink(), 'click', function(){
    //     myController.removeAllResearch();
    // });

    // /**
    //  *  Add background color selector 
    //  */ 
    // var colors = ['Olive','Red', 'Orange', 'Yellow', 'Green', 'Cyan' , 'Blue' , 'Purple' ];
    // this.backgroundColorSelector =
    //     thisView.createColorSelector(map,colors,'Background Color');
    // L.DomEvent.on(this.backgroundColorSelector.getSelect(), 'change', function(){
    //     myController.actualize();
    // });
    
    
    // /**
    //  *  Add tweets color selector 
    //  */ 
    // this.tweetsColorSelector =
    //     thisView.createColorSelector(map,colors,'Tweets Color');

    //----------------------------------TOP RIGHT------------------------------------///
    
    // /**
    //  * Add recherche selectable checkbox list
    //  */
    
    // this.researchCheckBoxList =
    //     this.createCheckBoxList(map, [], 'Research CheckBox List');
    
    // /**
    //  * Add recherche select box
    //  */
    
    // this.researchSelector =
    //     this.createSelector(map, [], 'Research List');
    // L.DomEvent.on(this.researchSelector.getSelect(), 'change', function(){
    //      myController.selectResearch();
    // })
   
    /**
     * Add layers control panel
     */
    this.layersPanel =
        L.control.layers(myModel.mapLayers.dict);
    this.layersPanel.addTo(map);
    myModel.mapLayers.getDefault().addTo(map);
    // L.DomEvent.on(this.layersPanel.getContainer(), 'click', function(){
    //     myController.updateMarkers();
    // });
    // /**
    //  * Add overlays control panel
    //  */
    
    // this.overlaysPanel =
    //     L.control.layers();
    // this.overlaysPanel.addTo(map);
    
    // //---------------------------------Botton right-----------------------------
   

    // this.pointNumber = this.createMessageBox(map);
    // this.pointNumber.setClass("text-basic text-border");
    // this.pointNumber.update(" Data loading...")

    
    /**
     *  LayerGroup contain all ROIs displayed on Map 
     *  including polygons:
     *  + Polygons of research
     *  + ROI admin (not implemented)
     */
    this.rois =
        new L.LayerGroup;
    this.rois.addTo(map);

    this.displayedMarkers =
        new L.LayerGroup;
    this.displayedMarkers.addTo(map);

    //---------------------------------------------Button Organisation------------------------------------------//
    /**
     * @function stopEventOfLeaflet stop all map events
     * @param div div on which we want to stop all map events
     */
    this.stopEventOfLeaflet = function(div) {
         if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
        } else {
            L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
        }
    }
    
    /**
     * ChildBox div
     * under-div of Edit box or Research div
     * @param name name of box Ex Time Interval
     * @param parent the parent element 
     * @param bool true if this is the last child 
     * 
     */
    this.createChildBox = function(name, parent, bool) {
        var res;
        res = L.DomUtil.create("div", 'champComposant leaflet-control leaflet-bar ', parent);
        var firtChild = L.DomUtil.create("div", 'underChampComposant title firstComposant', res);
        firtChild.innerHTML = name;

        return res;
    }
    
    /**
     * Edit box div 
     * Position: left
     * id = research
     * see research.css
     */ 
    var mapDiv = document.getElementById('map')
    this.editionDiv = L.DomUtil.create("div", "leaflet-bar title text-border scrollable", mapDiv);
    this.editionDiv.id = "research";
    // hide varable
    this.editionDiv.hide = false;
    thisView.stopEventOfLeaflet(this.editionDiv);

    // research name
    this.editionTitle = L.DomUtil.create('div','edition-title text-basic text-border', mapDiv);
    this.editionTitle.innerHTML = 'Name research';
    // hide div
    function hideResearch(){

        if(thisView.editionDiv.hide == true){
            thisView.editionTitle.style.visibility = 'hidden';
            thisView.editionDiv.style.visibility = 'hidden';
            thisView.hideButton.setSign("►");
            thisView.hideButton.getContainer().style.left = '0px';
        }
        else {
            thisView.editionTitle.style.visibility = 'visible';
            thisView.editionDiv.style.visibility = 'visible';
            thisView.hideButton.setSign("◄");
            thisView.hideButton.getContainer().style.left = '25%';
        }    
            thisView.editionDiv.hide = !thisView.editionDiv.hide;
    }

    this.hideButton = this.createButton('►', 'hide research');
    L.DomEvent.on(this.hideButton.getLink(), 'click', hideResearch);
    this.hideButton.addOn(mapDiv);
    this.hideButton.addClass('hideResearch');
    
    var editBox = this.createChildBox("Edition Tools", this.editionDiv);
    var timeBox = this.createChildBox("Time Interval", this.editionDiv);
    var colorBox = this.createChildBox("Color Selections", this.editionDiv);
    

    //--------------- Fill Editiontools box --------------------
    /**
     *  Add button for creating a zone
    */ 
    this.newPolygonButton =
        thisView.createButton('▱','New polygon');
    // set up event for ROI creation
    L.DomEvent.on(this.newPolygonButton.getLink(), 'click', function () {
                      map.editTools.startPolygon(); 
            });
    this.newRectangleButton =
        thisView.createButton('▭','New rectangle');
    L.DomEvent.on(this.newRectangleButton.getLink(), 'click', function(){
                    map.editTools.startRectangle();
    });
    this.newCircleButton =
        thisView.createButton('◯','New Circle');
    L.DomEvent.on(this.newCircleButton.getLink(), 'click', function(){
                    map.editTools.startCircle();
    });

    /**
    *  Add button for reset current research
    */ 
    this.resetResearchButton =
        thisView.createButton('♺','Reset Research');
    L.DomEvent.on(this.resetResearchButton.getLink(), 'click', function(){
        myController.resetResearch();
    });

    this.newPolygonButton.addOn(editBox);
    this.newPolygonButton.addClass("childOfEditTools");
    this.newRectangleButton.addOn(editBox);
    this.newRectangleButton.addClass("childOfEditTools");
    this.newCircleButton.addOn(editBox);
    this.newCircleButton.addClass("childOfEditTools");
    this.resetResearchButton.addOn(editBox);
    this.resetResearchButton.addClass("childOfEditTools");

    // for(var i=1; i < editBox.children.length;i++){
    //     editBox.children[i].style.top = -(i-2)*20 + 'px' ;
    //     editBox.children[i].style.left = (i*30)+'px';
    // }
    
    //---------------Fill TimeInterval box-------------------

    function timeSelector(text, date, month, year, parent){
        this.create = function(text, date, month, year, parent)
        {
            var container = L.DomUtil.create('div','timeSelector',parent);
            this._container = container;
            this._textDiv = L.DomUtil.create('div', 'text-border',container);
            this._textDiv.innerHTML = text ;
            this._dateDiv = L.DomUtil.create('select', '',container);
            for(var i=1;i<31; i++){
                var option = L.DomUtil.create('option', 'timeOption', this._dateDiv);
                option.text = i;
                
            }

            this._dateDiv.defaultValue = date;
            this._dateDiv.text = date;
            this._dateDiv.value = date;
            
            this._monthDiv = L.DomUtil.create('select', '',container);
            for(var i=0;i<this.monthsShort.length; i++){
                var option = L.DomUtil.create('option', 'timeOption', this._monthDiv);
                option.text = this.monthsShort[i];
            }
            this._monthDiv.defaultValue = month;
            this._monthDiv.value = month;

            this._yearDiv = L.DomUtil.create('select', '',container);
            for(var i = 2007; i<= 2017; i++){
                var option = L.DomUtil.create('option', 'timeOption', this._yearDiv);
                option.text = i;
            }
            this._yearDiv.defaultValue = year;
            this._yearDiv.value = year;

            return this;
        };

        this.monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        this.getDate = function(){
            return this._dateDiv.value;
        };

        this.create(text, date, month, year, parent);
    };

    this.starTimetDiv = new timeSelector("Start", 23, 'Dec', 2017, timeBox);
    this.endTimetDiv = new timeSelector("End", 23, 'Dec', 2017, timeBox);

    //-------------------Fill Color Selector--------------------------------//
    /**
     *  Add background color selector 
     */ 
    var colors = ['Olive','Red', 'Orange', 'Yellow', 'Green', 'Cyan' , 'Blue' , 'Purple' ];
    this.backgroundColorSelector =
        thisView.createColorSelector(map,colors,'Background Color');
    L.DomEvent.on(this.backgroundColorSelector.getSelect(), 'change', function(){
        myController.actualize();
    });
    this.boundColorSelector =
        thisView.createColorSelector(map,colors,'Bound Color');
    
    /**
     *  Add tweets color selector 
     */ 
    this.tweetsColorSelector =
        thisView.createColorSelector(map,colors,'Tweets Color');

    function addColorSelector(text, child, parent){
        
        var container = L.DomUtil.create('div','colorSelector',parent);
        
        var textDiv = L.DomUtil.create('div', 'text-border',container);
        textDiv.innerHTML = text ;
        var colorSelector = child;
        container.appendChild(colorSelector);

        return container;
    }

    addColorSelector('Bound', thisView.boundColorSelector.getContainer(), colorBox);
    addColorSelector('Background', thisView.backgroundColorSelector.getContainer() ,colorBox);
    addColorSelector('Tweets', thisView.tweetsColorSelector.getContainer() ,colorBox);

    /**
     * Recherche Management box div 
     * Position: right
     * id = management
     * see management.css
     */ 
    this.managementDiv = L.DomUtil.create("div", "leaflet-bar title text-border", mapDiv);
    this.managementDiv.id = "management";
    // hide varable
    this.managementDiv.hide = false;

    function hideManangement(){

        if(thisView.managementDiv.hide == true){
            thisView.managementDiv.style.right="-30%";
            thisView.hideManagementButton.setSign("◄");
        }
        else {
            thisView.managementDiv.style.right="0px";
            thisView.hideManagementButton.setSign("►"); 
        }    
        thisView.managementDiv.hide = !thisView.managementDiv.hide;

    }
    this.hideManagementButton = this.createButton('◄', 'hide management');
    L.DomEvent.on(this.hideManagementButton.getLink(), 'click', hideManangement);
    this.hideManagementButton.addOn(this.managementDiv);
    this.hideManagementButton.addClass('hideManagement');

    // research name
    //this.editionTitle = L.DomUtil.create('div','firstComposant text-basic text-border',this.editionDiv);
    //this.editionTitle.innerHTML = 'Name research';

    this.basemapsBox = this.createChildBox("Base Maps", this.managementDiv);
    this.userlayersBox = this.createChildBox("User Layer", this.managementDiv);

    //----------------------Fill basemapsBox----------------------------------------/

    //----------------------Fill userlayersBox-------------------------------------/
}



//---------------------------------------View Singleton-----------------------------------------------/
var myView = new View();

