import Game from './framework/game.js';

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

const game = new Game( {
	players: [ 'left', 'right' ],
	board: {
		width: 3,
		height: 8,
		squares: GAME_SQUARES,
		finalSquare: 14,
	},
	player: {
		tokenCount: 7,
	},
} );

document.getElementById( 'start' ).addEventListener( 'click', function() {
	this.hidden = true;
	game.start();
} );

/*
Game flow concept:
1. player clicks their ROLL button, if 0, turn ends
2. valid tokens will be highlighted, if none are, turn ends
3. player selects valid token to place/move
4. if enemy token is captured, return to enemy players hand
5. if token reaches end, move to complete pile
6. if landing on a double, back to step 1
7. if last token is completed, end
*/

document.body.appendChild( game.el );

window.game = game;
