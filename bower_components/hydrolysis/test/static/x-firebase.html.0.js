

Polymer({

  is: 'x-firebase',

  /**
   * Fired when properties on `data` are added, removed, or modified.
   *
   * @event data-change
   */

  /**
   * Fired when an error occurs on an interaction with Firebase.  The
   * `details.error` property contains the `Error` object provided by
   * the Firebase API.
   *
   * @event error
   */

  publish: {
    /**
     * Firebase location mapped to `data`.
     * @attribute location
     * @type String
     */
    location: String,
    /**
     * Restricts the number of records reflected on the client.
     * @attribute limit
     * @type Number
     */
    limit: Number,
    /**
     * Specify a starting record for the set of records reflected on the client.
     * @attribute start
     * @type Any
     */
    start: Number,
    /**
     * Specify an ending record for the set of records reflected on the client.
     * @attribute end
     * @type Any
     */
    end: Number,
    /**
     * The `data` object mapped to `location`.
     * @attribute data
     * @type Object
     */
    data: {
      type: Object,
      notify: true
    },
    /**
     * All keys in data (array of names, if you think of data as a set of name/value pairs).
     * @attribute keys
     * @type Array
     */
    keys: {
      type: Array,
      notify: true
    },
    /**
     * If true, will fire `child-added`, `child-removed`, `child-changed` events.
     * @attribute childEvents
     * @type Boolean
     */
    childEvents: Boolean,
    /**
     * When set, data will be stored with the given Firebase priority level.
     * @attribute priority
     * @type Number
     */
    priority: Number,
    /**
     * Reflects whether the data at this locaation as been read at least once
     * @attribute initialized
     * @type Boolean
     */
    dataReady: {
      type: Boolean,
      notify: true
    },
    /**
     * If true, will log various occurances to the console api.
     * @attribute log
     * @type Boolean
     */
    log: Boolean
  },

  bind: {
    location: 'locationChanged',
    data: 'dataChanged',
    ref: 'debouncedRequery',
    limit: 'debouncedRequery',
    start: 'debouncedRequery',
    end: 'debouncedRequery'
  },

  features: function() {
    this._data.data = null;
    this.defaultFeatures();
  },

  locationChanged: function() {
    // shut-down previous observers (if any)
    this.closeQuery();
    // connect to db
    if (this.location) {
      this.ref = new Firebase(this.location);
      this.debouncedRequery();
    } else {
      this.ref = null;
    }
  },

  debouncedRequery: function() {
    if (!this.requeryJob) {
      this.requeryJob = setTimeout(function() {
        this.requeryJob = null;
        this.requery();
      }.bind(this), 0);
    }
  },

  requery: function() {
    // shut-down previous observers (if any)
    this.closeQuery();
    this.closeObserver();
    // construct new query
    var query = this.ref;
    if (query) {
      if (this.start) {
        query = query.startAt(this.start);
      }
      if (this.end) {
        query = query.endAt(this.end);
      }
      if (this.limit > 0) {
        query = query.limit(this.limit);
      }
      this.query = query;
      this.queryChanged();
    }
  },

  queryChanged: function() {
    // initialize
    this._updateData(null);
    // data acquisition
    this.dataReady = false;
    this.valueLoading = true;
    this.query.once('value', this.valueLoaded, this.errorHandler, this);
  },

  valueLoaded: function(snapshot) {
    this.valueLoading = false;
    if (this.ref.key() !== snapshot.key()) {
      this.log && console.warn('squelching stale response [%s]', snapshot.key());
      return;
    }
    this.log && console.log('acquired value ' + this.location);
    this.dataReady = true;
    this._remoteValueChanged = true;
    this._updateData(snapshot.val());
    if (this.data) {
      this.dataChange();
    }
    this.observeQuery();
  },

  valueUpdated: function(snapshot) {
    this._updateData(snapshot.val());
    if (this.data) {
      this.dataChange();
    }
  },

  _updateData: function(data) {
    this.closeObserver();
    this._lastData = data;
    this.data = data;
    this.observeData();
  },

  //
  // server-side data-observation
  //
  observeQuery: function() {
    // server side dynamics
    if (this.data instanceof Object || this.data instanceof Array) {
      this.query.on('child_added', this.childAdded, this.errorHandler, this);
      this.query.on('child_changed', this.childChanged, this.errorHandler, this);
      this.query.on('child_removed', this.childRemoved, this.errorHandler, this);
    } else {
      this.query.on('value', this.valueUpdated, this.errorHandler, this);
    }
  },

  closeQuery: function() {
    if (this.query) {
      this.query.off();
    }
  },

  //
  // client-side data-observation
  //
  observeData: function() {
    // if (this.data instanceof Array) {
    //   this.observer = new ArrayObserver(this.data);
    //   this.observer.open(this.observeArray.bind(this));
    // } else if (this.data instanceof Object) {
    //   this.observer = new ObjectObserver(this.data);
    //   this.observer.open(this.observeObject.bind(this));
    // }
  },

  closeObserver: function() {
    // if (this.observer) {
    //   this.observer.close();
    //   this.observer = null;
    // }
  },

  dataChanged: function() {
    if (!this._remoteValueChanged) {
      this._updateData(this.data);
      this.commit();
    }
    this._remoteValueChanged = false;
  },

  priorityChanged: function() {
    if (this.ref && (this.priority != null)) {
      this.ref.setPriority(this.priority, this.errorHandler);
    }
  },

  discardObservations: function() {
    if (this.observer) {
      this.observer.discardChanges();
    }
  },

  deliverObservations: function() {
    if (this.observer) {
      this.observer.deliver();
    }
  },

  //
  // server-side effects
  //
  childAdded: function(snapshot) {
    if (this.data) {
      // ignore initial adds, we'll take the 'value' instead
      this.modulateData('updateData', snapshot);
    } else if (!this.valueLoading) {
      // if children are added to a previously null location, grab the whole value in one go
      this.valueLoading = true;
      this.query.once('value', this.valueLoaded, this);
    }
    this.childEvent('child-added', snapshot);
  },

  childChanged: function(snapshot) {
    if (!this.valueLoading) {
      this.modulateData('updateData', snapshot);
    }
    this.childEvent('child-changed', snapshot);
  },

  childRemoved: function(snapshot) {
    if (!this.valueLoading) {
      this.modulateData('removeData', snapshot);
    }
    this.childEvent('child-removed', snapshot);
  },

  childEvent: function(kind, snapshot) {
    this.log && console.log(kind, snapshot.key());
    if (this.childEvents) {
      this.fire(kind, {name: snapshot.key(), value: snapshot.val()});
    }
  },

  modulateData: function(operation, snapshot) {
    // handle any pending observations
    this.deliverObservations();
    this[operation](snapshot);
    this.dataChange();
    // discard any observations so we don't send this value back to the
    // server, it may already be stale from the server's perspective
    this.discardObservations();
  },

  updateData: function(snapshot) {
    if (!this.data) {
      this.data = {};
    }
    this.data[snapshot.key()] = snapshot.val();
  },

  removeData: function(snapshot) {
    var key = snapshot.key();
    if (this.data instanceof Array) {
      this.data.splice(key, 1);
      if (data.length == 0) {
        this._updateData(null);
      }
    } else if (this.data) {
      delete this.data[key];
      if (Object.keys(this.data).length === 0) {
        this._updateData(null);
      }
    }
  },

  dataChange: function() {
    //this.job('change', function() {
      if (this.data) {
        this.keys = this.data instanceof Object ? Object.keys(this.data) : [];
      }
      // TODO(kschaaf): Notify when bind-effects-object experimental feature is enabled
      if (this.notifyPropertyChange) {
        this.notifyPropertyChange('data');
      }
    //});
  },

  //
  // client-side effects
  //
  observeArray: function(splices) {
    //console.warn('observeArray');
    // TODO(sjmiles): arrays are nasty because simple insertions/deletions
    // cause changes to ripple through keys
    this.commit();
  },

  observeObject: function(added, removed, changed, getOldValueFn) {
    // client-side dynamics
    var ctrlr = this;
    Object.keys(added).forEach(function(property) {
      ctrlr.commitProperty(property);
    });
    Object.keys(removed).forEach(function(property) {
      ctrlr.remove(property);
    });
    Object.keys(changed).forEach(function(property) {
      ctrlr.commitProperty(property);
    });
  },

  // api for manual commits
  commitProperty: function(key) {
    this.log && console.log('commitProperty ' + key);
    if (this.ref) {
      this.ref.child(key).set(this.data[key], this.errorHandler);
    }
  },

  remove: function(key) {
    this.ref.child(key).remove(this.errorHandler);
  },

  commit: function() {
    this.log && console.log('commit');
    if (this.ref) {
      if (this.priority != null) {
        this.ref.setWithPriority(this.data || {}, this.priority, this.errorHandler);
      } else {
        this.ref.set(this.data || {}, this.errorHandler);
      }
    }
  },

  push: function(item) {
    var neo;
    if (this.data instanceof Array) {
      this.commitProperty(this.data.push(item)-1);
    } else {
      neo = this.ref.push(item, this.errorHandler);
    }
    this.dataChange();
    return neo;
  },

  errorHandler: function(error) {
    if (error) {
      this.fire('error', {error: error});
    }
  }

});

