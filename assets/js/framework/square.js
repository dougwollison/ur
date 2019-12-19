import Emitter from './emitter.js';

export default class Square extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-square' );
		this.token = null;

		this.index = config.index;
		this.side = config.side;
		this.top = config.top;
		this.left = config.left;
		this.isDouble = !! config.isDouble;
		this.isSafe = !! config.isSafe;

		this.el.classList.add( config.side );
		this.el.classList.toggle( 'is-double', this.isDouble );
		this.el.classList.toggle( 'is-safe', this.isSafe );
	}

	addToken( token ) {
		if ( token.square && token.square !== this ) {
			token.square.removeToken( token );
		}

		this.token = token;
		token.square = this;
	}

	removeToken( token ) {
		if ( this.token === token ) {
			this.token = null;
		}
		if ( token.square === this ) {
			token.square = null;
		}
	}
}
