import { h } from 'preact';
import classnames from 'classnames';

export default function Player( { ready, roll, side, onRoll } ) {
	const classes = classnames( 'ur-player', side, {
		'is-ready': ready,
	} );

	return (
		<div className={ classes }>
			<button className="roll"
				onClick={ onRoll }
				disabled={ ! ready || roll !== false }
				>
				{ roll }
			</button>
		</div>
	);
}
