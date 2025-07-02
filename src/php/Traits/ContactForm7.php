<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * ContactForm7 Trait
 *
 * Provides utility methods for working with Contact Form 7 plugin.
 * These methods act as proxies for Contact Form 7 functions and include
 * proper checks for plugin availability.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait ContactForm7 {
	/**
	 * Render a Contact Form 7 form by its post ID.
	 *
	 * This method checks if Contact Form 7 is available and renders
	 * the specified form. It can either echo the form HTML directly
	 * or return it for further processing.
	 *
	 * @since 1.0.0
	 *
	 * @param int  $post_id The post ID of the Contact Form 7 form.
	 * @param bool $echo    Optional. Whether to echo the form HTML. Defaults to true.
	 *
	 * @return string|void The form HTML if $echo is false, void otherwise.
	 */
	public static function render_contact_form_7( $post_id, $echo = true ) {
		if ( ! function_exists( 'wpcf7_contact_form' ) ) {
			return;
		}

		$contact_form = wpcf7_contact_form( $post_id );
		if ( $contact_form ) {
			if ( $echo ) {
				echo $contact_form->form_html();
			} else {
				return $contact_form->form_html();
			}
		}
	}
}
