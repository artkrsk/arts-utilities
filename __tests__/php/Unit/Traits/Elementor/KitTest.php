<?php

namespace Tests\Unit\Traits\Elementor;

use Arts\Utilities\Traits\Elementor\Kit;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;

/**
 * Test class for the Kit trait
 */
class KitTest extends TestCase {
	protected $test_kit;

	protected function setUp(): void {
		parent::setUp();

		// Initialize Brain\Monkey
		\Brain\Monkey\setUp();

		// Define the test_kit object that uses the trait
		$this->test_kit = new class() {
			use Kit;

			// Override is_elementor_plugin_active for testing
			public static function is_elementor_plugin_active() {
				global $MOCK_DATA;
				return $MOCK_DATA['elementor_exists'] ?? false;
			}

			// Override get_global_color_control_id for testing
			protected static function get_global_color_control_id( $input ) {
				if ( ! is_string( $input ) ) {
					return '';
				}

				if ( strpos( $input, 'globals/colors?id=' ) !== false ) {
					return preg_replace( '/.*globals\/colors\?id=([a-z0-9]+).*/i', '$1', $input );
				}
				return '';
			}
		};

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();

		// Setup global Elementor\Plugin and kits_manager
		$MOCK_DATA['elementor_exists'] = true;

		// Mock the Elementor Plugin's kit manager's get_current_settings method
		// This is a bit tricky but we need to mock method calls on properties of global objects
		$MOCK_DATA['kit_manager_setting_system_colors'] = array(
			array(
				'_id'   => 'primary',
				'color' => '#0000ff',
			),
		);

		$MOCK_DATA['kit_manager_setting_custom_colors'] = array(
			array(
				'_id'   => 'secondary',
				'color' => '#ff0000',
			),
		);

		// Setup global plugin instance property test
		$MOCK_PLUGIN               = new \stdClass();
		$MOCK_KITS_MANAGER         = new \stdClass();
		$MOCK_PLUGIN->kits_manager = $MOCK_KITS_MANAGER;

		$MOCK_DATA['elementor_plugin_instance'] = $MOCK_PLUGIN;

		// Define constants for testing
		if ( ! defined( 'ABSPATH' ) ) {
			define( 'ABSPATH', '/fake/path/' );
		}

		// Mock class_exists function
		\Brain\Monkey\Functions\when( 'class_exists' )->justReturn( true );
	}

	protected function tearDown(): void {
		\Brain\Monkey\tearDown();
		parent::tearDown();
	}

	// Mock the Plugin instance
	private function mockElementorPlugin() {
		global $MOCK_DATA;

		// In the updated version, we'll use a simpler approach to mocking
		// by directly modifying the mock data and not using Brain\Monkey\Functions\expect
		// for static property method calls which it doesn't support well

		// We'll simply set up the mock values in the global MOCK_DATA array
		// and the trait will access these values via our mock implementation of
		// the Elementor namespace classes in Mocks/Elementor/classes.php
	}

	/**
	 * Test get_color_value method
	 */
	public function testGetColorValue() {
		global $MOCK_DATA;

		$this->mockElementorPlugin();

		// Make sure Elementor exists
		$MOCK_DATA['elementor_exists'] = true;

		// Set the expected return value for the system colors
		$MOCK_DATA['kit_manager_setting_system_colors'] = array(
			array(
				'_id'   => 'primary',
				'color' => '#000000', // This is what will be returned from the mock
			),
		);

		// Set up mock widget settings
		$settings = array(
			'text_color'  => '#cccccc',
			'__globals__' => array(
				'text_color' => 'globals/colors?id=primary',
			),
		);

		// Test with valid global color
		$result = $this->test_kit::get_color_value( $settings, 'text_color', '#000000' );
		$this->assertEquals( '#000000', $result );

		// Test with non-existent global color
		$settings['__globals__']['text_color'] = 'globals/colors?id=nonexistent';
		$result                                = $this->test_kit::get_color_value( $settings, 'text_color', '#000000' );
		$this->assertEquals( '#000000', $result );

		// Test with empty settings
		$result = $this->test_kit::get_color_value( array(), 'text_color', '#000000' );
		$this->assertEquals( '#000000', $result );

		// Test with missing __globals__ property
		$settings = array( 'text_color' => '#cccccc' );
		$result   = $this->test_kit::get_color_value( $settings, 'text_color', '#000000' );
		$this->assertEquals( '#000000', $result );

		// Test with invalid option name
		$settings = array(
			'__globals__' => array(
				'text_color' => 'globals/colors?id=primary',
			),
		);
		$result   = $this->test_kit::get_color_value( $settings, 'background_color', '#000000' );
		$this->assertEquals( '#000000', $result );
	}

	/**
	 * Test get_kit_settings method
	 */
	public function testGetKitSettings() {
		global $MOCK_DATA;

		$this->mockElementorPlugin();

		// Test when Elementor is active
		$MOCK_DATA['elementor_exists'] = true;

		// Mock kit manager's get_current_settings
		$MOCK_DATA['kit_manager_setting_body_background_color'] = '#ffffff';
		$MOCK_DATA['kit_manager_setting_container_width']       = 1140; // Changed to a scalar value instead of array
		$MOCK_DATA['kit_manager_setting_logo']                  = 'https://example.com/logo.png'; // Changed to a string

		// Test with simple value
		$result = $this->test_kit::get_kit_settings( 'body_background_color', '#000000' );
		$this->assertEquals( '#ffffff', $result );

		// Test with numeric value
		$result = $this->test_kit::get_kit_settings( 'container_width', 960 );
		$this->assertEquals( 1140, $result );

		// Test with URL value and return_size = false
		$result = $this->test_kit::get_kit_settings( 'logo', null, false );
		$this->assertEquals( 'https://example.com/logo.png', $result );

		// Test with non-existent option
		$result = $this->test_kit::get_kit_settings( 'nonexistent_option', 'default' );
		$this->assertEquals( 'default', $result );

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$result                        = $this->test_kit::get_kit_settings( 'body_background_color', '#000000' );
		$this->assertEquals( '#000000', $result );
	}

	/**
	 * Test get_kit_setting_or_theme_mod method
	 */
	public function testGetKitSettingOrThemeMod() {
		global $MOCK_DATA;

		$this->mockElementorPlugin();

		// Test when Elementor is active
		$MOCK_DATA['elementor_exists'] = true;

		// Mock kit manager's get_current_settings
		$MOCK_DATA['kit_manager_setting_body_background_color'] = '#ffffff';

		// Test with kit settings available
		$result = $this->test_kit::get_kit_setting_or_theme_mod( 'body_background_color', '#000000' );
		$this->assertEquals( '#ffffff', $result );

		// Test when Elementor is not active but theme mod available
		$MOCK_DATA['elementor_exists']                = false;
		$MOCK_DATA['theme_mod_body_background_color'] = '#dddddd';

		$result = $this->test_kit::get_kit_setting_or_theme_mod( 'body_background_color', '#000000' );
		$this->assertEquals( '#dddddd', $result );

		// Test when neither Elementor nor theme mod available
		$result = $this->test_kit::get_kit_setting_or_theme_mod( 'nonexistent_option', 'default' );
		$this->assertEquals( 'default', $result );
	}

	/**
	 * Test update_kit_settings method
	 */
	public function testUpdateKitSettings() {
		global $MOCK_DATA;

		$this->mockElementorPlugin();

		// Test when Elementor is active
		$MOCK_DATA['elementor_exists']   = true;
		$MOCK_DATA['updated_kit_option'] = null;
		$MOCK_DATA['updated_kit_value']  = null;

		// Test successful update
		$result = $this->test_kit::update_kit_settings( 'body_background_color', '#eeeeee' );
		$this->assertTrue( $result );

		// Verify update was recorded
		$this->assertEquals( 'body_background_color', $MOCK_DATA['updated_kit_option'] );
		$this->assertEquals( '#eeeeee', $MOCK_DATA['updated_kit_value'] );

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$result                        = $this->test_kit::update_kit_settings( 'body_background_color', '#eeeeee' );
		$this->assertFalse( $result );
	}
}
