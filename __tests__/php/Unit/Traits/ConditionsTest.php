<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Conditions;

class TestConditionsUtilities {
	use Conditions;
}

class ConditionsTest extends TestCase {
	protected $test_utilities;

	protected function setUp(): void {
		parent::setUp();
		$this->test_utilities = new TestConditionsUtilities();
	}

	/**
	 * Test is_archive method
	 */
	public function testIsArchive() {
		global $MOCK_DATA;

		// Test when is_home() is true
		$MOCK_DATA['is_home']     = true;
		$MOCK_DATA['is_category'] = false;
		$MOCK_DATA['is_search']   = false;
		$MOCK_DATA['is_archive']  = false;

		$result = TestConditionsUtilities::is_archive();
		$this->assertTrue( $result );

		// Test when is_category() is true
		$MOCK_DATA['is_home']     = false;
		$MOCK_DATA['is_category'] = true;

		$result = TestConditionsUtilities::is_archive();
		$this->assertTrue( $result );

		// Test when is_search() is true
		$MOCK_DATA['is_category'] = false;
		$MOCK_DATA['is_search']   = true;

		$result = TestConditionsUtilities::is_archive();
		$this->assertTrue( $result );

		// Test when is_archive() is true
		$MOCK_DATA['is_search']  = false;
		$MOCK_DATA['is_archive'] = true;

		$result = TestConditionsUtilities::is_archive();
		$this->assertTrue( $result );

		// Test when all are false
		$MOCK_DATA['is_home']     = false;
		$MOCK_DATA['is_category'] = false;
		$MOCK_DATA['is_search']   = false;
		$MOCK_DATA['is_archive']  = false;

		$result = TestConditionsUtilities::is_archive();
		$this->assertFalse( $result );
	}
}
