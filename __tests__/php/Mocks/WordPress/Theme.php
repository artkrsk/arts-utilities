<?php
/**
 * WordPress Theme-related mock functions
 */

// Theme-related classes
class MockWP_Theme {
	private $is_parent = false;

	public function __construct( $is_parent = false ) {
		$this->is_parent = $is_parent;
	}

	public function get( $property ) {
		global $MOCK_DATA;
		if ( $property === 'Version' ) {
			if ( $this->is_parent ) {
				return $MOCK_DATA['wp_theme_parent_version'] ?? '';
			}
			return $MOCK_DATA['wp_theme_version'] ?? '';
		}
		return '';
	}

	public function parent() {
		global $MOCK_DATA;
		if ( isset( $MOCK_DATA['wp_theme_parent'] ) && $MOCK_DATA['wp_theme_parent'] ) {
			return new MockWP_Theme( true );
		}
		return false;
	}
}

// Theme functions
function wp_get_theme() {
	return new MockWP_Theme();
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_theme_mod' ) ) {
	function get_theme_mod( $name, $default = false ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'theme_mod_' . $name ] ?? $default;
	}
}
