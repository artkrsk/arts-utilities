<?php
/**
 * WordPress utility functions mocks
 */

// Basic utility functions
if ( ! function_exists( 'esc_html__' ) ) {
	function esc_html__( $text, $domain ) {
		return $text;
	}
}

if ( ! function_exists( 'esc_html' ) ) {
	function esc_html( $text ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $text ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_url' ) ) {
	function esc_url( $url ) {
		return $url; // For our tests, just return the URL unchanged
	}
}

if ( ! function_exists( 'apply_filters' ) ) {
	function apply_filters( $tag, $value, ...$args ) {
		return $value;
	}
}

if ( ! function_exists( 'wp_parse_args' ) ) {
	function wp_parse_args( $args, $defaults = array() ) {
		if ( is_object( $args ) ) {
			$parsed_args = get_object_vars( $args );
		} elseif ( is_array( $args ) ) {
			$parsed_args = $args;
		} else {
			parse_str( $args, $parsed_args );
		}

		return array_merge( $defaults, $parsed_args );
	}
}

if ( ! function_exists( 'shortcode_unautop' ) ) {
	function shortcode_unautop( $content ) {
		global $MOCK_DATA;
		return $MOCK_DATA['shortcode_unautop_result'] ?? $content;
	}
}

if ( ! function_exists( 'do_shortcode' ) ) {
	function do_shortcode( $content ) {
		global $MOCK_DATA;
		return $MOCK_DATA['do_shortcode_result'] ?? $content;
	}
}

// URL related functions
if ( ! function_exists( 'home_url' ) ) {
	function home_url( $path = '' ) {
		global $MOCK_DATA;
		$url = $MOCK_DATA['home_url'] ?? 'https://example.com';
		return $url . ltrim( $path, '/' );
	}
}

if ( ! function_exists( 'get_site_url' ) ) {
	function get_site_url() {
		global $MOCK_DATA;
		return $MOCK_DATA['site_url'] ?? 'https://example.com';
	}
}

if ( ! function_exists( 'wp_get_raw_referer' ) ) {
	function wp_get_raw_referer() {
		global $MOCK_DATA;
		return $MOCK_DATA['wp_referer'] ?? false;
	}
}

if ( ! function_exists( 'add_query_arg' ) ) {
	function add_query_arg( $args, $url ) {
		$query = parse_url( $url, PHP_URL_QUERY );

		if ( $query ) {
			parse_str( $query, $query_args );
			$args = array_merge( $query_args, $args );
		}

		$base_url = preg_replace( '/\?.*/', '', $url );
		return $base_url . '?' . http_build_query( $args );
	}
}

// Parse URL functions
if ( ! function_exists( 'parse_str' ) ) {
	function parse_str( $string, &$result ) {
		// Simple implementation for tests
		$result = array();
		$parts  = explode( '&', $string );

		foreach ( $parts as $part ) {
			if ( strpos( $part, '=' ) !== false ) {
				list($key, $value) = explode( '=', $part, 2 );
				$result[ $key ]    = urldecode( $value );
			}
		}
	}
}

if ( ! function_exists( 'http_build_query' ) ) {
	function http_build_query( $data ) {
		$result = array();

		foreach ( $data as $key => $value ) {
			$result[] = urlencode( $key ) . '=' . urlencode( $value );
		}

		return implode( '&', $result );
	}
}

// String utility functions
if ( ! function_exists( 'untrailingslashit' ) ) {
	function untrailingslashit( $string ) {
		return rtrim( $string, '/\\' );
	}
}

if ( ! function_exists( 'trailingslashit' ) ) {
	function trailingslashit( $string ) {
		return untrailingslashit( $string ) . '/';
	}
}

// WordPress options
if ( ! function_exists( 'get_option' ) ) {
	function get_option( $option_name ) {
		global $MOCK_DATA;
		if ( isset( $MOCK_DATA[ 'option_' . $option_name ] ) ) {
			return $MOCK_DATA[ 'option_' . $option_name ];
		}
		return $MOCK_DATA['options'][ $option_name ] ?? null;
	}
}

if ( ! function_exists( 'get_bloginfo' ) ) {
	function get_bloginfo( $show = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ 'bloginfo_' . $show ] ?? '';
	}
}

// Wp_file functions
if ( ! function_exists( 'get_file_data' ) ) {
	function get_file_data( $file, $default_headers, $context = '' ) {
		global $MOCK_DATA;

		// Store the file path for tests that check it
		$MOCK_DATA['get_file_data_file'] = $file;

		// Return mock data
		return $MOCK_DATA['get_file_data'] ?? array();
	}
}

if ( ! function_exists( 'wp_check_filetype' ) ) {
	function wp_check_filetype( $filename ) {
		global $MOCK_DATA;
		return $MOCK_DATA['filetype'] ?? array(
			'ext'  => '',
			'type' => '',
		);
	}
}

// Functions needed for URL class tests
if ( ! function_exists( 'wp_normalize_path' ) ) {
	function wp_normalize_path( $path ) {
		global $MOCK_DATA;
		return $MOCK_DATA['normalize_path'] ?? $path;
	}
}

if ( ! function_exists( 'get_template_directory' ) ) {
	function get_template_directory() {
		global $MOCK_DATA;
		return $MOCK_DATA['template_directory'] ?? '/var/www/html/wp-content/themes/default';
	}
}

if ( ! function_exists( 'get_template_directory_uri' ) ) {
	function get_template_directory_uri() {
		global $MOCK_DATA;
		return $MOCK_DATA['template_directory_uri'] ?? 'https://example.com/wp-content/themes/default';
	}
}

if ( ! function_exists( 'plugin_dir_url' ) ) {
	function plugin_dir_url( $file ) {
		global $MOCK_DATA;
		return $MOCK_DATA['plugin_dir_url'] ?? 'https://example.com/wp-content/plugins/default/';
	}
}

// Define WP_PLUGIN_DIR if not already defined
if ( ! defined( 'WP_PLUGIN_DIR' ) ) {
	global $MOCK_DATA;
	define( 'WP_PLUGIN_DIR', $MOCK_DATA['wp_plugin_dir'] ?? '/var/www/html/wp-content/plugins' );
}
