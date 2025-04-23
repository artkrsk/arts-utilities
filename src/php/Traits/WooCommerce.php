<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * WooCommerce Trait
 *
 * Provides utility methods for working with WooCommerce,
 * checking page types, retrieving information, and handling products.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait WooCommerce {
	/**
	 * Array of WooCommerce URLs.
	 *
	 * Cached to avoid multiple calls to get_permalink() and wc_get_permalink_structure().
	 *
	 * @var string[]
	 */
	private static $woocommerce_urls = array();

	/**
	 * Check if the current page is the shop page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_shop() {
		return function_exists( 'is_shop' ) && is_shop();
	}

	/**
	 * Check if the current page is a WooCommerce page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_woocommerce() {
		return function_exists( 'is_woocommerce' ) && is_woocommerce();
	}

	/**
	 * Check if the current page is a product category archive page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $term Optional. The term to check. Defaults to empty string.
	 * @return bool
	 */
	public static function is_product_category( $term = '' ) {
		return function_exists( 'is_product_category' ) && is_product_category( $term );
	}

	/**
	 * Check if the current page is a product tag archive page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $term Optional. The term to check. Defaults to empty string.
	 * @return bool
	 */
	public static function is_product_tag( $term = '' ) {
		return function_exists( 'is_product_tag' ) && is_product_tag( $term );
	}

	/**
	 * Check if the current page is a WooCommerce archive page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_woocommerce_archive() {
		return self::is_shop() || self::is_product_category() || self::is_product_tag();
	}

	/**
	 * Check if the current page is the checkout page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_checkout() {
		return function_exists( 'is_checkout' ) && is_checkout();
	}

	/**
	 * Check if the current page is the cart page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_cart() {
		return function_exists( 'is_cart' ) && is_cart();
	}

	/**
	 * Check if the current page is the account page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_account_page() {
		return function_exists( 'is_account_page' ) && is_account_page();
	}

	/**
	 * Check if the current page is the order received page.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_order_received_page() {
		return function_exists( 'is_order_received_page' ) && is_order_received_page();
	}

	/**
	 * Retrieve an array of WooCommerce URLs for various pages and permalink structures.
	 *
	 * This method fetches URLs for WooCommerce pages such as shop, cart, my account, checkout, and terms pages.
	 * It also retrieves URLs for product, category, tag, and attribute bases if they are set in the WooCommerce permalink structure.
	 *
	 * @since 1.0.0
	 *
	 * @param bool $bypass_cache Optional. Whether to bypass the cache and retrieve fresh URLs. Default false.
	 * @return string[] List of WooCommerce URLs.
	 */
	public static function get_woocommerce_urls( $bypass_cache = false ) {
		if ( $bypass_cache ) {
			self::$woocommerce_urls = array();
		}

		if ( ! empty( self::$woocommerce_urls ) ) {
			return self::$woocommerce_urls;
		}

		$woocommerce_urls  = array();
		$woocommerce_pages = array();

		// Retrieve WooCommerce page IDs
		if ( function_exists( 'wc_get_page_id' ) ) {
			$woocommerce_pages = array(
				'shop'      => wc_get_page_id( 'shop' ),
				'cart'      => wc_get_page_id( 'cart' ),
				'myaccount' => wc_get_page_id( 'myaccount' ),
				'checkout'  => wc_get_page_id( 'checkout' ),
				'terms'     => wc_get_page_id( 'terms' ),
			);

			// Add WooCommerce page URLs to the array
			foreach ( $woocommerce_pages as $page => $page_id ) {
				if ( ! empty( $page_id ) ) {
					$woocommerce_urls[] = untrailingslashit( get_permalink( $page_id ) );
				}
			}
		}

		// Retrieve WooCommerce permalink structure URLs
		if ( function_exists( 'wc_get_permalink_structure' ) ) {
			$woocommerce_permalinks = wc_get_permalink_structure();
			$site_base_url          = trailingslashit( get_site_url() );

			$permalink_bases = array(
				'product_base'   => 'product_base',
				'category_base'  => 'category_base',
				'tag_base'       => 'tag_base',
				'attribute_base' => 'attribute_base',
			);

			foreach ( $permalink_bases as $base_key => $base_value ) {
				if ( array_key_exists( $base_key, $woocommerce_permalinks ) && ! empty( $woocommerce_permalinks[ $base_key ] ) ) {
					$woocommerce_urls[] = untrailingslashit( $site_base_url . $woocommerce_permalinks[ $base_key ] );
				}
			}
		}

		self::$woocommerce_urls = $woocommerce_urls;

		return $woocommerce_urls;
	}

	/**
	 * Get the WooCommerce page title.
	 *
	 * @since 1.0.0
	 *
	 * @return string The WooCommerce page title if the function exists, otherwise an empty string.
	 */
	public static function get_woocommerce_page_title() {
		return function_exists( 'woocommerce_page_title' ) ? woocommerce_page_title( false ) : '';
	}

	/**
	 * Get a WooCommerce product by ID.
	 *
	 * @since 1.0.0
	 *
	 * @param int $product_id The product ID.
	 * @return array|false Product data array or false if not found.
	 */
	public static function get_product( $product_id ) {
		if ( function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				return array(
					'id'    => $product->get_id(),
					'name'  => $product->get_name(),
					'price' => $product->get_price(),
					'type'  => $product->get_type(),
				);
			}
		}

		return false;
	}

	/**
	 * Check if a product is in stock.
	 *
	 * @since 1.0.0
	 *
	 * @param int $product_id The product ID.
	 * @return bool True if the product is in stock, false otherwise.
	 */
	public static function is_product_in_stock( $product_id ) {
		if ( function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				return $product->is_in_stock();
			}
		}

		return false;
	}

	/**
	 * Get the contents of the WooCommerce cart.
	 *
	 * @since 1.0.0
	 *
	 * @return array Cart contents.
	 */
	public static function get_cart_contents() {
		if ( function_exists( 'WC' ) && isset( WC()->cart ) ) {
			return WC()->cart->get_cart();
		}

		return array();
	}

	/**
	 * Get the total of the WooCommerce cart.
	 *
	 * @since 1.0.0
	 *
	 * @return float Cart total.
	 */
	public static function get_cart_total() {
		if ( function_exists( 'WC' ) && isset( WC()->cart ) ) {
			return WC()->cart->get_cart_contents_total();
		}

		return 0;
	}

	/**
	 * Check if a product is purchasable.
	 *
	 * @since 1.0.0
	 *
	 * @param int $product_id The product ID.
	 * @return bool True if the product is purchasable, false otherwise.
	 */
	public static function is_product_purchasable( $product_id ) {
		if ( function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				return $product->is_purchasable();
			}
		}

		return false;
	}

	/**
	 * Get the gallery image IDs for a product.
	 *
	 * @since 1.0.0
	 *
	 * @param int $product_id The product ID.
	 * @return array|false Array of image IDs or false if the product doesn't exist.
	 */
	public static function get_product_gallery_image_ids( $product_id ) {
		if ( function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $product_id );

			if ( $product ) {
				return $product->get_gallery_image_ids();
			}
		}

		return false;
	}
}
