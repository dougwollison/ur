import Emitter from './emitter.js';

export default class Token extends Emitter {
	constructor( side ) {
		super();

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
