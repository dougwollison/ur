import React from 'react';
import classnames from 'classnames';

import Board from './board.js';
import Player from './player.js';

export default class Game extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			ready: false,
		};
	}

	render() {
		const { playerSides, boardConfig, playerConfig } = this.props;

		const classes = classnames( 'ur-game', {
			'ready': this.state.ready,
		} );

		return (
			<>
				<div className={ classes }>
					<Board { ...boardConfig } />
					{ playerSides.map( ( side, index ) => (
						<Player { ...playerConfig } side={ side } />
					) ) }
				</div>
				{ this.state.ready || (
					<button className="start" onClick={ () => this.setState( { ready: true } ) }>Start</button>
				) }
			</>
		);
	}
}
