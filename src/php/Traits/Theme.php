<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Theme Trait
 *
 * Provides utility methods for working with WordPress themes,
 * particularly for retrieving theme information and versions.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Theme {
	/**
	 * Get the version of the parent theme.
	 *
	 * Retrieves the version from the parent theme if available,
	 * otherwise returns the current theme version.
	 *
	 * @since 1.0.0
	 *
	 * @return string The version of the parent theme.
	 */
	public static function get_parent_theme_version() {
		$current_theme = wp_get_theme();
		$theme_version = $current_theme->get( 'Version' );

		// Try to get the parent theme object
		$parent_theme = $current_theme->parent();

		// Use parent theme version if available
		if ( $parent_theme ) {
			$theme_version = $parent_theme->get( 'Version' );
		}

		return $theme_version;
	}
}
