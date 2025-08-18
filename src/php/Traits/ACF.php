<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * ACF Trait
 *
 * Provides utility methods for working with Advanced Custom Fields (ACF).
 * These methods act as proxies for ACF functions and include proper checks
 * for ACF availability.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait ACF {
	/**
	 * Check if an ACF function exists
	 *
	 * This method can be mocked in tests
	 *
	 * @since 1.0.0
	 *
	 * @param string $function_name The function name to check
	 * @return bool Whether the function exists
	 */
	protected static function acf_function_exists( $function_name ) {
		if ( function_exists( 'acf_function_exists' ) ) {
			return acf_function_exists( $function_name );
		}
		return function_exists( $function_name );
	}

	/**
	 * Proxy for `get_field()` function from ACF.
	 *
	 * @since 1.0.0
	 *
	 * @param string $selector     The field name or field key.
	 * @param int    $post_id      Optional. The post ID where the value is saved. Defaults to the current post.
	 * @param bool   $format_value Optional. Whether to apply formatting logic. Defaults to true.
	 * @param bool   $escape_html  Optional. Whether to escape HTML. Defaults to false.
	 *
	 * @return mixed|false The value of the field or false if not found.
	 */
	public static function acf_get_field( $selector, $post_id = false, $format_value = true, $escape_html = false ) {
		if ( self::acf_function_exists( 'get_field' ) ) {
			return get_field( $selector, $post_id, $format_value, $escape_html );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `have_rows()` function from ACF.
	 *
	 * @since 1.0.0
	 *
	 * @param string $selector The field name or field key.
	 * @param int    $post_id  Optional. The post ID where the value is saved. Defaults to the current post.
	 *
	 * @return bool Whether the field has rows or not.
	 */
	public static function acf_have_rows( $selector, $post_id = false ) {
		if ( self::acf_function_exists( 'have_rows' ) ) {
			return have_rows( $selector, $post_id );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `get_field_objects()` function from ACF.
	 *
	 * @since 1.0.0
	 *
	 * @param int  $post_id      Optional. The post ID where the value is saved. Defaults to the current post.
	 * @param bool $format_value Optional. Whether to apply formatting logic. Defaults to true.
	 * @param bool $load_value   Optional. Whether to load the value. Defaults to true.
	 * @param bool $escape_html  Optional. Whether to escape HTML. Defaults to false.
	 *
	 * @return array|false The field objects or false if not found.
	 */
	public static function acf_get_field_objects( $post_id = false, $format_value = true, $load_value = true, $escape_html = false ) {
		if ( self::acf_function_exists( 'get_field_objects' ) ) {
			return get_field_objects( $post_id, $format_value, $load_value, $escape_html );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `acf_add_options_page()` function from ACF.
	 *
	 * @since 1.0.10
	 *
	 * @param array $page The options page settings.
	 *
	 * @return bool|int The ID of the options page or false if not found.
	 */
	public static function acf_add_options_page( $page = '' ) {
		if ( self::acf_function_exists( 'acf_add_options_page' ) ) {
			return acf_add_options_page( $page );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `get_sub_field()` function from ACF.
	 *
	 * @since 1.0.14
	 *
	 * @param string $selector     The field name or field key.
	 * @param bool   $format_value Optional. Whether to apply formatting logic. Defaults to true.
	 * @param bool   $escape_html  Optional. Whether to escape HTML. Defaults to false.
	 *
	 * @return mixed|false The value of the sub field or false if not found.
	 */
	public static function acf_get_sub_field( $selector, $format_value = true, $escape_html = false ) {
		if ( self::acf_function_exists( 'get_sub_field' ) ) {
			return get_sub_field( $selector, $format_value, $escape_html );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `update_field()` function from ACF.
	 *
	 * @since 1.0.30
	 *
	 * @param string $selector The field name or field key.
	 * @param mixed  $value    The new value to save.
	 * @param int    $post_id  Optional. The post ID where the value is saved. Defaults to the current post.
	 *
	 * @return bool Whether the field was updated successfully or false if not found.
	 */
	public static function acf_update_field( $selector, $value, $post_id = false ) {
		if ( self::acf_function_exists( 'update_field' ) ) {
			return update_field( $selector, $value, $post_id );
		} else {
			return false;
		}
	}

	/**
	 * Retrieves the available ACF fields and values for a given post.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return array An associative array of ACF field names and their corresponding values.
	 */
	public static function acf_get_post_fields( $post_id ) {
		if ( ! $post_id ) {
			return array();
		}

		$result = array();

		$acf_fields = self::acf_get_field_objects( $post_id );

		if ( $acf_fields && ! empty( $acf_fields ) ) {
			foreach ( $acf_fields as $field ) {
				$result[ $field['name'] ] = $field['value'];
			}
		}

		return $result;
	}
}
