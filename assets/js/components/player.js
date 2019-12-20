import { h } from 'preact';
import classnames from 'classnames';

import Token from './token';

export default function Player( { ready, roll, side, tokens = [], onRoll, onPlay } ) {
	const classes = classnames( 'ur-player', side, {
		'is-ready': ready,
	} );

	const inactive = tokens.filter( token => token.status === 'inactive' );
	const complete = tokens.filter( token => token.status === 'complete' );

	return (
		<div className={ classes }>
			<button className="roll"
				onClick={ onRoll }
				disabled={ ! ready || roll !== false }
				>
				{ roll }
			</button>
			<div className="ur-player-tokens inactive">
				{ inactive.map( config => (
					<Token { ...config }
						side={ side }
						onClick={ () => onPlay( config ) }
						/>
				) ) }
			</div>
			<div className="ur-player-tokens completed">
				{ complete.map( () => (
					<Token status="complete" side={ side } />
				) ) }
			</div>
		</div>
	);
}
