import { h, Fragment } from 'preact';

export default function() {
	return (
		<>
			<h1>Game Rules</h1>
			<ul>
				<li>On your turn, tap the Roll button.</li>
				<li>Tap one of your tokens to move it the number of spaces you rolled.</li>
				<li>If you land on a space with a star, you get to roll again.</li>
				<li>If you land on a space with an emeny token on it, you capture it.</li>
				<li>You cannot land on a space with one of your own tokens.</li>
				<li>Captured tokens return to the player's hand and must start again.</li>
				<li>Tokens on the golden star cannot be captured; you instead land one space ahead.</li>
				<li>You must roll an exact amount to move your token to the finish square.</li>
				<li>First player to get all 7 tokens through the board wins.</li>
			</ul>
			<p><a href="http s://www.youtube.com/watch?v=WZskjLq040I" target="_blank">More about Ur</a></p>
		</>
	);
}
