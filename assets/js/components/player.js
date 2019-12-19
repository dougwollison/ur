import React from 'react';

import Token from './token';

export default class Player extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { side, tokenCount } = this.props;

		const tokens = [];
		for ( let i = 0; i < tokenCount; i++ ) {
			tokens.push( <Token side={ side } /> );
		}

		return (
			<div className={ `ur-player ${side}` }>
				<button className="roll"></button>
				{ tokens }
			</div>
		);
	}
}
