<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Query Trait
 *
 * Provides utility methods for working with WordPress queries,
 * retrieving posts, categories, and handling various query-related tasks.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Query {
	/**
	 * Retrieves a page by its title.
	 *
	 * @since 1.0.0
	 *
	 * @param string $page_title The title of the page to retrieve.
	 * @param string $output     Optional. The output type. Default is OBJECT.
	 * @param string $post_type  Optional. The post type. Default is 'page'.
	 *
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
	 * Get the page titles, subtitles, and descriptions based on the current context.
	 *
	 * @since 1.0.0
	 *
	 * @return array $titles {
	 *   An associative array containing the page title, subtitle, and description.
	 *
	 *   @type string $title       The page title.
	 *   @type string $subtitle    The page subtitle.
	 *   @type string $description The page description.
	 * }
	 *
	 * @filter `arts/utilities/get_page_titles/acf_fields` Allows customization of ACF fields used for subtitle and description.
	 * @filter `arts/utilities/get_page_titles/strings`    Allows customization of default strings for various contexts.
	 * @filter `arts/utilities/get_page_titles/titles`     Allows customization of the final titles array before it is returned.
	 */
	public static function get_page_titles() {
		$page_title       = '';
		$page_subtitle    = '';
		$page_description = '';
		$titles           = array(
			'title'       => '',
			'subtitle'    => '',
			'description' => '',
		);
		$acf_fields       = apply_filters(
			'arts/utilities/get_page_titles/acf_fields',
			array(
				'subtitle'    => 'subheading',
				'description' => 'description',
			)
		);
		$strings          = apply_filters(
			'arts/utilities/get_page_titles/strings',
			array(
				'category' => esc_html__( 'Posts in category', 'arts-utilities' ),
				'author'   => esc_html__( 'Posts by author', 'arts-utilities' ),
				'tag'      => esc_html__( 'Posts with tag', 'arts-utilities' ),
				'day'      => esc_html__( 'Day archive', 'arts-utilities' ),
				'month'    => esc_html__( 'Month archive', 'arts-utilities' ),
				'year'     => esc_html__( 'Year archive', 'arts-utilities' ),
				'search'   => esc_html__( 'Search', 'arts-utilities' ),
				'blog'     => esc_html__( 'Blog', 'arts-utilities' ),
			)
		);

		if ( self::is_built_with_elementor() ) {
			$page_title = get_the_title();

			if ( isset( $acf_fields['subtitle'] ) ) {
				$page_subtitle = self::acf_get_field( $acf_fields['subtitle'] );
			}

			if ( isset( $acf_fields['description'] ) ) {
				$page_description = self::acf_get_field( $acf_fields['description'] );
			}
		} elseif ( self::is_woocommerce_archive() ) {
			$page_title = self::get_woocommerce_page_title();
		} elseif ( is_category() ) {
			$page_title    = get_category( get_query_var( 'cat' ) )->name;
			$page_subtitle = $strings['category'];
		} elseif ( is_author() ) {
			$page_title    = get_userdata( get_query_var( 'author' ) )->display_name;
			$page_subtitle = $strings['author'];
		} elseif ( is_tag() ) {
			$page_title    = single_tag_title( '', false );
			$page_subtitle = $strings['tag'];
		} elseif ( is_day() ) {
			$page_title    = get_the_date();
			$page_subtitle = $strings['day'];
		} elseif ( is_month() ) {
			$page_title    = get_the_date( 'F Y' );
			$page_subtitle = $strings['month'];
		} elseif ( is_year() ) {
			$page_title    = get_the_date( 'Y' );
			$page_subtitle = $strings['year'];
		} elseif ( is_home() ) {
			$posts_page_id = get_option( 'page_for_posts' );
			if ( $posts_page_id ) {
				$page_title = get_the_title( $posts_page_id );

				if ( isset( $acf_fields['subtitle'] ) ) {
					$page_subtitle = self::acf_get_field( $acf_fields['subtitle'], $posts_page_id );
				}

				if ( isset( $acf_fields['description'] ) ) {
					$page_description = self::acf_get_field( $acf_fields['description'], $posts_page_id );
				}
			} else {
				// Fallback for when no static posts page is set
				$page_title = $strings['blog'];
			}
		} elseif ( is_search() ) {
			$page_title = $strings['search'];
		} else {
			$page_title = get_the_title();
		}

		// Fallback page title.
		if ( ! $page_title ) {
			$page_title = $strings['blog'];
		}

		// Fallback page description.
		if ( ! $page_description ) {
			$page_description = get_the_archive_description();
		}

		$titles['title']       = $page_title;
		$titles['subtitle']    = $page_subtitle;
		$titles['description'] = $page_description;

		return apply_filters( 'arts/utilities/get_page_titles/titles', $titles );
	}

	/**
	 * Retrieve all uploaded font attachments.
	 *
	 * @since 1.0.0
	 *
	 * @return array List of uploaded font files with their ID, permalink, and filetype.
	 */
	public static function get_uploaded_fonts() {
		$result     = array();
		$query_args = array(
			'posts_per_page' => -1,
			'post_type'      => 'attachment',
			'post_mime_type' => 'font',
			'post_status'    => array(
				'publish',
				'inherit',
			),
			'fields'         => 'ids', // Optimize query by retrieving only IDs
		);

		$loop = new \WP_Query( $query_args );

		if ( $loop->have_posts() ) {
			while ( $loop->have_posts() ) {
				$loop->the_post();
				$id        = get_the_ID();
				$permalink = wp_get_attachment_url( $id );
				$filetype  = wp_check_filetype( $permalink );

				$result[] = array(
					'ID'        => $id,
					'permalink' => $permalink,
					'filetype'  => $filetype,
				);
			}

			wp_reset_postdata();
		}

		return $result;
	}

	/**
	 * Fix for Intutive Custom Posts Order plugin
	 * when custom posts sorting in Elementor is applied.
	 * Returns the original $_GET['orderby'] value for later restore.
	 * Call it right before \WP_Query.
	 *
	 * @since 1.0.0
	 *
	 * @param array $query_args - WP_Query arguments
	 *
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
	 * Restores the original $_GET['orderby'] value
	 * just in case it's used somewhere else.
	 * Call right after \WP_Query.
	 *
	 * @since 1.0.0
	 *
	 * @param string $get_orderby_value
	 *
	 * @return void
	 */
	public static function fix_query_hicpo_after( $get_orderby_value ) {
		$_GET['orderby'] = $get_orderby_value;
	}

	/**
	 * Retrieves categories of posts based on the specified mode.
	 *
	 * @deprecated 2.0.0 Use get_posts_terms() instead.
	 * @since 1.0.0
	 */
	public static function get_posts_categories( $mode = 'all', $args = array() ) {
		// Forward to the new method
		return self::get_posts_terms( $mode, $args, 'category' );
	}

	/**
	 * Retrieves terms (categories/tags) of posts based on the specified mode.
	 *
	 * @since 1.0.24
	 *
	 * @param string $mode The mode of retrieval.
	 * @param array  $args Optional arguments.
	 * @param string $taxonomy The taxonomy to retrieve. Default 'category'.
	 *
	 * @return array An array of terms with their details.
	 */
	public static function get_posts_terms( $mode = 'all', $args = array(), $taxonomy = 'category' ) {
		$result = array();

		$defaults = array(
			'post_type'      => 'post',
			'posts_per_page' => null,
			'orderby'        => null,
			'order'          => null,
		);

		$args = wp_parse_args( $args, $defaults );

		$query_args = array(
			'post_type'      => $args['post_type'],
			'posts_per_page' => $args['posts_per_page'],
			'orderby'        => $args['orderby'],
			'order'          => $args['order'],
			'no_found_rows'  => true,
		);

		if ( ! is_singular() && $mode === 'current_page' ) {
			$sync_global_query_vars = array(
				'paged',
				'cat',
				'tag_id',
				'tag',
			);

			foreach ( $sync_global_query_vars as $var ) {
				$value = get_query_var( $var );
				if ( $value ) {
					$query_args[ $var ] = $value;
				}
			}
		}

		$loop = new \WP_Query( $query_args );

		if ( $loop->have_posts() ) {
			if ( $mode === 'current_page' ) {
				while ( $loop->have_posts() ) {
					$loop->the_post();
					$terms = get_the_terms( get_the_ID(), $taxonomy );

					if ( ! empty( $terms ) ) {
						foreach ( $terms as $term ) {
							if ( array_key_exists( $term->term_id, $result ) ) {
								$result[ $term->term_id ]['total'] += 1;
							} else {
								$result[ $term->term_id ] = array(
									'id'      => $term->term_id,
									'name'    => $term->name,
									'slug'    => $term->slug,
									'total'   => 1,
									'current' => ( $taxonomy === 'category' && is_category( $term->term_id ) ) || ( $taxonomy === 'post_tag' && is_tag( $term->term_id ) ),
								);
							}
						}
					}
				}
			} else {
				$posts_terms = get_terms( array( 'taxonomy' => $taxonomy ) );

				if ( ! empty( $posts_terms ) ) {
					foreach ( $posts_terms as $term ) {
						$result[] = array(
							'id'      => $term->term_id,
							'slug'    => $term->slug,
							'name'    => $term->name,
							'url'     => get_term_link( $term->term_id, $taxonomy ),
							'total'   => $term->count,
							'current' => ( $taxonomy === 'category' && is_category( $term->term_id ) ) || ( $taxonomy === 'post_tag' && is_tag( $term->term_id ) ),
						);
					}
				}
			}

			wp_reset_postdata();
		}

		return $result;
	}

	/**
	 * Retrieves the author information for a given post.
	 * Can be used outside of WordPress loop
	 *
	 * @since 1.0.0
	 *
	 * @param int|null $post_id The ID of the post. Default is null.
	 * @return array {
	 *   Array of author information.
	 *
	 *   @type int    $id     The author ID.
	 *   @type string $name   The author's display name.
	 *   @type string $url    The URL to the author's posts.
	 *   @type string $avatar The URL to the author's avatar.
	 * }
	 */
	public static function get_post_author( $post_id = null ) {
		$result = array(
			'id'     => 0,
			'name'   => '',
			'url'    => '',
			'avatar' => '',
		);

		if ( ! $post_id ) {
			global $post;

			if ( isset( $post ) ) {
				$post_id = $post->ID;
			} else {
				return $result;
			}
		}

		$author_id = get_post_field( 'post_author', $post_id );

		if ( ! $author_id ) {
			return $result;
		}

		$result['id'] = $author_id;

		$author_name = get_the_author_meta( 'display_name', $author_id );

		if ( $author_name ) {
			$result['name'] = esc_html( $author_name );
		}

		$author_avatar = get_avatar_url( $author_id );

		if ( $author_avatar ) {
			$result['avatar'] = esc_url( $author_avatar );
		}

		$author_url = get_author_posts_url( $author_id );

		if ( $author_url ) {
			$result['url'] = esc_url( $author_url );
		}

		return $result;
	}
}
