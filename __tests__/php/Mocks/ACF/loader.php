<?php
/**
 * Loads all ACF mock functions
 */

// Load ACF functions
require_once __DIR__ . '/functions.php';

// Set up ACF function exists helper
function acf_function_exists( $name ) {
	global $MOCK_DATA;

	// For tests that verify ACF functions don't exist
	if ( isset( $MOCK_DATA['acf_exists'] ) && $MOCK_DATA['acf_exists'] === false ) {
		return false;
	}

	// For tests that check if specific functions exist
	if ( isset( $MOCK_DATA['acf_functions_exist'][ $name ] ) ) {
		return $MOCK_DATA['acf_functions_exist'][ $name ];
	}

	// Default behavior
	return isset( $MOCK_DATA['acf_exists'] ) && $MOCK_DATA['acf_exists'] === true;
}
