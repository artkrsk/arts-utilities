<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait Taxonomies {
	/**
	 * Retrieves the names of taxonomy terms associated with a post.
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
	 * @param array       $taxonomies List of taxonomy objects.
	 * @param int|WP_Post $post Post ID or WP_Post object.
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
		$exclude_taxonomies = apply_filters( 'arts/utilities/taxonomies/exclude_taxonomies', $exclude_taxonomies );

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
}
