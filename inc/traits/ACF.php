<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait ACF {
	/**
	 * Proxy for `get_field()` function from ACF.
	 *
	 * @param string $selector The field name or field key.
	 * @param int    $post_id  Optional. The post ID where the value is saved. Defaults to the current post.
	 * @param bool   $format_value Optional. Whether to apply formatting logic. Defaults to true.
	 * @param bool   $escape_html Optional. Whether to escape HTML. Defaults to false.
	 * @return mixed|false The value of the field or false if not found.
	 */
	public static function acf_get_field( $selector, $post_id = false, $format_value = true, $escape_html = false ) {
		if ( function_exists( 'get_field' ) ) {
			return get_field( $selector, $post_id, $format_value, $escape_html );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `have_rows()` function from ACF.
	 *
	 * @param string $selector The field name or field key.
	 * @param int    $post_id  Optional. The post ID where the value is saved. Defaults to the current post.
	 * @return bool Whether the field has rows or not.
	 */
	public static function acf_have_rows( $selector, $post_id = false ) {
		if ( function_exists( 'have_rows' ) ) {
			return have_rows( $selector, $post_id );
		} else {
			return false;
		}
	}

	/**
	 * Proxy for `get_field_objects()` function from ACF.
	 *
	 * @param int  $post_id     Optional. The post ID where the value is saved. Defaults to the current post.
	 * @param bool $format_value Optional. Whether to apply formatting logic. Defaults to true.
	 * @param bool $load_value   Optional. Whether to load the value. Defaults to true.
	 * @param bool $escape_html  Optional. Whether to escape HTML. Defaults to false.
	 * @return array|false The field objects or false if not found.
	 */
	public static function acf_get_field_objects( $post_id = false, $format_value = true, $load_value = true, $escape_html = false ) {
		if ( function_exists( 'get_field_objects' ) ) {
			return get_field_objects( $post_id, $format_value, $load_value, $escape_html );
		} else {
			return false;
		}
	}

	/**
	 * Retrieves the available ACF fields and values for a given post.
	 *
	 * @param int $post_id The ID of the post.
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
