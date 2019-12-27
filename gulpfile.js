/* globals require, exports */

// Common Stuff
const { src, dest, watch, series, parallel } = require( 'gulp' );

// Script Stuff
const eslint = require( 'gulp-eslint' );
const terser = require( 'gulp-terser' );
const sourcemaps = require( 'gulp-sourcemaps' );
const rollup = require( 'gulp-better-rollup' );
const resolve = require( '@rollup/plugin-node-resolve' );
const commonjs = require( '@rollup/plugin-commonjs' );
const babel = require( 'rollup-plugin-babel' );

// Style Stuff
const sass = require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );

// Browser Sync
const sync = require( 'browser-sync' ).create();

// Options
const eslintOptions = require( './.eslintrc.json' );
const babelOptions = require( './.babelrc.json' );
const watchOptions = {
	events: [ 'add', 'change' ],
	usePolling: true,
};

// =========================
// ! Utilities
// =========================

function swallow( err ) {
	console.log( err.toString() );
	this.emit( 'end' );
}

// =========================
// ! Tasks
// =========================

function validateScripts() {
	return src( './assets/js/**/*.js' )
		.pipe( eslint( eslintOptions ) )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );
}

function compileScripts() {
	return src( './assets/js/app.js' )
		.pipe( sourcemaps.init() )
		.pipe( rollup( {
			plugins: [
				resolve(),
				commonjs( { include: 'node_modules/**' } ),
				babel( {
					...babelOptions,
					exclude: 'node_modules/**',
				} ),
			],
		}, {
			file: 'bundle.js',
			format: 'iife',
		} ) )
		.pipe( terser( {
			mangle: {
				module: true,
			},
			compress: {
				arguments: true,
			},
			output: {
				ecma: 5,
				comments: false,
			},
		} ) )
		.pipe( sourcemaps.write( './' ) )
		.on( 'error', swallow )
		.pipe( dest( './' ) );
}

function compileStyles() {
	return src( './assets/scss/*.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass( { outputStyle: 'compressed' } ) )
		.on( 'error', sass.logError )
		.pipe( autoprefixer() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( dest( './' ) );
}

// =========================
// ! Server Handling
// =========================

function startSync() {
	if ( sync.active ) {
		sync.reload();
	} else {
		sync.init( {
			server: {
				baseDir: './',
			},
			port: 5759,
		} );
	}
}

// =========================
// ! Watchers
// =========================

function watchScripts() {
	return watch( './assets/js/**/*.js', watchOptions, series( validateScripts, compileScripts ) );
}

function watchStyles() {
	return watch( './assets/scss/**/*.scss', watchOptions, function refreshStyles() {
		return compileStyles().pipe( sync.stream() );
	} );
}

// =========================
// ! Exported Commands
// =========================

exports.lint = validateScripts;
exports.js = series( validateScripts, compileScripts );
exports.css = compileStyles;

exports.build = exports.default = parallel( series( validateScripts, compileScripts ), compileStyles );

exports.watch = parallel( startSync, watchScripts, watchStyles );
