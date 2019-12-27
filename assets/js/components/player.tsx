import { h } from 'preact';
import classnames from 'classnames';

export interface Props {
	side: number;
	score: number;
	ready?: boolean;
	roll?: number;
	onRoll?: () => void;
}

export default function Player( { ready, roll, side, onRoll } ) {
	const classes = classnames(
		'ur-player',
		`side-${side + 1}`,
		{ 'is-ready': ready }
	);

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
