import { h, render } from 'preact';

import Game from './components/game.js';

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
	{ index: -1, side: 0,  left: 0, top: 4, isStart: true },
	{ index: 0,  side: 0,  left: 0, top: 3 },
	{ index: 1,  side: 0,  left: 0, top: 2 },
	{ index: 2,  side: 0,  left: 0, top: 1 },
	{ index: 3,  side: 0,  left: 0, top: 0, isDouble: true },
	{ index: 12, side: 0,  left: 0, top: 7 },
	{ index: 13, side: 0,  left: 0, top: 6, isDouble: true },
	{ index: 14, side: 0,  left: 0, top: 5, isEnd: true },

	// Right Squares
	{ index: -1, side: 1,  left: 2, top: 4, isStart: true },
	{ index: 0,  side: 1,  left: 2, top: 3 },
	{ index: 1,  side: 1,  left: 2, top: 2 },
	{ index: 2,  side: 1,  left: 2, top: 1 },
	{ index: 3,  side: 1,  left: 2, top: 0, isDouble: true },
	{ index: 12, side: 1,  left: 2, top: 7 },
	{ index: 13, side: 1,  left: 2, top: 6, isDouble: true },
	{ index: 14, side: 1,  left: 2, top: 5, isEnd: true },

	// Middle/Combat Squares
	{ index: 4,  side: -1, left: 1, top: 0 },
	{ index: 5,  side: -1, left: 1, top: 1 },
	{ index: 6,  side: -1, left: 1, top: 2 },
	{ index: 7,  side: -1, left: 1, top: 3 },
	{ index: 8,  side: -1, left: 1, top: 4, isDouble: true, isSafe: true },
	{ index: 9,  side: -1, left: 1, top: 5 },
	{ index: 10, side: -1, left: 1, top: 6 },
	{ index: 11, side: -1, left: 1, top: 7 },
];

const gameConfig = {
	squares: GAME_SQUARES,
	playerCount: 2,
	rollCount: 4,
	tokenCount: 7,
	boardConfig: {
		cols: 3,
		rows: 8,
	},
};

render( <Game { ...gameConfig } />, document.getElementById( 'root' ) );
