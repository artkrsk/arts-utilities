<?php
/**
 * Mock functions for the Arts\Utilities\Traits\Elementor namespace
 */

namespace Arts\Utilities\Traits\Elementor;

// Only define these functions if they don't already exist
if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\class_exists' ) ) {
	// Mock class_exists() function for testing ElementorPro
	function class_exists( $class ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'class_exists_' . $class ] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_archive' ) ) {
	// Mock is_archive() function
	function is_archive() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_archive'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_tax' ) ) {
	// Mock is_tax() function
	function is_tax() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_tax'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_home' ) ) {
	// Mock is_home() function
	function is_home() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_home'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_search' ) ) {
	// Mock is_search() function
	function is_search() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_search'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_single' ) ) {
	// Mock is_single() function
	function is_single() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_single'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_singular' ) ) {
	// Mock is_singular() function
	function is_singular() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_singular'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\is_404' ) ) {
	// Mock is_404() function
	function is_404() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_404'] ?? false;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\get_the_ID' ) ) {
	// Mock get_the_ID() function
	function get_the_ID() {
		global $MOCK_DATA;
		return $MOCK_DATA['post_id'] ?? 0;
	}
}

if ( ! function_exists( 'Arts\Utilities\Traits\Elementor\did_action' ) ) {
	// Mock did_action() function
	function did_action( $tag ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'did_action_' . $tag ] ?? true;
	}
}
