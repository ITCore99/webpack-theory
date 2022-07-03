'use strict';

module.exports = tabable;

function tabable( el, filter ) {
    filter = filter || 'input, textarea, button';
    
    var targets = Array.prototype.slice.call( el.querySelectorAll( filter ), 0 );

    targets.forEach( function( target, index ) {
        target.setAttribute( 'tab-index', index );
    } );
}