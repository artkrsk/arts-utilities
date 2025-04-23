<?php

namespace Tests\Unit;

use Brain\Monkey;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

/**
 * Abstract base test case for unit tests
 */
abstract class TestCase extends PHPUnitTestCase {
	/**
	 * Setup method for each test
	 */
	protected function setUp(): void {
		parent::setUp();
		Monkey\setUp();
	}

	/**
	 * Teardown method for each test
	 */
	protected function tearDown(): void {
		Monkey\tearDown();
		parent::tearDown();
	}

	/**
	 * Get mock data for testing
	 */
	protected function getMockData( $key, $default = null ) {
		static $mockData = array();

		return isset( $mockData[ $key ] ) ? $mockData[ $key ] : $default;
	}

	/**
	 * Set mock data for testing
	 */
	protected function setMockData( $key, $value ) {
		static $mockData = array();

		$mockData[ $key ] = $value;
		return $this;
	}
}
