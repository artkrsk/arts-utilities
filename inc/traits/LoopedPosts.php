<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait LoopedPosts {
	/**
	 * Retrieves the previous and next posts in a looped manner based on the given arguments.
	 *
	 * @param array $args {
	 *     Optional. An array of arguments for retrieving the previous and next posts.
	 *
	 *     @type int    $post_id        The ID of the current post. Default is the ID of the current post in the loop.
	 *     @type string $post_type      The post type to retrieve the previous and next posts from. Default is the post type of the current post.
	 *     @type bool   $in_same_term   Whether the previous and next posts should be in the same term as the current post. Default is false.
	 *     @type string $excluded_terms Comma-separated list of term IDs to exclude from the previous and next posts. Default is empty.
	 *     @type string $taxonomy       The taxonomy to use for retrieving the previous and next posts. Default is 'category'.
	 * }
	 * @return array An array containing the previous and next posts. If no previous or next posts are found, the corresponding key will be null.
	 */
	public static function get_prev_next_posts_looped( $args = array() ) {
		$current_post_index = null;
		$prev_next_posts    = array(
			'previous' => null,
			'next'     => null,
		);

		$defaults = array(
			'post_id'        => get_the_ID(),
			'post_type'      => get_post_type(),
			'in_same_term'   => false,
			'excluded_terms' => '',
			'taxonomy'       => 'category',
		);

		$args = wp_parse_args( $args, $defaults );

		$posts = self::get_posts( $args );

		if ( ! empty( $posts ) ) {
			$current_post_index = self::get_current_post_index( $posts, $args['post_id'] );

			$prev_next_posts['next']     = self::get_next_post_in_loop( $posts, $current_post_index );
			$prev_next_posts['previous'] = self::get_previous_post_in_loop( $posts, $current_post_index );
		}

		return $prev_next_posts;
	}

	/**
	 * Retrieves posts based on the provided arguments.
	 *
	 * @param array $args The arguments to customize the query.
	 * @return array The retrieved posts.
	 */
	private static function get_posts( $args ) {
		$query_args = self::get_query_args( $args );
		$loop       = new \WP_Query( $query_args );
		$posts      = self::get_posts_from_loop( $loop );
		wp_reset_postdata();

		return $posts;
	}

	/**
	 * Retrieves the query arguments for retrieving posts.
	 *
	 * @param array $args The arguments for retrieving posts.
	 * @return array The query arguments.
	 */
	private static function get_query_args( $args ) {
		$query_args = array(
			'post_type'      => $args['post_type'],
			'posts_per_page' => -1,
			'no_found_rows'  => true,
		);

		if ( $args['in_same_term'] ) {
			$current_terms = self::get_taxonomy_term_names( $args['post_id'], $args['taxonomy'] );

			if ( ! empty( $current_terms ) ) {
				$terms = array_map(
					function( $term ) {
						return $term['slug'];
					},
					$current_terms
				);

				$query_args['tax_query'] = array(
					array(
						'taxonomy' => $args['taxonomy'],
						'field'    => 'slug',
						'terms'    => $terms,
					),
				);
			}
		}

		return $query_args;
	}

	/**
	 * Retrieves an array of posts from a WordPress loop.
	 *
	 * @param WP_Query $loop The WordPress loop object.
	 * @return array An array of post objects.
	 */
	private static function get_posts_from_loop( $loop ) {
		$posts = array();

		if ( $loop->have_posts() ) {
			while ( $loop->have_posts() ) {
				$loop->the_post();
				$posts[] = get_post();
			}
		}

		return $posts;
	}

	/**
	 * Get the index of the current post in the given array of posts.
	 *
	 * @param array $posts An array of post objects.
	 * @param int   $post_id The ID of the post to find.
	 * @return int|null The index of the post in the array, or null if not found.
	 */
	private static function get_current_post_index( $posts, $post_id ) {
		foreach ( $posts as $index => $post ) {
			if ( $post->ID === $post_id ) {
				return $index;
			}
		}

		return null;
	}

	/**
	 * Retrieves the next post in a loop.
	 *
	 * This function takes an array of posts and the index of the current post,
	 * and returns the next post in the loop. If the current post is the last post
	 * in the array, it wraps around and returns the first post. If the next post
	 * index is within the array bounds, it returns the post at that index.
	 *
	 * @param array $posts              The array of posts.
	 * @param int   $current_post_index The index of the current post.
	 *
	 * @return mixed|null The next post in the loop, or null if there is no next post.
	 */
	private static function get_next_post_in_loop( $posts, $current_post_index ) {
		$next_index      = $current_post_index + 1;
		$last_post_index = count( $posts ) - 1;

		if ( $next_index > $last_post_index ) {
			return $posts[0];
		} elseif ( array_key_exists( $next_index, $posts ) ) {
			return $posts[ $next_index ];
		}

		return null;
	}

	/**
	 * Retrieves the previous post in a loop.
	 *
	 * This function takes an array of posts and the index of the current post,
	 * and returns the previous post in the loop. If the current post is the first
	 * post in the loop, it returns the last post in the array.
	 *
	 * @param array $posts             The array of posts.
	 * @param int   $current_post_index The index of the current post.
	 *
	 * @return mixed|null The previous post in the loop, or null if not found.
	 */
	private static function get_previous_post_in_loop( $posts, $current_post_index ) {
		$prev_index = $current_post_index - 1;

		if ( $prev_index < 0 ) {
			return $posts[ count( $posts ) - 1 ];
		} elseif ( array_key_exists( $prev_index, $posts ) ) {
			return $posts[ $prev_index ];
		}

		return null;
	}
}
