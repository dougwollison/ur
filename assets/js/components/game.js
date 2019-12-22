import { h, Component, Fragment } from 'preact';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';
import Token from './token.js';

export default class Game extends Component {
	constructor( props ) {
		super( props );

		const players = [];
		const tokens = [];
		for ( var i = 0; i < props.playerCount; i++ ) {
			players.push( {
				side: i,
				score: 0,
			} );

			for ( let j = 0; j < this.props.tokenCount; j++ ) {
				tokens.push( {
					side: i,
					progress: -1,
					status: 'inactive',
					inInvalid: false,
				} );
			}
		}

		this.state = {
			canvas: { width: 0, height: 0 },
			ready: false,
			animating: false,
			currentPlayer: null,
			currentRoll: false,
			players,
			tokens,
		};

		// Bind methods
		this.updateCanvas = this.updateCanvas.bind( this );
		this.start = this.start.bind( this );
		this.handleRoll = this.handleRoll.bind( this );
		this.handlePlay = this.handlePlay.bind( this );
	}

	updateCanvas() {
		this.setState( {
			canvas: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		} );
	}

	componentDidMount() {
		window.addEventListener( 'resize', this.updateCanvas );
		this.updateCanvas();
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.updateCanvas );
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
			if ( current >= this.props.playerCount ) {
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
		const player = this.state.currentPlayer;
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

	animateToken( token, moveBy ) {
		const start = token.progress;
		let moves = start >= 0 ? 1 : 0;

		// Get the square the token lands on
		const lastSquare = this.findSquare( start + moveBy, token.side );

		// Get the capture to perform when done
		const capture = this.findToken( lastSquare );

		const step = () => {
			// If done moving, handle last square
			if ( moves > moveBy ) {
				this.setState( { animating: false } );

				// If end square, mark token as complete
				if ( lastSquare.isEnd ) {
					delete token.top;
					delete token.left;
					token.status = 'complete';

					// Update player score
					this.state.players[ this.state.currentPlayer ].score++;
				}

				// Perform capture if needed
				if ( capture ) {
					delete capture.top;
					delete capture.left;
					capture.status = 'inactive';
					capture.progress = -1;
				}

				this.setState( {
					tokens: [ ...this.state.tokens ],
					players: [ ...this.state.players ],
				} );

				// If double, restart turn, otherwise end
				if ( lastSquare.isDouble ) {
					this.nextPlayer( this.state.currentPlayer );
				} else {
					this.nextPlayer();
				}
				return;
			}

			// Find the square at the new position
			const square = this.findSquare( start + moves, token.side );

			// Update the token
			token.top = square.top;
			token.left = square.left;
			token.status = 'active';
			token.progress = square.index;

			this.setState( {
				tokens: [ ...this.state.tokens ],
			} );

			moves++;
			setTimeout( step, 500 );
		};

		this.setState( { animating: true } );
		step();
	}

	handlePlay( token ) {
		// Currently animating, ignore
		if ( this.state.animating ) {
			return;
		}

		// If not the current player's token, ignore
		if ( token.side !== this.state.currentPlayer ) {
			return;
		}

		// Get the move, validate it
		const moveBy = this.validateMove( token, this.state.currentRoll );

		// If somehow not a valid move, abort
		if ( ! moveBy ) {
			return;
		}

		this.animateToken( token, moveBy );
	}

	render( { squares, playerCount, boardConfig }, { canvas, ready, currentPlayer, currentRoll, players, tokens } ) {
		const classes = classnames( 'ur-game', {
			'is-ready': ready,
		} );

		const { width, height } = canvas;
		const { rows, cols } = boardConfig;
		const rem = Math.min( height / 100, 10 );
		const ratio = rows / cols;

		const boardHeight = Math.min( rows * 100, Math.round( height - ( 2 * 10 * rem ) ) );
		const boardWidth = Math.round( boardHeight / ratio );
		const squareSize = Math.floor( boardWidth / cols );
		const barWidth = Math.floor( rem * 10 );

		const boardLayout = {
			width: boardWidth,
			height: boardHeight,
			top: Math.floor( ( height - boardHeight ) / 2 ),
			left: Math.floor( ( width - boardWidth ) / 2 ),
		};

		const inactiveCounts = new Array( playerCount ).fill( 0 );
		const completeCounts = new Array( playerCount ).fill( 0 );

		return (
			<>
				<div className={ classes }>
					<Board { ...boardConfig }
						layout={ boardLayout }
						squares={ squares }
						/>
					{ players.map( ( player, index ) => {
						var isCurrent = currentPlayer === player.side;

						return (
							<Player { ...player }
								key={ index }
								ready={ isCurrent }
								roll={ isCurrent && currentRoll }
								onRoll={ this.handleRoll }
								/>
						);
					} ) }
					{ tokens.map( ( token, index ) => {
						const layout = {
							top: 0,
							left: 0,
							width: 0,
							height: 0,
						};

						// Set the top based on if on board or not
						switch ( token.status ) {
							case 'active':
								// Position relative to square
								layout.top = ( token.top * squareSize ) + boardLayout.top;
								break;

							case 'inactive':
								// At top of player bar (after roll button)
								layout.top = barWidth + ( barWidth * 0.25 * inactiveCounts[ token.side ] );
								inactiveCounts[ token.side ]++; // increment token counter
								break;

							case 'complete':
								// At bottom of player bar
								layout.top = height - barWidth - ( barWidth * 0.25 * completeCounts[ token.side ] );
								completeCounts[ token.side ]++; // increment token counter
								break;
						}

						// Set left based on if on board or not
						if ( token.status === 'active' ) {
							// Position relative to square
							layout.left = ( token.left * squareSize ) + boardLayout.left;
						} else {
							// Position on left/right side
							layout.left = token.side === 0 ? 0 : width - barWidth;
						}

						// Set width/height to either square or bar
						if ( token.status === 'active' ) {
							layout.width = layout.height = squareSize;
						} else {
							layout.width = layout.height = barWidth;
						}

						return (
							<Token { ...token }
								key={ index }
								layout={ layout }
								isPlayable={ currentPlayer === token.side }
								onClick={ () => this.handlePlay( token ) }
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
