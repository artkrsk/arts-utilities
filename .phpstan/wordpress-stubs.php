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
		 * @return int
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
