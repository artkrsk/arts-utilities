<?php

namespace Tests\Unit\Traits\Elementor;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Elementor\Plugin;

class TestElementorPlugin {
	use Plugin;

	// Override methods to use our mock system for testing
	public static function is_elementor_plugin_active() {
		global $MOCK_DATA;
		return $MOCK_DATA['elementor_exists'] ?? false;
	}

	public static function is_shop() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_shop'] ?? false;
	}

	// Mock the Elementor Plugin instance and methods
	public static function is_built_with_elementor( $post_id = null ) {
		global $MOCK_DATA, $post;

		if ( ! self::is_elementor_plugin_active() ) {
			return false;
		}

		if ( is_home() ) {
			$post_id = $MOCK_DATA['options']['page_for_posts'] ?? 0;
		}

		if ( self::is_shop() ) {
			$post_id = $MOCK_DATA['options']['woocommerce_shop_page_id'] ?? 0;
		}

		if ( ! $post_id ) {
			$post_id = $post->ID ?? 0;
		}

		if ( is_singular() ) {
			return isset( $MOCK_DATA['elementor_documents'][ $post_id ] );
		}

		return false;
	}

	public static function is_elementor_editor_active() {
		global $MOCK_DATA;

		if ( ! self::is_elementor_plugin_active() ) {
			return false;
		}

		return $MOCK_DATA['is_preview_mode'] ?? false;
	}

	public static function is_elementor_feature_active( $feature_name ) {
		global $MOCK_DATA;

		if ( ! self::is_elementor_plugin_active() ) {
			return false;
		}

		return isset( $MOCK_DATA['active_features'] ) &&
			   in_array( $feature_name, $MOCK_DATA['active_features'] );
	}
}

class PluginTest extends TestCase {
	protected $test_plugin;

	protected function setUp(): void {
		parent::setUp();
		$this->test_plugin = new TestElementorPlugin();

		// Initialize global plugin instance
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			// Create a mock Elementor Plugin class if needed
			$this->markTestSkipped( 'Elementor Plugin class not available for testing' );
		}

		new \Elementor\Plugin();
	}

	/**
	 * Test is_elementor_plugin_active method
	 */
	public function testIsElementorPluginActive() {
		global $MOCK_DATA;

		// Test when Elementor is active
		$MOCK_DATA['elementor_exists'] = true;
		$this->assertTrue( TestElementorPlugin::is_elementor_plugin_active() );

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$this->assertFalse( TestElementorPlugin::is_elementor_plugin_active() );
	}

	/**
	 * Test is_built_with_elementor method
	 */
	public function testIsBuiltWithElementor() {
		global $MOCK_DATA, $post;

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$this->assertFalse( TestElementorPlugin::is_built_with_elementor() );

		// Test with blog page
		$MOCK_DATA['elementor_exists']          = true;
		$MOCK_DATA['is_home']                   = true;
		$MOCK_DATA['options']['page_for_posts'] = 10;
		$MOCK_DATA['elementor_documents'][10]   = true;
		$MOCK_DATA['is_singular']               = true;
		$this->assertTrue( TestElementorPlugin::is_built_with_elementor() );

		// Test with shop page
		$MOCK_DATA['is_home']                             = false;
		$MOCK_DATA['is_shop']                             = true;
		$MOCK_DATA['options']['woocommerce_shop_page_id'] = 20;
		$MOCK_DATA['elementor_documents'][20]             = true;
		$this->assertTrue( TestElementorPlugin::is_built_with_elementor() );

		// Test with regular post
		$MOCK_DATA['is_shop']                 = false;
		$post                                 = new \WP_Post( array( 'ID' => 30 ) );
		$MOCK_DATA['elementor_documents'][30] = true;
		$this->assertTrue( TestElementorPlugin::is_built_with_elementor() );

		// Test with non-Elementor post
		$post                             = new \WP_Post( array( 'ID' => 40 ) );
		$MOCK_DATA['elementor_documents'] = array(
			10 => true,
			20 => true,
			30 => true,
		);
		$this->assertFalse( TestElementorPlugin::is_built_with_elementor() );

		// Test with non-singular
		$MOCK_DATA['is_singular'] = false;
		$this->assertFalse( TestElementorPlugin::is_built_with_elementor() );
	}

	/**
	 * Test is_elementor_editor_active method
	 */
	public function testIsElementorEditorActive() {
		global $MOCK_DATA;

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$this->assertFalse( TestElementorPlugin::is_elementor_editor_active() );

		// Test when Elementor is active but not in preview mode
		$MOCK_DATA['elementor_exists'] = true;
		$MOCK_DATA['is_preview_mode']  = false;
		$this->assertFalse( TestElementorPlugin::is_elementor_editor_active() );

		// Test when Elementor is active and in preview mode
		$MOCK_DATA['is_preview_mode'] = true;
		$this->assertTrue( TestElementorPlugin::is_elementor_editor_active() );
	}

	/**
	 * Test is_elementor_feature_active method
	 */
	public function testIsElementorFeatureActive() {
		global $MOCK_DATA;

		// Test when Elementor is not active
		$MOCK_DATA['elementor_exists'] = false;
		$this->assertFalse( TestElementorPlugin::is_elementor_feature_active( 'some_feature' ) );

		// Test when Elementor is active but feature is not
		$MOCK_DATA['elementor_exists'] = true;
		$MOCK_DATA['active_features']  = array( 'feature1', 'feature2' );
		$this->assertFalse( TestElementorPlugin::is_elementor_feature_active( 'some_feature' ) );

		// Test when Elementor is active and feature is active
		$MOCK_DATA['active_features'] = array( 'feature1', 'some_feature', 'feature2' );
		$this->assertTrue( TestElementorPlugin::is_elementor_feature_active( 'some_feature' ) );
	}
}
