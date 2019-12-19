import Emitter from './emitter.js';

export default class Token extends Emitter {
	constructor( side ) {
		super();

		this.side = side;
		this.progress = -1;
		this.el = document.createElement( 'ur-token' );
		this.el.classList.add( 'token', side );

		this.el.addEventListener( 'click', () => this.trigger( 'select' ) );
	}

	advance( amount ) {
		this.progress += amount;
		this.el.dataset.progress = this.progress;
	}

	reset() {
		this.progress = -1;
		this.trigger( 'reset' );
	}

	complete() {
		this.el.classList.add( 'complete' );
		this.trigger( 'complete' );
		this.trigger( 'place' );
	}
}
