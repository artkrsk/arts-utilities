<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait Conditions {
	/**
	 * Checks if the current page is an archive page.
	 *
	 * @return bool True if the current page is an archive page, false otherwise.
	 */
	public static function is_archive() {
		return is_home() || is_category() || is_search() || is_archive();
	}
}
