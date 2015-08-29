

/**
* A module with no dependencies
* and some newlines
* in
* its
* docstring.
*/
  modulate('bare-module', function() {
    return {

      /**
       * User must call from `attached` callback
       *
       * @method resizableAttached
       */
      resizableAttached: function(cb) {
        cb = cb || this._notifyResizeSelf;
        this.async(function() {
          var detail = {callback: cb, hasParentResizer: false};
          this.fire('x-request-resize', detail);
          if (!detail.hasParentResizer) {
            this._boundWindowResizeHandler = cb.bind(this);
            // log('adding window resize handler', null, this);
            window.addEventListener('resize', this._boundWindowResizeHandler);
          }
        }.bind(this));
      },

      /**
       * User must call from `detached` callback
       *
       * @method resizableDetached
       */
      resizableDetached: function() {
        this.fire('x-request-resize-cancel', null, this, false);
        if (this._boundWindowResizeHandler) {
          window.removeEventListener(this._boundResizeHandler);
        }
      },

      // Private: fire non-bubbling resize event to self; returns whether
      // preventDefault was called, indicating that children should not
      // be resized
      _notifyResizeSelf: function() {
        return this.fire('x-resize', null, this, false).defaultPrevented;
      }

    };
  });

/**
 * A module that depends on bare-module.
 */
  modulate('module-depends', ['bare-module'], function(bare) {
    return {

      /**
       * User must call from `attached` callback
       *
       * @method resizerAttached
       */
      resizerAttached: function() {
        this.resizableAttached(this.notifyResize);
        this._boundResizeRequested = this._boundResizeRequested || this._handleResizeRequested.bind(this);
        var target = this.resizerIsPeer ? this.parentElement : this;
        target.addEventListener('x-request-resize', this._boundResizeRequested);
      },

      /**
       * User must call from `detached` callback
       *
       * @method resizerDetached
       */
      resizerDetached: function() {
        this.resizableDetached();
        var target = this.resizerIsPeer ? this.parentElement : this;
        target.removeEventListener('x-request-resize', this._boundResizeRequested);
      },

      /**
       * User should call when resizing or un-hiding children
       *
       * @method notifyResize
       */
      notifyResize: function() {
        // Notify self
        if (!this._notifyResizeSelf()) {
          // Notify requestors if default was not prevented
          var r = this.resizeRequestors;
          if (r) {
            for (var i=0; i<r.length; i++) {
              var ri = r[i];
              if (!this.resizerShouldNotify || this.resizerShouldNotify(ri.target)) {
                // log('notifying resize', null, ri.target, true);
                ri.callback.apply(ri.target);
                // logEnd();
              }
            }
          }
        }
      },

      /**
       * User should implement to introduce filtering when notifying children.
       * Generally, children that are hidden by the CoreResizer (e.g. non-active
       * pages) need not be notified during resize, since they will be notified
       * again when becoming un-hidden.
       *
       * Return `true` if CoreResizable passed as argument should be notified of
       * resize.
       *
       * @method resizeerShouldNotify
       * @param {Element} el
       */
       // resizeerShouldNotify: function(el) { }  // User to implement if needed
      /**
       * Set to `true` if the resizer is actually a peer to the elements it
       * resizes (e.g. splitter); in this case it will listen for resize requests
       * events from its peers on its parent.
       *
       * @property resizerIsPeer
       * @type Boolean
       * @default false
       */
      // Private: Handle requests for resize
      _handleResizeRequested: function(e) {
        if (e.target == this) {
          return;
        }
        // log('resize requested', e.target, this);
        if (!this.resizeRequestors) {
          this.resizeRequestors = [];
        }
        this.resizeRequestors.push({target: e.target, callback: e.detail.callback});
        e.target.addEventListener('x-request-resize-cancel', this._cancelResizeRequested.bind(this));
        e.detail.hasParentResizer = true;
        e.stopPropagation();
      },

      // Private: Handle cancellation requests for resize
      _cancelResizeRequested: function(e) {
        // Exit early if we're already out of the DOM (resizeRequestors will already be null)
        if (this.resizeRequestors) {
          for (var i=0; i<this.resizeRequestors.length; i++) {
            if (this.resizeRequestors[i].target == e.target) {
              // log('resizeCanceled', e.target, this);
              this.resizeRequestors.splice(i, 1);
              break;
            }
          }
        }
      }

    };
  });

//
//  Toss some comments around for fun.
//
//
