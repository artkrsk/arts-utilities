<?php
/**
 * WordPress Author and User-related mock functions
 */

// Author functions
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

if ( ! function_exists( 'get_userdata' ) ) {
	function get_userdata( $user_id ) {
		global $MOCK_DATA;
		return (object) array(
			'display_name' => $MOCK_DATA['author_display_name'] ?? '',
		);
	}
}

if ( ! function_exists( 'is_author' ) ) {
	function is_author() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_author'] ?? false;
	}
}
