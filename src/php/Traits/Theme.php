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
	 * Cached current theme object.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_Theme|null
	 */
	private static $current_theme = null;

	/**
	 * Cached parent theme object.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_Theme|null
	 */
	private static $parent_theme = null;

	/**
	 * Reset the cached theme objects.
	 *
	 * Primarily used for testing purposes.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function reset_theme_cache() {
		self::$current_theme = null;
		self::$parent_theme  = null;
	}

	/**
	 * Get the current theme object.
	 *
	 * @since 1.0.0
	 *
	 * @return \WP_Theme The current theme object.
	 */
	private static function get_current_theme() {
		if ( null === self::$current_theme ) {
			self::$current_theme = wp_get_theme();
		}

		return self::$current_theme;
	}

	/**
	 * Get the parent theme object.
	 *
	 * @since 1.0.0
	 *
	 * @return \WP_Theme|false The parent theme object or false if no parent theme exists.
	 */
	private static function get_parent_theme() {
		if ( null === self::$parent_theme ) {
			$current_theme = self::get_current_theme();
			$parent        = $current_theme->parent();
			self::$parent_theme = $parent !== false ? $parent : null;
		}

		return self::$parent_theme;
	}

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
		$current_theme = self::get_current_theme();
		$theme_version = $current_theme->get( 'Version' );

		// Use parent theme version if available
		$parent_theme = self::get_parent_theme();
		if ( $parent_theme ) {
			$theme_version = $parent_theme->get( 'Version' );
		}

		return $theme_version;
	}

	/**
	 * Get the slug of the parent theme.
	 *
	 * Retrieves the stylesheet (directory name) from the parent theme if available,
	 * otherwise returns the current theme's stylesheet.
	 *
	 * @since 1.0.0
	 *
	 * @return string The slug of the parent theme.
	 */
	public static function get_parent_theme_slug() {
		$current_theme = self::get_current_theme();
		$theme_slug    = $current_theme->get_stylesheet();

		// Use parent theme slug if available
		$parent_theme = self::get_parent_theme();
		if ( $parent_theme ) {
			$theme_slug = $parent_theme->get_stylesheet();
		}

		return $theme_slug;
	}

	/**
	 * Get the name of the parent theme.
	 *
	 * Retrieves the name from the parent theme if available,
	 * otherwise returns the current theme's name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The name of the parent theme.
	 */
	public static function get_parent_theme_name() {
		$current_theme = self::get_current_theme();
		$theme_name    = $current_theme->get( 'Name' );

		// Use parent theme name if available
		$parent_theme = self::get_parent_theme();
		if ( $parent_theme ) {
			$theme_name = $parent_theme->get( 'Name' );
		}

		return $theme_name;
	}
}
