<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Fonts;

/**
 * Test class that uses the Fonts trait
 */
class TestFontsUtilities {
	use Fonts;
}

/**
 * Test the Fonts trait
 */
class FontsTest extends TestCase {
	/**
	 * Instance of TestFontsUtilities
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

		// Create instance of TestFontsUtilities
		$this->test_utilities = new TestFontsUtilities();
	}

	/**
	 * Test get_fonts_mime_types method
	 */
	public function testGetFontsMimeTypes() {
		// Test with empty mime types
		$mime_types = array();
		$result     = TestFontsUtilities::get_fonts_mime_types( $mime_types );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'woff', $result );
		$this->assertArrayHasKey( 'woff2', $result );

		$this->assertEquals( 'font/woff|application/font-woff|application/x-font-woff|application/octet-stream', $result['woff'] );
		$this->assertEquals( 'font/woff2|application/octet-stream|font/x-woff2', $result['woff2'] );

		// Test with existing mime types
		$mime_types = array(
			'jpg'  => 'image/jpeg',
			'png'  => 'image/png',
			'woff' => 'old/mime/type',
		);

		$result = TestFontsUtilities::get_fonts_mime_types( $mime_types );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'jpg', $result );
		$this->assertArrayHasKey( 'png', $result );
		$this->assertArrayHasKey( 'woff', $result );
		$this->assertArrayHasKey( 'woff2', $result );

		$this->assertEquals( 'image/jpeg', $result['jpg'] );
		$this->assertEquals( 'image/png', $result['png'] );
		$this->assertEquals( 'font/woff|application/font-woff|application/x-font-woff|application/octet-stream', $result['woff'] );
		$this->assertEquals( 'font/woff2|application/octet-stream|font/x-woff2', $result['woff2'] );
	}

	/**
	 * Test get_fonts_custom_file_extensions method
	 */
	public function testGetFontsCustomFileExtensions() {
		// Test with WOFF file
		$types    = array(
			'ext'  => '',
			'type' => '',
		);
		$file     = '/path/to/font.woff';
		$filename = 'font.woff';
		$mimes    = array();

		$result = TestFontsUtilities::get_fonts_custom_file_extensions( $types, $file, $filename, $mimes );

		$this->assertIsArray( $result );
		$this->assertEquals( 'woff', $result['ext'] );
		$this->assertEquals( 'font/woff|application/font-woff|application/x-font-woff|application/octet-stream', $result['type'] );

		// Test with WOFF2 file
		$types    = array(
			'ext'  => '',
			'type' => '',
		);
		$file     = '/path/to/font.woff2';
		$filename = 'font.woff2';
		$mimes    = array();

		$result = TestFontsUtilities::get_fonts_custom_file_extensions( $types, $file, $filename, $mimes );

		$this->assertIsArray( $result );
		$this->assertEquals( 'woff2', $result['ext'] );
		$this->assertEquals( 'font/woff2|application/octet-stream|font/x-woff2', $result['type'] );

		// Test with non-font file (should return original types)
		$types    = array(
			'ext'  => 'jpg',
			'type' => 'image/jpeg',
		);
		$file     = '/path/to/image.jpg';
		$filename = 'image.jpg';
		$mimes    = array();

		$result = TestFontsUtilities::get_fonts_custom_file_extensions( $types, $file, $filename, $mimes );

		$this->assertIsArray( $result );
		$this->assertEquals( 'jpg', $result['ext'] );
		$this->assertEquals( 'image/jpeg', $result['type'] );
	}
}
