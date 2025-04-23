<?php
/**
 * PHPUnit bootstrap file.
 *
 * This file sets up the testing environment for WordPress-based PHP unit tests.
 */

// Require composer autoloader.
require_once dirname( dirname( __DIR__ ) ) . '/vendor/autoload.php';

// We need to include Patchwork BEFORE any function definitions
// to ensure it can properly redefine WordPress functions
if ( class_exists( 'Patchwork\\Stack\\State' ) ) {
	// Force Patchwork to initialize
	\Patchwork\Stack\State::$items = array();
}

// Initialize the global mock data variable
global $MOCK_DATA;
$MOCK_DATA = array();

// Define WordPress constants only if not already defined
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/fake-wp/' );
}

// Define path to Elementor
if ( ! defined( 'ELEMENTOR_PATH' ) ) {
	define( 'ELEMENTOR_PATH', __DIR__ . '/fake-elementor/' );
}

// Create Elementor directory structure if needed
if ( ! file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' ) ) {
	@mkdir( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/', 0777, true );
	@file_put_contents(
		ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php',
		'<?php /* Mock BFI Thumb */ ?>'
	);
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

// Include the MockBreakpoints class for Elementor
require_once __DIR__ . '/Mocks/Elementor/MockBreakpoints.php';

// Initialize Brain Monkey after Patchwork but before loading mocks
\Brain\Monkey\setUp();

// Load all mock functions and classes
require_once __DIR__ . '/Mocks/loader.php';
