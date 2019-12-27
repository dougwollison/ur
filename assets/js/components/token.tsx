import { h, FunctionalComponent } from 'preact';
import classnames from 'classnames';

export interface TokenProps {
	side: number;
	progress: number;
	status: string;
	isInvalid?: boolean;
	isPlayable?: boolean;
	isAnimating?: boolean;
	top?: number;
	left?: number;
	layout?: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
	onClick?: () => void;
}

export const Token: FunctionalComponent<TokenProps> =
( { side, status, isInvalid, isPlayable, isAnimating, layout, onClick } : TokenProps ) => {
	const classes = classnames(
		'ur-token',
		`side-${side + 1}`,
		`is-${status}`,
		{
			'is-invalid': isInvalid,
			'is-animating': isAnimating,
		}
	);

	return (
		<button className={ classes } style={ layout } disabled={ ! isPlayable } onClick={ onClick }></button>
	);
}
