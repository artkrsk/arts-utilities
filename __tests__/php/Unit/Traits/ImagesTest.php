<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Images;

/**
 * Test class that uses the Images trait
 */
class TestImagesUtilities {
	use Images;
}

/**
 * Test the Images trait
 */
class ImagesTest extends TestCase {
	/**
	 * Instance of TestImagesUtilities
	 */
	protected $test_utilities;

	/**
	 * Setup for each test
	 */
	protected function setUp(): void {
		parent::setUp();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();

		// Create instance of TestImagesUtilities
		$this->test_utilities = new TestImagesUtilities();

		// Set up mock data
		$MOCK_DATA['image_src'] = array(
			1 => array(
				'https://example.com/image.jpg',  // URL
				800,                              // Width
				600,                              // Height
				false,                             // Is cropped
			),
		);

		$MOCK_DATA['image_sizes'] = array(
			'thumbnail',
			'medium',
			'medium_large',
			'large',
		);
	}

	/**
	 * Test get_image_aspect_ratio method
	 */
	public function testGetImageAspectRatio() {
		global $MOCK_DATA;

		// Test normal aspect ratio calculation
		$result = TestImagesUtilities::get_image_aspect_ratio( 1 );
		$this->assertEquals( 800 / 600, $result );

		// Test with zero height (should return 1)
		$MOCK_DATA['image_src'][2] = array(
			'https://example.com/image2.jpg',
			800,
			0,
			false,
		);
		$result                    = TestImagesUtilities::get_image_aspect_ratio( 2 );
		$this->assertEquals( 1, $result );

		// Test with null height (should return 1)
		$MOCK_DATA['image_src'][3] = array(
			'https://example.com/image3.jpg',
			800,
			null,
			false,
		);
		$result                    = TestImagesUtilities::get_image_aspect_ratio( 3 );
		$this->assertEquals( 1, $result );

		// Test with invalid image ID (should return 1)
		$result = TestImagesUtilities::get_image_aspect_ratio( 999 );
		$this->assertEquals( 1, $result );
	}

	/**
	 * Test get_available_image_sizes method
	 */
	public function testGetAvailableImageSizes() {
		global $MOCK_DATA;

		// Test with standard image sizes
		$result = TestImagesUtilities::get_available_image_sizes();

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'thumbnail', $result );
		$this->assertArrayHasKey( 'medium', $result );
		$this->assertArrayHasKey( 'medium_large', $result );
		$this->assertArrayHasKey( 'large', $result );
		$this->assertArrayHasKey( 'full', $result );

		// Check formatting of names
		$this->assertEquals( 'Thumbnail', $result['thumbnail'] );
		$this->assertEquals( 'Medium', $result['medium'] );
		$this->assertEquals( 'Medium Large', $result['medium_large'] );
		$this->assertEquals( 'Large', $result['large'] );
		$this->assertEquals( 'Full', $result['full'] );

		// Test with empty image sizes
		$MOCK_DATA['image_sizes'] = array();
		$result                   = TestImagesUtilities::get_available_image_sizes();

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'full', $result );
		$this->assertEquals( 'Full', $result['full'] );
	}
}
