<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\Taxonomies;

class TestTaxonomiesUtilities {
	use Taxonomies;
}

class TaxonomiesTest extends TestCase {
	protected $test_utilities;

	protected function setUp(): void {
		parent::setUp();
		$this->test_utilities = new TestTaxonomiesUtilities();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();
	}

	/**
	 * Test get_term_ancestors_list method
	 */
	public function testGetTermAncestorsList() {
		global $MOCK_DATA;

		// Mock terms data
		$term_id  = 123;
		$taxonomy = 'category';

		// Mock term ancestors
		$MOCK_DATA['term_ancestors'] = array(
			$term_id => array( 111, 222 ),
		);

		// Mock terms
		$MOCK_DATA['terms'] = array(
			111 => array(
				'term_id' => 111,
				'name'    => 'Ancestor 1',
				'slug'    => 'ancestor-1',
			),
			222 => array(
				'term_id' => 222,
				'name'    => 'Ancestor 2',
				'slug'    => 'ancestor-2',
			),
		);

		// Test with default parameters
		$result = $this->test_utilities->get_term_ancestors_list( $term_id, $taxonomy );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( 'Ancestor 1', $result[0]['name'] );
		$this->assertEquals( 'Ancestor 2', $result[1]['name'] );

		// Test with custom order and fields
		$result = $this->test_utilities->get_term_ancestors_list( $term_id, $taxonomy, 'DESC', array( 'slug' ) );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( 'ancestor-2', $result[0]['slug'] );
		$this->assertEquals( 'ancestor-1', $result[1]['slug'] );
	}

	/**
	 * Test get_term_ancestors_list method with no ancestors
	 */
	public function testGetTermAncestorsListWithNoAncestors() {
		global $MOCK_DATA;

		$term_id  = 456;
		$taxonomy = 'category';

		// Mock empty ancestors
		$MOCK_DATA['term_ancestors'] = array(
			$term_id => array(),
		);

		$result = $this->test_utilities->get_term_ancestors_list( $term_id, $taxonomy );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_taxonomy_hierarchy method
	 */
	public function testGetTaxonomyHierarchy() {
		global $MOCK_DATA;

		$taxonomy = 'category';

		// Mock terms
		$MOCK_DATA['taxonomy_terms'] = array(
			$taxonomy => array(
				array(
					'term_id' => 1,
					'name'    => 'Parent 1',
					'slug'    => 'parent-1',
					'parent'  => 0,
				),
				array(
					'term_id' => 2,
					'name'    => 'Child 1',
					'slug'    => 'child-1',
					'parent'  => 1,
				),
				array(
					'term_id' => 3,
					'name'    => 'Parent 2',
					'slug'    => 'parent-2',
					'parent'  => 0,
				),
				array(
					'term_id' => 4,
					'name'    => 'Child 2',
					'slug'    => 'child-2',
					'parent'  => 3,
				),
				array(
					'term_id' => 5,
					'name'    => 'Grandchild',
					'slug'    => 'grandchild',
					'parent'  => 2,
				),
			),
		);

		// Test default parameters
		$result = $this->test_utilities->get_taxonomy_hierarchy( $taxonomy );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result ); // 2 top-level terms

		// Check structure
		$this->assertEquals( 'Parent 1', $result[0]['name'] );
		$this->assertEquals( 'Child 1', $result[0]['children'][0]['name'] );
		$this->assertEquals( 'Grandchild', $result[0]['children'][0]['children'][0]['name'] );
		$this->assertEquals( 'Parent 2', $result[1]['name'] );
		$this->assertEquals( 'Child 2', $result[1]['children'][0]['name'] );

		// Test with parent specified
		$result = $this->test_utilities->get_taxonomy_hierarchy( $taxonomy, 1 );

		$this->assertIsArray( $result );
		$this->assertCount( 1, $result ); // Only children of parent 1
		$this->assertEquals( 'Child 1', $result[0]['name'] );
	}

	/**
	 * Test get_taxonomy_hierarchy with empty taxonomy
	 */
	public function testGetTaxonomyHierarchyWithEmptyTaxonomy() {
		global $MOCK_DATA;

		$taxonomy = 'empty_tax';

		// Mock empty taxonomy
		$MOCK_DATA['taxonomy_terms'] = array(
			$taxonomy => array(),
		);

		$result = $this->test_utilities->get_taxonomy_hierarchy( $taxonomy );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_term_by method
	 */
	public function testGetTermBy() {
		global $MOCK_DATA;

		// Mock term data
		$MOCK_DATA['term_by'] = array(
			'slug' => array(
				'test-term' => array(
					'term_id'  => 789,
					'name'     => 'Test Term',
					'slug'     => 'test-term',
					'taxonomy' => 'category',
				),
			),
			'id'   => array(
				789 => array(
					'term_id'  => 789,
					'name'     => 'Test Term',
					'slug'     => 'test-term',
					'taxonomy' => 'category',
				),
			),
		);

		// Test get term by slug
		$result = $this->test_utilities->get_term_by( 'slug', 'test-term', 'category' );

		$this->assertIsArray( $result );
		$this->assertEquals( 789, $result['term_id'] );
		$this->assertEquals( 'Test Term', $result['name'] );

		// Test get term by ID
		$result = $this->test_utilities->get_term_by( 'id', 789, 'category' );

		$this->assertIsArray( $result );
		$this->assertEquals( 'test-term', $result['slug'] );

		// Test non-existent term
		$result = $this->test_utilities->get_term_by( 'slug', 'non-existent', 'category' );

		$this->assertFalse( $result );
	}

	/**
	 * Test get_term_by method with successful lookup
	 */
	public function testGetTermBySuccess() {
		$field    = 'slug';
		$value    = 'test-term';
		$taxonomy = 'category';

		// Mock term object to be returned
		$mock_term = (object) array(
			'term_id'  => 123,
			'name'     => 'Test Term',
			'slug'     => 'test-term',
			'taxonomy' => 'category',
		);

		// Override get_term_by function
		\Patchwork\redefine(
			'get_term_by',
			function( $f, $v, $tax ) use ( $field, $value, $taxonomy, $mock_term ) {
				if ( $f === $field && $v === $value && $tax === $taxonomy ) {
					return $mock_term;
				}
				return false;
			}
		);

		$result = $this->test_utilities->get_term_by( $field, $value, $taxonomy );

		$this->assertIsArray( $result );
		$this->assertEquals( 123, $result['term_id'] );
		$this->assertEquals( 'Test Term', $result['name'] );
		$this->assertEquals( 'test-term', $result['slug'] );
		$this->assertEquals( 'category', $result['taxonomy'] );
	}

	/**
	 * Test get_term_by method with failed lookup
	 */
	public function testGetTermByFail() {
		$field    = 'slug';
		$value    = 'nonexistent-term';
		$taxonomy = 'category';

		// Override get_term_by function to return false
		\Patchwork\redefine(
			'get_term_by',
			function( $f, $v, $tax ) {
				return false;
			}
		);

		$result = $this->test_utilities->get_term_by( $field, $value, $taxonomy );

		$this->assertFalse( $result );
	}

	/**
	 * Test get_taxonomy_term_names method
	 */
	public function testGetTaxonomyTermNames() {
		$post_id  = 123;
		$taxonomy = 'category';

		// Mock terms data as WordPress term objects
		$terms = array(
			(object) array(
				'term_id'  => 1,
				'slug'     => 'term-1',
				'name'     => 'Term 1',
				'taxonomy' => $taxonomy,
			),
			(object) array(
				'term_id'  => 2,
				'slug'     => 'term-2',
				'name'     => 'Term 2',
				'taxonomy' => $taxonomy,
			),
		);

		// Override the get_term_link function for our test
		\Patchwork\redefine(
			'get_term_link',
			function( $term, $tax ) {
				if ( $term === 'term-1' ) {
					return 'https://example.com/term-1';
				}
				if ( $term === 'term-2' ) {
					return 'https://example.com/term-2';
				}
				return '';
			}
		);

		// Mock get_the_terms function
		\Brain\Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( $post_id, $taxonomy )
			->andReturn( $terms );

		$result = $this->test_utilities->get_taxonomy_term_names( $post_id, $taxonomy );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( 'term-1', $result[0]['slug'] );
		$this->assertEquals( 'Term 1', $result[0]['name'] );
		$this->assertEquals( 'https://example.com/term-1', $result[0]['url'] );
		$this->assertEquals( 'term-2', $result[1]['slug'] );
		$this->assertEquals( 'Term 2', $result[1]['name'] );
		$this->assertEquals( 'https://example.com/term-2', $result[1]['url'] );
	}

	/**
	 * Test get_post_terms method
	 */
	public function testGetPostTerms() {
		$post_id    = 123;
		$taxonomies = array(
			(object) array(
				'name'   => 'category',
				'labels' => (object) array( 'name' => 'Categories' ),
			),
			(object) array(
				'name'   => 'post_tag',
				'labels' => (object) array( 'name' => 'Tags' ),
			),
		);

		// Mock terms data as WordPress term objects
		$category_terms = array(
			(object) array(
				'term_id'  => 1,
				'slug'     => 'category-1',
				'name'     => 'Category 1',
				'taxonomy' => 'category',
			),
		);

		$tag_terms = array(
			(object) array(
				'term_id'  => 2,
				'slug'     => 'tag-1',
				'name'     => 'Tag 1',
				'taxonomy' => 'post_tag',
			),
		);

		// Override the global mocked functions
		\Patchwork\redefine(
			'get_the_terms',
			function( $post, $tax ) use ( $category_terms, $tag_terms ) {
				if ( $tax === 'category' ) {
					return $category_terms;
				}
				if ( $tax === 'post_tag' ) {
					return $tag_terms;
				}
				return array();
			}
		);

		// Define excluded taxonomies
		$excluded_taxonomies = array(
			'translation_priority',
			'post_translations',
			'language',
			'product_type',
			'product_visibility',
			'product_shipping_class',
			false,
		);

		// Mock apply_filters
		\Brain\Monkey\Filters\expectApplied( 'arts/utilities/taxonomies/get_post_terms/exclude_taxonomies' )
			->andReturn( $excluded_taxonomies );

		$result = $this->test_utilities->get_post_terms( $taxonomies, $post_id );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );

		// Check category taxonomy
		$this->assertEquals( 'category', $result[0]['id'] );
		$this->assertEquals( 'Categories', $result[0]['name'] );
		$this->assertCount( 1, $result[0]['terms'] );
		$this->assertEquals( 1, $result[0]['terms'][0]['id'] );
		$this->assertEquals( 'category-1', $result[0]['terms'][0]['slug'] );
		$this->assertEquals( 'Category 1', $result[0]['terms'][0]['name'] );

		// Check post_tag taxonomy
		$this->assertEquals( 'post_tag', $result[1]['id'] );
		$this->assertEquals( 'Tags', $result[1]['name'] );
		$this->assertCount( 1, $result[1]['terms'] );
		$this->assertEquals( 2, $result[1]['terms'][0]['id'] );
		$this->assertEquals( 'tag-1', $result[1]['terms'][0]['slug'] );
		$this->assertEquals( 'Tag 1', $result[1]['terms'][0]['name'] );
	}

	/**
	 * Test get_post_terms with excluded taxonomies
	 */
	public function testGetPostTermsWithExcludedTaxonomies() {
		$post_id    = 123;
		$taxonomies = array(
			(object) array(
				'name'   => 'translation_priority',
				'labels' => (object) array( 'name' => 'Translation Priority' ),
			),
		);

		// Define excluded taxonomies that include 'translation_priority'
		$excluded_taxonomies = array(
			'translation_priority',
			'post_translations',
			'language',
			'product_type',
			'product_visibility',
			'product_shipping_class',
			false,
		);

		// Override the get_the_terms function for this test
		\Patchwork\redefine(
			'get_the_terms',
			function( $post, $tax ) {
				if ( $tax === 'translation_priority' ) {
					return array(
						(object) array(
							'term_id' => 1,
							'slug'    => 'high',
							'name'    => 'High',
						),
					);
				}
				return array();
			}
		);

		// Mock apply_filters to return the excluded taxonomies
		\Brain\Monkey\Filters\expectApplied( 'arts/utilities/taxonomies/get_post_terms/exclude_taxonomies' )
			->andReturn( $excluded_taxonomies );

		$result = $this->test_utilities->get_post_terms( $taxonomies, $post_id );

		// The result should be empty since translation_priority is in the excluded list
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_taxonomy_term_names with empty terms
	 */
	public function testGetTaxonomyTermNamesWithEmptyTerms() {
		$post_id  = 123;
		$taxonomy = 'category';

		// Override the get_the_terms function to return false for this test
		\Patchwork\redefine(
			'get_the_terms',
			function( $post, $tax ) {
				return false;  // WordPress returns false when no terms are found
			}
		);

		$result = $this->test_utilities->get_taxonomy_term_names( $post_id, $taxonomy );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_tax_query method
	 */
	public function testGetTaxQuery() {
		$term_ids = array( 1, 2, 3 );
		$operator = 'IN';

		// Mock term objects to be returned by get_term
		$term1 = (object) array(
			'term_id'  => 1,
			'taxonomy' => 'category',
		);

		$term2 = (object) array(
			'term_id'  => 2,
			'taxonomy' => 'category',
		);

		$term3 = (object) array(
			'term_id'  => 3,
			'taxonomy' => 'post_tag',
		);

		// Override the get_term function for this test
		\Patchwork\redefine(
			'get_term',
			function( $term_id ) use ( $term1, $term2, $term3 ) {
				if ( $term_id === 1 ) {
					return $term1;
				}
				if ( $term_id === 2 ) {
					return $term2;
				}
				if ( $term_id === 3 ) {
					return $term3;
				}
				return null;
			}
		);

		$result = $this->test_utilities->get_tax_query( $term_ids, $operator );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result ); // Should group by taxonomy

		// Check category tax query
		$this->assertEquals( 'category', $result[0]['taxonomy'] );
		$this->assertEquals( 'term_id', $result[0]['field'] );
		$this->assertEquals( array( 1, 2 ), $result[0]['terms'] );
		$this->assertEquals( 'IN', $result[0]['operator'] );

		// Check post_tag tax query
		$this->assertEquals( 'post_tag', $result[1]['taxonomy'] );
		$this->assertEquals( 'term_id', $result[1]['field'] );
		$this->assertEquals( array( 3 ), $result[1]['terms'] );
		$this->assertEquals( 'IN', $result[1]['operator'] );
	}

	/**
	 * Test get_tax_query with empty terms
	 */
	public function testGetTaxQueryWithEmptyTerms() {
		$result = $this->test_utilities->get_tax_query( array() );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}
}
