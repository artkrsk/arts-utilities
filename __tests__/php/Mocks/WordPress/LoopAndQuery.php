<?php
/**
 * WordPress Query and Loop mock functions
 */

// WordPress Post and Query functions
class WP_Post {
	public $ID;

	public function __construct( $args = array() ) {
		foreach ( $args as $key => $value ) {
			$this->$key = $value;
		}
	}

	public function to_array() {
		return get_object_vars( $this );
	}
}

class WP_Query {
	public $posts        = array();
	public $post         = null;
	public $current_post = -1;
	public $post_count   = 0;

	public function __construct( $args = array() ) {
		global $MOCK_DATA;

		// If we have specific post data in the mock data, use it
		if ( isset( $MOCK_DATA['wp_query_data']['posts'] ) && is_array( $MOCK_DATA['wp_query_data']['posts'] ) ) {
			$this->posts      = $MOCK_DATA['wp_query_data']['posts'];
			$this->post_count = count( $this->posts );

			if ( $this->post_count > 0 ) {
				$this->post                = $this->posts[0];
				$MOCK_DATA['current_post'] = $this->post;
			}
		}

		// If mock data has a specific post for this query, use it
		if ( isset( $MOCK_DATA['wp_query_data']['post'] ) ) {
			$this->post                = $MOCK_DATA['wp_query_data']['post'];
			$this->posts               = array( $this->post );
			$this->post_count          = 1;
			$MOCK_DATA['current_post'] = $this->post;
		}

		// If querying by title, check if the mock post title matches
		if ( isset( $args['title'] ) && isset( $MOCK_DATA['wp_query_data']['post'] ) ) {
			$mock_post = $MOCK_DATA['wp_query_data']['post'];
			if ( $mock_post->post_title != $args['title'] ) {
				$this->post       = null;
				$this->posts      = array();
				$this->post_count = 0;
			}
		}

		// Check if we're querying for a specific post type
		if ( isset( $args['post_type'] ) && isset( $MOCK_DATA['wp_query_data']['post'] ) ) {
			$mock_post = $MOCK_DATA['wp_query_data']['post'];
			if ( $mock_post->post_type != $args['post_type'] ) {
				$this->post       = null;
				$this->posts      = array();
				$this->post_count = 0;
			}
		}
	}

	public function have_posts() {
		return ( $this->current_post + 1 < $this->post_count );
	}

	public function the_post() {
		global $MOCK_DATA;

		$this->current_post++;
		if ( isset( $this->posts[ $this->current_post ] ) ) {
			$this->post                = $this->posts[ $this->current_post ];
			$MOCK_DATA['current_post'] = $this->post;
		}
	}
}

// Post-related functions
function get_post( $post_id = null ) {
	global $MOCK_DATA;

	if ( is_null( $post_id ) ) {
		return $MOCK_DATA['current_post'] ?? null;
	}

	if ( ! isset( $MOCK_DATA['wp_query_data']['posts'] ) || ! is_array( $MOCK_DATA['wp_query_data']['posts'] ) ) {
		return null;
	}

	foreach ( $MOCK_DATA['wp_query_data']['posts'] as $post ) {
		if ( $post->ID === $post_id ) {
			return $post;
		}
	}

	return null;
}

// Only define if it doesn't exist already
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

// Only define if it doesn't exist already
if ( ! function_exists( 'get_post_type' ) ) {
	function get_post_type( $post = null ) {
		global $MOCK_DATA, $post;
		if ( is_null( $post ) ) {
			return $MOCK_DATA['current_post_type'] ?? 'post';
		}
		return $post->post_type ?? 'post';
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_the_ID' ) ) {
	function get_the_ID() {
		global $MOCK_DATA, $post;

		if ( isset( $post ) && isset( $post->ID ) ) {
			return $post->ID;
		}

		return $MOCK_DATA['current_post_id'] ?? 0;
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_the_title' ) ) {
	function get_the_title() {
		global $MOCK_DATA;
		return $MOCK_DATA['the_title'] ?? '';
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_the_category' ) ) {
	function get_the_category() {
		global $MOCK_DATA, $post;
		return $MOCK_DATA['post_categories'][ $post->ID ] ?? array();
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_the_date' ) ) {
	function get_the_date( $format = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['the_date'] ?? '';
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_the_archive_description' ) ) {
	function get_the_archive_description() {
		global $MOCK_DATA;
		return $MOCK_DATA['archive_description'] ?? '';
	}
}

function get_taxonomy_term_names( $post_id, $taxonomy ) {
	global $MOCK_DATA;
	return $MOCK_DATA['taxonomy_terms'][ $post_id ] ?? array();
}

// Only define if it doesn't exist already
if ( ! function_exists( 'wp_reset_postdata' ) ) {
	function wp_reset_postdata() {
		// No-op
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'get_query_var' ) ) {
	// Query functions
	function get_query_var( $var ) {
		global $MOCK_DATA;
		return $MOCK_DATA[ $var ] ?? null;
	}
}

// Only define if it doesn't exist already
if ( ! function_exists( 'wp_title' ) ) {
	function wp_title( $sep = '', $display = true, $seplocation = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['wp_title'] ?? '';
	}
}
