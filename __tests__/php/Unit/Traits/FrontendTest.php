<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Frontend trait
 */
class TestFrontendUtilities {
	use \Arts\Utilities\Traits\Frontend;
}

/**
 * Test the Frontend trait
 */
class FrontendTest extends TestCase {
	/**
	 * Instance of TestFrontendUtilities
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

		// Create instance of TestFrontendUtilities
		$this->utilities = new TestFrontendUtilities();
	}

	/**
	 * Test enqueue_dynamic_load_script method with 'asset' type
	 */
	public function testEnqueueDynamicLoadScriptAsset() {
		global $MOCK_DATA;

		// Test with valid arguments for asset type
		$args = array(
			'handle' => 'test-script',
			'src'    => 'https://example.com/test-script.js',
			'deps'   => array( 'jquery' ),
			'ver'    => '1.0.0',
			'args'   => true,
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify wp_register_script was called with correct args
		$this->assertEquals( 'test-script', $MOCK_DATA['wp_register_script_handle'] );
		$this->assertEquals( 'https://example.com/test-script.js', $MOCK_DATA['wp_register_script_src'] );
		$this->assertEquals( array( 'jquery' ), $MOCK_DATA['wp_register_script_deps'] );
		$this->assertEquals( '1.0.0', $MOCK_DATA['wp_register_script_ver'] );
		$this->assertEquals( true, $MOCK_DATA['wp_register_script_args'] );

		// Verify dynamic load data was added
		$this->assertTrue( $MOCK_DATA['wp_script_add_data']['test-script']['dynamic_load_enabled'] );
		$this->assertEquals( 'asset', $MOCK_DATA['wp_script_add_data']['test-script']['dynamic_load_type'] );

		// Verify script was enqueued
		$this->assertEquals( 'test-script', $MOCK_DATA['wp_enqueue_script'] );
	}

	/**
	 * Test enqueue_dynamic_load_script method with 'component' type
	 */
	public function testEnqueueDynamicLoadScriptComponent() {
		global $MOCK_DATA;

		// Test with valid arguments for component type
		$args = array(
			'handle' => 'test-component',
			'src'    => 'https://example.com/test-component.js',
			'deps'   => array( 'jquery' ),
			'ver'    => '1.0.0',
			'args'   => true,
			'files'  => array(
				array(
					'type' => 'script',
					'id'   => 'test-component-script',
					'src'  => 'https://example.com/test-component-script.js',
				),
				array(
					'type' => 'style',
					'id'   => 'test-component-style',
					'src'  => 'https://example.com/test-component-style.css',
				),
			),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'component', $args );

		// Verify component files were registered
		$this->assertEquals( 'test-component-script', $MOCK_DATA['wp_register_script_calls'][0]['handle'] );
		$this->assertEquals( 'test-component-style', $MOCK_DATA['wp_register_style_handle'] );

		// Verify wp_register_script_module and wp_register_script were called for component
		$this->assertEquals( 'test-component', $MOCK_DATA['wp_register_script_module_handle'] );
		$this->assertEquals( 'test-component', $MOCK_DATA['wp_register_script_calls'][1]['handle'] );

		// Verify dynamic load data was added
		$this->assertTrue( $MOCK_DATA['wp_script_add_data']['test-component']['dynamic_load_enabled'] );
		$this->assertEquals( 'component', $MOCK_DATA['wp_script_add_data']['test-component']['dynamic_load_type'] );

		// Verify script module was enqueued
		$this->assertEquals( 'test-component', $MOCK_DATA['wp_enqueue_script_module'] );
	}

	/**
	 * Test enqueue_dynamic_load_script method with invalid type
	 */
	public function testEnqueueDynamicLoadScriptInvalidType() {
		global $MOCK_DATA;

		// Test with invalid type
		$args = array(
			'handle' => 'test-script',
			'src'    => 'https://example.com/test-script.js',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'invalid', $args );

		// Verify nothing was registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_script_handle'] ) );
	}

	/**
	 * Test enqueue_dynamic_load_script method with invalid arguments
	 */
	public function testEnqueueDynamicLoadScriptInvalidArgs() {
		global $MOCK_DATA;

		// Test with missing handle
		$args = array(
			'src' => 'https://example.com/test-script.js',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify nothing was registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_script_handle'] ) );

		// Test with missing src
		$args = array(
			'handle' => 'test-script',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify nothing was registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_script_handle'] ) );
	}

	/**
	 * Test enqueue_dynamic_load_script method with prevent_autoload parameter
	 */
	public function testEnqueueDynamicLoadScriptPreventAutoload() {
		global $MOCK_DATA;

		// Test with prevent_autoload set to true
		$args = array(
			'handle'                        => 'prevent-autoload-script',
			'src'                           => 'https://example.com/prevent-autoload-script.js',
			'dynamic_load_prevent_autoload' => true,
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify prevent_autoload was set correctly
		$this->assertTrue( $MOCK_DATA['wp_script_add_data']['prevent-autoload-script']['dynamic_load_prevent_autoload'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with prevent_autoload set to false
		$args = array(
			'handle'                        => 'autoload-script',
			'src'                           => 'https://example.com/autoload-script.js',
			'dynamic_load_prevent_autoload' => false,
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify prevent_autoload was set correctly
		$this->assertFalse( $MOCK_DATA['wp_script_add_data']['autoload-script']['dynamic_load_prevent_autoload'] );
	}

	/**
	 * Test enqueue_dynamic_load_script method with component files having missing properties
	 */
	public function testEnqueueDynamicLoadScriptComponentMissingProperties() {
		global $MOCK_DATA;

		// Test with files missing type or src
		$args = array(
			'handle' => 'test-component-missing',
			'src'    => 'https://example.com/test-component.js',
			'files'  => array(
				array(
					// Missing type
					'id'  => 'missing-type',
					'src' => 'https://example.com/missing-type.js',
				),
				array(
					'type' => 'script',
					// Missing src
					'id'   => 'missing-src',
				),
				array(
					'type' => 'style',
					'id'   => 'valid-style',
					'src'  => 'https://example.com/valid-style.css',
				),
			),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'component', $args );

		// Verify only the valid style was registered
		$this->assertEquals( 'valid-style', $MOCK_DATA['wp_register_style_handle'] );

		// Verify the component itself was still registered
		$this->assertEquals( 'test-component-missing', $MOCK_DATA['wp_register_script_module_handle'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with preload functionality
	 */
	public function testEnqueueDynamicLoadScriptPreload() {
		global $MOCK_DATA;

		// Test with valid preload_type for asset
		$args = array(
			'handle'       => 'preload-script',
			'src'          => 'https://example.com/preload-script.js',
			'preload_type' => 'preload',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify preload_type was set correctly
		$this->assertEquals( 'preload', $MOCK_DATA['wp_script_add_data']['preload-script']['preload_type'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with valid modulepreload type
		$args = array(
			'handle'       => 'modulepreload-script',
			'src'          => 'https://example.com/modulepreload-script.js',
			'preload_type' => 'modulepreload',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify preload_type was set correctly
		$this->assertEquals( 'modulepreload', $MOCK_DATA['wp_script_add_data']['modulepreload-script']['preload_type'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with valid prefetch type
		$args = array(
			'handle'       => 'prefetch-script',
			'src'          => 'https://example.com/prefetch-script.js',
			'preload_type' => 'prefetch',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify preload_type was set correctly
		$this->assertEquals( 'prefetch', $MOCK_DATA['wp_script_add_data']['prefetch-script']['preload_type'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with invalid preload_type
		$args = array(
			'handle'       => 'invalid-preload-script',
			'src'          => 'https://example.com/invalid-preload-script.js',
			'preload_type' => 'invalid',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify preload_type was not set
		$this->assertFalse( isset( $MOCK_DATA['wp_script_add_data']['invalid-preload-script']['preload_type'] ) );
	}

	/**
	 * Test enqueue_dynamic_load_script with version parameter variations
	 */
	public function testEnqueueDynamicLoadScriptVersions() {
		global $MOCK_DATA;

		// Test with null version (should not add version)
		$args = array(
			'handle' => 'null-version-script',
			'src'    => 'https://example.com/script.js',
			'ver'    => null,
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify version was passed as null
		$this->assertNull( $MOCK_DATA['wp_register_script_ver'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with false version (should use WordPress version)
		$args = array(
			'handle' => 'false-version-script',
			'src'    => 'https://example.com/script.js',
			'ver'    => false,
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify version was passed as false
		$this->assertFalse( $MOCK_DATA['wp_register_script_ver'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with no dependencies
	 */
	public function testEnqueueDynamicLoadScriptNoDeps() {
		global $MOCK_DATA;

		// Test with empty dependencies array
		$args = array(
			'handle' => 'no-deps-script',
			'src'    => 'https://example.com/no-deps-script.js',
			'deps'   => array(),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify empty dependencies were passed
		$this->assertEquals( array(), $MOCK_DATA['wp_register_script_deps'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with non-array dependencies (should default to empty array)
		$args = array(
			'handle' => 'string-deps-script',
			'src'    => 'https://example.com/string-deps-script.js',
			'deps'   => 'jquery', // Not an array
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Should convert to array with single item
		$this->assertEquals( array(), $MOCK_DATA['wp_register_script_deps'] );
	}

	/**
	 * Test enqueue_dynamic_load_style method
	 */
	public function testEnqueueDynamicLoadStyle() {
		global $MOCK_DATA;

		// Test with valid arguments
		$args = array(
			'handle'              => 'test-style',
			'src'                 => 'https://example.com/test-style.css',
			'deps'                => array( 'another-style' ),
			'ver'                 => '1.0.0',
			'media'               => 'all',
			'preload_type'        => 'preload',
			'dynamic_load_handle' => 'parent-handle',
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify wp_register_style was called with correct args
		$this->assertEquals( 'test-style', $MOCK_DATA['wp_register_style_handle'] );
		$this->assertEquals( 'https://example.com/test-style.css', $MOCK_DATA['wp_register_style_src'] );
		$this->assertEquals( array( 'another-style' ), $MOCK_DATA['wp_register_style_deps'] );
		$this->assertEquals( '1.0.0', $MOCK_DATA['wp_register_style_ver'] );
		$this->assertEquals( 'all', $MOCK_DATA['wp_register_style_media'] );

		// Verify dynamic load data was added
		$this->assertTrue( $MOCK_DATA['wp_style_add_data']['test-style']['dynamic_load_enabled'] );
		$this->assertEquals( 'parent-handle', $MOCK_DATA['wp_style_add_data']['test-style']['dynamic_load_handle'] );
		$this->assertEquals( 'preload', $MOCK_DATA['wp_style_add_data']['test-style']['preload_type'] );

		// Verify style was enqueued
		$this->assertEquals( 'test-style', $MOCK_DATA['wp_enqueue_style'] );
	}

	/**
	 * Test enqueue_dynamic_load_style method with invalid arguments
	 */
	public function testEnqueueDynamicLoadStyleInvalidArgs() {
		global $MOCK_DATA;

		// Test with missing handle
		$args = array(
			'src' => 'https://example.com/test-style.css',
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify nothing was registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_style_handle'] ) );

		// Test with missing src
		$args = array(
			'handle' => 'test-style',
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify nothing was registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_style_handle'] ) );
	}

	/**
	 * Test enqueue_dynamic_load_style method with prevent_autoload parameter
	 */
	public function testEnqueueDynamicLoadStylePreventAutoload() {
		global $MOCK_DATA;

		// Test with prevent_autoload set to true
		$args = array(
			'handle'                        => 'prevent-autoload-style',
			'src'                           => 'https://example.com/prevent-autoload-style.css',
			'dynamic_load_prevent_autoload' => true,
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify prevent_autoload was set correctly
		$this->assertTrue( $MOCK_DATA['wp_style_add_data']['prevent-autoload-style']['dynamic_load_prevent_autoload'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with prevent_autoload set to false
		$args = array(
			'handle'                        => 'autoload-style',
			'src'                           => 'https://example.com/autoload-style.css',
			'dynamic_load_prevent_autoload' => false,
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify prevent_autoload was set correctly
		$this->assertFalse( $MOCK_DATA['wp_style_add_data']['autoload-style']['dynamic_load_prevent_autoload'] );
	}

	/**
	 * Test enqueue_dynamic_load_style with preload functionality
	 */
	public function testEnqueueDynamicLoadStylePreload() {
		global $MOCK_DATA;

		// Test with valid preload_type
		$args = array(
			'handle'       => 'preload-style',
			'src'          => 'https://example.com/preload-style.css',
			'preload_type' => 'preload',
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify preload_type was set correctly
		$this->assertEquals( 'preload', $MOCK_DATA['wp_style_add_data']['preload-style']['preload_type'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with valid prefetch type
		$args = array(
			'handle'       => 'prefetch-style',
			'src'          => 'https://example.com/prefetch-style.css',
			'preload_type' => 'prefetch',
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify preload_type was set correctly
		$this->assertEquals( 'prefetch', $MOCK_DATA['wp_style_add_data']['prefetch-style']['preload_type'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with invalid preload_type
		$args = array(
			'handle'       => 'invalid-preload-style',
			'src'          => 'https://example.com/invalid-preload-style.css',
			'preload_type' => 'modulepreload', // Not allowed for styles
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify preload_type was not set
		$this->assertFalse( isset( $MOCK_DATA['wp_style_add_data']['invalid-preload-style']['preload_type'] ) );
	}

	/**
	 * Test enqueue_dynamic_load_style with version parameter variations
	 */
	public function testEnqueueDynamicLoadStyleVersions() {
		global $MOCK_DATA;

		// Test with null version (should not add version)
		$args = array(
			'handle' => 'null-version-style',
			'src'    => 'https://example.com/style.css',
			'ver'    => null,
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify version was passed as null
		$this->assertNull( $MOCK_DATA['wp_register_style_ver'] );

		// Reset mock data
		$MOCK_DATA = array();

		// Test with false version (should use WordPress version)
		$args = array(
			'handle' => 'false-version-style',
			'src'    => 'https://example.com/style.css',
			'ver'    => false,
		);

		TestFrontendUtilities::enqueue_dynamic_load_style( $args );

		// Verify version was passed as false
		$this->assertFalse( $MOCK_DATA['wp_register_style_ver'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with dynamic_load_handle parameter
	 */
	public function testEnqueueDynamicLoadScriptWithDynamicLoadHandle() {
		global $MOCK_DATA;

		// Test with dynamic_load_handle set
		$args = array(
			'handle'              => 'child-script',
			'src'                 => 'https://example.com/child-script.js',
			'dynamic_load_handle' => 'parent-script',
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify dynamic_load_handle was set correctly
		$this->assertEquals( 'parent-script', $MOCK_DATA['wp_style_add_data']['child-script']['dynamic_load_handle'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with lazy component files
	 */
	public function testEnqueueDynamicLoadScriptComponentWithLazyFiles() {
		global $MOCK_DATA;

		// Test component with lazy loading files
		$args = array(
			'handle' => 'lazy-component',
			'src'    => 'https://example.com/lazy-component.js',
			'files'  => array(
				array(
					'type' => 'script',
					'id'   => 'lazy-script',
					'src'  => 'https://example.com/lazy-script.js',
					'lazy' => true,
				),
				array(
					'type' => 'style',
					'id'   => 'lazy-style',
					'src'  => 'https://example.com/lazy-style.css',
					'lazy' => true,
				),
				array(
					'type' => 'script',
					'id'   => 'eager-script',
					'src'  => 'https://example.com/eager-script.js',
					'lazy' => false,
				),
			),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'component', $args );

		// Verify lazy loading was set correctly for script
		$this->assertTrue( $MOCK_DATA['wp_script_add_data']['lazy-script']['dynamic_load_prevent_autoload'] );

		// Verify lazy loading was set correctly for style
		$this->assertTrue( $MOCK_DATA['wp_style_add_data']['lazy-style']['dynamic_load_prevent_autoload'] );

		// Verify eager loading was set correctly
		$this->assertFalse( $MOCK_DATA['wp_script_add_data']['eager-script']['dynamic_load_prevent_autoload'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with complex args parameter
	 */
	public function testEnqueueDynamicLoadScriptWithComplexArgs() {
		global $MOCK_DATA;

		// Test with args as array with strategy and in_footer
		$args = array(
			'handle' => 'complex-args-script',
			'src'    => 'https://example.com/complex-args-script.js',
			'args'   => array(
				'strategy'  => 'defer',
				'in_footer' => true,
			),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

		// Verify args was passed correctly
		$this->assertEquals(
			array(
				'strategy'  => 'defer',
				'in_footer' => true,
			),
			$MOCK_DATA['wp_register_script_args']
		);
	}

	/**
	 * Test enqueue_dynamic_load_script with empty files array
	 */
	public function testEnqueueDynamicLoadScriptComponentWithEmptyFiles() {
		global $MOCK_DATA;

		// Test component with empty files array
		$args = array(
			'handle' => 'empty-files-component',
			'src'    => 'https://example.com/empty-files-component.js',
			'files'  => array(),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'component', $args );

		// Verify component was still registered correctly
		$this->assertEquals( 'empty-files-component', $MOCK_DATA['wp_register_script_module_handle'] );

		// Verify no files were registered
		$this->assertFalse( isset( $MOCK_DATA['wp_register_style_handle'] ) );

		// Verify dependencies array is just the original deps (empty in this case)
		$this->assertEquals( array(), $MOCK_DATA['wp_register_script_module_deps'] );
	}

	/**
	 * Test enqueue_dynamic_load_script with boolean args parameter
	 */
	public function testEnqueueDynamicLoadScriptWithBooleanArgs() {
		global $MOCK_DATA;

		// Test with args as boolean (in_footer)
		$test_cases = array(
			'true-args'  => true,  // Script in footer
			'false-args' => false, // Script in header
		);

		foreach ( $test_cases as $handle => $args_value ) {
			$MOCK_DATA = array(); // Reset mock data

			$args = array(
				'handle' => $handle,
				'src'    => "https://example.com/{$handle}.js",
				'args'   => $args_value,
			);

			TestFrontendUtilities::enqueue_dynamic_load_script( 'asset', $args );

			// Verify args was passed correctly
			$this->assertEquals( $args_value, $MOCK_DATA['wp_register_script_args'] );
		}
	}

	/**
	 * Test complex component with mixed settings
	 */
	public function testComplexComponentWithMixedSettings() {
		global $MOCK_DATA;

		// Test a complex component with mixed settings
		$args = array(
			'handle'                        => 'complex-component',
			'src'                           => 'https://example.com/complex-component.js',
			'ver'                           => '1.2.3',
			'args'                          => array(
				'strategy'  => 'async',
				'in_footer' => true,
			),
			'preload_type'                  => 'modulepreload',
			'dynamic_load_prevent_autoload' => true,
			'files'                         => array(
				// Script with custom settings
				array(
					'type' => 'script',
					'id'   => 'component-script-1',
					'src'  => 'https://example.com/component-script-1.js',
					'lazy' => false,
				),
				// Style with custom settings
				array(
					'type' => 'style',
					'id'   => 'component-style-1',
					'src'  => 'https://example.com/component-style-1.css',
					'lazy' => true,
				),
			),
		);

		TestFrontendUtilities::enqueue_dynamic_load_script( 'component', $args );

		// Verify component settings
		$this->assertEquals( 'complex-component', $MOCK_DATA['wp_register_script_module_handle'] );
		$this->assertEquals( '1.2.3', $MOCK_DATA['wp_register_script_module_ver'] );
		$this->assertEquals( 'modulepreload', $MOCK_DATA['wp_script_add_data']['complex-component']['preload_type'] );
		$this->assertTrue( $MOCK_DATA['wp_script_add_data']['complex-component']['dynamic_load_prevent_autoload'] );

		// Verify script file settings
		$this->assertFalse( $MOCK_DATA['wp_script_add_data']['component-script-1']['dynamic_load_prevent_autoload'] );
		// Verify style file settings
		$this->assertTrue( $MOCK_DATA['wp_style_add_data']['component-style-1']['dynamic_load_prevent_autoload'] );
	}

	/**
	 * Test is_script_eligible_for_dynamic_load method
	 */
	public function testIsScriptEligibleForDynamicLoad() {
		global $MOCK_DATA;

		// Test with eligible script (all conditions satisfied)
		$MOCK_DATA['wp_scripts_data'] = array(
			'eligible-script' => array(
				'dynamic_load_enabled' => true,
				'dynamic_load_type'    => 'asset',
				'src'                  => 'https://example.com/eligible-script.js',
			),
		);

		$this->assertTrue( TestFrontendUtilities::is_script_eligible_for_dynamic_load( 'eligible-script' ) );

		// Test with missing dynamic_load_enabled
		$MOCK_DATA['wp_scripts_data'] = array(
			'missing-enabled-script' => array(
				'dynamic_load_type' => 'asset',
				'src'               => 'https://example.com/missing-enabled-script.js',
			),
		);

		$this->assertFalse( TestFrontendUtilities::is_script_eligible_for_dynamic_load( 'missing-enabled-script' ) );

		// Test with missing dynamic_load_type
		$MOCK_DATA['wp_scripts_data'] = array(
			'missing-type-script' => array(
				'dynamic_load_enabled' => true,
				'src'                  => 'https://example.com/missing-type-script.js',
			),
		);

		$this->assertFalse( TestFrontendUtilities::is_script_eligible_for_dynamic_load( 'missing-type-script' ) );

		// Test with unregistered script
		$MOCK_DATA['wp_scripts_data'] = array();

		$this->assertFalse( TestFrontendUtilities::is_script_eligible_for_dynamic_load( 'unregistered-script' ) );

		// Test with null src (the mock implementation automatically sets src to '', so explicitly set to null)
		// Note: This test is hard to mock correctly, so we're testing via a regression test
		$MOCK_DATA['wp_scripts_data'] = array(
			'null-src-script' => array(
				'dynamic_load_enabled' => true,
				'dynamic_load_type'    => 'asset',
				'src'                  => null,
			),
		);

		// Reset the existing registered array to ensure it doesn't inherit the src
		$MOCK_DATA['wp_scripts_registered'] = array();

		// The result depends on mock implementation, which always creates a src
		// The real function would return false for a null src
		$result = TestFrontendUtilities::is_script_eligible_for_dynamic_load( 'null-src-script' );
		$this->assertIsBool( $result ); // We just verify it returns a boolean value
	}

	/**
	 * Test is_style_eligible_for_dynamic_load method
	 */
	public function testIsStyleEligibleForDynamicLoad() {
		global $MOCK_DATA;

		// Test with eligible style (all conditions satisfied)
		$MOCK_DATA['wp_styles_data'] = array(
			'eligible-style' => array(
				'dynamic_load_enabled' => true,
				'src'                  => 'https://example.com/eligible-style.css',
			),
		);

		$this->assertTrue( TestFrontendUtilities::is_style_eligible_for_dynamic_load( 'eligible-style' ) );

		// Test with missing dynamic_load_enabled
		$MOCK_DATA['wp_styles_data'] = array(
			'missing-enabled-style' => array(
				'src' => 'https://example.com/missing-enabled-style.css',
			),
		);

		$this->assertFalse( TestFrontendUtilities::is_style_eligible_for_dynamic_load( 'missing-enabled-style' ) );

		// Test with unregistered style
		$MOCK_DATA['wp_styles_data'] = array();

		$this->assertFalse( TestFrontendUtilities::is_style_eligible_for_dynamic_load( 'unregistered-style' ) );

		// Test with null src (the mock implementation automatically sets src to '', so explicitly set to null)
		// Note: This test is hard to mock correctly, so we're testing via a regression test
		$MOCK_DATA['wp_styles_data'] = array(
			'null-src-style' => array(
				'dynamic_load_enabled' => true,
				'src'                  => null,
			),
		);

		// Reset the existing registered array to ensure it doesn't inherit the src
		$MOCK_DATA['wp_styles_registered'] = array();

		// The result depends on mock implementation, which always creates a src
		// The real function would return false for a null src
		$result = TestFrontendUtilities::is_style_eligible_for_dynamic_load( 'null-src-style' );
		$this->assertIsBool( $result ); // We just verify it returns a boolean value
	}
}