<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Strings;

class TestStringsUtilities {
	use Strings;
}

class StringsTest extends TestCase {
	protected $test_utilities;

	protected function setUp(): void {
		parent::setUp();
		$this->test_utilities = new TestStringsUtilities();
	}

	/**
	 * Test convert_camel_to_kebab_case method
	 */
	public function testConvertCamelToKebabCase() {
		// Test with camelCase string
		$result = TestStringsUtilities::convert_camel_to_kebab_case( 'myCamelCaseString' );
		$this->assertEquals( 'my-camel-case-string', $result );

		// Test with PascalCase string
		$result = TestStringsUtilities::convert_camel_to_kebab_case( 'PascalCaseString' );
		$this->assertEquals( 'pascal-case-string', $result );

		// Test with already kebab case
		$result = TestStringsUtilities::convert_camel_to_kebab_case( 'already-kebab-case' );
		$this->assertEquals( 'already-kebab-case', $result );

		// Test with empty string
		$result = TestStringsUtilities::convert_camel_to_kebab_case( '' );
		$this->assertEquals( '', $result );

		// Test with single word
		$result = TestStringsUtilities::convert_camel_to_kebab_case( 'Word' );
		$this->assertEquals( 'word', $result );
	}

	/**
	 * Test convert_camel_to_snake_case method
	 */
	public function testConvertCamelToSnakeCase() {
		// Test with camelCase string
		$result = TestStringsUtilities::convert_camel_to_snake_case( 'myCamelCaseString' );
		$this->assertEquals( 'my_camel_case_string', $result );

		// Test with PascalCase string
		$result = TestStringsUtilities::convert_camel_to_snake_case( 'PascalCaseString' );
		$this->assertEquals( 'pascal_case_string', $result );

		// Test with already snake case
		$result = TestStringsUtilities::convert_camel_to_snake_case( 'already_snake_case' );
		$this->assertEquals( 'already_snake_case', $result );

		// Test with empty string
		$result = TestStringsUtilities::convert_camel_to_snake_case( '' );
		$this->assertEquals( '', $result );

		// Test with single word
		$result = TestStringsUtilities::convert_camel_to_snake_case( 'Word' );
		$this->assertEquals( 'word', $result );
	}

	/**
	 * Test convert_kebab_case_to_camel method
	 */
	public function testConvertKebabCaseToCamel() {
		// Test with kebab-case string
		$result = TestStringsUtilities::convert_kebab_case_to_camel( 'my-kebab-case-string' );
		$this->assertEquals( 'myKebabCaseString', $result );

		// Test with already camelCase
		$result = TestStringsUtilities::convert_kebab_case_to_camel( 'alreadyCamelCase' );
		$this->assertEquals( 'alreadycamelcase', $result );

		// Test with empty string
		$result = TestStringsUtilities::convert_kebab_case_to_camel( '' );
		$this->assertEquals( '', $result );

		// Test with single word
		$result = TestStringsUtilities::convert_kebab_case_to_camel( 'word' );
		$this->assertEquals( 'word', $result );

		// Test with leading/trailing hyphens
		$result = TestStringsUtilities::convert_kebab_case_to_camel( '-my-string-' );
		$this->assertEquals( 'myString', $result );

		// Test with multiple consecutive hyphens
		$result = TestStringsUtilities::convert_kebab_case_to_camel( 'multiple---hyphens' );
		$this->assertEquals( 'multipleHyphens', $result );

		// Test with non-string input
		$result = TestStringsUtilities::convert_kebab_case_to_camel( 123 );
		$this->assertEquals( '', $result );
	}

	/**
	 * Test get_slug_from_string method
	 */
	public function testGetSlugFromString() {
		// Test with spaces
		$result = TestStringsUtilities::get_slug_from_string( 'This is a string' );
		$this->assertEquals( 'this_is_a_string', $result );

		// Test with special characters
		$input    = 'Special? #characters-and_symbols/.';
		$expected = 'special___characters_and_symbols__';
		$result   = TestStringsUtilities::get_slug_from_string( $input );
		$this->assertEquals( $expected, $result );

		// Test with custom replacement
		$result = TestStringsUtilities::get_slug_from_string( 'Replace with dashes', '-' );
		$this->assertEquals( 'replace-with-dashes', $result );

		// Test with uppercase
		$result = TestStringsUtilities::get_slug_from_string( 'UPPERCASE' );
		$this->assertEquals( 'uppercase', $result );

		// Test with empty string
		$result = TestStringsUtilities::get_slug_from_string( '' );
		$this->assertEquals( '', $result );
	}

	/**
	 * Test get_asset_url_file_extension method
	 */
	public function testGetAssetUrlFileExtension() {
		// Test with standard URL
		$result = TestStringsUtilities::get_asset_url_file_extension( 'https://example.com/assets/image.jpg' );
		$this->assertEquals( 'jpg', $result );

		// Test with query parameters
		$result = TestStringsUtilities::get_asset_url_file_extension( 'https://example.com/script.js?v=1.0' );
		$this->assertEquals( 'js', $result );

		// Test with no extension
		$result = TestStringsUtilities::get_asset_url_file_extension( 'https://example.com/no-extension' );
		$this->assertEquals( '', $result );

		// Test with path only
		$result = TestStringsUtilities::get_asset_url_file_extension( '/path/to/file.css' );
		$this->assertEquals( 'css', $result );

		// Test with double extension
		$result = TestStringsUtilities::get_asset_url_file_extension( 'https://example.com/file.min.js' );
		$this->assertEquals( 'js', $result );
	}
}
