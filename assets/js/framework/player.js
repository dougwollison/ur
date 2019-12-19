import Emitter from './emitter.js';
import Token from './token.js';

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

export default class Player extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-player' );
		this.el.classList.add( config.side );

		var rollButton = document.createElement( 'button' );
		this.el.appendChild( rollButton );

		this.currentRoll = 0;
		rollButton.addEventListener( 'click', () => {
			var result = roll( 4 );

			this.currentRoll = result;
			rollButton.textContent = result;
		} );

		this.inactiveTokens = [];
		for ( let i = 0; i < config.tokenCount; i++ ) {
			const token = new Token( config.side );

			token.on( 'reset', () => {
				this.resetToken( token );
			} );

			token.on( 'complete', () => {
				this.completeToken( token );
			} );

			token.on( 'place', () => {
				this.currentRoll = 0;
				rollButton.textContent = '';
			} );

			token.on( 'select', () => {
				token.advance( this.currentRoll );
				this.trigger( 'play', token );
			} );

			this.inactiveTokens.push( token );
			this.el.appendChild( token.el );
		}

		this.completedTokens = [];
	}

	activateToken() {
		return this.inactiveTokens.pop();
	}

	storeToken( token ) {
		// Add back to container, remove styling
		this.el.appendChild( token.el );
		token.el.removeAttribute( 'style' );
	}

	resetToken( token ) {
		this.storeToken( token );

		// Return to inactive list
		this.inactiveTokens.push( token );
	}

	completeToken( token ) {
		this.storeToken( token );

		// Add to complete list
		this.completedTokens.push( token );
	}
}
