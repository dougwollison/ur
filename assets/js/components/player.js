import React from 'react';

import Token from './token';

export default class Player extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			roll: null,
		};

		// Bind methods
		this.rollMove = this.rollMove.bind( this );
	}

	rollMove() {
		var result = 0;

		// Sum a number of simulated coin flips
		for ( let i = 0; i < this.props.rollCount; i++ ) {
			result += Math.floor( Math.random() * 2 ) ? 1 : 0;
		}

		this.setState( {
			roll: result,
		} );
	}

	render() {
		const { side, tokenCount } = this.props;
		const { roll } = this.state;

		const tokens = [];
		for ( let i = 0; i < tokenCount; i++ ) {
			tokens.push( <Token side={ side } /> );
		}

		return (
			<div className={ `ur-player ${side}` }>
				<button className="roll" onClick={ this.rollMove }>{ roll }</button>
				{ tokens }
			</div>
		);
	}
}
