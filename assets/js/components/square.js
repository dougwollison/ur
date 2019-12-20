import { h } from 'preact';
import classnames from 'classnames';

export default function Square( props ) {
	const classes = classnames( 'ur-square', props.side, {
		'is-double': props.isDouble,
		'is-safe': props.isSafe,
	} );

	const position = {
		top: props.top,
		left: props.left,
	};

	return (
		<div className={ classes } style={ position }></div>
	);
}
