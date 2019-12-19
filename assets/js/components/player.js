import React from 'react';
import classnames from 'classnames';

import Token from './token';

export default function Player( { ready, roll, side, tokens = [], onRoll, onPlay } ) {
	const classes = classnames( 'ur-player', side, {
		'is-ready': ready,
	} );

	return (
		<div className={ classes }>
			<button className="roll"
				onClick={ onRoll }
				disabled={ ! ready }
				>
				{ roll }
			</button>
			{ tokens.map( config => (
				<Token { ...config }
					side={ side }
					onClick={ () => onPlay( config ) }
					/>
			) ) }
		</div>
	);
}
