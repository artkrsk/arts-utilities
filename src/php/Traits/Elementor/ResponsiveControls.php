<?php

namespace Arts\Utilities\Traits\Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * ResponsiveControls Trait
 *
 * Provides utility methods for working with Elementor responsive controls
 * and generating responsive queries based on breakpoints.
 *
 * @package Arts\Utilities\Traits\Elementor
 * @since 1.0.0
 */
trait ResponsiveControls {
	/**
	 * Retrieves the enabled settings map for the given option
	 * based on the current breakpoint configuration in Elementor.
	 *
	 * @since 1.0.0
	 *
	 * @param \Elementor\Element_Base $controls_stack The controls stack object.
	 * @param string                  $option         The option to retrieve the enabled settings for.
	 *
	 * @return array The enabled settings for the given option.
	 */
	public static function get_enabled_settings_map( \Elementor\Element_Base $controls_stack, $option = '' ) {
		$enabled_map = array();

		if ( ! $option || ! is_string( $option ) || ! $controls_stack ) {
			return $enabled_map;
		}

		$settings           = $controls_stack->get_settings_for_display();
		$breakpoints_config = \Elementor\Plugin::$instance->breakpoints->get_breakpoints_config();

		foreach ( $settings as $key => $value ) {
			if ( strpos( $key, $option ) === 0 ) {
				$new_key = substr( $key, strlen( $option . '_' ) );

				if ( empty( $new_key ) ) {
					$new_key = 'desktop';
				}

				if ( ( array_key_exists( $new_key, $breakpoints_config ) && $breakpoints_config[ $new_key ]['is_enabled'] ) || $new_key === 'desktop' ) {
					$enabled_map[ $new_key ] = $value;
				}
			}
		}

		return array_reverse( $enabled_map, true );
	}

	/**
	 * Returns the media query string for a responsive option.
	 *
	 * Generates a media query string based on the enabled settings map and queries
	 * provided by the controls stack. It also allows for an additional query suffix to be added.
	 *
	 * @since 1.0.0
	 *
	 * @param \Elementor\Element_Base $controls_stack          The controls stack object.
	 * @param string                  $option                  The option for which the media query string is generated.
	 * @param string                  $additional_query_suffix An optional additional query suffix to be added.
	 * @return string The generated media query string.
	 */
	public static function get_media_query_string_for_responsive_option( \Elementor\Element_Base $controls_stack, $option = '', $additional_query_suffix = '' ) {
		$enabled_map = self::get_enabled_settings_map( $controls_stack, $option );
		$queries     = self::get_queries( $enabled_map, $controls_stack );
		$queries     = self::add_additional_query_suffix( $queries, $additional_query_suffix );

		return implode( ', ', $queries );
	}

	/**
	 * Checks if there is at least one enabled value for a given responsive option.
	 *
	 * @since 1.0.0
	 *
	 * @param \Elementor\Element_Base $controls_stack         The controls stack object.
	 * @param string                  $option                 The specific option to check.
	 * @param string                  $setting_value_to_check (Optional) The specific value to check. Default is 'yes'.
	 * @return bool Returns true if the responsive enabled option is set, false otherwise.
	 */
	public static function has_responsive_enabled_option( \Elementor\Element_Base $controls_stack, $option, $setting_value_to_check = 'yes' ) {
		$enabled_map = self::get_enabled_settings_map( $controls_stack, $option );

		foreach ( $enabled_map as $setting ) {
			if ( $setting === $setting_value_to_check ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Retrieves the responsive queries based on the enabled map.
	 *
	 * @since 1.0.0
	 *
	 * @param array $enabled_map The map of enabled breakpoints.
	 * @return array The array of responsive queries.
	 */
	private static function get_queries( $enabled_map ) {
		$elementor_breakpoints     = \Elementor\Plugin::$instance->breakpoints;
		$breakpoints_config        = $elementor_breakpoints->get_breakpoints_config();
		$widescreen_key            = $elementor_breakpoints::BREAKPOINT_KEY_WIDESCREEN;
		$has_widescreen_breakpoint = false;
		$queries                   = array();

		foreach ( $breakpoints_config as $breakpoint => $config ) {
			if ( in_array( $breakpoint, array_keys( $enabled_map ) ) && $config['is_enabled'] ) {
				if ( $enabled_map[ $breakpoint ] === 'yes' ) {
					if ( $config['direction'] === 'max' ) {
						$min_width = $elementor_breakpoints->get_device_min_breakpoint( $breakpoint );
						$queries[] = '(min-width: ' . $min_width . 'px) and (max-width: ' . $config['value'] . 'px)';
					} else {
						$queries[] = '(min-width: ' . $config['value'] . 'px)';
					}
				} else {
					if ( $config['direction'] === 'min' ) {
						// $min_width = $elementor_breakpoints->get_device_min_breakpoint( $breakpoint );
						$queries[] = 'not (min-width: ' . $config['value'] . 'px)';
					}
				}

				if ( $breakpoint === $widescreen_key ) {
					$has_widescreen_breakpoint = true;
				}
			}
		}

		if ( array_key_exists( 'desktop', $enabled_map ) ) {
			if ( $enabled_map['desktop'] === 'yes' ) {
				$min_width = $elementor_breakpoints->get_desktop_min_point();
				$queries[] = '(min-width: ' . $min_width . 'px)';

				if ( $has_widescreen_breakpoint ) {
					$queries[] = ' and (max-width: ' . $config['value'] . 'px)';
				}
			} else {
				if ( $has_widescreen_breakpoint ) {
					$min_width = $elementor_breakpoints->get_desktop_min_point();
					$queries[] = 'not ((min-width: ' . $min_width . 'px) and (max-width: ' . $config['value'] . 'px))';
				}
			}
		}

		return $queries;
	}

	/**
	 * Adds an additional query suffix to each query in the given array.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $queries                 The array of queries to modify.
	 * @param string $additional_query_suffix The additional query suffix to add.
	 * @return array The modified array of queries.
	 */
	private static function add_additional_query_suffix( $queries, $additional_query_suffix ) {
		if ( ! empty( $additional_query_suffix ) ) {
			foreach ( $queries as $key => $query ) {
				$queries[ $key ] = $query . ' ' . $additional_query_suffix;
			}
		}
		return $queries;
	}
}