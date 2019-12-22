// Common Stuff
const { src, dest, watch, series, parallel } = require( 'gulp' );
const rename = require( 'gulp-rename' );
const changed = require( 'gulp-changed' );

// Script Stuff
const browserify = require( 'browserify' );
const babelify = require( 'babelify' );
const source = require( 'vinyl-source-stream' );
const buffer = require( 'vinyl-buffer' );
const eslint = require( 'gulp-eslint' );
const terser = require( 'gulp-terser' );
const sourcemaps = require( 'gulp-sourcemaps' );

// Style Stuff
const sass = require( 'gulp-sass' );
const autoprefixer = require('gulp-autoprefixer');

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
	return browserify( {
			entries: './assets/js/app.js',
			debug: true,
		} )
		.transform( 'babelify', babelOptions )
		.bundle()
		.pipe( source( 'bundle.js' ) )
		.pipe( buffer() )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
		.pipe( terser( {
			module: true,
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
