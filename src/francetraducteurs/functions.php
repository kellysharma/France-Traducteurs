<?php

add_filter( 'gettext', 'replace_text' );
function replace_text( $text ){
    if( $text === 'Hourly Rate' ) {
        $text = 'Price per 1000 words';
    } return $text;
}

add_filter( 'gettext', 'replace_text2' );
function replace_text2( $text ){
    if( $text === 'Hourly Rate:' ) {
        $text = 'Price per 1000 words:';
    } return $text;
}
