<?php
/**
 * PHPStan Stubs for Advanced Custom Fields (ACF)
 *
 * Function signatures extracted from ACF Pro 6.6.0
 *
 * @package Arts\Utilities
 */

if ( ! function_exists( 'get_field' ) ) {
	/**
	 * Return a custom field value for a specific field name/key + post_id.
	 *
	 * @param string  $selector     The field name or key.
	 * @param mixed   $post_id      The post_id of which the value is saved against.
	 * @param boolean $format_value Whether or not to format the value.
	 * @param boolean $escape_html  If formatting, make sure it's HTML safe.
	 *
	 * @return mixed
	 */
	function get_field( $selector, $post_id = false, $format_value = true, $escape_html = false ) {
		return null;
	}
}

if ( ! function_exists( 'have_rows' ) ) {
	/**
	 * Checks if a field has any rows of data to loop over.
	 *
	 * @param string $selector The field name or field key.
	 * @param mixed  $post_id  The post ID where the value is saved.
	 *
	 * @return boolean
	 */
	function have_rows( $selector, $post_id = false ) {
		return false;
	}
}

if ( ! function_exists( 'get_field_objects' ) ) {
	/**
	 * Return an array containing all custom field objects for a specific post_id.
	 *
	 * @param mixed   $post_id      The post_id of which the value is saved against.
	 * @param boolean $format_value Whether or not to format the field value.
	 * @param boolean $load_value   Whether or not to load the field value.
	 * @param boolean $escape_html  Should the field return a HTML safe formatted value.
	 *
	 * @return array<string, mixed>|false
	 */
	function get_field_objects( $post_id = false, $format_value = true, $load_value = true, $escape_html = false ) {
		return false;
	}
}

if ( ! function_exists( 'acf_add_options_page' ) ) {
	/**
	 * Add an ACF options page.
	 *
	 * @param mixed $page Page configuration array or string.
	 *
	 * @return array
	 */
	function acf_add_options_page( $page = '' ) {
		return array();
	}
}

if ( ! function_exists( 'get_sub_field' ) ) {
	/**
	 * Return a sub field value inside a have_rows loop.
	 *
	 * @param string  $selector     The field name or key.
	 * @param boolean $format_value Whether or not to format the value.
	 * @param boolean $escape_html  If formatting, make sure it's HTML safe.
	 *
	 * @return mixed
	 */
	function get_sub_field( $selector = '', $format_value = true, $escape_html = false ) {
		return null;
	}
}

if ( ! function_exists( 'update_field' ) ) {
	/**
	 * Update a field value in the database.
	 *
	 * @param string $selector The field name or key.
	 * @param mixed  $value    The value to save in the database.
	 * @param mixed  $post_id  The post_id of which the value is saved against.
	 *
	 * @return boolean
	 */
	function update_field( $selector, $value, $post_id = false ) {
		return false;
	}
}
