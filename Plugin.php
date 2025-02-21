<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/inc/traits/ACF.php';
require_once __DIR__ . '/inc/traits/Conditions.php';
require_once __DIR__ . '/inc/traits/Elementor.php';
require_once __DIR__ . '/inc/traits/LoopedPosts.php';
require_once __DIR__ . '/inc/traits/Query.php';
require_once __DIR__ . '/inc/traits/Strings.php';
require_once __DIR__ . '/inc/traits/Taxonomies.php';
require_once __DIR__ . '/inc/traits/WooCommerce.php';

class Utilities {
	use ACF;
	use Conditions;
	use Elementor;
	use LoopedPosts;
	use Query;
	use Strings;
	use Taxonomies;
	use WooCommerce;
}
