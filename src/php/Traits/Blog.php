<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Blog Trait
 *
 * Provides utility methods for working with blog-related functionality
 * including pagination and pingback handling.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Blog {
	/**
	 * Outputs the pingback link markup if the current post is singular and pings are open.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function get_link_rel_pingback_markup() {
		?>
		<?php if ( is_singular() && pings_open() ) : ?>
			<link rel="pingback" href="<?php echo esc_url( get_bloginfo( 'pingback_url' ) ); ?>">
		<?php endif; ?>
		<?php
	}

	/**
	 * Get pagination link attributes for navigation links.
	 *
	 * Generates a set of attributes that can be used for pagination links,
	 * with support for next/previous links.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $attributes Default attributes to merge with. Default empty array.
	 * @param string $type       The type of pagination link ('next' or 'prev'). Default 'prev'.
	 * @return string HTML attributes string for the pagination link.
	 */
	public static function get_pagination_link_attributes( $attributes = array(), $type = 'prev' ) {
		$default_attributes = array(
			'class' => array( 'page-numbers' ),
		);

		if ( isset( $attributes['class'] ) && is_string( $attributes['class'] ) ) {
			// Convert string to array
			$attributes['class'] = explode( ' ', $attributes['class'] );
		}

		if ( $type === 'next' ) {
			$default_attributes['class'][] = 'next';
		} elseif ( $type === 'prev' ) {
			$default_attributes['class'][] = 'prev';
		}

		$attributes = self::parse_args_recursive( $attributes, $default_attributes );

		return self::print_attributes( $attributes, false );
	}

	/**
	 * Modify category archive links to wrap post count in a span element.
	 *
	 * This method can be used as a callback for the 'wp_list_categories' filter
	 * to wrap category post counts in span elements for better styling control.
	 *
	 * @since 1.0.16
	 *
	 * @param string $links The category archive links.
	 * @return string Modified category archive links with post count wrapped in a span.
	 */
	public static function cat_count_span( $links ) {
		$links = str_replace( '</a> (', '</a><span>', $links );
		$links = str_replace( ')', '</span>', $links );

		return $links;
	}

	/**
	 * Modify archive links to wrap post count in a span element.
	 *
	 * This method can be used as a callback for the 'get_archives_link' filter
	 * to wrap archive post counts in span elements for better styling control.
	 *
	 * @since 1.0.16
	 *
	 * @param string $links The archive links.
	 * @return string Modified archive links with post count wrapped in a span.
	 */
	public static function archive_count_span( $links ) {
		$links = str_replace( '</a>&nbsp;(', '</a><span>', $links );
		$links = str_replace( ')', '</span>', $links );

		return $links;
	}
}
