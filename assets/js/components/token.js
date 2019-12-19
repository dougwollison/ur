import React from 'react';
import classnames from 'classnames';

export default function Token( props ) {
	const classes = classnames( 'ur-token', props.side, {
		'is-disabled': props.status === 'disabled',
	} );

	const position = {
		top: props.top,
		left: props.left,
	};

	return (
		<button className={ classes } style={ position } onClick={ props.onClick }></button>
	);
}
