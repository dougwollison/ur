import { h } from 'preact';
import classnames from 'classnames';

export default function Square( { side, isStart, isEnd, isDouble, isSafe, layout } ) {
	const classes = classnames(
		'ur-square',
		side,
		{
			'is-start': isStart,
			'is-end': isEnd,
			'is-double': isDouble,
			'is-safe': isSafe,
		}
	);

	return (
		<div className={ classes } style={ layout }></div>
	);
}
