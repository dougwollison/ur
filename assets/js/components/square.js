import { h } from 'preact';
import classnames from 'classnames';

export default function Square( { side, isDouble, isSafe, layout } ) {
	const classes = classnames(
		'ur-square',
		side,
		{
			'is-double': isDouble,
			'is-safe': isSafe,
		}
	);

	return (
		<div className={ classes } style={ layout }></div>
	);
}
