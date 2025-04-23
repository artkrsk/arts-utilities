<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * URL Trait
 *
 * Provides utility methods for working with URLs, including
 * referer checking and license URL generation.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait URL {
	/**
	 * Check if the referer is from the same domain.
	 *
	 * Retrieves the raw referer URL and compares its host with the host of the site URL.
	 * If both hosts match, it indicates that the referer is from the same domain.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if the referer is from the same domain, false otherwise.
	 */
	public static function is_referer_from_same_domain() {
		$referer = wp_get_raw_referer();
		$host    = get_site_url();

		if ( $referer !== false ) {
			if ( parse_url( $referer, PHP_URL_HOST ) === parse_url( $host, PHP_URL_HOST ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Generates a URL with license arguments for use with EDD.
	 *
	 * Appends license key and site URL parameters to a base URL,
	 * typically used for API calls to an EDD-powered license server.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url    The base URL to append the license arguments to.
	 * @param string $option The option name to retrieve the license key.
	 * @return string The URL with the license arguments or an empty string if parameters are missing.
	 */
	public static function get_license_args_url( $url = '', $option = '' ) {
		if ( ! $url || ! $option ) {
			return '';
		}

		$key      = get_option( $option );
		$site_url = home_url( '/' );

		$license_args_url = add_query_arg(
			array(
				'key' => $key,
				'url' => $site_url,
			),
			esc_url( $url )
		);

		return $license_args_url;
	}
}
