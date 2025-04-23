<?php
/**
 * WordPress Taxonomy-related mock functions
 */

// Category and taxonomy functions
if ( ! function_exists( 'get_terms' ) ) {
	function get_terms( $args = array() ) {
		global $MOCK_DATA;

		// Legacy parameter format support
		if ( ! is_array( $args ) ) {
			return $MOCK_DATA['terms'] ?? array();
		}

		// Handle array format with taxonomies
		if ( is_array( $args ) && isset( $args['taxonomy'] ) ) {
			$taxonomy = $args['taxonomy'];
			$parent   = isset( $args['parent'] ) ? $args['parent'] : null;

			// If we have taxonomy terms data in the expected format
			if ( isset( $MOCK_DATA['taxonomy_terms'][ $taxonomy ] ) ) {
				// If parent is specified, filter terms by parent
				if ( $parent !== null ) {
					$filtered_terms = array();
					foreach ( $MOCK_DATA['taxonomy_terms'][ $taxonomy ] as $term ) {
						if ( $term['parent'] == $parent ) {
							$filtered_terms[] = (object) $term;
						}
					}
					return $filtered_terms;
				}

				// Return all terms for this taxonomy
				$terms = array();
				foreach ( $MOCK_DATA['taxonomy_terms'][ $taxonomy ] as $term ) {
					$terms[] = (object) $term;
				}
				return $terms;
			}
		}

		return $MOCK_DATA['terms'] ?? array();
	}
}

if ( ! function_exists( 'get_term' ) ) {
	function get_term( $term, $taxonomy = '', $output = OBJECT, $filter = 'raw' ) {
		global $MOCK_DATA;

		if ( isset( $MOCK_DATA['terms'][ $term ] ) ) {
			return (object) $MOCK_DATA['terms'][ $term ];
		}

		return null;
	}
}

if ( ! function_exists( 'get_term_by' ) ) {
	function get_term_by( $field, $value, $taxonomy, $output = OBJECT, $filter = 'raw' ) {
		global $MOCK_DATA;

		if ( isset( $MOCK_DATA['term_by'][ $field ][ $value ] ) ) {
			return (object) $MOCK_DATA['term_by'][ $field ][ $value ];
		}

		return false;
	}
}

if ( ! function_exists( 'get_term_link' ) ) {
	function get_term_link( $term, $taxonomy = '' ) {
		if ( is_object( $term ) ) {
			$term = $term->slug;
		}
		return "https://example.com/{$taxonomy}/{$term}";
	}
}

if ( ! function_exists( 'is_wp_error' ) ) {
	function is_wp_error( $thing ) {
		return false;
	}
}

if ( ! function_exists( 'get_ancestors' ) ) {
	function get_ancestors( $object_id, $object_type, $resource_type = '' ) {
		global $MOCK_DATA;
		return $MOCK_DATA['term_ancestors'][ $object_id ] ?? array();
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

if ( ! function_exists( 'get_categories' ) ) {
	function get_categories( $args = array() ) {
		global $MOCK_DATA;
		return $MOCK_DATA['categories'] ?? array();
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

if ( ! function_exists( 'single_cat_title' ) ) {
	function single_cat_title( $prefix = '', $display = true ) {
		global $MOCK_DATA;
		return $MOCK_DATA['cat_title'] ?? '';
	}
}

if ( ! function_exists( 'single_tag_title' ) ) {
	function single_tag_title( $prefix = '', $display = true ) {
		global $MOCK_DATA;
		return $MOCK_DATA['tag_name'] ?? '';
	}
}

// WordPress conditional functions for taxonomy pages
if ( ! function_exists( 'is_category' ) ) {
	function is_category( $category_id = null ) {
		global $MOCK_DATA;
		if ( $category_id !== null ) {
			return isset( $MOCK_DATA['current_category_id'] ) && $MOCK_DATA['current_category_id'] === $category_id;
		}
		return $MOCK_DATA['is_category'] ?? false;
	}
}

if ( ! function_exists( 'is_tag' ) ) {
	function is_tag() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_tag'] ?? false;
	}
}

if ( ! function_exists( 'is_tax' ) ) {
	function is_tax() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_tax'] ?? false;
	}
}

if ( ! function_exists( 'is_archive' ) ) {
	function is_archive() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_archive'] ?? false;
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
