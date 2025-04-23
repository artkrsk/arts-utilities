<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Fonts Trait
 *
 * Provides utility methods for working with font files in WordPress,
 * particularly with handling font MIME types and file extensions.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Fonts {
	/**
	 * Adds custom MIME types for font files.
	 *
	 * To be used with `upload_mimes` WordPress filter.
	 *
	 * @since 1.0.0
	 *
	 * @param array $mime_types Existing MIME types.
	 * @return array Modified MIME types.
	 */
	public static function get_fonts_mime_types( $mime_types ) {
		$mime_types['woff']  = 'font/woff|application/font-woff|application/x-font-woff|application/octet-stream';
		$mime_types['woff2'] = 'font/woff2|application/octet-stream|font/x-woff2';

		return $mime_types;
	}

	/**
	 * Adds custom file extensions and MIME types for font files.
	 *
	 * To be used with `wp_check_filetype_and_ext` WordPress filter.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $types    File data array.
	 * @param string $file     Full path to the file.
	 * @param string $filename The name of the file.
	 * @param array  $mimes    MIME types keyed by the file extension regex corresponding to those types.
	 *
	 * @return array Modified file data array.
	 */
	public static function get_fonts_custom_file_extensions( $types, $file, $filename, $mimes ) {
		if ( false !== strpos( $filename, '.woff' ) ) {
			$types['ext']  = 'woff';
			$types['type'] = 'font/woff|application/font-woff|application/x-font-woff|application/octet-stream';
		}

		if ( false !== strpos( $filename, '.woff2' ) ) {
			$types['ext']  = 'woff2';
			$types['type'] = 'font/woff2|application/octet-stream|font/x-woff2';
		}

		return $types;
	}
}