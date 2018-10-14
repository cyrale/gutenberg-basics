<?php
/**
 * Autoloader.
 *
 * @package Gutenberg_Basics
 */

spl_autoload_register(
	function ( $name ) {
		$sanitized_basename = str_replace( '_', '-', sanitize_title( basename( str_replace( '\\', '/', $name ) ) ) );

		if ( strpos( $name, 'Gutenberg_Basics\\' ) === 0 ) {
			require_once __DIR__ . '/includes/class-' . $sanitized_basename . '.php';
		}
	}
);
