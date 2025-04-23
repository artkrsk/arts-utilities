<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;
use Arts\Utilities\Utilities;

class URLTest extends TestCase {
	/**
	 * Setup for each test
	 */
	protected function setUp(): void {
		parent::setUp();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();
	}

	/**
	 * Test is_referer_from_same_domain method
	 */
	public function testIsRefererFromSameDomain() {
		global $MOCK_DATA;

		// Test when referer is from same domain
		$MOCK_DATA['wp_referer'] = 'https://example.com/page';
		$MOCK_DATA['site_url']   = 'https://example.com';

		$this->assertTrue( Utilities::is_referer_from_same_domain() );

		// Test when referer is from different domain
		$MOCK_DATA['wp_referer'] = 'https://otherdomain.com/page';

		$this->assertFalse( Utilities::is_referer_from_same_domain() );

		// Test when referer is false
		$MOCK_DATA['wp_referer'] = false;

		$this->assertFalse( Utilities::is_referer_from_same_domain() );

		// Test with subdomain
		$MOCK_DATA['wp_referer'] = 'https://subdomain.example.com/page';

		$this->assertFalse( Utilities::is_referer_from_same_domain() );
	}

	/**
	 * Test get_license_args_url method
	 */
	public function testGetLicenseArgsUrl() {
		global $MOCK_DATA;

		// Test with valid parameters
		$MOCK_DATA['option_license_key_option'] = 'valid-license-key';
		$MOCK_DATA['home_url']                  = 'https://example.com/';

		$license_url = 'https://api.example.com/check?key=valid-license-key&url=https%3A%2F%2Fexample.com%2F';

		$result = Utilities::get_license_args_url( 'https://api.example.com/check', 'license_key_option' );
		$this->assertEquals( $license_url, $result );

		// Test with empty URL
		$this->assertEquals( '', Utilities::get_license_args_url( '', 'license_key_option' ) );

		// Test with empty option
		$this->assertEquals( '', Utilities::get_license_args_url( 'https://api.example.com/check', '' ) );

		// Test with both parameters empty
		$this->assertEquals( '', Utilities::get_license_args_url( '', '' ) );
	}
}
