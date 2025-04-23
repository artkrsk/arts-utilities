<?php
/**
 * Loader for Elementor Mock Classes
 */

// First include our main classes file which contains all the necessary mocks
// Only include if the key classes don't already exist
if ( ! class_exists( '\Elementor\Plugin' ) || ! class_exists( '\Elementor\Core\Settings\Manager' ) ) {
	require_once __DIR__ . '/classes.php';
}

// Do not include any of the split class files
// CoreSettings.php, ElementorNamespace.php, ElementorProNamespace.php, GlobalNamespace.php
// These are deprecated and should be removed
