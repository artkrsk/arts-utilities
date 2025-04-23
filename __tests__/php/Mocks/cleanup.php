<?php
/**
 * Cleanup script to check for duplicate function declarations
 *
 * Run this script with:
 * php __tests__/php/Mocks/cleanup.php
 */

// Check that we're running from the right directory
if ( ! file_exists( '__tests__/php/Mocks/cleanup.php' ) ) {
	echo "Error: Please run this script from the project root directory.\n";
	exit( 1 );
}

echo "Scanning mock files for duplicate function declarations...\n";

// Files to scan
$files = array(
	'__tests__/php/Mocks/WordPress/functions.php',
	'__tests__/php/Mocks/WordPress/Utility.php',
	'__tests__/php/Mocks/WordPress/Assets.php',
	'__tests__/php/Mocks/WordPress/LoopAndQuery.php',
	'__tests__/php/Mocks/WordPress/Conditionals.php',
	'__tests__/php/Mocks/WordPress/Taxonomies.php',
	'__tests__/php/Mocks/WordPress/Theme.php',
	'__tests__/php/Mocks/WordPress/Authors.php',
	'__tests__/php/Mocks/Elementor/classes.php',
	'__tests__/php/Mocks/ElementorTraitFunctions.php',
	'__tests__/php/Mocks/WooCommerce/functions.php',
	'__tests__/php/Mocks/ACF/functions.php',
);

// Track all found functions
$foundFunctions = array();
$duplicates     = array();

foreach ( $files as $file ) {
	if ( ! file_exists( $file ) ) {
		echo "Warning: File not found: $file\n";
		continue;
	}

	echo "Scanning $file...\n";
	$contents = file_get_contents( $file );

	// Extract function declarations using regex
	preg_match_all( '/function\s+([a-zA-Z0-9_]+)\s*\(/m', $contents, $matches );

	if ( ! empty( $matches[1] ) ) {
		foreach ( $matches[1] as $function ) {
			if ( isset( $foundFunctions[ $function ] ) ) {
				$duplicates[ $function ][] = $file;
			} else {
				$foundFunctions[ $function ] = $file;
			}
		}
	}
}

// Report duplicates
if ( empty( $duplicates ) ) {
	echo "\nNo duplicate function declarations found! 🎉\n";
} else {
	echo "\nFound " . count( $duplicates ) . " duplicate function declarations:\n";

	foreach ( $duplicates as $function => $files ) {
		echo "\nFunction '$function' is defined in multiple files:\n";
		echo '  - ' . $foundFunctions[ $function ] . " (first)\n";
		foreach ( $files as $file ) {
			echo "  - $file\n";
		}

		// Suggestion
		echo "Suggestion: Add if (!function_exists('$function')) { ... } check in these files.\n";
	}
}

echo "\nDone.\n";