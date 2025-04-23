<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Shortcodes trait
 */
class TestShortcodesUtilities {
	use \Arts\Utilities\Traits\Shortcodes;
}

/**
 * Test the Shortcodes trait
 */
class ShortcodesTest extends TestCase {
	/**
	 * Instance of TestShortcodesUtilities
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

		// Create instance of TestShortcodesUtilities
		$this->utilities = new TestShortcodesUtilities();
	}

	/**
	 * Test get_shortcode_current_year method
	 */
	public function testGetShortcodeCurrentYear() {
		global $MOCK_DATA;

		// Test with current year
		$current_year                          = date( 'Y' );
		$MOCK_DATA['gmdate_result']            = $current_year;
		$MOCK_DATA['shortcode_unautop_result'] = $current_year;
		$MOCK_DATA['do_shortcode_result']      = $current_year;

		$this->assertEquals( $current_year, TestShortcodesUtilities::get_shortcode_current_year() );

		// Test with empty current year after processing
		$MOCK_DATA['gmdate_result']            = '2025';
		$MOCK_DATA['shortcode_unautop_result'] = '';
		$MOCK_DATA['do_shortcode_result']      = '';

		$this->assertEquals( '', TestShortcodesUtilities::get_shortcode_current_year() );

		// Test with different year format
		$custom_year                           = '2025';
		$MOCK_DATA['gmdate_result']            = $custom_year;
		$MOCK_DATA['shortcode_unautop_result'] = $custom_year;
		$MOCK_DATA['do_shortcode_result']      = $custom_year;

		$this->assertEquals( $custom_year, TestShortcodesUtilities::get_shortcode_current_year() );
	}
}
