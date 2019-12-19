import Emitter from './emitter.js';
import Board from './board.js';
import Player from './player.js';

export default class Game extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-game' );

		this.board = new Board( config.board );
		this.player1 = new Player( { ...config.players, side: 'left' } );
		this.player2 = new Player( { ...config.players, side: 'right' } );

		const playToken = token => this.board.placeToken( token );

		this.player1.on( 'play', playToken );
		this.player2.on( 'play', playToken );

		this.el.appendChild( this.board.el );
		this.el.appendChild( this.player1.el );
		this.el.appendChild( this.player2.el );
	}
}
