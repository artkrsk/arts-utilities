<?php
/**
 * Loads all WordPress mock functions and classes
 */

// Define WordPress object constants if not already defined
// These have been moved to the bootstrap.php file
// DO NOT define them here

// IMPORTANT: Load functions.php first to ensure core WordPress functions are defined
// before any other files try to use them
require_once __DIR__ . '/functions.php';

// Load utility functions - they contain basic WordPress functions
require_once __DIR__ . '/Utility.php';

// Load core WordPress functionality in a specific order to prevent conflicts
require_once __DIR__ . '/LoopAndQuery.php';
require_once __DIR__ . '/Conditionals.php';
require_once __DIR__ . '/Assets.php';
require_once __DIR__ . '/Theme.php';

// Load Taxonomies.php to ensure taxonomy functions are defined
require_once __DIR__ . '/Taxonomies.php';

require_once __DIR__ . '/Authors.php';
