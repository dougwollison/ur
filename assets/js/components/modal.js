import { h, Component, createRef, Fragment } from 'preact';
import { createPortal } from 'preact/compat';
import classnames from 'classnames';

export default class Modal extends Component {
	constructor( props ) {
		super( props );

		this.ref = createRef();

		this.state = {
			isOpen: false,
		};

		// Bind methods
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
	}

	componentDidMount() {
		if ( this.props.content ) {
			const source = document.getElementById( this.props.content );
			this.ref.current.appendChild( source.content.cloneNode( true ) );
		}
	}

	open() {
		this.setState( { isOpen: true } );
	}

	close() {
		this.setState( { isOpen: false } );
	}

	render( { name, children }, { isOpen } ) {
		const classes = classnames(
			'modal',
			{ 'is-open': isOpen }
		);

		return (
			<>
				<button className="modal-toggle" onClick={ this.open }>{ name }</button>
				{ createPortal( (
					<div className={ classes }>
						<div className="modal-inner">
							<button class="modal-close" onClick={ this.close }>Close</button>
							<div className="modal-content" ref={ this.ref }>
								{ children }
							</div>
						</div>
					</div>
				), document.body )}
			</>
		);
	}
}
