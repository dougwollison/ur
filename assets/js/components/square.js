import { h } from 'preact';
import classnames from 'classnames';

const PATHS = {
	v: 'M46.5,15h7v70h-7V15z',
	h: 'M15,46.5h70v7H15V46.5z',
	u: 'M62.9,32.8L50,20L37.1,32.8l-4.9-4.9L50,10l17.8,17.9L62.9,32.8z',
	d: 'M50,90L32.2,72.1l4.9-4.9L50,80l12.9-12.8l4.9,4.9L50,90z',
	l: 'M27.9,67.8L10,50l17.9-17.8l4.9,4.9L20,50l12.8,12.9L27.9,67.8z',
	r: 'M72.1,67.8l-4.9-4.9L80,50L67.2,37.1l4.9-4.9L90,50L72.1,67.8z',
	tl: 'M15,53.5v-7c16,0,24.8,0,28.2-3.3c3.3-3.4,3.3-12.2,3.3-28.2h7c0,18.5,0,27.7-5.4,33.1C42.7,53.5,33.5,53.5,15,53.5z',
	tr: 'M85,53.5c-18.5,0-27.7,0-33.1-5.4c-5.4-5.3-5.4-14.6-5.4-33.1h7c0,16,0,24.8,3.3,28.2c3.4,3.3,12.2,3.3,28.2,3.3V53.5z',
	bl: 'M53.5,85h-7c0-16,0-24.8-3.3-28.2C39.8,53.5,31,53.5,15,53.5v-7c18.5,0,27.7,0,33.1,5.4C53.5,57.3,53.5,66.5,53.5,85z',
	br: 'M53.5,85h-7c0-18.5,0-27.7,5.4-33.1c5.3-5.4,14.6-5.4,33.1-5.4v7c-16,0-24.8,0-28.2,3.3C53.5,60.2,53.5,69,53.5,85z',
};

export default function Square( { side, isStart, isEnd, isDouble, isSafe, layout, arrow } ) {
	const classes = classnames(
		'ur-square',
		`side-${side + 1}`,
		{
			'is-start': isStart,
			'is-end': isEnd,
			'is-double': isDouble,
			'is-safe': isSafe,
		}
	);

	const paths = arrow.split( ' ' );

	return (
		<div className={ classes } style={ layout }>
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
				{ paths.map( ( key, index ) => ( <path key={ index } className={ key } d={ PATHS[ key ] } /> ) ) }
			</svg>
		</div>
	);
}
