import { h, FunctionComponent } from 'preact';
import { Square, SquareProps } from './square';

export interface BoardProps {
	cols: number;
	rows: number;
	layout: {
		width: number;
		height: number;
		top: number;
		left: number;
	};
	squares: SquareProps[];
}

export const Board: FunctionComponent<BoardProps> = ( { cols, rows, layout, squares } : BoardProps ) => {
	const style = {
		width: layout.width + 'px',
		height: layout.height + 'px',
		top: layout.top + 'px',
		left: layout.left + 'px',
	};

	return (
		<div className="ur-board" style={ style }>
			{ squares.map( square => {
				const squareLayout = {
					top: ( square.top / rows ) * 100 + '%',
					left: ( square.left / cols ) * 100 + '%',
					width: ( 1 / cols ) * 100 + '%',
					height: ( 1 / rows ) * 100 + '%',
				};

				return ( <Square { ...square } layout={ squareLayout } /> );
			} ) }
		</div>
	);
}
