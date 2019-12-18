import Emitter from './emitter.js';
import Square from './square.js';

export default class Board extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-board' );
		this.squares = [];

		this.width = config.width;
		this.height = config.height;

		this.el.style.width = this.width * 100 + 'px';
		this.el.style.height = this.height * 100 + 'px';

		config.squares.forEach( squareConfig => {
			var square = new Square( squareConfig );

			this.placeItem( square.el, squareConfig.top, squareConfig.left, 1, 1 );

			this.squares[ squareConfig.side + squareConfig.index ] = square;
		} );
	}

	placeItem( el, top, left, width, height ) {
		this.el.appendChild( el );

		if ( top ) {
			el.style.top = top * 100 + 'px';
		}
		if ( left ) {
			el.style.left = left * 100 + 'px';
		}
		if ( width ) {
			el.style.width = width * 100 + 'px';
		}
		if ( height ) {
			el.style.height = height * 100 + 'px';
		}
	}

	placeToken( token ) {
		var progress = token.progress;

		// If not in play, abort
		if ( progress < 0 ) {
			return false;
		}

		// Find the applicable square and place it there
		var square = this.squares[ token.side + progress ] || this.squares[ 'm' + progress ];
		if ( square ) {
			const capture = square.token;

			// Check if there is a token to capture
			if ( capture ) {
				// Can't capture if own token, abort
				if ( capture.side === token.side ) {
					return false;
				}

				// Can't capture if safe, move ahead
				if ( square.isSafe ) {
					token.advance();
					return this.place( token );
				}

				// Reset the target token
				capture.reset();
			}

			// Place the token to the square
			square.token = token;

			this.placeItem( token.el, square.top, square.left );
		}

		// return
		return square;
	}
}
