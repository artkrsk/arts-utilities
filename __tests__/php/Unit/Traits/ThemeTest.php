<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Theme trait
 */
class TestThemeUtilities {
	use \Arts\Utilities\Traits\Theme;
}

/**
 * Test the Theme trait
 */
class ThemeTest extends TestCase {
	/**
	 * Instance of TestThemeUtilities
	 */
	protected $utilities;

	/**
	 * Setup for each test
	 */
	protected function setUp(): void {
		parent::setUp();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();

		 // Reset theme cache to ensure clean state for each test
		TestThemeUtilities::reset_theme_cache();

		// Create instance of TestThemeUtilities
		$this->utilities = new TestThemeUtilities();
	}

	/**
	 * Test get_parent_theme_version method
	 */
	public function testGetParentThemeVersion() {
		global $MOCK_DATA;

		// Test with child theme and parent theme
		$MOCK_DATA['wp_theme_version']        = '1.0.0';
		$MOCK_DATA['wp_theme_parent']         = true;
		$MOCK_DATA['wp_theme_parent_version'] = '2.0.0';

		$this->assertEquals( '2.0.0', TestThemeUtilities::get_parent_theme_version() );

		// Reset theme cache between test scenarios
		TestThemeUtilities::reset_theme_cache();

		// Reset the parent theme flag to false
		$MOCK_DATA['wp_theme_parent'] = false;

		// Test with only the current theme (no parent theme)
		$MOCK_DATA['wp_theme_version'] = '1.0.0';

		$this->assertEquals( '1.0.0', TestThemeUtilities::get_parent_theme_version() );

		// Reset theme cache between test scenarios
		TestThemeUtilities::reset_theme_cache();

		// Test with no theme version
		$MOCK_DATA['wp_theme_version'] = '';

		$this->assertEquals( '', TestThemeUtilities::get_parent_theme_version() );
	}
}
