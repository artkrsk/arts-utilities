<?php

namespace Tests\Unit\Traits;

use Arts\Utilities\Traits\Blog;
use Arts\Utilities\Traits\Markup;
use Arts\Utilities\Traits\Query;
use Arts\Utilities\Traits\ACF;

class TestUtilities {
	use Blog, Markup, Query, ACF;

	// Required methods for tests
	public static function is_built_with_elementor() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_built_with_elementor'] ?? false;
	}

	public static function is_woocommerce_archive() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_woocommerce_archive'] ?? false;
	}

	public static function get_woocommerce_page_title() {
		global $MOCK_DATA;
		return $MOCK_DATA['woocommerce_page_title'] ?? '';
	}

	// Any helper methods for tests can be added here
}
