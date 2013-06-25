/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){

	// Enable strict mode
	"use strict";

	w.picturefill = function(e, ps) {
		ps = ps || w.document.getElementsByTagName( "span" );
		if (!("length" in ps)) ps = [ps];

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-picture" ) !== null ){

				var sources = ps[ i ].getElementsByTagName( "span" ),
					matches = [];

				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var specified;
					var media = sources[ j ].getAttribute( "data-media" );
					specified = specified || media;
					// if w.matchMedia is supported
					if( w.matchMedia && w.matchMedia( media ).matches ){
						matches.push( sources[ j ] );
					}
					else {
						for ( var key in w.picturefill.plugins ) {
							if (! w.picturefill.plugins.hasOwnProperty(key)) continue;
							var result = w.picturefill.plugins[key]({
								source: sources[ j ],
								picture: ps[ i ]
							});
							specified = specified || result.specified;
							if (result.matches) {
								matches.push(sources[ j ]);
								break;
							}
						}
					}
					if (!specified) {
						matches.push( sources[ j ] );
					}
				}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

			if( matches.length ){
				var matchedEl = matches.pop();
				if( !picImg ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "data-alt" );
				}

				picImg.src =  matchedEl.getAttribute( "data-src" );
				matchedEl.appendChild( picImg );
			}
			else if( picImg ){
				picImg.parentNode.removeChild( picImg );
			}
		}
		}
	};

	w.picturefill.plugins = w.picturefill.plugins || {};

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
	}

	if (typeof define === 'function' && define.amd) {
		define(function() {
			return w.picturefill;
		});
	}

}( this ));