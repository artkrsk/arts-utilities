<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Markup Trait
 *
 * Provides utility methods for generating HTML markup,
 * working with HTML attributes, and handling components.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Markup {
	/**
	 * Like wp_parse_args but supports recursivity
	 * By default converts the returned type based on the $args and $defaults
	 *
	 * @since 1.0.0
	 *
	 * @param array|object $args           Array or object that contains the user-defined values.
	 * @param array|object $defaults       Array, Object that serves as the defaults or string.
	 * @param boolean      $preserve_type  Optional. Convert output array into object if $args or $defaults if it is. Default true.
	 * @param boolean      $preserve_integer_keys Optional. If given, integer keys will be preserved and merged instead of appended.
	 *
	 * @return array|object $output Merged user defined values with defaults.
	 */
	public static function parse_args_recursive( $args, $defaults, $preserve_type = true, $preserve_integer_keys = false ) {
		$output = array();

		foreach ( array( $defaults, $args ) as $list ) {
			$output = self::merge_lists( $output, $list, $preserve_integer_keys );
		}

		return self::convert_output_type( $output, $args, $defaults, $preserve_type );
	}

	/**
	 * Get component attributes as an array.
	 *
	 * This method modifies the given attributes array by adding component-specific
	 * attributes based on the provided arguments. It ensures that the component
	 * name, options, and animation status are included in the attributes array.
	 *
	 * @since 1.0.0
	 *
	 * @param array        $attributes    Existing attributes.
	 * @param array        $args {
	 *  Optional. Arguments to modify component attributes.
	 *
	 *  @type string $name         Component name. Default 'MyComponent'.
	 *  @type array  $options      Component options. Default empty array.
	 *  @type bool   $hasAnimation Whether the component has animation. Default false.
	 * }
	 * @param array|string $exclude_names Names to exclude from adding to attributes. Default empty array.
	 *
	 * @return array Modified attributes.
	 */
	public static function get_component_attributes( $attributes = array(), $args = array(), $exclude_names = array( 'PSWP' ) ) {
		$defaults = array(
			'name'         => 'MyComponent',
			'options'      => array(),
			'hasAnimation' => false,
		);

		$args = wp_parse_args( $args, $defaults );

		// Ensure $exclude_names is an array
		if ( ! is_array( $exclude_names ) ) {
			$exclude_names = (array) $exclude_names;
		}

		if ( ! empty( $args['name'] ) ) {
			if ( ! in_array( $args['name'], $exclude_names, true ) ) {
				$kebab_case_name = self::convert_camel_to_kebab_case( $args['name'] );
				$class_is_array  = array_key_exists( 'class', $attributes ) && is_array( $attributes['class'] );

				if ( $class_is_array ) {
					$attributes['class'][] = $kebab_case_name;
					$attributes['class'][] = 'js-' . $kebab_case_name;
				} else {
					$attributes['class'] = array( $kebab_case_name, 'js-' . $kebab_case_name );
				}
			}

			$attribute_component_name                = esc_attr( apply_filters( 'arts/utilities/markup/add_component_attributes/attribute_name', 'data-arts-component-name' ) );
			$attributes[ $attribute_component_name ] = esc_attr( $args['name'] );

			if ( is_array( $args['options'] ) && ! empty( $args['options'] ) ) {
				$attribute_component_options                = esc_attr( apply_filters( 'arts/utilities/markup/add_component_attributes/attribute_options', 'data-arts-component-options' ) );
				$attributes[ $attribute_component_options ] = wp_json_encode( $args['options'] );
			}

			if ( $args['hasAnimation'] ) {
				$attribute_component_animation                = esc_attr( apply_filters( 'arts/utilities/markup/add_component_attributes/attribute_animation', 'data-arts-os-animation' ) );
				$attributes[ $attribute_component_animation ] = 'true';
			}
		}

		return $attributes;
	}

	/**
	 * Prints or returns HTML attributes from an associative array.
	 *
	 * @since 1.0.0
	 *
	 * @param array $attributes Associative array of attributes and their values.
	 * @param bool  $echo       Optional. Whether to echo the attributes. Default true.
	 *
	 * @return string|null The HTML attributes string if $echo is false, otherwise null.
	 */
	public static function print_attributes( $attributes = array(), $echo = true ) {
		// Check if the provided attributes array is valid and non-empty
		// This ensures that we have attributes to process and print
		if ( ! is_array( $attributes ) || empty( $attributes ) ) {
			return '';
		}

		$attribute_pairs = array();

		foreach ( $attributes as $key => $val ) {
			// No need to print an empty array
			if ( is_array( $val ) && empty( $val ) ) {
				continue;
			}
			// If the attribute value is an array, it is assumed to be a set of CSS classes.
			// We remove duplicates, filter out empty values, and then convert the array to a space-separated string.
			// Usually we prepare a class set in this way
			if ( is_array( $val ) ) {
				// Remove duplicates
				$val = array_unique( $val );

				// Remove all the empty elements, zeros, false, null values, and an empty array (arr()) from the array
				$val = array_filter( $val );

				// Convert the array to a space-separated string
				$val = implode( ' ', $val );
			}

			if ( is_int( $key ) ) {
				$attribute_pairs[] = $val;
			} else {
				$val = htmlspecialchars( $val, ENT_QUOTES | ENT_HTML5 );

				// Different escaping function for URLs
				if ( $key === 'href' ) {
					$attribute_pairs[] = esc_attr( $key ) . '="' . esc_attr( esc_url( $val ) ) . '"';
				} else {
					$attribute_pairs[] = esc_attr( $key ) . '="' . esc_attr( $val ) . '"';
				}
			}
		}

		if ( $echo ) {
			// All attributes and values are escaped and are safe to output
			echo join( ' ', $attribute_pairs ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			return ! is_array( $attributes ) || empty( $attributes ) ? '' : join( ' ', $attribute_pairs );
		}
	}

	/**
	 * Add classes to an array of HTML attributes.
	 *
	 * This method adds one or more classes to the 'class' attribute of the provided
	 * attributes array. If the 'class' attribute already exists, it merges the new
	 * classes with the existing ones.
	 *
	 * @since 1.0.0
	 *
	 * @param array        $attributes Associative array of HTML attributes.
	 * @param string|array $classes    One or more classes to add.
	 *
	 * @return array Modified attributes with added classes.
	 */
	public static function add_classes_to_attributes( $attributes, $classes ) {
		// Validate attributes parameter
		if ( ! is_array( $attributes ) ) {
			$attributes = array();
		}

		// Normalize classes to array
		if ( is_string( $classes ) ) {
			$classes = explode( ' ', trim( $classes ) );
		} elseif ( ! is_array( $classes ) ) {
			$classes = array();
		}

		// Filter out empty strings
		$classes = array_filter( $classes, 'strlen' );

		if ( empty( $classes ) ) {
			return $attributes;
		}

		// Handle existing class attribute
		$existing_classes = array();
		if ( isset( $attributes['class'] ) ) {
			if ( is_string( $attributes['class'] ) ) {
				$existing_classes = explode( ' ', trim( $attributes['class'] ) );
			} elseif ( is_array( $attributes['class'] ) ) {
				$existing_classes = $attributes['class'];
			}
			// Filter out empty strings from existing classes
			$existing_classes = array_filter( $existing_classes, 'strlen' );
		}

		// Merge and assign
		$attributes['class'] = array_merge( $existing_classes, $classes );

		return $attributes;
	}

	/**
	 * Get post terms classes.
	 *
	 * This method retrieves the terms associated with the post's taxonomies
	 * and returns them as an array of class names in the format "taxonomy-term".
	 * Can be used in Masonry grids for filtering posts by terms.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $post    Associative array containing post data with 'taxonomies' key.
	 * @param string $divider Optional. The divider between taxonomy and term. Default is '-'.
	 *
	 * @return array An array of class names for the post's terms.
	 */
	public static function get_post_terms_classes( $post, $divider = '-' ) {
		$terms_classes = array();

		if ( is_array( $post ) && isset( $post['taxonomies'] ) && ! empty( $post['taxonomies'] ) ) {
			$post_taxonomies = $post['taxonomies'];

			foreach ( $post_taxonomies as $taxonomy ) {
				$tax_id = $taxonomy['id'];

				if ( isset( $taxonomy['terms'] ) && ! empty( $taxonomy['terms'] ) ) {
					$tax_terms = $taxonomy['terms'];

					foreach ( $tax_terms as $term ) {
						$term_slug       = $term['slug'];
						$terms_classes[] = "{$tax_id}{$divider}{$term_slug}";
					}
				}
			}
		}

		return $terms_classes;
	}

	/**
	 * Merges two lists recursively.
	 *
	 * @since 1.0.0
	 *
	 * @param array|object $output              The initial list to merge into.
	 * @param array|object $list                The list to merge from.
	 * @param bool         $preserve_integer_keys Whether to preserve integer keys.
	 *
	 * @return array|object The merged list.
	 */
	private static function merge_lists( $output, $list, $preserve_integer_keys ) {
		foreach ( (array) $list as $key => $value ) {
			$output = self::merge_list_item( $output, $key, $value, $preserve_integer_keys );
		}

		return $output;
	}

	/**
	 * Merges a list item into the output array.
	 *
	 * @since 1.0.0
	 *
	 * @param array $output               The output array to merge into.
	 * @param mixed $key                  The key of the item to merge.
	 * @param mixed $value                The value of the item to merge.
	 * @param bool  $preserve_integer_keys Whether to preserve integer keys.
	 *
	 * @return array The merged output array.
	 */
	private static function merge_list_item( $output, $key, $value, $preserve_integer_keys ) {
		if ( is_integer( $key ) && ! $preserve_integer_keys ) {
			$output[] = $value;
		} elseif ( self::should_merge_recursively( $output, $key, $value ) ) {
			$output[ $key ] = self::merge_lists( $output[ $key ], $value, $preserve_integer_keys );
		} else {
			$output[ $key ] = $value;
		}
		return $output;
	}

	/**
	 * Converts the output type based on the provided arguments and defaults.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $output       The output to be converted.
	 * @param mixed $args         The arguments to check for object type.
	 * @param mixed $defaults     The default values to check for object type.
	 * @param bool  $preserve_type Whether to preserve the object type.
	 *
	 * @return mixed The converted output, either as an object or the original type.
	 */
	private static function convert_output_type( $output, $args, $defaults, $preserve_type ) {
		return $preserve_type && ( is_object( $args ) || is_object( $defaults ) ) ? (object) $output : $output;
	}

	/**
	 * Determines if two items should be merged recursively.
	 *
	 * @since 1.0.0
	 *
	 * @param array|object $output The output array or object.
	 * @param mixed        $key    The key of the item to check.
	 * @param mixed        $value  The value of the item to check.
	 *
	 * @return bool True if the items should be merged recursively, false otherwise.
	 */
	private static function should_merge_recursively( $output, $key, $value ) {
		return ( is_array( $output ) || is_object( $output ) ) &&
						( is_array( $value ) || is_object( $value ) ) &&
						isset( $output[ $key ] ) &&
						( is_array( $output[ $key ] ) || is_object( $output[ $key ] ) );
	}

	/**
	 * Print a validated and escaped HTML tag.
	 *
	 * @since 1.0.0
	 *
	 * @param string $tag  The HTML tag to be validated and printed.
	 * @param bool   $echo Optional. Whether to echo the tag. Default true.
	 *
	 * @return string|null The validated and escaped HTML tag if $echo is false, otherwise null.
	 */
	public static function print_html_tag( $tag, $echo = true ) {
		$tag = self::get_valid_html_tag( $tag );

		if ( $echo ) {
			echo esc_html( $tag );
		} else {
			return esc_html( $tag );
		}
	}

	/**
	 * Get a valid HTML tag.
	 *
	 * This function checks if the provided tag is in the list of allowed HTML tags.
	 * If the tag is valid, it returns the tag; otherwise, it returns 'div'.
	 *
	 * @since 1.0.0
	 *
	 * @param string $tag The HTML tag to validate.
	 *
	 * @return string The validated HTML tag or 'div' if invalid.
	 *
	 * @filter `arts/utilities/markup/allows_html_tags` Allows filtering the list of allowed HTML tags.
	 */
	public static function get_valid_html_tag( $tag ) {
		$allowed_html_tags = apply_filters(
			'arts/utilities/markup/allows_html_tags',
			array(
				'a',
				'article',
				'aside',
				'button',
				'div',
				'footer',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'header',
				'main',
				'nav',
				'p',
				'section',
				'span',
			)
		);

		return $tag && in_array( strtolower( $tag ), $allowed_html_tags ) ? $tag : 'div';
	}

	/**
	 * Add one or more classes to the HTML element.
	 *
	 * This method can be used with the WordPress 'language_attributes' filter
	 * to add classes to the <html> element.
	 *
	 * @since 1.0.0
	 *
	 * @param string       $attributes Current HTML element attributes.
	 * @param string|array $classes    One or more classes to add.
	 * @return string Modified attributes with added classes.
	 */
	public static function add_root_html_classes( $attributes, $classes ) {
		// Convert to array if string provided
		if ( ! is_array( $classes ) ) {
			$classes = array( $classes );
		}

		// Filter out empty values
		$classes = array_filter( $classes );

		if ( empty( $classes ) ) {
			return $attributes;
		}

		// Join classes with spaces
		$class_string = esc_attr( implode( ' ', $classes ) );

		// Check if class attribute already exists
		if ( strpos( $attributes, 'class=' ) !== false ) {
			// Add our classes to existing class attribute
			$attributes = preg_replace( '/class="([^"]*)"/', 'class="$1 ' . $class_string . '"', $attributes );
		} else {
			// Add new class attribute
			$attributes .= ' class="' . $class_string . '"';
		}

		return $attributes;
	}
}
