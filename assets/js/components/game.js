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

	nextPlayer( current ) {
		const tokens = [ ...this.state.tokens ];

		if ( typeof current === 'undefined' ) {
			current = this.state.currentPlayer + 1;
			if ( current >= this.props.playerSides.length ) {
				current = 0;
			}
		}

		tokens.forEach( token => token.isDisabled = false );

		this.setState( {
			currentPlayer: current,
			currentRoll: false,
			tokens,
		} );
	}

	findSquare( index, side ) {
		var result = this.props.squares.filter( square => square.index === index );

		if ( result.length > 1 ) {
			result = result.filter( square => square.side === side );
		}

		return result[0];
	}

	findToken( square ) {
		return this.state.tokens.find( token => {
			return token.top === square.top && token.left === square.left;
		} );
	}

	validateMove( token, moveBy ) {
		const progress = token.progress + moveBy;

		// At final square; valid
		if ( progress === this.props.finalSquare ) {
			return moveBy;
		}

		var square = this.findSquare( progress, token.side );

		// Somehow no square found; invalid
		if ( ! square ) {
			return 0;
		}

		// Check if square is occupied
		var capture = this.findToken( square );

		// Square is occupied by own token; invalid
		if ( capture && capture.side === token.side ) {
			return 0;
		}

		// Square is capturable but Safe, check next square
		if ( capture && square.isSafe ) {
			return this.validateMove( token, moveBy + 1 );
		}

		return moveBy;
	}

	handleRoll() {
		var result = 0;

		// Sum a number of simulated coin flips
		for ( let i = 0; i < this.props.rollCount; i++ ) {
			result += Math.floor( Math.random() * 2 ) ? 1 : 0;
		}

		console.log( result );

		this.setState( {
			currentRoll: result,
		} );

		// End turn if a zero was rolled
		if ( ! result ) {
			this.nextPlayer();
			return;
		}

		const player = this.props.playerSides[ this.state.currentPlayer ];
		const playerTokens = this.state.tokens.filter( token => token.side === player );

		// Get the list of valid moves, if none, end turm
		const validMoves = playerTokens.filter( token => this.validateMove( token, result ) !== 0 );
		if ( validMoves.length === 0 ) {
			this.nextPlayer();
			return;
		}

		// Disable all player tokens except the valid ones
		playerTokens.forEach( token => token.isDisabled = true );
		validMoves.forEach( token => token.isDisabled = false );

		this.setState( {
			tokens: [ ...this.state.tokens ],
		} );
	}

	handlePlay( token ) {
		// Get the move, validate it
		const moveBy = this.validateMove( token, this.state.currentRoll );

		// If somehow not a valid move, abort
		if ( ! moveBy ) {
			return;
		}

		const progress = token.progress + moveBy;

		// If at the final square, mark as complete
		if ( token.progress === this.props.finalSquare ) {
			token.status == 'complete';
			delete token.top;
			delete token.left;

			this.nextPlayer();
		} else {
			// Find the applicable square and place it there
			const square = this.findSquare( progress, token.side );

			// Find the existing token, capture it if found
			const capture = this.findToken( square );
			if ( capture ) {
				delete capture.top;
				delete capture.left;
				capture.status = 'inactive';
			}

			// Update token position/status
			token.top = square.top;
			token.left = square.left;
			token.status = 'active';
			token.progress += moveBy;

			// If double, restart turn, otherwise end
			if ( square.isDouble ) {
				this.nextPlayer( this.state.currentPlayer );
			} else {
				this.nextPlayer();
			}
		}

		this.setState( {
			tokens: [ ...this.state.tokens ],
		} );
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
						tokens={ tokens.filter( token => token.status === 'active' ) }
						onPlay={ this.handlePlay }
						/>
					{ playerSides.map( ( side, index ) => {
						var isCurrent = currentPlayer === index;

						return (
							<Player { ...playerConfig }
								side={ side }
								ready={ isCurrent }
								roll={ isCurrent && currentRoll }
								tokens={ tokens.filter( token => token.side === side && token.status !== 'active' ) }
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
