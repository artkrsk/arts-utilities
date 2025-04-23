<?php
/**
 * Central loader for all mock classes and functions
 *
 * This file ensures everything is loaded in the correct order
 * and only once to prevent redefinition errors.
 */

// Load WordPress mocks first
require_once __DIR__ . '/WordPress/loader.php';

// Load Elementor trait functions
require_once __DIR__ . '/ElementorTraitFunctions.php';

// Load Elementor mocks through its loader
require_once __DIR__ . '/Elementor/loader.php';

// Load plugin-specific mocks (only load once)
require_once __DIR__ . '/WooCommerce/loader.php';
require_once __DIR__ . '/ACF/loader.php';

// Load custom framework mocks
function arts_is_built_with_elementor() {
	global $MOCK_DATA;
	return $MOCK_DATA['is_built_with_elementor'] ?? false;
}

function arts_is_woocommerce_archive() {
	global $MOCK_DATA;
	return $MOCK_DATA['is_woocommerce_archive'] ?? false;
}

function arts_get_woocommerce_page_title() {
	global $MOCK_DATA;
	return $MOCK_DATA['woocommerce_page_title'] ?? '';
}
