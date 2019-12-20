import { h } from 'preact';
import classnames from 'classnames';

export default function Token( props ) {
	const classes = classnames(
		'ur-token',
		props.side,
		`is-${props.status}`,
		{ 'is-disabled': props.isDisabled }
	);

	const position = {
		top: props.top,
		left: props.left,
	};

	return (
		<button className={ classes } style={ position } onClick={ props.onClick }></button>
	);
}
