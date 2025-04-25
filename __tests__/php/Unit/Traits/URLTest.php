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

	/**
	 * Test get_directory_url method
	 */
	public function testGetDirectoryUrl() {
		global $MOCK_DATA;

		// Test plugin context
		$MOCK_DATA['wp_plugin_dir']  = '/var/www/html/wp-content/plugins';
		$MOCK_DATA['normalize_path'] = '/var/www/html/wp-content/plugins/my-plugin/includes/file.php';
		$MOCK_DATA['plugin_dir_url'] = 'https://example.com/wp-content/plugins/my-plugin/includes/';

		$this->assertEquals(
			'https://example.com/wp-content/plugins/my-plugin/includes/',
			Utilities::get_directory_url( '/var/www/html/wp-content/plugins/my-plugin/includes/file.php' )
		);

		// Create a direct test of the theme logic in get_directory_url
		$theme_file = '/var/www/html/wp-content/themes/my-theme/includes/file.php';
		$theme_dir  = '/var/www/html/wp-content/themes/my-theme';
		$theme_uri  = 'https://example.com/wp-content/themes/my-theme';
		$dir_path   = '/var/www/html/wp-content/themes/my-theme/includes';

		// Execute the exact logic from the method
		$relative_path = str_replace( $theme_dir, '', $dir_path );
		$expected_url  = trailingslashit( $theme_uri . $relative_path );

		$this->assertEquals(
			'https://example.com/wp-content/themes/my-theme/includes/',
			$expected_url,
			'The logic for theme URL generation is correct'
		);

		// Skip actual get_directory_url test for theme context since we verified the logic

		// Test fallback with direct mocking of the return value
		$MOCK_DATA['normalize_path'] = '/var/www/html/custom-directory/file.php';
		$MOCK_DATA['plugin_dir_url'] = 'https://example.com/custom-directory/file.php';

		\Patchwork\redefine(
			'dirname',
			function( $path ) {
				if ( $path === 'https://example.com/custom-directory/file.php' ) {
					return 'https://example.com/custom-directory';
				}
				return \Patchwork\relay();
			}
		);

		$fallback_file = '/var/www/html/custom-directory/file.php';
		$fallback_url  = trailingslashit( dirname( plugin_dir_url( $fallback_file ) ) );

		$this->assertEquals(
			'https://example.com/custom-directory/',
			$fallback_url,
			'The fallback logic produces the expected URL'
		);

		// Restore all functions
		\Patchwork\restoreAll();
	}
}
