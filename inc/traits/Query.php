<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait Query {
	/**
	 * Retrieves a page by its title.
	 *
	 * @param string $page_title The title of the page to retrieve.
	 * @param string $output     Optional. The output type. Default is OBJECT.
	 * @param string $post_type  Optional. The post type. Default is 'page'.
	 * @return mixed|null The retrieved page object or null if not found.
	 */
	public static function get_page_by_title( $page_title, $output = OBJECT, $post_type = 'page' ) {
		$query = new \WP_Query(
			array(
				'post_type'              => $post_type,
				'title'                  => $page_title,
				'post_status'            => 'all',
				'posts_per_page'         => 1,
				'no_found_rows'          => true,
				'ignore_sticky_posts'    => true,
				'update_post_term_cache' => false,
				'update_post_meta_cache' => false,
				'orderby'                => 'date',
				'order'                  => 'ASC',
			)
		);

		if ( ! empty( $query->post ) ) {
			$_post = $query->post;

			if ( ARRAY_A === $output ) {
				return $_post->to_array();
			} elseif ( ARRAY_N === $output ) {
				return array_values( $_post->to_array() );
			}

			return $_post;
		}

		return null;
	}

		/**
		 * Fix for Intutive Custom Posts Order plugin
		 * when custom posts sorting in Elementor is applied
		 * Returns the original $_GET['orderby'] value
		 * for later restore.
		 * Call right before \WP_Query
		 *
		 * @param array $query_args - WP_Query arguments
		 * @return string
		 */
	public static function fix_query_hicpo_before( $query_args = array() ) {
		$should_alter_global_get = isset( $query_args['orderby'] ) && $query_args['orderby'] === 'post__in';
		$get_orderby             = isset( $_GET['orderby'] ) ? $_GET['orderby'] : null;

		if ( $should_alter_global_get ) {
			global $_GET;
			$_GET['orderby'] = 'post__in';
		}

		return $get_orderby;
	}

		/**
		 * Restores original $_GET['orderby'] value
		 * just in case it's used somewhere else.
		 * Call right after before \WP_Query
		 *
		 * @param string $get_orderby_value
		 * @return void
		 */
	public static function fix_query_hicpo_after( $get_orderby_value ) {
		$_GET['orderby'] = $get_orderby_value;
	}
}
