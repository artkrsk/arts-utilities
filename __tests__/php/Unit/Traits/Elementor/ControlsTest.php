<?php

namespace Tests\Unit\Traits\Elementor;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Elementor\Controls;
use Arts\Utilities\Traits\Images;

class TestElementorControls {
	use Controls, Images;

	// Add static method to get image aspect ratio for testing
	public static function get_image_aspect_ratio( $image_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA['image_aspect_ratios'][ $image_id ] ?? 1.5; // Default 3:2 ratio
	}
}

class ControlsTest extends TestCase {
	protected $test_controls;

	protected function setUp(): void {
		parent::setUp();
		$this->test_controls = new TestElementorControls();

		// Make sure ELEMENTOR_PATH exists and contains the BFI Thumb file
		if ( ! file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' ) ) {
			mkdir( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/', 0777, true );
		}

		// Create a minimal bfi-thumb.php file
		file_put_contents(
			ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php',
			'<?php /* Mock BFI Thumb */ ?>'
);
}

protected function tearDown(): void {
parent::tearDown();

// Clean up the mock BFI Thumb file
if ( file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php' ) ) {
unlink( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php' );
}

if ( file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' ) ) {
rmdir( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' );
}

if ( file_exists( ELEMENTOR_PATH . 'includes/libraries/' ) ) {
rmdir( ELEMENTOR_PATH . 'includes/libraries/' );
}

if ( file_exists( ELEMENTOR_PATH . 'includes/' ) ) {
rmdir( ELEMENTOR_PATH . 'includes/' );
}
}

/**
*/
public function testGetGroupControlValue() {
// Test with empty settings
$settings = array();
$result = TestElementorControls::get_group_control_value( $settings, 'image', 'size', 'fallback' );
$this->assertEquals( 'fallback', $result );

// Test with existing settings
$settings = array(
'image_size' => 'medium',
);
$result = TestElementorControls::get_group_control_value( $settings, 'image', 'size', 'fallback' );
$this->assertEquals( 'medium', $result );

// Test with different group control prefix
$settings = array(
'thumbnail_type' => 'custom',
);
$result = TestElementorControls::get_group_control_value( $settings, 'thumbnail', 'type', 'default' );
$this->assertEquals( 'custom', $result );
}

/**
*/
public function testGetSettingsThumbnailSize() {
global $MOCK_DATA;

// Test with empty image ID
$settings = array();
$result = TestElementorControls::get_settings_thumbnail_size( $settings, '', 'image' );
$this->assertFalse( $result );

// Test with standard size
$settings = array(
'image_size' => 'medium',
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, 123, 'image' );
$this->assertEquals( 'medium', $result );

// Test with custom size - both width and height
$settings = array(
'image_size' => 'custom',
'image_custom_dimension' => array(
'width' => 300,
'height' => 200,
),
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, 123, 'image' );
$this->assertEquals(
array(
0 => 300,
1 => 200,
'bfi_thumb' => true,
'crop' => true,
),
$result
);

// Test with custom size - only width
$MOCK_DATA['image_aspect_ratios'][123] = 1.5; // 3:2 aspect ratio
$settings = array(
'image_size' => 'custom',
'image_custom_dimension' => array(
'width' => 300,
'height' => 0,
),
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, 123, 'image' );
$this->assertEquals(
array(
0 => 300,
1 => 200, // 300 / 1.5 = 200
'bfi_thumb' => true,
'crop' => true,
),
$result
);

// Test with custom size - only height
$settings = array(
'image_size' => 'custom',
'image_custom_dimension' => array(
'width' => 0,
'height' => 200,
),
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, 123, 'image' );
$this->assertEquals(
array(
0 => 300, // 200 * 1.5 = 300
1 => 200,
'bfi_thumb' => true,
'crop' => true,
),
$result
);

// Test with custom size but no dimensions
$settings = array(
'image_size' => 'custom',
'image_custom_dimension' => array(
'width' => 0,
'height' => 0,
),
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, 123, 'image' );
$this->assertEquals( 'full', $result );

// Test with image ID as array
$settings = array(
'image_size' => 'large',
);
$result = TestElementorControls::get_settings_thumbnail_size( $settings, array( 'id' => 123 ), 'image' );
$this->assertEquals( 'large', $result );
}
}