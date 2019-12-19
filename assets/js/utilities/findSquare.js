export default function findSquare( squares, index, side ) {
	var result = squares.filter( s => s.index === index );

	if ( result.length > 1 ) {
		result = result.filter( s => s.side === side );
	}

	return result[0];
}
