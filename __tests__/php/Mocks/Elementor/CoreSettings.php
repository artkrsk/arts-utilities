<?php
/**
 * Mock Elementor Core Settings classes for unit testing
 */

namespace Elementor\Core\Settings {
	class Manager {
		public static function get_settings_managers( $manager_name ) {
			static $page_settings_manager = null;

			if ( $manager_name === 'page' && $page_settings_manager === null ) {
				$page_settings_manager = new PageManager();
			}

			return $page_settings_manager;
		}
	}

	class PageManager {
		public function get_model( $post_id ) {
			return new PageModel( $post_id );
		}
	}

	class PageModel {
		private $post_id;
		private $settings;

		public function __construct( $post_id ) {
			global $MOCK_DATA;
			$this->post_id  = $post_id;
			$this->settings = $MOCK_DATA['page_settings_model'] ?? array();
		}

		public function get_settings( $setting = null ) {
			global $MOCK_DATA;

			if ( $setting === null ) {
				return $this->settings;
			}

			// First check if we have a specific mock for this document option
			$option_key = 'document_option_' . $setting;
			if ( isset( $MOCK_DATA[ $option_key ] ) ) {
				return $MOCK_DATA[ $option_key ];
			}

			// If the option doesn't exist but is explicitly defined as null,
			// return null to trigger fallback to default
			if ( array_key_exists( $option_key, $MOCK_DATA ) && $MOCK_DATA[ $option_key ] === null ) {
				return null;
			}

			// Special handling for empty option name - always return NULL to ensure default value is used
			if ( empty( $setting ) ) {
				return null;
			}

			// Otherwise check the settings array
			return $this->settings[ $setting ] ?? null;
		}
	}
}
