import { h, Component, Fragment } from 'preact';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';

export default class Game extends Component {
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
					inInvalid: false,
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

		tokens.forEach( token => token.isInvalid = false );

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

		// Not in play; invalid
		if ( token.status === 'completed' ) {
			return 0;
		}

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

		this.setState( {
			currentRoll: result,
		} );

		// If rolled 0, end turn after delay
		if ( ! result ) {
			setTimeout( () => this.nextPlayer(), 1000 );
			return;
		}

		// Get the current player and their tokens
		const player = this.props.playerSides[ this.state.currentPlayer ];
		const playerTokens = this.state.tokens.filter( token => token.side === player );

		// Get the list of valid moves
		const validMoves = playerTokens.filter( token => this.validateMove( token, result ) !== 0 );

		// Mark tokens that aren't valid moves as invalid
		playerTokens.forEach( token => token.isInvalid = validMoves.indexOf( token ) < 0 );

		// If no valid moves, end turn after delay
		if ( validMoves.length === 0 ) {
			setTimeout( () => this.nextPlayer(), 1000 );
			return;
		}

		this.setState( {
			tokens: [ ...this.state.tokens ],
		} );
	}

	handlePlay( token ) {
		// If not the current player's token, ignore
		if ( token.side !== this.props.playerSides[ this.state.currentPlayer ] ) {
			return;
		}

		// Get the move, validate it
		const moveBy = this.validateMove( token, this.state.currentRoll );

		// If somehow not a valid move, abort
		if ( ! moveBy ) {
			return;
		}

		const progress = token.progress + moveBy;

		// If at the final square, mark as complete
		if ( progress === this.props.finalSquare ) {
			token.status = 'complete';
			token.progress += moveBy;
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
				capture.progress = -1;
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

	render( { squares, playerSides, boardConfig, playerConfig }, { ready, currentPlayer, currentRoll, tokens } ) {
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
