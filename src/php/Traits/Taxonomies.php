<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Taxonomies Trait
 *
 * Provides utility methods for working with WordPress taxonomies and terms,
 * including retrieving terms, building term hierarchies, and getting term information.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Taxonomies {
	/**
	 * Retrieves the names of taxonomy terms associated with a post.
	 *
	 * @since 1.0.0
	 *
	 * @param int|WP_Post $post     The post ID or object.
	 * @param string      $taxonomy The taxonomy name.
	 *
	 * @return array An array of taxonomy term names, slugs, and URLs.
	 */
	public static function get_taxonomy_term_names( $post, $taxonomy ) {
		$items  = get_the_terms( $post, $taxonomy );
		$result = array();

		if ( is_array( $items ) ) {
			foreach ( $items as $item ) {
				$term         = $item->slug;
				$name         = $item->name;
				$current_item = array(
					'slug' => $term,
					'name' => $name,
					'url'  => get_term_link( $term, $taxonomy ),
				);

				// don't add the same item multiple times
				if ( ! in_array( $result, $current_item ) ) {
					array_push( $result, $current_item );
				}
			}
		}

		return $result;
	}

	/**
	 * Retrieve post terms for specified taxonomies.
	 *
	 * @since 1.0.0
	 *
	 * @param array       $taxonomies List of taxonomy objects.
	 * @param int|WP_Post $post       Post ID or WP_Post object.
	 *
	 * @return array List of terms grouped by taxonomy.
	 */
	public static function get_post_terms( $taxonomies, $post ) {
		$result = array();

		if ( empty( $taxonomies ) || ! is_array( $taxonomies ) || ! $post ) {
			return $result;
		}

		$exclude_taxonomies = array(
			'translation_priority', // WPML
			// PolyLang
			'post_translations',
			'language',
			'product_type',
			'product_visibility',
			'product_shipping_class',
			false,
		);
		$exclude_taxonomies = apply_filters( 'arts/utilities/taxonomies/get_post_terms/exclude_taxonomies', $exclude_taxonomies );

		foreach ( $taxonomies as $taxonomy ) {
			$taxonomy_terms = get_the_terms(
				$post,
				$taxonomy->name
			);

			if ( ! in_array( $taxonomy->name, $exclude_taxonomies ) ) {
				$terms = array();

				if ( ! empty( $taxonomy_terms ) ) {
					foreach ( $taxonomy_terms as $term ) {
						$terms[] = array(
							'id'   => $term->term_id,
							'slug' => $term->slug,
							'name' => $term->name,
						);
					}
				}

				$result[] = array(
					'id'    => $taxonomy->name,
					'name'  => $taxonomy->labels->name,
					'terms' => $terms,
				);
			}
		}

		return $result;
	}

	/**
	 * Generates a tax query array based on given term IDs.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $terms    Array of term IDs.
	 * @param string $operator Optional. The logical relationship between each inner taxonomy array when there is more than one. Default 'IN'.
	 *
	 * @return array The tax query array.
	 */
	public static function get_tax_query( $terms, $operator = 'IN' ) {
		$result     = array();
		$taxonomies = array();

		foreach ( $terms as $term_id ) {
			$term = get_term( $term_id );

			if ( ! array_key_exists( $term->taxonomy, $taxonomies ) ) {
				$taxonomies[ $term->taxonomy ] = array(
					'name'  => $term->taxonomy,
					'terms' => array(),
				);
			}

			$taxonomies[ $term->taxonomy ]['terms'][] = $term_id;
		}

		foreach ( $taxonomies as $taxonomy ) {
			$result[] = array(
				'taxonomy' => $taxonomy['name'],
				'field'    => 'term_id',
				'terms'    => $taxonomy['terms'],
				'operator' => $operator,
			);
		}

		return $result;
	}

	/**
	 * Get a list of term ancestors for a given term.
	 *
	 * @since 1.0.0
	 *
	 * @param int    $term_id  The term ID.
	 * @param string $taxonomy The taxonomy name.
	 * @param string $order    The sort order of the ancestors. Default 'ASC'.
	 * @param array  $fields   The fields to return for each ancestor. Default array('term_id', 'name', 'slug').
	 *
	 * @return array Array of term ancestors.
	 */
	public static function get_term_ancestors_list( $term_id, $taxonomy, $order = 'ASC', $fields = array( 'term_id', 'name', 'slug' ) ) {
		$ancestors = get_ancestors( $term_id, $taxonomy, 'taxonomy' );
		$result    = array();

		if ( ! empty( $ancestors ) ) {
			// Reverse the order if needed
			if ( $order === 'DESC' ) {
				$ancestors = array_reverse( $ancestors );
			}

			foreach ( $ancestors as $ancestor_id ) {
				$term = get_term( $ancestor_id, $taxonomy );

				if ( $term && ! is_wp_error( $term ) ) {
					$ancestor = array();

					// Include only requested fields
					foreach ( $fields as $field ) {
						if ( isset( $term->$field ) ) {
							$ancestor[ $field ] = $term->$field;
						}
					}

					$result[] = $ancestor;
				}
			}
		}

		return $result;
	}

	/**
	 * Build a hierarchical tree of taxonomy terms.
	 *
	 * @since 1.0.0
	 *
	 * @param string $taxonomy The taxonomy name.
	 * @param int    $parent   The parent term ID. Default 0.
	 *
	 * @return array Hierarchical array of terms.
	 */
	public static function get_taxonomy_hierarchy( $taxonomy, $parent = 0 ) {
		// Get all terms for the taxonomy
		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'parent'     => $parent,
			)
		);

		$result = array();

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				// Get term children
				$children = self::get_taxonomy_hierarchy( $taxonomy, $term->term_id );

				// Add term with its children to result
				$result[] = array(
					'term_id'  => $term->term_id,
					'name'     => $term->name,
					'slug'     => $term->slug,
					'children' => $children,
				);
			}
		}

		return $result;
	}

	/**
	 * Get a term by a specific field.
	 *
	 * @since 1.0.0
	 *
	 * @param string $field    The field to get the term by (slug, id, name, etc.).
	 * @param mixed  $value    The value to search for.
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return array|false Term array on success, false on failure.
	 */
	public static function get_term_by( $field, $value, $taxonomy ) {
		$term = get_term_by( $field, $value, $taxonomy );

		if ( $term && ! is_wp_error( $term ) ) {
			return array(
				'term_id'  => $term->term_id,
				'name'     => $term->name,
				'slug'     => $term->slug,
				'taxonomy' => $term->taxonomy,
			);
		}

		return false;
	}
}