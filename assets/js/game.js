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
}

class Square {
	constructor( config ) {
		this.el = document.createElement( 'ur-square' );
		this.token = null;

		this.side = config.side;
		this.top = config.top;
		this.left = config.left;
		this.isDouble = !! config.isDouble;
		this.isSafe = !! config.isSafe;

		this.el.classList.add( config.side );
		this.el.classList.toggle( 'is-double', this.isDouble );
		this.el.classList.toggle( 'is-safe', this.isSafe );
	}
}

class Board {
	constructor( config ) {
		this.el = document.createElement( 'ur-board' );
		this.squares = [];

		this.width = config.width;
		this.height = config.height;

		this.el.style.width = this.width * 100 + 'px';
		this.el.style.height = this.height * 100 + 'px';

		config.squares.forEach( squareConfig => {
			var square = new Square( squareConfig );

			this.placeItem( square.el, 1, 1, squareConfig.top, squareConfig.left );

			this.squares[ squareConfig.side + squareConfig.index ] = square;
		} );
	}

	placeItem( el, width, height, top, left ) {
		this.el.appendChild( el );

		el.style.width = width * 100 + 'px';
		el.style.height = height * 100 + 'px';

		el.style.top = top * 100 + 'px';
		el.style.left = left * 100 + 'px';
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
			var capture = square.token;

			// Check if there is a token to capture
			if ( capture ) {
				// Can't capture if own token, abort
				if ( caputre.side === token.side ) {
					return false;
				}

				// Can't capture if safe, move ahead
				if ( square.isSafe ) {
					token.advance();
					return this.place( token );
				}

				// Reset the target token, take it's place
				square.token.reset();
				square.token = token;

				// return token to remove
				return capture;
			}

			// Add the token to the square
			square.token = token;
		}

		// return
		return square;
	}
}

class Player {
	constructor( config ) {
		this.el = document.createElement( 'ur-player' );
		this.el.classList.add( config.side );

		this.inactiveTokens = [];
		for ( let i = 0; i < config.tokenCount; i++ ) {
			const token = new Token( config.side );

			this.inactiveTokens.push( token );
			this.el.appendChild( token.el );
		}

		this.activeTokens = [];
		this.completedTokens = [];
	}
}

class Game {
	constructor( config ) {
		this.el = document.createElement( 'ur-game' );

		this.board = new Board( config.board );
		this.player1 = new Player( { ...config.players, side: 'left' } );
		this.player2 = new Player( { ...config.players, side: 'right' } );

		this.el.appendChild( this.board.el );
		this.el.appendChild( this.player1.el );
		this.el.appendChild( this.player2.el );
	}

	roll() {
		// simulate flipping 4 coins
		return flip() + flip() + flip() + flip();
	}
}

window.game = new Game( {
	board: {
		width: 3,
		height: 8,
		squares: GAME_SQUARES,
	},
	players: {
		tokenCount: 7,
	},
	finalSquare: 13,
} );

document.body.appendChild( game.el );
