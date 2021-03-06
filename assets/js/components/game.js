import { h, Component, createRef, Fragment } from 'preact';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';
import Token from './token.js';
import Modal from './modal.js';

export default class Game extends Component {
	ref = createRef();

	state = {
		canvas: { width: 0, height: 0 },
		ready: false,
		animating: false,
		currentPlayer: -1,
		currentRoll: false,
		turnCounts: [],
		players: [],
		tokens: [],
	};

	constructor( props ) {
		super( props );

		for ( var i = 0; i < props.playerCount; i++ ) {
			this.state.players.push( {
				side: i,
				score: 0,
			} );

			for ( let j = 0; j < this.props.tokenCount; j++ ) {
				this.state.tokens.push( {
					side: i,
					progress: -1,
					status: 'inactive',
					inInvalid: false,
				} );
			}

			this.state.turnCounts.push( 0 );
		}
	}

	updateCanvas = () => {
		this.setState( {
			canvas: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		} );
	};

	fullscreen = () => {
		if ( document.fullscreen ) {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			} else if ( document.mozCancelFullScreen ) { // Firefox
				document.mozCancelFullScreen();
			} else if ( document.webkitExitFullscreen ) { // Chrome, Safari and Opera
				document.webkitExitFullscreen();
			} else if ( document.msExitFullscreen ) { // IE/Edge
				document.msExitFullscreen();
			}
		} else {
			const elm = this.ref.current;

			if ( elm.requestFullscreen ) {
				elm.requestFullscreen();
			} else if ( elm.mozRequestFullScreen ) { // Firefox
				elm.mozRequestFullScreen();
			} else if ( elm.webkitRequestFullscreen ) { // Chrome, Safari and Opera
				elm.webkitRequestFullscreen();
			} else if ( elm.msRequestFullscreen ) { // IE/Edge
				elm.msRequestFullscreen();
			}
		}
	};

	start = () => {
		this.nextPlayer( 0 );

		this.setState( {
			ready: true,
		} );
	};

	nextPlayer( player ) {
		const tokens = [ ...this.state.tokens ];
		const turnCounts = [ ...this.state.turnCounts ];
		const { currentPlayer } = this.state;

		// By default, advance to next player
		if ( typeof player === 'undefined' ) {
			player = currentPlayer + 1;
			if ( player >= this.props.playerCount ) {
				player = 0;
			}
		}

		// If changing players, increment turn
		if ( player !== currentPlayer ) {
			turnCounts[ player ]++;
		}

		tokens.forEach( token => ( token.isInvalid = false ) );

		this.setState( {
			currentPlayer: player,
			currentRoll: false,
			turnCounts,
			tokens,
		} );
	}

	findSquare( index, side ) {
		var result = this.props.squares.filter( square => square.index === index );

		if ( result.length > 1 ) {
			result = result.filter( square => square.side === side );
		}

		return result[ 0 ];
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

	handleRoll = () => {
		const { minRoll, maxRoll } = this.props;
		const { turnCounts, currentPlayer } = this.state;
		var result = minRoll;

		// Sum a number of simulated coin flips
		for ( let i = 0; i < maxRoll - minRoll; i++ ) {
			result += Math.floor( Math.random() * 2 ) ? 1 : 0;
		}

		// If on first turn, don't allow a 0
		if ( ! result && turnCounts[ currentPlayer ] <= 0 ) {
			result = 1;
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
		playerTokens.forEach( token => ( token.isInvalid = validMoves.indexOf( token ) < 0 ) );

		// If no valid moves, end turn after delay
		if ( validMoves.length === 0 ) {
			setTimeout( () => this.nextPlayer(), 1000 );
			return;
		}

		this.setState( {
			tokens: [ ...this.state.tokens ],
		} );
	};

	animateToken( token, moveBy ) {
		const start = token.progress;
		let moves = start >= 0 ? 1 : 0;

		// Mark the token as animating
		token.isAnimating = true;

		// Get the square the token lands on
		const lastSquare = this.findSquare( start + moveBy, token.side );

		// Get the capture to perform when done
		const capture = this.findToken( lastSquare );

		const step = () => {
			// If done moving, handle last square
			if ( moves > moveBy ) {
				token.isAnimating = false;
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

	handlePlay = ( token ) => {
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
	};

	componentDidMount() {
		window.addEventListener( 'resize', this.updateCanvas );
		this.updateCanvas();
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.updateCanvas );
	}

	render( { squares, playerCount, boardConfig }, { canvas, ready, currentPlayer, currentRoll, players, tokens } ) {
		const classes = classnames(
			'ur-game',
			`side-${currentPlayer + 1}`,
			{ 'is-ready': ready }
		);

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
				<div className={ classes } ref={ this.ref }>
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

							default:
								// Position relative to square
								layout.top = ( token.top * squareSize ) + boardLayout.top;
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
					<button className="fullscreen" onClick={ this.fullscreen }>Fullscreen</button>
				</div>
				{ this.state.ready || (
					<button className="start" onClick={ this.start }>Start</button>
				) }
				<Modal name="How to Play" content="rules" />
			</>
		);
	}
}
