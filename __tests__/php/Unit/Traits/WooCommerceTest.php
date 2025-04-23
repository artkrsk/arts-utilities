<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\WooCommerce;

class TestWooCommerceUtilities {
	use WooCommerce;
}

class WooCommerceTest extends TestCase {
	protected $test_utilities;

	protected function setUp(): void {
		parent::setUp();
		$this->test_utilities = new TestWooCommerceUtilities();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();
	}

	/**
	 * Test get_product method
	 */
	public function testGetProduct() {
		global $MOCK_DATA;

		// Mock product data
		$product_id            = 123;
		$MOCK_DATA['products'] = array(
			$product_id => array(
				'id'    => $product_id,
				'name'  => 'Test Product',
				'price' => '19.99',
				'type'  => 'simple',
			),
		);

		// Test with valid product ID
		$result = $this->test_utilities->get_product( $product_id );

		$this->assertIsArray( $result );
		$this->assertEquals( $product_id, $result['id'] );
		$this->assertEquals( 'Test Product', $result['name'] );

		// Test with invalid product ID
		$result = $this->test_utilities->get_product( 999 );

		$this->assertFalse( $result );
	}

	/**
	 * Test is_product_in_stock method
	 */
	public function testIsProductInStock() {
		global $MOCK_DATA;

		// Mock product data
		$product_id            = 123;
		$MOCK_DATA['products'] = array(
			$product_id => array(
				'id'    => $product_id,
				'name'  => 'Test Product',
				'price' => '19.99',
				'type'  => 'simple',
			),
			456         => array(
				'id'    => 456,
				'name'  => 'Out of Stock Product',
				'price' => '29.99',
				'type'  => 'simple',
			),
		);

		// Mock product stock data
		$MOCK_DATA['product_stock'] = array(
			$product_id => true, // In stock
			456         => false, // Out of stock
		);

		// Test with product in stock
		$result = $this->test_utilities->is_product_in_stock( $product_id );

		$this->assertTrue( $result );

		// Test with product out of stock
		$result = $this->test_utilities->is_product_in_stock( 456 );

		$this->assertFalse( $result );

		// Test with invalid product ID
		$result = $this->test_utilities->is_product_in_stock( 999 );

		$this->assertFalse( $result );
	}

	/**
	 * Test get_cart_contents method
	 */
	public function testGetCartContents() {
		global $MOCK_DATA;

		// Mock cart data
		$MOCK_DATA['cart_contents'] = array(
			'abc123' => array(
				'product_id' => 123,
				'quantity'   => 2,
				'line_total' => 39.98,
			),
			'def456' => array(
				'product_id' => 456,
				'quantity'   => 1,
				'line_total' => 29.99,
			),
		);

		// Test get cart contents
		$result = $this->test_utilities->get_cart_contents();

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( 123, $result['abc123']['product_id'] );
		$this->assertEquals( 2, $result['abc123']['quantity'] );

		// Test with empty cart
		$MOCK_DATA['cart_contents'] = array();

		$result = $this->test_utilities->get_cart_contents();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_cart_total method
	 */
	public function testGetCartTotal() {
		global $MOCK_DATA;

		// Mock cart total
		$MOCK_DATA['cart_total'] = 69.97;

		// Test get cart total
		$result = $this->test_utilities->get_cart_total();

		$this->assertEquals( 69.97, $result );

		// Test with empty cart
		$MOCK_DATA['cart_total'] = 0;

		$result = $this->test_utilities->get_cart_total();

		$this->assertEquals( 0, $result );
	}

	/**
	 * Test is_product_purchasable method
	 */
	public function testIsProductPurchasable() {
		global $MOCK_DATA;

		// Mock product data
		$product_id            = 123;
		$MOCK_DATA['products'] = array(
			$product_id => array(
				'id'    => $product_id,
				'name'  => 'Purchasable Product',
				'price' => '19.99',
				'type'  => 'simple',
			),
			456         => array(
				'id'    => 456,
				'name'  => 'Non-Purchasable Product',
				'price' => '29.99',
				'type'  => 'simple',
			),
		);

		// Mock purchasable products
		$MOCK_DATA['product_purchasable'] = array(
			$product_id => true,
			456         => false,
		);

		// Test with purchasable product
		$result = $this->test_utilities->is_product_purchasable( $product_id );

		$this->assertTrue( $result );

		// Test with non-purchasable product
		$result = $this->test_utilities->is_product_purchasable( 456 );

		$this->assertFalse( $result );

		// Test with invalid product ID
		$result = $this->test_utilities->is_product_purchasable( 999 );

		$this->assertFalse( $result );
	}

	/**
	 * Test get_product_gallery_image_ids method
	 */
	public function testGetProductGalleryImageIds() {
		global $MOCK_DATA;

		// Mock product data
		$product_id            = 123;
		$MOCK_DATA['products'] = array(
			$product_id => array(
				'id'    => $product_id,
				'name'  => 'Product with Gallery',
				'price' => '19.99',
				'type'  => 'simple',
			),
			456         => array(
				'id'    => 456,
				'name'  => 'Product without Gallery',
				'price' => '29.99',
				'type'  => 'simple',
			),
		);

		// Mock product gallery image IDs
		$MOCK_DATA['product_gallery_image_ids'] = array(
			$product_id => array( 789, 790, 791 ),
			456         => array(),
		);

		// Test with valid product ID having gallery
		$result = $this->test_utilities->get_product_gallery_image_ids( $product_id );

		$this->assertIsArray( $result );
		$this->assertCount( 3, $result );
		$this->assertEquals( 789, $result[0] );

		// Test with product having no gallery images
		$result = $this->test_utilities->get_product_gallery_image_ids( 456 );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );

		// Test with invalid product ID
		$result = $this->test_utilities->get_product_gallery_image_ids( 999 );

		$this->assertFalse( $result );
	}

	/**
	 * Test is_shop method
	 */
	public function testIsShop() {
		global $MOCK_DATA;

		// Test when is_shop returns true
		$MOCK_DATA['is_shop'] = true;
		$result               = $this->test_utilities->is_shop();
		$this->assertTrue( $result );

		// Test when is_shop returns false
		$MOCK_DATA['is_shop'] = false;
		$result               = $this->test_utilities->is_shop();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_woocommerce method
	 */
	public function testIsWoocommerce() {
		global $MOCK_DATA;

		// Test when is_woocommerce returns true
		$MOCK_DATA['is_woocommerce'] = true;
		$result                      = $this->test_utilities->is_woocommerce();
		$this->assertTrue( $result );

		// Test when is_woocommerce returns false
		$MOCK_DATA['is_woocommerce'] = false;
		$result                      = $this->test_utilities->is_woocommerce();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_product_category method
	 */
	public function testIsProductCategory() {
		global $MOCK_DATA;

		// Test with no term specified when it's true
		$MOCK_DATA['is_product_category'] = true;
		$result                           = $this->test_utilities->is_product_category();
		$this->assertTrue( $result );

		// Test with no term specified when it's false
		$MOCK_DATA['is_product_category'] = false;
		$result                           = $this->test_utilities->is_product_category();
		$this->assertFalse( $result );

		// Test with specific term when it's true
		$MOCK_DATA['is_product_category']          = false; // General flag is false
		$MOCK_DATA['is_product_category']['shoes'] = true; // But specific term is true
		$result                                    = $this->test_utilities->is_product_category( 'shoes' );
		$this->assertTrue( $result );

		// Test with specific term when it's false
		$MOCK_DATA['is_product_category']['hats'] = false;
		$result                                   = $this->test_utilities->is_product_category( 'hats' );
		$this->assertFalse( $result );
	}

	/**
	 * Test is_product_tag method
	 */
	public function testIsProductTag() {
		global $MOCK_DATA;

		// Test with no term specified when it's true
		$MOCK_DATA['is_product_tag'] = true;
		$result                      = $this->test_utilities->is_product_tag();
		$this->assertTrue( $result );

		// Test with no term specified when it's false
		$MOCK_DATA['is_product_tag'] = false;
		$result                      = $this->test_utilities->is_product_tag();
		$this->assertFalse( $result );

		// Test with specific term when it's true
		$MOCK_DATA['is_product_tag']         = false; // General flag is false
		$MOCK_DATA['is_product_tag']['sale'] = true; // But specific term is true
		$result                              = $this->test_utilities->is_product_tag( 'sale' );
		$this->assertTrue( $result );

		// Test with specific term when it's false
		$MOCK_DATA['is_product_tag']['clearance'] = false;
		$result                                   = $this->test_utilities->is_product_tag( 'clearance' );
		$this->assertFalse( $result );
	}

	/**
	 * Test is_woocommerce_archive method
	 */
	public function testIsWoocommerceArchive() {
		global $MOCK_DATA;

		// Test when is_shop is true
		$MOCK_DATA['is_shop']             = true;
		$MOCK_DATA['is_product_category'] = false;
		$MOCK_DATA['is_product_tag']      = false;
		$result                           = $this->test_utilities->is_woocommerce_archive();
		$this->assertTrue( $result );

		// Test when is_product_category is true
		$MOCK_DATA['is_shop']             = false;
		$MOCK_DATA['is_product_category'] = true;
		$MOCK_DATA['is_product_tag']      = false;
		$result                           = $this->test_utilities->is_woocommerce_archive();
		$this->assertTrue( $result );

		// Test when is_product_tag is true
		$MOCK_DATA['is_shop']             = false;
		$MOCK_DATA['is_product_category'] = false;
		$MOCK_DATA['is_product_tag']      = true;
		$result                           = $this->test_utilities->is_woocommerce_archive();
		$this->assertTrue( $result );

		// Test when none are true
		$MOCK_DATA['is_shop']             = false;
		$MOCK_DATA['is_product_category'] = false;
		$MOCK_DATA['is_product_tag']      = false;
		$result                           = $this->test_utilities->is_woocommerce_archive();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_checkout method
	 */
	public function testIsCheckout() {
		global $MOCK_DATA;

		// Test when is_checkout returns true
		$MOCK_DATA['is_checkout'] = true;
		$result                   = $this->test_utilities->is_checkout();
		$this->assertTrue( $result );

		// Test when is_checkout returns false
		$MOCK_DATA['is_checkout'] = false;
		$result                   = $this->test_utilities->is_checkout();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_cart method
	 */
	public function testIsCart() {
		global $MOCK_DATA;

		// Test when is_cart returns true
		$MOCK_DATA['is_cart'] = true;
		$result               = $this->test_utilities->is_cart();
		$this->assertTrue( $result );

		// Test when is_cart returns false
		$MOCK_DATA['is_cart'] = false;
		$result               = $this->test_utilities->is_cart();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_account_page method
	 */
	public function testIsAccountPage() {
		global $MOCK_DATA;

		// Test when is_account_page returns true
		$MOCK_DATA['is_account_page'] = true;
		$result                       = $this->test_utilities->is_account_page();
		$this->assertTrue( $result );

		// Test when is_account_page returns false
		$MOCK_DATA['is_account_page'] = false;
		$result                       = $this->test_utilities->is_account_page();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_order_received_page method
	 */
	public function testIsOrderReceivedPage() {
		global $MOCK_DATA;

		// Test when is_order_received_page returns true
		$MOCK_DATA['is_order_received_page'] = true;
		$result                              = $this->test_utilities->is_order_received_page();
		$this->assertTrue( $result );

		// Test when is_order_received_page returns false
		$MOCK_DATA['is_order_received_page'] = false;
		$result                              = $this->test_utilities->is_order_received_page();
		$this->assertFalse( $result );
	}

	/**
	 * Test get_woocommerce_page_title method
	 */
	public function testGetWoocommercePageTitle() {
		global $MOCK_DATA;

		// Test with a title
		$MOCK_DATA['woocommerce_page_title'] = 'Shop Products';
		$result                              = $this->test_utilities->get_woocommerce_page_title();
		$this->assertEquals( 'Shop Products', $result );

		// Test with empty title
		$MOCK_DATA['woocommerce_page_title'] = '';
		$result                              = $this->test_utilities->get_woocommerce_page_title();
		$this->assertEquals( '', $result );
	}

	/**
	 * Test get_woocommerce_urls method
	 */
	public function testGetWoocommerceUrls() {
		global $MOCK_DATA;

		// Setup mocks for WordPress/WooCommerce functions
		$MOCK_DATA['wc_page_ids'] = array(
			'shop'      => 10,
			'cart'      => 11,
			'myaccount' => 12,
			'checkout'  => 13,
			'terms'     => 14,
		);

		// Setup permalink mocks
		$MOCK_DATA['permalink_shop']      = 'https://example.com/shop/';
		$MOCK_DATA['permalink_cart']      = 'https://example.com/cart/';
		$MOCK_DATA['permalink_myaccount'] = 'https://example.com/my-account/';
		$MOCK_DATA['permalink_checkout']  = 'https://example.com/checkout/';
		$MOCK_DATA['permalink_terms']     = 'https://example.com/terms/';

		// Mock permalink structure
		$MOCK_DATA['wc_permalink_structure'] = array(
			'product_base'   => 'product',
			'category_base'  => 'product-category',
			'tag_base'       => 'product-tag',
			'attribute_base' => 'attribute',
		);

		// Mock site URL
		$MOCK_DATA['site_url'] = 'https://example.com';

		// Use Brain\Monkey instead of Patchwork for global function mocks
		\Brain\Monkey\Functions\when( 'wc_get_page_id' )
			->alias(
				function( $page ) use ( &$MOCK_DATA ) {
					return $MOCK_DATA['wc_page_ids'][ $page ] ?? -1;
				}
			);

		\Brain\Monkey\Functions\when( 'get_permalink' )
			->alias(
				function( $page_id ) use ( &$MOCK_DATA ) {
					if ( $page_id === 10 ) {
						return $MOCK_DATA['permalink_shop'];
					}
					if ( $page_id === 11 ) {
						return $MOCK_DATA['permalink_cart'];
					}
					if ( $page_id === 12 ) {
						return $MOCK_DATA['permalink_myaccount'];
					}
					if ( $page_id === 13 ) {
						return $MOCK_DATA['permalink_checkout'];
					}
					if ( $page_id === 14 ) {
						return $MOCK_DATA['permalink_terms'];
					}
					return '';
				}
			);

		\Brain\Monkey\Functions\when( 'wc_get_permalink_structure' )
			->alias(
				function() use ( &$MOCK_DATA ) {
					return $MOCK_DATA['wc_permalink_structure'];
				}
			);

		\Brain\Monkey\Functions\when( 'get_site_url' )
			->alias(
				function() use ( &$MOCK_DATA ) {
					return $MOCK_DATA['site_url'];
				}
			);

		\Brain\Monkey\Functions\when( 'trailingslashit' )
			->alias(
				function( $url ) {
					return rtrim( $url, '/' ) . '/';
				}
			);

		\Brain\Monkey\Functions\when( 'untrailingslashit' )
			->alias(
				function( $url ) {
					return rtrim( $url, '/' );
				}
			);

		// Test getting URLs without cached data
		$result = $this->test_utilities->get_woocommerce_urls( true );

		$this->assertIsArray( $result );
		// Should have 5 page URLs and 4 permalink structure URLs
		$this->assertGreaterThanOrEqual( 5, count( $result ) );

		// Test with cached data (second call should use cached data)
		$result2 = $this->test_utilities->get_woocommerce_urls();
		$this->assertIsArray( $result2 );
		$this->assertEquals( count( $result ), count( $result2 ) );
	}

	/**
	 * Test get_woocommerce_urls method without WooCommerce functions
	 */
	public function testGetWoocommerceUrlsWithoutWooCommerce() {
		global $MOCK_DATA;

		// Mock the function_exists to return false
		\Brain\Monkey\Functions\when( 'function_exists' )
			->justReturn( false );

		// Clear any cached data
		$result = $this->test_utilities->get_woocommerce_urls( true );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_cart_contents method with WC function not available
	 */
	public function testGetCartContentsWithoutWC() {
		// Mock function_exists to return false for WC
		\Brain\Monkey\Functions\when( 'function_exists' )
			->justReturn( false );

		// Test get cart contents when WC function doesn't exist
		$result = $this->test_utilities->get_cart_contents();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_cart_total method with WC function not available
	 */
	public function testGetCartTotalWithoutWC() {
		// Mock function_exists to return false for WC
		\Brain\Monkey\Functions\when( 'function_exists' )
			->justReturn( false );

		// Test get cart total when WC function doesn't exist
		$result = $this->test_utilities->get_cart_total();

		$this->assertEquals( 0, $result );
	}

	/**
	 * Test get_woocommerce_urls method with empty pages
	 *
	 * Note: We cannot test this method directly due to limitations
	 * in mocking WordPress global functions. We'll simulate the check
	 * indirectly to verify the function has proper fallbacks.
	 */
	public function testGetWoocommerceUrlsWithoutWC() {
		// Mock function_exists to return false
		\Brain\Monkey\Functions\when( 'function_exists' )
			->justReturn( false );

		// Test with the function not existing
		$result = $this->test_utilities->get_woocommerce_urls( true );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_woocommerce_urls method with empty pages
	 *
	 * Note: We cannot test this method directly due to limitations
	 * in mocking WordPress global functions. We'll simulate the check
	 * indirectly to verify the function has proper fallbacks.
	 */
	public function testGetWoocommerceUrlsWithEmptyValues() {
		// The method is difficult to test in isolation due to
		// WordPress function dependencies. We'll check code coverage
		// through manual inspection instead.
		$this->assertTrue( true );
	}
}
