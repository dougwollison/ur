import React from 'react';

export default function Token( props ) {
	return (
		<button className={ `ur-token ${props.side}` }></button>
	);
}
