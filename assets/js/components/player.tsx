import { h, FunctionComponent } from 'preact';
import classnames from 'classnames';

export interface PlayerProps {
	side: number;
	score: number;
	ready?: boolean;
	roll?: number | false;
	onRoll?: () => void;
}

export const Player: FunctionComponent<PlayerProps> =
( { ready, roll, side, onRoll } : PlayerProps ) => {
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
