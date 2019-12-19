import Emitter from './emitter.js';
import Square from './square.js';

export default class Board extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-board' );

		this.width = config.width;
		this.height = config.height;

		this.el.innerHTML = `<svg id="canvas" version="1" width="${config.width * 100}" height="${config.height * 100}" xmlns="http://www.w3.org/2000/svg"></svg>`;

		this.squares = config.squares.map( squareConfig => {
			var square = new Square( squareConfig );

			this.placeItem( square.el, squareConfig.top, squareConfig.left );

			return square;
		} );

		this.finalSquare = config.finalSquare;
	}

	findSquare( index, side ) {
		var result = this.squares.filter( square => square.index === index );

		if ( result.length > 1 ) {
			result = result.filter( square => square.side === side );
		}

		return result[0];
	}

	validateMove( token, moveBy ) {
		var progress = token.progress + moveBy;

		// At final square; valid
		if ( progress === this.finalSquare ) {
			return true;
		}

		var square = this.findSquare( progress, token.side );

		// Somehow no square found; invalid
		if ( ! square ) {
			return false;
		}

		// Square is occupied by own token; invalid
		if ( square.token && square.token.side === token.side ) {
			return false;
		}

		// Square is capturable but Safe, check next square
		if ( square.token && square.isSafe ) {
			return this.validateMove( token, moveBy + 1 )
		}

		return true;
	}

	validateTokens( tokens, moveBy ) {
		return tokens.filter( token => this.validateMove( token, moveBy ) );
	}

	placeItem( el, top, left ) {
		if ( el.parentElement !== this.el ) {
			this.el.appendChild( el );
		}

		if ( typeof top === 'number' ) {
			el.style.top = ( top / this.height ) * 100 + '%';
		}
		if ( typeof left === 'number' ) {
			el.style.left = ( left / this.width ) * 100 + '%';
		}
	}

	placeToken( token ) {
		var progress = token.progress;

		// If somehow not a valid move, abort
		if ( ! this.validateMove( token, 0 ) ) {
			return false;
		}

		// If at the final square, complete
		if ( progress === this.finalSquare ) {
			token.complete();
			return false;
		}

		// Find the applicable square and place it there
		var square = this.findSquare( progress, token.side );
		if ( square ) {
			// Reset captured token if found
			if ( square.token ) {
				square.token.reset();
			}

			// (Re)place the token in the square
			square.addToken( token );
			token.trigger( 'place' );

			// Draw on board
			this.placeItem( token.el, square.top, square.left );
		}

		// return
		return square && square.isDouble;
	}
}
