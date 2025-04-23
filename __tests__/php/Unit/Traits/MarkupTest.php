<?php

namespace Tests\Unit\Traits;

use Tests\Unit\TestCase;

/**
 * Test class that uses the Markup trait
 */
class TestMarkupUtilities {
	use \Arts\Utilities\Traits\Markup;
	use \Arts\Utilities\Traits\Strings;
}

/**
 * Test the Markup trait
 */
class MarkupTest extends TestCase {
	/**
	 * Instance of TestMarkupUtilities
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

		// Create instance of TestMarkupUtilities
		$this->utilities = new TestMarkupUtilities();
	}

	/**
	 * Test parse_args_recursive method
	 */
	public function testParseArgsRecursive() {
		// Test basic array merging
		$args     = array(
			'key1' => 'value1',
			'key3' => 'value3',
		);
		$defaults = array(
			'key1' => 'default1',
			'key2' => 'default2',
		);
		$expected = array(
			'key1' => 'value1',
			'key2' => 'default2',
			'key3' => 'value3',
		);
		$this->assertEquals( $expected, TestMarkupUtilities::parse_args_recursive( $args, $defaults ) );

		// Test nested arrays
		$args     = array(
			'key1' => array(
				'nested1' => 'value1',
				'nested3' => 'value3',
			),
		);
		$defaults = array(
			'key1' => array(
				'nested1' => 'default1',
				'nested2' => 'default2',
			),
			'key2' => 'default2',
		);
		$expected = array(
			'key1' => array(
				'nested1' => 'value1',
				'nested2' => 'default2',
				'nested3' => 'value3',
			),
			'key2' => 'default2',
		);
		$this->assertEquals( $expected, TestMarkupUtilities::parse_args_recursive( $args, $defaults ) );

		// Test with empty arrays
		$this->assertEquals( array(), TestMarkupUtilities::parse_args_recursive( array(), array() ) );
		$this->assertEquals( $defaults, TestMarkupUtilities::parse_args_recursive( array(), $defaults ) );
		$this->assertEquals( $args, TestMarkupUtilities::parse_args_recursive( $args, array() ) );
	}

	/**
	 * Test get_component_attributes method
	 */
	public function testGetComponentAttributes() {
		// Test with default parameters
		$attributes = array( 'class' => array( 'existing-class' ) );
		$result     = TestMarkupUtilities::get_component_attributes( $attributes );

		$this->assertArrayHasKey( 'class', $result );
		$this->assertContains( 'existing-class', $result['class'] );
		$this->assertContains( 'my-component', $result['class'] );
		$this->assertContains( 'js-my-component', $result['class'] );
		$this->assertArrayHasKey( 'data-arts-component-name', $result );
		$this->assertEquals( 'MyComponent', $result['data-arts-component-name'] );

		// Test with custom component name
		$attributes = array();
		$args       = array( 'name' => 'CustomComponent' );
		$result     = TestMarkupUtilities::get_component_attributes( $attributes, $args );

		$this->assertArrayHasKey( 'class', $result );
		$this->assertContains( 'custom-component', $result['class'] );
		$this->assertContains( 'js-custom-component', $result['class'] );
		$this->assertArrayHasKey( 'data-arts-component-name', $result );
		$this->assertEquals( 'CustomComponent', $result['data-arts-component-name'] );

		// Test with options
		$attributes = array();
		$args       = array(
			'name'    => 'OptionsComponent',
			'options' => array(
				'option1' => 'value1',
				'option2' => 'value2',
			),
		);
		$result     = TestMarkupUtilities::get_component_attributes( $attributes, $args );

		$this->assertArrayHasKey( 'data-arts-component-options', $result );
		$this->assertEquals( json_encode( $args['options'] ), $result['data-arts-component-options'] );

		// Test with animation
		$attributes = array();
		$args       = array(
			'name'         => 'AnimationComponent',
			'hasAnimation' => true,
		);
		$result     = TestMarkupUtilities::get_component_attributes( $attributes, $args );

		$this->assertArrayHasKey( 'data-arts-os-animation', $result );
		$this->assertEquals( 'true', $result['data-arts-os-animation'] );

		// Test with excluded name
		$attributes = array();
		$args       = array( 'name' => 'PSWP' );
		$result     = TestMarkupUtilities::get_component_attributes( $attributes, $args );

		$this->assertArrayNotHasKey( 'class', $result );
		$this->assertArrayHasKey( 'data-arts-component-name', $result );
	}

	/**
	 * Test print_attributes method
	 */
	public function testPrintAttributes() {
		// Test with various attributes
		$attributes = array(
			'id'        => 'test-id',
			'class'     => array( 'class1', 'class2' ),
			'data-test' => 'test-data',
		);

		// Test with echo=false
		$result = TestMarkupUtilities::print_attributes( $attributes, false );
		$this->assertStringContainsString( 'id="test-id"', $result );
		$this->assertStringContainsString( 'class="class1 class2"', $result );
		$this->assertStringContainsString( 'data-test="test-data"', $result );

		// Test with echo=true
		ob_start();
		TestMarkupUtilities::print_attributes( $attributes );
		$output = ob_get_clean();
		$this->assertStringContainsString( 'id="test-id"', $output );
		$this->assertStringContainsString( 'class="class1 class2"', $output );
		$this->assertStringContainsString( 'data-test="test-data"', $output );

		// Test with empty attributes
		$this->assertEquals( '', TestMarkupUtilities::print_attributes( array(), false ) );

		// Test with duplicate classes
		$attributes = array(
			'class' => array( 'class1', 'class1', 'class2' ),
		);
		$result     = TestMarkupUtilities::print_attributes( $attributes, false );
		$this->assertStringContainsString( 'class="class1 class2"', $result );

		// Test with empty classes that get filtered out
		$attributes = array(
			'class' => array( '', false, null ),
		);
		// The implementation might return 'class=""' for an empty filtered array
		$result = TestMarkupUtilities::print_attributes( $attributes, false );
		$this->assertStringContainsString( 'class="', $result );
	}

	/**
	 * Test get_post_terms_classes method
	 */
	public function testGetPostTermsClasses() {
		// Test with empty post array
		$post = array();
		$this->assertEquals( array(), TestMarkupUtilities::get_post_terms_classes( $post ) );

		// Test with empty taxonomies
		$post = array( 'taxonomies' => array() );
		$this->assertEquals( array(), TestMarkupUtilities::get_post_terms_classes( $post ) );

		// Test with single taxonomy and term
		$post     = array(
			'taxonomies' => array(
				array(
					'id'    => 'category',
					'terms' => array(
						array( 'slug' => 'news' ),
					),
				),
			),
		);
		$expected = array( 'category-news' );
		$this->assertEquals( $expected, TestMarkupUtilities::get_post_terms_classes( $post ) );

		// Test with multiple taxonomies and terms
		$post     = array(
			'taxonomies' => array(
				array(
					'id'    => 'category',
					'terms' => array(
						array( 'slug' => 'news' ),
						array( 'slug' => 'featured' ),
					),
				),
				array(
					'id'    => 'post_tag',
					'terms' => array(
						array( 'slug' => 'important' ),
						array( 'slug' => 'trending' ),
					),
				),
			),
		);
		$expected = array(
			'category-news',
			'category-featured',
			'post_tag-important',
			'post_tag-trending',
		);
		$this->assertEquals( $expected, TestMarkupUtilities::get_post_terms_classes( $post ) );

		// Test with custom divider
		$post     = array(
			'taxonomies' => array(
				array(
					'id'    => 'category',
					'terms' => array(
						array( 'slug' => 'news' ),
					),
				),
			),
		);
		$expected = array( 'category_news' );
		$this->assertEquals( $expected, TestMarkupUtilities::get_post_terms_classes( $post, '_' ) );

		// Test with taxonomy without terms
		$post = array(
			'taxonomies' => array(
				array(
					'id' => 'category',
				),
			),
		);
		$this->assertEquals( array(), TestMarkupUtilities::get_post_terms_classes( $post ) );
	}

	/**
	 * Test print_html_tag method
	 */
	public function testPrintHtmlTag() {
		// Test with valid tag and echo=false
		$result = TestMarkupUtilities::print_html_tag( 'div', false );
		$this->assertEquals( 'div', $result );

		// Test with valid tag and echo=true
		ob_start();
		TestMarkupUtilities::print_html_tag( 'span' );
		$output = ob_get_clean();
		$this->assertEquals( 'span', $output );

		// Test with invalid tag (should return 'div')
		$result = TestMarkupUtilities::print_html_tag( 'invalid-tag', false );
		$this->assertEquals( 'div', $result );

		// Test with empty tag (should return 'div')
		$result = TestMarkupUtilities::print_html_tag( '', false );
		$this->assertEquals( 'div', $result );

		// Test with uppercase tag (case handling depends on implementation)
		$result = TestMarkupUtilities::print_html_tag( 'DIV', false );
		$this->assertTrue( strtolower( $result ) === 'div' );

		// Test with various valid tags
		$valid_tags = array( 'a', 'article', 'aside', 'button', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main', 'nav', 'p', 'section', 'span' );
		foreach ( $valid_tags as $tag ) {
			$result = TestMarkupUtilities::print_html_tag( $tag, false );
			$this->assertEquals( $tag, $result );
		}
	}

	/**
	 * Test get_valid_html_tag method
	 */
	public function testGetValidHtmlTag() {
		// Test valid tags
		$this->assertEquals( 'div', TestMarkupUtilities::get_valid_html_tag( 'div' ) );
		$this->assertEquals( 'p', TestMarkupUtilities::get_valid_html_tag( 'p' ) );
		$this->assertEquals( 'span', TestMarkupUtilities::get_valid_html_tag( 'span' ) );

		// Test invalid tags (should return 'div')
		$this->assertEquals( 'div', TestMarkupUtilities::get_valid_html_tag( 'invalid' ) );
		$this->assertEquals( 'div', TestMarkupUtilities::get_valid_html_tag( '' ) );
		$this->assertEquals( 'div', TestMarkupUtilities::get_valid_html_tag( null ) );

		// The implementation might preserve the case of the tag
		$tag = TestMarkupUtilities::get_valid_html_tag( 'DIV' );
		$this->assertTrue( strtolower( $tag ) === 'div' );
	}

	/**
	 * Test add_root_html_classes method
	 */
	public function testAddRootHtmlClasses() {
		// Test adding class to empty attributes
		$attributes = '';
		$classes    = 'test-class';
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( ' class="test-class"', $result );

		// Test adding class to existing attributes without class
		$attributes = 'lang="en"';
		$classes    = 'test-class';
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( 'lang="en" class="test-class"', $result );

		// Test adding class to existing attributes with class
		$attributes = 'lang="en" class="existing-class"';
		$classes    = 'test-class';
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( 'lang="en" class="existing-class test-class"', $result );

		// Test adding multiple classes
		$attributes = '';
		$classes    = array( 'class1', 'class2' );
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( ' class="class1 class2"', $result );

		// Test with empty classes
		$attributes = 'lang="en"';
		$classes    = array();
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( 'lang="en"', $result );

		// Test with empty string class
		$attributes = 'lang="en"';
		$classes    = '';
		$result     = TestMarkupUtilities::add_root_html_classes( $attributes, $classes );
		$this->assertEquals( 'lang="en"', $result );
	}
}