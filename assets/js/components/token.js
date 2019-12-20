import { h } from 'preact';
import classnames from 'classnames';

export default function Token( props ) {
	const classes = classnames(
		'ur-token',
		props.side,
		`is-${props.status}`,
		{ 'is-invalid': props.inInvalid }
	);

	const position = {
		top: props.top,
		left: props.left,
	};

	return (
		<button className={ classes } style={ position } onClick={ props.onClick }></button>
	);
}
