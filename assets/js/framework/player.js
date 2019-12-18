import Emitter from './emitter.js';
import Token from './token.js';

export default class Player extends Emitter {
	constructor( config ) {
		super();

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
