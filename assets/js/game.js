const SAFE_SQUARES = [ 7 ];
const DOUBLE_SQUARES = [ 3, 7, 13 ];
const COMBAT_SQUARES = [ 4, 5, 6, 7, 8, 9, 10, 11 ];
const FINAL_SQUARE = 13;

class Square {
	constructor( el, side, index ) {
		this.el = el;
		this.token = null;

		el.classList.add( side );

		// Check if it's a safe square, flag if so
		this.isSafe = SAFE_SQUARES.indexOf( index ) >= 0;
		el.classList.toggle( 'is-safe', this.isSafe );

		// Check if it's a double square, flag if so
		this.isDouble = DOUBLE_SQUARES.indexOf( index ) >= 0;
		el.classList.toggle( 'is-double', this.isDouble );
	}

	add( token ) {
		this.token = token;
		this.el.appendChild( token.el );
	}

	remove( token ) {
		this.el.removeChild( token.el );
		this.token = null;
	}
}

class Board {
	constructor( el ) {
		this.el = el;
		this.squares = [];

		// Create the map of squares
		el.querySelectorAll( '.game-square' ).forEach( el => {
			var side = el.dataset.side;
			var index = parseInt( el.dataset.index );

			this.squares[ side + index ] = new Square( el, side, index );
		} );
	}

	place( token ) {
		var progress = token.progress;

		// If not in play, ignore
		if ( progress < 0 ) {
			return;
		}

		// If past the final square, remove from board
		if ( progress > FINAL_SQUARE ) {
			token.remove();
			return;
		}

		// Get the side (own or middle) based on progress
		var side = COMBAT_SQUARES.indexOf( progress ) >= 0 ? 'middle' : token.side;

		// Get the square for that side/index
		var square = this.squares[ side + progress ];

		// Check if a token is already there
		if ( square.token ) {
			// If safe, move ahead
			if ( square.isSafe ) {
				token.advance();
				this.place( token );
				return;
			}

			// reset the existing token and take it's place
			square.token.reset();
			square.remove( square.token );
		}

		// Add the token to the square
		square.add( token );
	}
}

class Token {
	constructor( side ) {
		this.side = side;
		this.progress = -1;
		this.el = document.createElement( 'div' );
		this.el.classList.add( 'token', side );
	}

	advance( amount = 1 ) {
		this.progress += amount;
	}

	reset() {
		this.progress = -1;
	}

	remove() {
		// Remove from DOM if applicable
		if ( this.el.parent ) {
			this.el.parent.removeChild( this.el );
		}
	}
}

const board = new Board( document.getElementById( 'canvas' ) );

const player1 = new Token( 'left' );
const player2 = new Token( 'right' );

// Debugging tools

window.game = { board, player1, player2 };

window.advanceToken = function( token, amount ) {
	token.advance( amount );
	board.place( token );
};
