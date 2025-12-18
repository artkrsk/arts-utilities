<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * LoopedPosts Trait
 *
 * Provides utility methods for working with posts in a loop-like manner,
 * including retrieving previous and next posts with looping functionality.
 * Also includes methods for manual post iteration similar to WP_Query.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait LoopedPosts {
	/**
	 * Retrieves the previous and next posts in a looped manner based on the given arguments.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $args {
	 *   Optional. An array of arguments for retrieving the previous and next posts.
	 *
	 *   @type int    $post_id        The ID of the post. Default is the ID of the current post in global $post.
	 *   @type string $post_type      The post type to retrieve the previous and next posts from. Default is the post type of the current post.
	 *   @type bool   $in_same_term   Whether the previous and next posts should be in the same term as the current post. Default is false.
	 *   @type string $excluded_terms Comma-separated list of term IDs to exclude from the previous and next posts. Default is empty.
	 *   @type string $taxonomy       The taxonomy to use for retrieving the previous and next posts. Default is 'category'.
	 * }
	 *
	 * @return array{previous: \WP_Post|null, next: \WP_Post|null} An array containing the previous and next posts. If no previous or next posts are found, the corresponding key will be null.
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
		/** @var array<string, mixed> $args */

		$posts = self::get_posts( $args );

		if ( ! empty( $posts ) ) {
			$post_id_value = self::get_int_value( $args['post_id'] );
			$current_post_index = self::get_current_post_index( $posts, $post_id_value );

			if ( $current_post_index !== null ) {
				$next_post = self::get_next_post_in_loop( $posts, $current_post_index );
				$prev_post = self::get_previous_post_in_loop( $posts, $current_post_index );

				if ( $next_post instanceof \WP_Post || $next_post === null ) {
					$prev_next_posts['next'] = $next_post;
				}
				if ( $prev_post instanceof \WP_Post || $prev_post === null ) {
					$prev_next_posts['previous'] = $prev_post;
				}
			}
		}

		return $prev_next_posts;
	}

	/**
	 * Retrieves posts based on the provided arguments.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $args The arguments to customize the query.
	 * @return list<\WP_Post> The retrieved posts.
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
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $args The arguments for retrieving posts.
	 * @return array<string, mixed> The query arguments.
	 */
	private static function get_query_args( $args ) {
		$query_args = array(
			'post_type'      => $args['post_type'],
			'posts_per_page' => -1,
			'no_found_rows'  => true,
		);

		if ( $args['in_same_term'] ) {
			$post_id  = self::get_post_id( $args['post_id'] );
			$taxonomy = self::get_string_value( $args['taxonomy'] );

			if ( $post_id !== null ) {
				$current_terms = self::get_taxonomy_term_names( $post_id, $taxonomy );
			} else {
				$current_terms = array();
			}

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
	 * @since 1.0.0
	 *
	 * @param \WP_Query $loop The WordPress loop object.
	 * @return list<\WP_Post> An array of post objects.
	 */
	private static function get_posts_from_loop( $loop ) {
		$posts = array();

		if ( $loop->have_posts() ) {
			while ( $loop->have_posts() ) {
				$loop->the_post();
				$post = get_post();
				if ( $post instanceof \WP_Post ) {
					$posts[] = $post;
				}
			}
		}

		return $posts;
	}

	/**
	 * Get the index of the current post in the given array of posts.
	 *
	 * @since 1.0.0
	 *
	 * @param list<\WP_Post> $posts   An array of post objects.
	 * @param int   $post_id The ID of the post to find.
	 * @return int|null The index of the post in the array, or null if not found.
	 */
	private static function get_current_post_index( $posts, $post_id ) {
		foreach ( $posts as $index => $post ) {
			if ( is_object( $post ) && $post->ID === $post_id ) {
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
	 * @since 1.0.0
	 *
	 * @param list<\WP_Post> $posts              The array of posts.
	 * @param int   $current_post_index The index of the current post.
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
	 * @since 1.0.0
	 *
	 * @param list<\WP_Post> $posts             The array of posts.
	 * @param int   $current_post_index The index of the current post.
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

	/**
	 * Get the MOCK_DATA global as an array.
	 *
	 * @since 1.1.12
	 *
	 * @return array<string, mixed> The MOCK_DATA array.
	 */
	private static function get_mock_data() {
		global $MOCK_DATA;
		if ( ! isset( $MOCK_DATA ) ) {
			$MOCK_DATA = array();
		}
		$result = is_array( $MOCK_DATA ) ? $MOCK_DATA : array();
		/** @var array<string, mixed> $result */
		return $result;
	}

	/**
	 * Setup looped posts for iteration.
	 *
	 * @since 1.0.0
	 *
	 * @param list<\WP_Post> $posts Array of post objects.
	 * @return bool True if setup was successful, false otherwise.
	 */
	public function setup_looped_posts( $posts ) {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			$MOCK_DATA = array();
		}

		$MOCK_DATA['looped_posts']        = $posts;
		$MOCK_DATA['looped_posts_index']  = 0;
		$MOCK_DATA['looped_posts_count']  = count( $posts );
		$MOCK_DATA['current_looped_post'] = null;

		return ! empty( $posts );
	}

	/**
	 * Check if there are more posts in the loop.
	 *
	 * Similar to WP_Query's have_posts() method, this function checks
	 * if there are more posts available in the current loop and advances
	 * the internal index if there are.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if there are more posts, false otherwise.
	 */
	public function have_looped_posts() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return false;
		}

		if ( ! isset( $MOCK_DATA['looped_posts_index'] ) || ! isset( $MOCK_DATA['looped_posts_count'] ) ) {
			return false;
		}

		$index = is_int( $MOCK_DATA['looped_posts_index'] ) ? $MOCK_DATA['looped_posts_index'] : 0;
		$count = is_int( $MOCK_DATA['looped_posts_count'] ) ? $MOCK_DATA['looped_posts_count'] : 0;

		$have_posts = $index < $count;

		if ( $have_posts ) {
			$MOCK_DATA['looped_posts_index'] = $index + 1;
		}

		return $have_posts;
	}

	/**
	 * Get the current post in the loop.
	 *
	 * Similar to WP_Query's the_post() method, this function
	 * sets up the current post in the loop and returns it.
	 *
	 * @since 1.0.0
	 *
	 * @return object|null The current post, or null if no current post.
	 */
	public function the_looped_post() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return null;
		}

		if ( ! isset( $MOCK_DATA['looped_posts'] ) || ! isset( $MOCK_DATA['looped_posts_index'] ) ) {
			return null;
		}

		$posts = is_array( $MOCK_DATA['looped_posts'] ) ? $MOCK_DATA['looped_posts'] : array();
		$raw_index = $MOCK_DATA['looped_posts_index'];
		$index = is_int( $raw_index ) ? $raw_index - 1 : -1;

		if ( $index >= 0 && isset( $posts[ $index ] ) ) {
			$current_post = $posts[ $index ];
			if ( is_object( $current_post ) ) {
				$MOCK_DATA['current_looped_post'] = $current_post;
				return $current_post;
			}
		}

		return null;
	}

	/**
	 * Get a specific post from the loop by index.
	 *
	 * @since 1.0.0
	 *
	 * @param int $index The index of the post to retrieve.
	 * @return object|null The post at the specified index, or null if not found.
	 */
	public function get_looped_post( $index ) {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return null;
		}

		if ( ! isset( $MOCK_DATA['looped_posts'] ) ) {
			return null;
		}

		$posts = is_array( $MOCK_DATA['looped_posts'] ) ? $MOCK_DATA['looped_posts'] : array();

		if ( ! isset( $posts[ $index ] ) ) {
			return null;
		}

		$post = $posts[ $index ];
		return is_object( $post ) ? $post : null;
	}

	/**
	 * Rewind the looped posts to the beginning.
	 *
	 * Similar to WP_Query's rewind_posts() method, this function
	 * resets the loop to the beginning.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function rewind_looped_posts() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			$MOCK_DATA = array();
		}

		$MOCK_DATA['looped_posts_index']  = 0;
		$MOCK_DATA['current_looped_post'] = null;
	}

	/**
	 * Reset all looped posts data.
	 *
	 * Completely clears all looped posts data from the global variable.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function reset_looped_posts() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return;
		}

		unset( $MOCK_DATA['looped_posts'] );
		unset( $MOCK_DATA['looped_posts_index'] );
		unset( $MOCK_DATA['looped_posts_count'] );
		unset( $MOCK_DATA['current_looped_post'] );
	}

	/**
	 * Get the total number of posts in the loop.
	 *
	 * @since 1.0.0
	 *
	 * @return int The total number of posts.
	 */
	public function get_looped_posts_count() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return 0;
		}

		if ( ! isset( $MOCK_DATA['looped_posts_count'] ) ) {
			return 0;
		}

		$count = $MOCK_DATA['looped_posts_count'];
		return is_int( $count ) ? $count : 0;
	}

	/**
	 * Get the current post index in the loop.
	 *
	 * @since 1.0.0
	 *
	 * @return int The current post index.
	 */
	public function get_looped_post_index() {
		global $MOCK_DATA;
		if ( ! is_array( $MOCK_DATA ) ) {
			return 0;
		}

		if ( ! isset( $MOCK_DATA['looped_posts_index'] ) ) {
			return 0;
		}

		$index = $MOCK_DATA['looped_posts_index'];
		return is_int( $index ) ? $index : 0;
	}
}