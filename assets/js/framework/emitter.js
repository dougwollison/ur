export default class Emitter {
	constructor() {
		this._callbacks = {};

		return this;
	}

	on( event, callback ) {
		( this._callbacks[ event ] = this._callbacks[ event ] || [] ).push( callback );

		return this;
	}

	once( event, callback ) {
		function listener() {
			this.removeListener( event, listener );
			callback.apply( this, arguments );
		}

		listener.fn = callback;
		this.addListener( event, listener );

		return this;
	}

	off( event, callback ) {
		var callbacks = this._callbacks[ event ];

		if ( ! callbacks ) {
			return this;
		}

		if ( ! callback ) {
			delete this._callbacks[ event ];
			return this;
		}

		for ( var i = 0; i < callbacks.length; i++ ) {
			const cb = callbacks[ i ];

			if ( cb === callback || cb.fn === callback ) {
				callbacks.splice( i, 1 );

				break;
			}
		}

		if ( callbacks.length === 0 ) {
			delete this._callbacks[ event ];
		}

		return this;
	}

	trigger( event ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		var callbacks = this._callbacks[ event ] || [];
		var allCallbacks = this._callbacks[ 'all' ] || [];

		if ( callbacks ) {
			for ( const callback of callbacks ) {
				callback.apply( this, args );
			}
		}

		if ( allCallbacks ) {
			args.unshift( event );
			for ( const callback of allCallbacks ) {
				callback.apply( this, args );
			}
		}

		return this;
	}
}
