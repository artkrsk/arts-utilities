<?php
/**
 * Additional WordPress Stubs
 *
 * Type definitions for WordPress classes not covered by wordpress-stubs package.
 * These are minimal stubs needed for PHPStan type checking.
 *
 * @package Arts\Utilities
 */

if ( ! class_exists( 'WP_Query' ) ) {
	/**
	 * WordPress Query class stub
	 */
	class WP_Query {
		/**
		 * @param array<string, mixed> $args
		 */
		public function __construct( $args = array() ) {}

		/**
		 * @return bool
		 */
		public function have_posts() {
			return false;
		}

		/**
		 * @return void
		 */
		public function the_post() {}

		/**
		 * @var int
		 */
		public $post_count = 0;

		/**
		 * @return array<int, \WP_Post>
		 */
		public function get_posts() {
			return array();
		}
	}
}

if ( ! class_exists( 'WP_Post' ) ) {
	/**
	 * WordPress Post class stub
	 */
	class WP_Post {
		/**
		 * @var int
		 */
		public $ID = 0;

		/**
		 * @var string
		 */
		public $post_title = '';

		/**
		 * @var string
		 */
		public $post_name = '';

		/**
		 * @var string
		 */
		public $post_type = '';

		/**
		 * @var string
		 */
		public $post_status = '';
	}
}

if ( ! function_exists( 'wp_style_add_data' ) ) {
	/**
	 * Add metadata to a CSS stylesheet.
	 *
	 * Accepts any string key for custom metadata storage.
	 * WordPress core uses specific keys ('rtl', 'suffix', 'alt', 'title', 'path'),
	 * but custom keys are supported for storing additional data.
	 *
	 * @param string $handle Name of the stylesheet.
	 * @param string $key    Name of data point (accepts any string).
	 * @param mixed  $value  String containing the data to be added.
	 *
	 * @return bool True on success, false on failure.
	 */
	function wp_style_add_data( $handle, $key, $value ) {
		return true;
	}
}

if ( ! function_exists( 'get_file_data' ) ) {
	/**
	 * Retrieve metadata from a file.
	 *
	 * @param string                    $file            Absolute path to the file.
	 * @param array<string, string>     $default_headers List of headers, in format array('HeaderKey' => 'Header Name').
	 * @param string                    $context         Optional. Context for filter hook. Default empty string.
	 *
	 * @return array<string, string> Array of file header values keyed by header name.
	 */
	function get_file_data( $file, $default_headers, $context = '' ) {
		return array();
	}
}
