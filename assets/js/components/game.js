import React from 'react';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';

export default class Game extends React.Component {
	constructor( props ) {
		super( props );

		const tokens = [];
		this.props.playerSides.forEach( side => {
			for ( let i = 0; i < this.props.tokenCount; i++ ) {
				tokens.push( {
					side,
					progress: -1,
					status: 'inactive',
				} );
			}
		} );

		this.state = {
			ready: false,
			currentPlayer: null,
			tokens,
		};

		// Bind methods
		this.start = this.start.bind( this );
	}

	start() {
		this.setState( {
			ready: true,
			currentPlayer: 0,
		} );
	}

	nextPlayer() {
		var current = this.state.currentPlayer;

		current++;
		if ( current >= this.props.playerSides.length ) {
			current = 0;
		}

		this.setState( {
			currentPlayer: current,
		} );
	}

	render() {
		const { playerSides, boardConfig, playerConfig } = this.props;
		const { ready, currentPlayer } = this.state;

		const classes = classnames( 'ur-game', {
			'is-ready': ready,
		} );

		return (
			<>
				<div className={ classes }>
					<Board { ...boardConfig } />
					{ playerSides.map( ( side, index ) => (
						<Player { ...playerConfig } side={ side } ready={ currentPlayer === index } />
					) ) }
				</div>
				{ this.state.ready || (
					<button className="start" onClick={ this.start }>Start</button>
				) }
			</>
		);
	}
}
