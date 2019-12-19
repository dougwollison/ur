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
					key: side + i,
					progress: -1,
					status: 'inactive',
					isDisabled: false,
				} );
			}
		} );

		this.state = {
			ready: false,
			currentPlayer: null,
			currentRoll: false,
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
		const tokens = [ ...this.state.tokens ];

		current++;
		if ( current >= this.props.playerSides.length ) {
			current = 0;
		}

		tokens.forEach( token => token.isDisabled = false );

		this.setState( {
			currentPlayer: current,
			currentRoll: false,
			tokens,
		} );
	}

	findSquare( index, side ) {
		var result = this.props.squares.filter( s => s.index === index );

		if ( result.length > 1 ) {
			result = result.filter( s => s.side === side );
		}

		return result[0];
	}

	handleRoll() {
		var result = 0;

		// Sum a number of simulated coin flips
		for ( let i = 0; i < this.props.rollCount; i++ ) {
			result += Math.floor( Math.random() * 2 ) ? 1 : 0;
		}

		this.setState( {
			currentRoll: result,
		} );

		// Force next turn if they roll a zero
		if ( ! result ) {
			this.nextPlayer();
			return;
		}

		console.log( result );
	}

	handlePlay( token ) {
		const tokens = [ ...this.state.tokens ];

		token.progress += this.state.currentRoll;

		// If at the final square, mark as complete
		if ( token.progress === this.props.finalSquare ) {
			token.status == 'complete';
			delete token.top;
			delete token.left;

			this.nextPlayer();
		} else {
			// Find the applicable square and place it there
			var square = this.findSquare( token.progress, token.side );
			if ( square ) {
				// Update token position/status
				token.top = square.top;
				token.left = square.left;
				token.status = 'active';

				if ( square.isDouble ) {
					this.setState( { currentRoll: false } );
				}
			}

			// If no square or otherwise not a double, next player
			if ( ! square || ! square.isDouble ) {
				this.nextPlayer();
			}
		}

		this.setState( { tokens } );
	}

	render() {
		const { squares, playerSides, boardConfig, playerConfig } = this.props;
		const { ready, currentPlayer, currentRoll, tokens } = this.state;

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
					{ playerSides.map( ( side, index ) => {
						var isCurrent = currentPlayer === index;

						return (
							<Player { ...playerConfig }
								side={ side }
								ready={ isCurrent }
								roll={ isCurrent && currentRoll }
								tokens={ tokens.filter( t => t.side === side && t.status !== 'active' ) }
								onRoll={ this.handleRoll }
								onPlay={ this.handlePlay }
								/>
						);
					} ) }
				</div>
				{ this.state.ready || (
					<button className="start" onClick={ this.start }>Start</button>
				) }
			</>
		);
	}
}
