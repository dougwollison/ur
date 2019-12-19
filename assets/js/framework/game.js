import Emitter from './emitter.js';
import Board from './board.js';
import Player from './player.js';

export default class Game extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-game' );

		this.board = new Board( config.board );
		this.el.appendChild( this.board.el );

		this.players = config.players.map( side => {
			var player = new Player( { ...config.player, side } );

			player.on( 'play', token => this.board.placeToken( token ) );
			this.el.appendChild( player.el );

			return player;
		} );
	}
}
