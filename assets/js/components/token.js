import { h } from 'preact';
import classnames from 'classnames';

export default function Token( { side, status, isInvalid, layout, onClick } ) {
	const classes = classnames(
		'ur-token',
		side,
		`is-${status}`,
		{ 'is-invalid': isInvalid }
	);

	return (
		<button className={ classes } style={ layout } onClick={ onClick }></button>
	);
}
