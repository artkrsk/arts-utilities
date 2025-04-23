<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Plugin trait
 */
class TestPluginUtilities {
	use \Arts\Utilities\Traits\Plugin;
}

/**
 * Test the Plugin trait
 */
class PluginTest extends TestCase {
	/**
	 * Instance of TestPluginUtilities
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

		// Create instance of TestPluginUtilities
		$this->utilities = new TestPluginUtilities();
	}

	/**
	 * Test get_plugin_version method
	 */
	public function testGetPluginVersion() {
		global $MOCK_DATA;

		// Test with plugin version data available
		$MOCK_DATA['get_file_data'] = array(
			'ver' => '1.2.3',
		);

		$this->assertEquals( '1.2.3', TestPluginUtilities::get_plugin_version( 'plugin.php' ) );

		// Test with specific plugin file path
		$plugin_file                     = '/path/to/my-plugin/plugin.php';
		$MOCK_DATA['get_file_data_file'] = $plugin_file;
		$MOCK_DATA['get_file_data']      = array(
			'ver' => '2.0.0',
		);

		$this->assertEquals( '2.0.0', TestPluginUtilities::get_plugin_version( $plugin_file ) );

		// Test with missing version data
		$MOCK_DATA['get_file_data'] = array();

		$this->assertEquals( '', TestPluginUtilities::get_plugin_version( 'plugin.php' ) );

		// Test with null version data
		$MOCK_DATA['get_file_data'] = array(
			'ver' => null,
		);

		$this->assertEquals( '', TestPluginUtilities::get_plugin_version( 'plugin.php' ) );
	}
}
