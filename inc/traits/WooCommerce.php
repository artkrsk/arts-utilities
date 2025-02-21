<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait WooCommerce {
	/**
	 * Check if the current page is the shop page.
	 *
	 * @return bool
	 */
	public static function is_shop() {
		return function_exists( 'is_shop' ) && is_shop();
	}

	/**
	 * Check if the current page is a WooCommerce page.
	 *
	 * @return bool
	 */
	public static function is_woocommerce() {
		return function_exists( 'is_woocommerce' ) && is_woocommerce();
	}

	/**
	 * Check if the current page is a product category archive page.
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
	 * @param string $term Optional. The term to check. Defaults to empty string.
	 * @return bool
	 */
	public static function is_product_tag( $term = '' ) {
		return function_exists( 'is_product_tag' ) && is_product_tag( $term );
	}

	/**
	 * Check if the current page is a WooCommerce archive page.
	 *
	 * @return bool
	 */
	public static function is_woocommerce_archive() {
		return self::is_shop() || self::is_product_category() || self::is_product_tag();
	}

	/**
	 * Check if the current page is the checkout page.
	 *
	 * @return bool
	 */
	public static function is_checkout() {
		return function_exists( 'is_checkout' ) && is_checkout();
	}

	/**
	 * Check if the current page is the cart page.
	 *
	 * @return bool
	 */
	public static function is_cart() {
		return function_exists( 'is_cart' ) && is_cart();
	}

	/**
	 * Check if the current page is the account page.
	 *
	 * @return bool
	 */
	public static function is_account_page() {
		return function_exists( 'is_account_page' ) && is_account_page();
	}

	/**
	 * Check if the current page is the order received page.
	 *
	 * @return bool
	 */
	public static function is_order_received_page() {
		return function_exists( 'is_order_received_page' ) && is_order_received_page();
	}
}
