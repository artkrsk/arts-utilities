<?php
/**
 * Mock Elementor global functions and configuration
 */

// Define path to Elementor
if ( ! defined( 'ELEMENTOR_PATH' ) ) {
	define( 'ELEMENTOR_PATH', __DIR__ . '/fake-elementor/' );
}

// Create directory if it doesn't exist
if ( ! file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' ) ) {
	@mkdir( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/', 0777, true );
	@file_put_contents(
		ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php',
		'<?php /* Mock BFI Thumb */ ?>'
	);
}

// Initialize global Plugin instances if they don't exist
if ( ! isset( $ELEMENTOR_PLUGIN_INSTANCE ) ) {
	global $ELEMENTOR_PLUGIN_INSTANCE;
}

if ( ! isset( $ELEMENTOR_PRO_PLUGIN_INSTANCE ) ) {
	global $ELEMENTOR_PRO_PLUGIN_INSTANCE;
}

/**
 * Fix for class_exists function to work with Brain\Monkey
 */
if ( ! function_exists( 'elementor_class_exists' ) ) {
	function elementor_class_exists( $class ) {
		global $MOCK_DATA;

		// Handle Elementor classes
		if ( $class === '\Elementor\Plugin' || $class === 'Elementor\Plugin' ) {
			return true;
		}

		// Handle ElementorPro classes
		if ( $class === '\ElementorPro\Plugin' || $class === 'ElementorPro\Plugin' ) {
			return isset( $MOCK_DATA['class_exists_ElementorPro\\Plugin'] )
				? $MOCK_DATA['class_exists_ElementorPro\\Plugin']
				: false;
		}

		// Handle Elementor Core Settings class
		if ( $class === '\Elementor\Core\Settings\Manager' || $class === 'Elementor\Core\Settings\Manager' ) {
			return isset( $MOCK_DATA['class_exists_\\Elementor\\Core\\Settings\\Manager'] )
				? $MOCK_DATA['class_exists_\\Elementor\\Core\\Settings\\Manager']
				: true;
		}

		// Fall back to real class_exists
		return class_exists( $class );
	}
}

// Initialize global Plugin instances
global $ELEMENTOR_PLUGIN_INSTANCE;
global $ELEMENTOR_PRO_PLUGIN_INSTANCE;

if ( ! isset( $ELEMENTOR_PLUGIN_INSTANCE ) ) {
	$ELEMENTOR_PLUGIN_INSTANCE = new \Elementor\Plugin();
}

if ( ! isset( $ELEMENTOR_PRO_PLUGIN_INSTANCE ) ) {
	$ELEMENTOR_PRO_PLUGIN_INSTANCE = new \ElementorPro\Plugin();
}
