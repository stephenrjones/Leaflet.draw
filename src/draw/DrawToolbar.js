L.DrawToolbar = L.Toolbar.extend({

	options: {
		polyline: {},
		polygon: {},
		rectangle: {},
		circle: {},
		marker: {}
	},

	initialize: function (options) {
		// Ensure that the options are merged correctly since L.extend is only shallow
		for (var type in this.options) {
			if (this.options.hasOwnProperty(type)) {
				if (options[type]) {
					options[type] = L.extend({}, this.options[type], options[type]);
				}
			}
		}

        // SRJ: passing in array of markers and polygons (eventually)
        if (options.markers) {
            this.options.markers = options.markers;
        }

		L.Toolbar.prototype.initialize.call(this, options);
	},

	addToolbar: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw-section'),
			buttonIndex = 0,
			buttonClassPrefix = 'leaflet-draw-draw';

		this._toolbarContainer = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');


		if (this.options.polyline) {
			this._initModeHandler(
				new L.Draw.Polyline(map, this.options.polyline),
				this._toolbarContainer,
				buttonIndex++,
				buttonClassPrefix,
				L.drawLocal.draw.toolbar.buttons.polyline
			);
		}

		if (this.options.polygon) {
//			this._initModeHandler(
//				new L.Draw.Polygon(map, this.options.polygon),
//				this._toolbarContainer,
//				buttonIndex++,
//				buttonClassPrefix,
//				L.drawLocal.draw.toolbar.buttons.polygon
//			);

            if (this.options.polygons) {
                for (var k = 0; k < this.options.polygons.length; k++) {
                    var optns = L.extend({}, this.options.polygon, this.options.polygons[k]);
                    var poly = new L.Draw.Polygons(map, optns, optns.id);
                    //poly.id = marker.type + "-" + i;
                    this._initModeHandler(
                        poly,
                        this._toolbarContainer,
                        buttonIndex++,
                        buttonClassPrefix,
                        //L.drawLocal.draw.toolbar.buttons.marker
                        this.options.polygons[k].title
                    );
                }
            }
		}

		if (this.options.rectangle) {
			this._initModeHandler(
				new L.Draw.Rectangle(map, this.options.rectangle),
				this._toolbarContainer,
				buttonIndex++,
				buttonClassPrefix,
				L.drawLocal.draw.toolbar.buttons.rectangle
			);
		}

		if (this.options.circle) {
			this._initModeHandler(
				new L.Draw.Circle(map, this.options.circle),
				this._toolbarContainer,
				buttonIndex++,
				buttonClassPrefix,
				L.drawLocal.draw.toolbar.buttons.circle
			);
		}

		if (this.options.marker) {
            if (this.options.markers) {
                for (var i = 0; i < this.options.markers.length; i++) {
                    var opts = L.extend({}, this.options.marker, this.options.markers[i]);
                    var marker = new L.Draw.Markers(map, opts, opts.id);
                    //marker.id = marker.type + "-" + i;
                    this._initModeHandler(
                        marker,
                        this._toolbarContainer,
                        buttonIndex++,
                        buttonClassPrefix,
                        //L.drawLocal.draw.toolbar.buttons.marker
                        this.options.markers[i].icon.options.text
                    );
                }
            }
		}

		// Save button index of the last button, -1 as we would have ++ after the last button
		this._lastButtonIndex = --buttonIndex;

		// Create the actions part of the toolbar
		this._actionsContainer = this._createActions([
			{
				title: L.drawLocal.draw.toolbar.actions.title,
				text: L.drawLocal.draw.toolbar.actions.text,
				callback: this.disable,
				context: this
			}
		]);

		// Add draw and cancel containers to the control container
		container.appendChild(this._toolbarContainer);
		container.appendChild(this._actionsContainer);

		return container;
	},

	setOptions: function (options) {
		L.setOptions(this, options);

		for (var type in this._modes) {
			if (this._modes.hasOwnProperty(type) && options.hasOwnProperty(type)) {
				this._modes[type].handler.setOptions(options[type]);
			}
		}
	}
});