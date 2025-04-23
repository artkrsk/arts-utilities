<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;
use Arts\Utilities\Utilities;

// Create a test class that extends Utilities and overrides the protected methods
class TestACFUtilities extends Utilities {
	// Make the method public for testing
	public static function acf_function_exists( $function_name ) {
		global $MOCK_DATA;
		return $MOCK_DATA['acf_exists'] ?? false;
	}
}

class ACFTest extends TestCase {
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
	 * Test acf_get_field method when ACF is available
	 */
	public function testAcfGetFieldWhenAvailable() {
		global $MOCK_DATA;

		// Test when get_field function exists and returns a value
		$MOCK_DATA['acf_exists']      = true;
		$MOCK_DATA['acf_field_value'] = 'field_value';

		$this->assertEquals( 'field_value', TestACFUtilities::acf_get_field( 'field_name' ) );
	}

	/**
	 * Test acf_get_field method when ACF is not available
	 */
	public function testAcfGetFieldWhenNotAvailable() {
		global $MOCK_DATA;

		// Explicitly set ACF as not existing
		$MOCK_DATA['acf_exists'] = false;

		$this->assertFalse( TestACFUtilities::acf_get_field( 'field_name' ) );
	}

	/**
	 * Test acf_have_rows method when ACF is available
	 */
	public function testAcfHaveRowsWhenAvailable() {
		global $MOCK_DATA;

		// Test when have_rows function exists and returns true
		$MOCK_DATA['acf_exists']    = true;
		$MOCK_DATA['acf_have_rows'] = true;

		$this->assertTrue( TestACFUtilities::acf_have_rows( 'repeater_field' ) );
	}

	/**
	 * Test acf_have_rows method when ACF is not available
	 */
	public function testAcfHaveRowsWhenNotAvailable() {
		global $MOCK_DATA;

		// Explicitly set ACF as not existing
		$MOCK_DATA['acf_exists'] = false;

		$this->assertFalse( TestACFUtilities::acf_have_rows( 'repeater_field' ) );
	}

	/**
	 * Test acf_get_field_objects method when ACF is available
	 */
	public function testAcfGetFieldObjectsWhenAvailable() {
		global $MOCK_DATA;

		// Test when get_field_objects function exists and returns an array
		$mockFields = array(
			'field1' => array(
				'name'  => 'field1',
				'value' => 'value1',
			),
			'field2' => array(
				'name'  => 'field2',
				'value' => 'value2',
			),
		);

		$MOCK_DATA['acf_exists']        = true;
		$MOCK_DATA['acf_field_objects'] = $mockFields;

		$this->assertEquals( $mockFields, TestACFUtilities::acf_get_field_objects() );
	}

	/**
	 * Test acf_get_field_objects method when ACF is not available
	 */
	public function testAcfGetFieldObjectsWhenNotAvailable() {
		global $MOCK_DATA;

		// Explicitly set ACF as not existing
		$MOCK_DATA['acf_exists'] = false;

		$this->assertFalse( TestACFUtilities::acf_get_field_objects() );
	}

	/**
	 * Test acf_get_post_fields method
	 */
	public function testAcfGetPostFields() {
		global $MOCK_DATA;

		// Mock field objects returned from acf_get_field_objects
		$mockFieldObjects = array(
			'field1' => array(
				'name'  => 'field1',
				'value' => 'value1',
			),
			'field2' => array(
				'name'  => 'field2',
				'value' => 'value2',
			),
		);

		// Expected result
		$expected = array(
			'field1' => 'value1',
			'field2' => 'value2',
		);

		// Test with valid post ID
		$MOCK_DATA['acf_exists']        = true;
		$MOCK_DATA['acf_field_objects'] = $mockFieldObjects;

		$this->assertEquals( $expected, TestACFUtilities::acf_get_post_fields( 123 ) );

		// Test with invalid post ID
		$this->assertEquals( array(), TestACFUtilities::acf_get_post_fields( false ) );
		$this->assertEquals( array(), TestACFUtilities::acf_get_post_fields( null ) );
		$this->assertEquals( array(), TestACFUtilities::acf_get_post_fields( 0 ) );

		// Test when get_field_objects returns empty
		$MOCK_DATA['acf_field_objects'] = array();

		$this->assertEquals( array(), TestACFUtilities::acf_get_post_fields( 456 ) );

		// Test when get_field_objects returns false
		$MOCK_DATA['acf_field_objects'] = false;

		$this->assertEquals( array(), TestACFUtilities::acf_get_post_fields( 789 ) );
	}
}
