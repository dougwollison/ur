const TOKEN_COUNT = 7;
const FINAL_SQUARE = 13;

const GAME_SQUARES = [
	/* ==========
	l03  m04  r03
	l02  m05  r02
	l01  m06  r01
	l00  m07  r00
	---  m08  ---
	---  m09  ---
	l13  m10  r13
	l12  m11  r12
	========== */

	// Left Squares
	{ index: 0,  side: 'left',   left: 0, top: 3 },
	{ index: 1,  side: 'left',   left: 0, top: 2 },
	{ index: 2,  side: 'left',   left: 0, top: 1 },
	{ index: 3,  side: 'left',   left: 0, top: 0, isDouble: true },
	{ index: 12, side: 'left',   left: 0, top: 7 },
	{ index: 13, side: 'left',   left: 0, top: 6, isDouble: true },

	// Right Squares
	{ index: 0,  side: 'right',  left: 2, top: 3 },
	{ index: 1,  side: 'right',  left: 2, top: 2 },
	{ index: 2,  side: 'right',  left: 2, top: 1 },
	{ index: 3,  side: 'right',  left: 2, top: 0, isDouble: true },
	{ index: 12, side: 'right',  left: 2, top: 7 },
	{ index: 13, side: 'right',  left: 2, top: 6, isDouble: true },

	// Middle/Combat Squares
	{ index: 4,  side: 'middle', left: 1, top: 0 },
	{ index: 5,  side: 'middle', left: 1, top: 1 },
	{ index: 6,  side: 'middle', left: 1, top: 2 },
	{ index: 7,  side: 'middle', left: 1, top: 3 },
	{ index: 8,  side: 'middle', left: 1, top: 4, isDouble: true, isSafe: true },
	{ index: 9,  side: 'middle', left: 1, top: 5 },
	{ index: 10, side: 'middle', left: 1, top: 6 },
	{ index: 11, side: 'middle', left: 1, top: 7 },
];

function flip() {
	return Math.floor( Math.random() * 2 ) ? 1 : 0;
}

class Square {
	constructor( config ) {
		this.el = document.createElement( 'ur-square' );
		this.token = null;

		this.isDouble = !! config.isDouble;
		this.isSafe = !! config.isSafe;

		this.el.classList.add( config.side );
		this.el.classList.toggle( 'is-double', this.isDouble );
		this.el.classList.toggle( 'is-safe', this.isSafe );
	}

	add( token ) {
		this.token = token;
		this.el.appendChild( token.el );
	}

	remove( token ) {
		this.el.removeChild( token.el );
		this.token = null;
	}

	size( width, height ) {
		this.el.style.width = width * 100 + '%';
		this.el.style.height = height * 100 + '%';
	}

	position( left, top ) {
		this.el.style.left = left * 100 + '%';
		this.el.style.top = top * 100 + '%';
	}
}

class Board {
	constructor( width, height, squares ) {
		this.el = document.createElement( 'ur-board' );
		this.squares = [];

		this.el.style.width = width * 100 + 'px';
		this.el.style.height = height * 100 + 'px';

		squares.forEach( config => {
			var square = new Square( config );

			this.el.appendChild( square.el );

			square.size( 1 / width, 1 / height );
			square.position( config.left / width, config.top / height );

			this.squares[ config.side + config.index ] = square;
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

		// Get the applicable square
		var square = this.squares[ token.side + progress ] || this.squares[ 'm' + progress ];

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
		this.el = document.createElement( 'ur-token' );
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

class Player {
	constructor( side ) {
		this.el = document.createElement( 'ur-player' );
		this.el.classList.add( side );

		this.roll = 0;

		this.inactiveTokens = [];
		for ( let i = 0; i < TOKEN_COUNT; i++ ) {
			this.inactiveTokens.push( new Token( side ) );
		}

		this.activeTokens = [];
		this.completedTokens = [];
	}

	roll() {
		// simulate flipping 4 coins
		this.roll = flip() + flip() + flip() + flip();
	}
}

const board = new Board( 3, 8, GAME_SQUARES );

const player1 = new Player( 'left' );
const player2 = new Player( 'right' );

const canvas = document.body;
canvas.appendChild( board.el );
canvas.appendChild( player1.el );
canvas.appendChild( player2.el );

window.game = { board, player1, player2 };
