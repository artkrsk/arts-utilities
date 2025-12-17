<?php
/**
 * PHPStan Bootstrap File
 *
 * Sets up constants and loads stubs for static analysis.
 *
 * @package Arts\Utilities
 */

// Define WordPress constants if not already defined
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/__tests__/php/fake-wp/' );
}

// Define Elementor path constant
if ( ! defined( 'ELEMENTOR_PATH' ) ) {
	define( 'ELEMENTOR_PATH', dirname( __DIR__ ) . '/__tests__/php/fake-elementor/' );
}

// Define WordPress object constants if not already defined
if ( ! defined( 'OBJECT' ) ) {
	define( 'OBJECT', 'OBJECT' );
}
if ( ! defined( 'ARRAY_A' ) ) {
	define( 'ARRAY_A', 'ARRAY_A' );
}
if ( ! defined( 'ARRAY_N' ) ) {
	define( 'ARRAY_N', 'ARRAY_N' );
}

// Load WordPress stubs
require_once __DIR__ . '/wordpress-stubs.php';

// Load ACF stubs
require_once __DIR__ . '/acf-stubs.php';

// Load Elementor stubs
require_once __DIR__ . '/elementor-stubs.php';
