<?php
/**
 * Mock WordPress functions for unit testing
 */

// Include utility functions first
require_once __DIR__ . '/Utility.php';

// Define WordPress constants (only if not already defined)
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/fake-wp/' );
}

// These constants are now defined in bootstrap.php
// DO NOT redefine them here

// These functions are now included from Utility.php, so we don't need to declare them again
// esc_html__()
// esc_html()
// esc_attr()
// esc_url()
// wp_kses_post()
// wp_kses_decoder()
// wp_strip_all_tags()
// apply_filters()
// wp_parse_args()
// shortcode_unautop()
// do_shortcode()
// home_url()
// get_site_url()
// wp_get_raw_referer()
// add_query_arg()
// parse_str()
// http_build_query()
// untrailingslashit()
// trailingslashit()
// get_option()
// get_bloginfo()
// get_file_data()
// wp_check_filetype()

// Mock WordPress functions
if ( ! function_exists( 'get_post_field' ) ) {
	function get_post_field( $field, $post_id ) {
		global $MOCK_DATA;

		// Special handling for post_author
		if ( $field === 'post_author' ) {
			// Check if there's a specific post author for this post ID
			if ( isset( $MOCK_DATA[ 'post_author_' . $post_id ] ) ) {
				return $MOCK_DATA[ 'post_author_' . $post_id ];
			}

			// Fall back to generic post_author
			return $MOCK_DATA['post_author'] ?? null;
		}

		return $MOCK_DATA[ 'post_' . $field ] ?? null;
	}
}

if ( ! function_exists( 'get_the_author_meta' ) ) {
	function get_the_author_meta( $field, $user_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'author_' . $field ] ?? null;
	}
}

if ( ! function_exists( 'get_avatar_url' ) ) {
	function get_avatar_url( $user_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA['author_avatar_url'] ?? null;
	}
}

if ( ! function_exists( 'get_author_posts_url' ) ) {
	function get_author_posts_url( $user_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA['author_posts_url'] ?? null;
	}
}

if ( ! function_exists( 'get_the_ID' ) ) {
	function get_the_ID() {
		global $MOCK_DATA, $post;

		if ( isset( $post ) && isset( $post->ID ) ) {
			return $post->ID;
		}

		return $MOCK_DATA['current_post_id'] ?? 0;
	}
}

if ( ! function_exists( 'get_the_title' ) ) {
	function get_the_title() {
		global $MOCK_DATA;
		return $MOCK_DATA['the_title'] ?? '';
	}
}

if ( ! function_exists( 'get_the_category' ) ) {
	function get_the_category() {
		global $MOCK_DATA, $post;
		return $MOCK_DATA['post_categories'][ $post->ID ] ?? array();
	}
}

if ( ! function_exists( 'wp_get_attachment_url' ) ) {
	function wp_get_attachment_url( $attachment_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA['attachment_url'] ?? null;
	}
}

if ( ! function_exists( 'wp_reset_postdata' ) ) {
	function wp_reset_postdata() {
		// No-op
	}
}

if ( ! function_exists( 'get_query_var' ) ) {
	function get_query_var( $var ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'query_var_' . $var ] ?? null;
	}
}

if ( ! function_exists( 'get_categories' ) ) {
	function get_categories( $args = array() ) {
		global $MOCK_DATA;
		return $MOCK_DATA['categories'] ?? array();
	}
}

if ( ! function_exists( 'get_post_types' ) ) {
	function get_post_types( $args = array(), $output = 'names', $operator = 'and' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['post_types'] ?? array(
			'post' => 'post',
			'page' => 'page',
		);
	}
}

if ( ! function_exists( 'get_post_type_archive_link' ) ) {
	function get_post_type_archive_link( $post_type ) {
		global $MOCK_DATA;
		return $MOCK_DATA['post_type_archive_links'][ $post_type ] ?? '';
	}
}

if ( ! function_exists( 'get_category_link' ) ) {
	function get_category_link( $category ) {
		global $MOCK_DATA;

		if ( is_object( $category ) ) {
			$category = $category->term_id;
		}

		return $MOCK_DATA['category_link'][ $category ] ?? 'https://example.com/category/' . $category;
	}
}

// Conditional functions
if ( ! function_exists( 'is_shop' ) ) {
	function is_shop() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_shop'] ?? false;
	}
}

if ( ! function_exists( 'is_category' ) ) {
	function is_category( $category_id = null ) {
		global $MOCK_DATA;
		if ( $category_id !== null ) {
			return isset( $MOCK_DATA['current_category_id'] ) && $MOCK_DATA['current_category_id'] === $category_id;
		}
		return $MOCK_DATA['is_category'] ?? false;
	}
}

if ( ! function_exists( 'is_author' ) ) {
	function is_author() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_author'] ?? false;
	}
}

if ( ! function_exists( 'is_tag' ) ) {
	function is_tag() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_tag'] ?? false;
	}
}

if ( ! function_exists( 'is_day' ) ) {
	function is_day() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_day'] ?? false;
	}
}

if ( ! function_exists( 'is_month' ) ) {
	function is_month() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_month'] ?? false;
	}
}

if ( ! function_exists( 'is_year' ) ) {
	function is_year() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_year'] ?? false;
	}
}

if ( ! function_exists( 'is_home' ) ) {
	function is_home() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_home'] ?? false;
	}
}

if ( ! function_exists( 'is_search' ) ) {
	function is_search() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_search'] ?? false;
	}
}

if ( ! function_exists( 'is_singular' ) ) {
	function is_singular() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_singular'] ?? false;
	}
}

if ( ! function_exists( 'is_archive' ) ) {
	function is_archive() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_archive'] ?? false;
	}
}

if ( ! function_exists( 'is_tax' ) ) {
	function is_tax() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_tax'] ?? false;
	}
}

if ( ! function_exists( 'is_single' ) ) {
	function is_single() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_single'] ?? false;
	}
}

if ( ! function_exists( 'is_404' ) ) {
	function is_404() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_404'] ?? false;
	}
}

if ( ! function_exists( 'get_the_date' ) ) {
	function get_the_date( $format = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['the_date'] ?? '';
	}
}

if ( ! function_exists( 'get_the_archive_description' ) ) {
	function get_the_archive_description() {
		global $MOCK_DATA;
		return $MOCK_DATA['archive_description'] ?? '';
	}
}

if ( ! function_exists( 'wp_title' ) ) {
	function wp_title( $sep = '', $display = true, $seplocation = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['wp_title'] ?? '';
	}
}

if ( ! function_exists( 'get_category' ) ) {
	function get_category( $category_id ) {
		global $MOCK_DATA;
		return (object) array(
			'name' => $MOCK_DATA['category_name'] ?? '',
		);
	}
}

if ( ! function_exists( 'get_userdata' ) ) {
	function get_userdata( $user_id ) {
		global $MOCK_DATA;
		return (object) array(
			'display_name' => $MOCK_DATA['author_display_name'] ?? '',
		);
	}
}

if ( ! function_exists( 'single_tag_title' ) ) {
	function single_tag_title( $prefix = '', $display = true ) {
		global $MOCK_DATA;
		return $MOCK_DATA['tag_name'] ?? '';
	}
}

if ( ! function_exists( 'single_cat_title' ) ) {
	function single_cat_title( $prefix = '', $display = true ) {
		global $MOCK_DATA;
		return $MOCK_DATA['cat_title'] ?? '';
	}
}

// Only define it if it doesn't already exist
if ( ! function_exists( 'get_theme_mod' ) ) {
	/**
	 * Mock implementation of get_theme_mod WordPress function
	 *
	 * @param string $name    The theme modification name.
	 * @param mixed  $default Default value to return if the theme modification doesn't exist.
	 * @return mixed Theme modification value or default.
	 */
	function get_theme_mod( $name, $default = false ) {
		global $MOCK_DATA;
		return isset( $MOCK_DATA[ 'theme_mod_' . $name ] ) ? $MOCK_DATA[ 'theme_mod_' . $name ] : $default;
	}
}

// NOTE: get_terms is now defined in Taxonomies.php
// Do not redefine it here to avoid conflicts

if ( ! function_exists( 'get_ancestors' ) ) {
	function get_ancestors( $object_id, $object_type, $resource_type = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['term_ancestors'][ $object_id ] ?? array();
	}
}