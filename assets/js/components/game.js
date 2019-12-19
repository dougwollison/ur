import React from 'react';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';

function findSquare( squares, index, side ) {
	var result = squares.filter( s => s.index === index );

	if ( result.length > 1 ) {
		result = result.filter( s => s.side === side );
	}

	return result[0];
}

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
		this.handleRoll = this.handleRoll.bind( this );
		this.handlePlay = this.handlePlay.bind( this );
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

	handleRoll( result ) {
		// Force next turn if they roll a zero
		if ( ! result ) {
			this.nextPlayer();
			return;
		}

		console.log( result );
	}

	handlePlay( token ) {
		console.log( token );
	}

	render() {
		const { squares, playerSides, boardConfig, playerConfig } = this.props;
		const { ready, currentPlayer, tokens } = this.state;

		const classes = classnames( 'ur-game', {
			'is-ready': ready,
		} );

		return (
			<>
				<div className={ classes }>
					<Board { ...boardConfig }
						squares={ squares }
						tokens={ tokens.filter( t => t.status === 'active' ) }
						onPlay={ this.handlePlay }
						/>
					{ playerSides.map( ( side, index ) => (
						<Player { ...playerConfig }
							side={ side }
							ready={ currentPlayer === index }
							tokens={ tokens.filter( t => t.side === side && t.status !== 'active' ) }
							onRoll={ this.handleRoll }
							onPlay={ this.handlePlay }
							/>
					) ) }
				</div>
				{ this.state.ready || (
					<button className="start" onClick={ this.start }>Start</button>
				) }
			</>
		);
	}
}
