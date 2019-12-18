import Emitter from './emitter.js';
import Board from './board.js';
import Player from './player.js';

function flip() {
	return Math.floor( Math.random() * 2 ) ? 1 : 0;
}

function roll( number ) {
	var result = 0;

	for ( let i = 0; i < number; i++ ) {
		result += flip();
	}

	return result;
}

export default class Game extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-game' );

		this.board = new Board( config.board );
		this.player1 = new Player( { ...config.players, side: 'left' } );
		this.player2 = new Player( { ...config.players, side: 'right' } );

		this.el.appendChild( this.board.el );
		this.el.appendChild( this.player1.el );
		this.el.appendChild( this.player2.el );
	}
}
