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

			player.on( 'play', token => {
				var goAgain = this.board.placeToken( token );

				// If they can't roll again, next turn
				if ( goAgain ) {
					player.start();
				} else {
					this.nextPlayer();
				}
			} );

			player.on( 'roll', result => {
				// Force next turn if they roll a zero
				if ( ! result ) {
					this.nextPlayer();
				}
			} );

			this.el.appendChild( player.el );

			return player;
		} );

		this.currentPlayer = -1;
	}

	start() {
		this.el.classList.add( 'ready' );
		this.nextPlayer();
	}

	nextPlayer() {
		this.currentPlayer++;

		if ( this.currentPlayer >= this.players.length ) {
			this.currentPlayer = 0;
		}

		this.players.forEach( player => player.end() );
		this.players[ this.currentPlayer ].start();
	}
}
