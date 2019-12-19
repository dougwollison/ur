import React from 'react';

export default function Token( props ) {
	const position = {
		top: props.top,
		left: props.left,
	};

	return (
		<button className={ `ur-token ${props.side}` } style={ position }></button>
	);
}
