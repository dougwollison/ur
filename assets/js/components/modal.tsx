import { h, Component, createRef, Fragment } from 'preact';
import { createPortal } from 'preact/compat';
import classnames from 'classnames';

export interface Props {
	name: string;
	children?: JSX.Element | JSX.Element[];
}

export interface State {
	isOpen: boolean;
}

export default class Modal extends Component<Props, State> {
	ref = createRef();

	state: State = {
		isOpen: false,
	};

	open = () => {
		this.setState( { isOpen: true } );
	};

	close = () => {
		this.setState( { isOpen: false } );
	};

	componentDidMount() {
		if ( this.props.content ) {
			const source = document.getElementById( this.props.content ) as HTMLTemplateElement;
			this.ref.current.appendChild( source.content.cloneNode( true ) );
		}
	}

	render( { name, children }: Props, { isOpen }: State ) {
		const classes = classnames(
			'modal',
			{ 'is-open': isOpen }
		);

		return (
			<Fragment>
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
			</Fragment>
		);
	}
}
