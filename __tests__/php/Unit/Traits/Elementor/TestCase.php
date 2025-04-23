<?php

namespace Tests\Unit\Traits\Elementor;

use PHPUnit\Framework\TestCase as BaseTestCase;

/**
 * Enhanced TestCase to help with Elementor trait testing
 */
class TestCase extends BaseTestCase {
	/**
	 * Set up the test environment for all Elementor trait tests
	 */
	protected function setUp(): void {
		parent::setUp();

		// Initialize Brain\Monkey
		\Brain\Monkey\setUp();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();

		// Make sure class_exists checks using our mock functions
		$MOCK_DATA['class_exists_\\Elementor\\Core\\Settings\\Manager'] = true;
	}

	/**
	 * Tear down the test environment
	 */
	protected function tearDown(): void {
		// Clean up Brain\Monkey
		\Brain\Monkey\tearDown();
		parent::tearDown();
	}
}
