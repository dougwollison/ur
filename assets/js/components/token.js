import { h } from 'preact';
import classnames from 'classnames';

export default function Token( { side, status, isInvalid, isPlayable, layout, onClick } ) {
	const classes = classnames(
		'ur-token',
		`side-${side + 1}`,
		`is-${status}`,
		{ 'is-invalid': isInvalid }
	);

	return (
		<button className={ classes } style={ layout } disabled={ ! isPlayable } onClick={ onClick }></button>
	);
}
