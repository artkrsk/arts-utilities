<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Blog trait
 */
class TestUtilities {
	use \Arts\Utilities\Traits\Blog;
	use \Arts\Utilities\Traits\Markup;
}

/**
 * Test the Blog trait
 */
class BlogTest extends TestCase {
	/**
	 * Instance of TestUtilities
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

		// Create instance of TestUtilities
		$this->utilities = new TestUtilities();
	}

	/**
	 * Test get_link_rel_pingback_markup method
	 */
	public function testGetLinkRelPingbackMarkup() {
		global $MOCK_DATA;

		// Test when is_singular and pings_open are true
		$MOCK_DATA['is_singular']           = true;
		$MOCK_DATA['pings_open']            = true;
		$MOCK_DATA['bloginfo_pingback_url'] = 'https://example.com/pingback';

		// Capture output
		ob_start();
		TestUtilities::get_link_rel_pingback_markup();
		$output = ob_get_clean();

		$this->assertStringContainsString( '<link rel="pingback" href="https://example.com/pingback">', $output );

		// Test when is_singular is false
		$MOCK_DATA['is_singular'] = false;
		$MOCK_DATA['pings_open']  = true;

		ob_start();
		TestUtilities::get_link_rel_pingback_markup();
		$output = ob_get_clean();

		$this->assertStringNotContainsString( '<link rel="pingback"', $output );

		// Test when pings_open is false
		$MOCK_DATA['is_singular'] = true;
		$MOCK_DATA['pings_open']  = false;

		ob_start();
		TestUtilities::get_link_rel_pingback_markup();
		$output = ob_get_clean();

		$this->assertStringNotContainsString( '<link rel="pingback"', $output );
	}

	/**
	 * Test get_pagination_link_attributes method
	 */
	public function testGetPaginationLinkAttributes() {
		// Test default attributes for 'prev'
		$result = $this->utilities->get_pagination_link_attributes( array( 'class' => array() ) );
		$this->assertStringContainsString( 'class=', $result );
		$this->assertStringContainsString( 'page-numbers', $result );
		$this->assertStringContainsString( 'prev', $result );

		// Test default attributes for 'next'
		$result = $this->utilities->get_pagination_link_attributes( array( 'class' => array() ), 'next' );
		$this->assertStringContainsString( 'class=', $result );
		$this->assertStringContainsString( 'page-numbers', $result );
		$this->assertStringContainsString( 'next', $result );

		// Test custom classes as array
		$result = $this->utilities->get_pagination_link_attributes( array( 'class' => array( 'custom-class' ) ) );
		$this->assertStringContainsString( 'class=', $result );
		$this->assertStringContainsString( 'custom-class', $result );
		$this->assertStringContainsString( 'page-numbers', $result );
		$this->assertStringContainsString( 'prev', $result );

		// Test custom classes as string
		$result = $this->utilities->get_pagination_link_attributes( array( 'class' => 'custom-class' ) );
		$this->assertStringContainsString( 'class=', $result );
		$this->assertStringContainsString( 'custom-class', $result );
		$this->assertStringContainsString( 'page-numbers', $result );
		$this->assertStringContainsString( 'prev', $result );

		// Test additional attributes
		$result = $this->utilities->get_pagination_link_attributes(
			array(
				'class'     => 'custom-class',
				'id'        => 'pagination-prev',
				'data-page' => '1',
			)
		);

		$this->assertStringContainsString( 'class=', $result );
		$this->assertStringContainsString( 'custom-class', $result );
		$this->assertStringContainsString( 'page-numbers', $result );
		$this->assertStringContainsString( 'prev', $result );
		$this->assertStringContainsString( 'id="pagination-prev"', $result );
		$this->assertStringContainsString( 'data-page="1"', $result );
	}
}
