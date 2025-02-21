<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait Strings {
	/**
	 * Converts a string from camel case to kebab case.
	 * Example: `myCamelCaseString` becomes `my-camel-case-string`
	 *
	 * @param string $string The input string to be converted.
	 * @return string The converted string in kebab case.
	 */
	public static function convert_camel_to_kebab_case( $string ) {
		$string = preg_replace( '/([a-z])([A-Z])/', "\\1-\\2", $string );
		$string = preg_replace( '/([a-z])([A-Z])/', "\\1 - \\2", $string );
		$string = strtolower( $string );

		return $string;
	}

	/**
	 * Converts a camel case string to snake case.
	 * Example: 'CustomMimeTypes' becomes 'custom_mime_types'.
	 *
	 * @param string $string The input string in camel case.
	 * @return string The converted string in snake case.
	 */
	public static function convert_camel_to_snake_case( $string ) {
		$string = preg_replace( '/([a-z])([A-Z])/', "\\1-\\2", $string );
		$string = preg_replace( '/([a-z])([A-Z])/', "\\1 - \\2", $string );
		$string = strtolower( $string );
		$string = str_replace( '-', '_', $string );
		$string = str_replace( '\\', '_', $string );

		return $string;
	}

	/**
	 * Replaces special characters in a string and converts it to a slug format.
	 *
	 * This function replaces characters like '_', '-', '/', '&', and ' ' with an underscore ('_')
	 * and converts the string to lowercase. This is useful for generating slugs from strings,
	 * which can be used in URLs or as unique identifiers.
	 *
	 * @param string $string The input string to convert to a slug.
	 * @return string The slug version of the input string.
	 */
	public static function get_slug_from_string( $string ) {
		// array('_', '-', '/', '&', ' ' )
		return str_replace( array( '_', '-', '/', '&', ' ', '.', '?', '#', '=' ), '_', strtolower( $string ) );
	}
}
