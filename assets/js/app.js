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
	{ index: -1, side: 0, left: 0, top: 4, arrowSide1: '', isStart: true },
	{ index: 0, side: 0, left: 0, top: 3, arrowSide1: 'u v' },
	{ index: 1, side: 0, left: 0, top: 2, arrowSide1: 'u v' },
	{ index: 2, side: 0, left: 0, top: 1, arrowSide1: 'u v' },
	{ index: 3, side: 0, left: 0, top: 0, arrowSide1: 'r br', isDouble: true },
	{ index: 13, side: 0, left: 0, top: 8, arrowSide1: 'u tr' },
	{ index: 14, side: 0, left: 0, top: 7, arrowSide1: 'u v', isDouble: true },
	{ index: 15, side: 0, left: 0, top: 6, arrowSide1: '', isEnd: true },

	// Right Squares
	{ index: -1, side: 1, left: 2, top: 4, arrowSide2: '', isStart: true },
	{ index: 0, side: 1, left: 2, top: 5, arrowSide2: 'd v' },
	{ index: 1, side: 1, left: 2, top: 6, arrowSide2: 'd v' },
	{ index: 2, side: 1, left: 2, top: 7, arrowSide2: 'd v' },
	{ index: 3, side: 1, left: 2, top: 8, arrowSide2: 'l tl', isDouble: true },
	{ index: 13, side: 1, left: 2, top: 0, arrowSide2: 'd bl' },
	{ index: 14, side: 1, left: 2, top: 1, arrowSide2: 'd v', isDouble: true },
	{ index: 15, side: 1, left: 2, top: 2, arrowSide2: '', isEnd: true },

	// Middle/Combat Squares
	{ index: 4, side: -1, left: 1, top: 0, arrowSide1: 'd bl', arrowSide2: 'r br' },
	{ index: 5, side: -1, left: 1, top: 1, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 6, side: -1, left: 1, top: 2, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 7, side: -1, left: 1, top: 3, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 8, side: -1, left: 1, top: 4, arrowSide1: 'd v', arrowSide2: 'u v', isDouble: true, isSafe: true },
	{ index: 9, side: -1, left: 1, top: 5, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 10, side: -1, left: 1, top: 6, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 11, side: -1, left: 1, top: 7, arrowSide1: 'd v', arrowSide2: 'u v' },
	{ index: 12, side: -1, left: 1, top: 8, arrowSide1: 'l tl', arrowSide2: 'u tr' },
];

const gameConfig = {
	squares: GAME_SQUARES,
	playerCount: 2,
	minRoll: 0,
	maxRoll: 4,
	tokenCount: 7,
	boardConfig: {
		cols: 3,
		rows: 9,
	},
};

render( <Game { ...gameConfig } />, document.getElementById( 'root' ) );
