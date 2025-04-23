<?php
/**
 * Mock WooCommerce functions and classes for unit testing
 */

// Mock WooCommerce functions
function wc_get_product( $product_id ) {
	global $MOCK_DATA;

	if ( isset( $MOCK_DATA['products'][ $product_id ] ) ) {
		$product_data = $MOCK_DATA['products'][ $product_id ];
		$product      = new MockWC_Product( $product_data );
		return $product;
	}

	return false;
}

class MockWC_Product {
	private $data;

	public function __construct( $data ) {
		$this->data = $data;
	}

	public function get_id() {
		return $this->data['id'] ?? 0;
	}

	public function get_name() {
		return $this->data['name'] ?? '';
	}

	public function get_price() {
		return $this->data['price'] ?? '0.00';
	}

	public function get_type() {
		return $this->data['type'] ?? 'simple';
	}

	public function is_in_stock() {
		global $MOCK_DATA;
		$product_id = $this->get_id();

		// For test compatibility, be more explicit when checking if the product is in stock
		if ( isset( $MOCK_DATA['product_stock'][ $product_id ] ) ) {
			return (bool) $MOCK_DATA['product_stock'][ $product_id ];
		}

		// Default to false for undefined products
		return false;
	}

	public function is_purchasable() {
		global $MOCK_DATA;
		$product_id = $this->get_id();

		// For test compatibility, be more explicit when checking if the product is purchasable
		if ( isset( $MOCK_DATA['product_purchasable'][ $product_id ] ) ) {
			return (bool) $MOCK_DATA['product_purchasable'][ $product_id ];
		}

		// Default to false for undefined products
		return false;
	}

	public function get_gallery_image_ids() {
		global $MOCK_DATA;
		$product_id = $this->get_id();

		// For test compatibility, return an empty array if gallery image IDs are set but empty
		if ( isset( $MOCK_DATA['product_gallery_image_ids'][ $product_id ] ) ) {
			return $MOCK_DATA['product_gallery_image_ids'][ $product_id ];
		}

		// Default to an empty array if product gallery image IDs are not set
		return array();
	}
}

class MockWC_Cart {
	public function get_cart() {
		global $MOCK_DATA;
		return $MOCK_DATA['cart_contents'] ?? array();
	}

	public function get_cart_contents_total() {
		global $MOCK_DATA;
		return $MOCK_DATA['cart_total'] ?? 0;
	}
}

class MockWC {
	public $cart;

	public function __construct() {
		$this->cart = new MockWC_Cart();
	}
}

function WC() {
	static $wc = null;

	if ( $wc === null ) {
		$wc = new MockWC();
	}

	return $wc;
}

// WooCommerce conditional functions
if ( ! function_exists( 'is_woocommerce' ) ) {
	function is_woocommerce() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_woocommerce'] ?? false;
	}
}

if ( ! function_exists( 'is_product_category' ) ) {
	function is_product_category( $term = '' ) {
		global $MOCK_DATA;

		if ( $term ) {
			return isset( $MOCK_DATA['is_product_category'][ $term ] ) ? $MOCK_DATA['is_product_category'][ $term ] : false;
		}

		return $MOCK_DATA['is_product_category'] ?? false;
	}
}

if ( ! function_exists( 'is_product_tag' ) ) {
	function is_product_tag( $term = '' ) {
		global $MOCK_DATA;

		if ( $term ) {
			return isset( $MOCK_DATA['is_product_tag'][ $term ] ) ? $MOCK_DATA['is_product_tag'][ $term ] : false;
		}

		return $MOCK_DATA['is_product_tag'] ?? false;
	}
}

if ( ! function_exists( 'is_checkout' ) ) {
	function is_checkout() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_checkout'] ?? false;
	}
}

if ( ! function_exists( 'is_cart' ) ) {
	function is_cart() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_cart'] ?? false;
	}
}

if ( ! function_exists( 'is_account_page' ) ) {
	function is_account_page() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_account_page'] ?? false;
	}
}

if ( ! function_exists( 'is_order_received_page' ) ) {
	function is_order_received_page() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_order_received_page'] ?? false;
	}
}

if ( ! function_exists( 'wc_get_page_id' ) ) {
	function wc_get_page_id( $page ) {
		global $MOCK_DATA;
		return $MOCK_DATA['wc_page_ids'][ $page ] ?? -1;
	}
}

if ( ! function_exists( 'wc_get_permalink_structure' ) ) {
	function wc_get_permalink_structure() {
		global $MOCK_DATA;
		return $MOCK_DATA['wc_permalink_structure'] ?? array();
	}
}

if ( ! function_exists( 'woocommerce_page_title' ) ) {
	function woocommerce_page_title( $echo = true ) {
		global $MOCK_DATA;
		$title = $MOCK_DATA['woocommerce_page_title'] ?? '';

		if ( $echo ) {
			echo $title;
		}

		return $title;
	}
}
