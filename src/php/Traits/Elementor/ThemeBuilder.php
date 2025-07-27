<?php

namespace Arts\Utilities\Traits\Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * ThemeBuilder Trait
 *
 * Provides utility methods for working with Elementor Theme Builder,
 * handling theme locations, and retrieving theme builder templates.
 *
 * @package Arts\Utilities\Traits\Elementor
 * @since 1.0.0
 */
trait ThemeBuilder {
	/**
	 * Retrieve the theme builder location ID.
	 *
	 * This method determines the appropriate theme builder location ID based on the current
	 * page context. Identifies the location type (archive, single, etc.). If a matching
	 * location is found, it retrieves the corresponding document ID.
	 *
	 * @since 1.0.0
	 *
	 * @return int|null The post ID of the theme builder document, or null if not found.
	 */
	public static function get_theme_builder_location_id() {
		$post_id = null;

		if ( class_exists( '\ElementorPro\Plugin' ) ) {
			$location = '';

			if ( self::is_shop() ) {
				$location = 'archive';
			} elseif ( is_archive() || is_tax() || is_home() || is_search() ) {
				$location = 'archive';
			} elseif ( is_single() ) {
				$location = 'single';
			} elseif ( is_singular() || is_404() ) {
				return get_the_ID();
			}

			if ( $location ) {
				$theme_builder_module = \ElementorPro\Plugin::instance()->modules_manager->get_modules( 'theme-builder' );
				/** @disregard P1013 The method exists */
				$document = $theme_builder_module->get_conditions_manager()->get_documents_for_location( $location );
				$IDs      = array_keys( $document );

				if ( ! empty( $IDs ) && $IDs[0] ) {
					$post_id = $IDs[0];
				}
			}
		}

		return $post_id;
	}

	/**
	 * Determines if a fallback template should be shown for a specific Elementor location
	 *
	 * @param string $location The Elementor theme location name
	 * @param bool   $require_elementor_inactive Whether to only show fallback when Elementor is inactive
	 *
	 * @since 1.0.27
	 *
	 * @return bool True if fallback should be shown, false otherwise
	 */
	public static function should_display_fallback_template( $location, $require_elementor_inactive = false ) {
		// Basic check if Elementor is handling this location
		$elementor_not_handling = ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( $location );

		// Additional check if we require Elementor to be completely inactive
		if ( $require_elementor_inactive ) {
			return $elementor_not_handling && ! self::is_elementor_plugin_active();
		}

		return $elementor_not_handling;
	}
}
