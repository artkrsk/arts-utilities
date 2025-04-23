<?php
/**
 * Mock Elementor classes for unit testing
 */

namespace Elementor {
	class Plugin {
		public static $instance;
		public $documents;
		public $kits_manager;
		public $experiments;
		public $breakpoints;

		public function __construct() {
			self::$instance     = $this;
			$this->documents    = new Documents();
			$this->kits_manager = new KitsManager();
			$this->experiments  = new Experiments();
			$this->breakpoints  = new Breakpoints();
		}

		public static function instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}
	}

	class Documents {
		public function get( $post_id ) {
			global $MOCK_DATA;
			if ( isset( $MOCK_DATA['elementor_documents'][ $post_id ] ) ) {
				return new Document( $post_id );
			}
			return null;
		}
	}

	class Document {
		private $post_id;

		public function __construct( $post_id ) {
			$this->post_id = $post_id;
		}

		public function is_built_with_elementor() {
			return true;
		}
	}

	class KitsManager {
		public function get_current_settings( $setting = null ) {
			global $MOCK_DATA;

			if ( $setting === null ) {
				return $MOCK_DATA['kit_settings'] ?? array();
			}

			if ( $setting === 'system_colors' ) {
				return $MOCK_DATA['kit_manager_setting_system_colors'] ?? array();
			}

			if ( $setting === 'custom_colors' ) {
				return $MOCK_DATA['kit_manager_setting_custom_colors'] ?? array();
			}

			return $MOCK_DATA[ 'kit_manager_setting_' . $setting ] ?? null;
		}

		public function update_kit_settings_based_on_option( $option, $value ) {
			global $MOCK_DATA;
			$MOCK_DATA['updated_kit_option'] = $option;
			$MOCK_DATA['updated_kit_value']  = $value;
			return true;
		}
	}

	class Experiments {
		public function is_feature_active( $feature_name ) {
			global $MOCK_DATA;
			return isset( $MOCK_DATA['active_features'] ) &&
				   in_array( $feature_name, $MOCK_DATA['active_features'] );
		}
	}

	class Breakpoints {
		const BREAKPOINT_KEY_WIDESCREEN = 'widescreen';

		public function get_breakpoints_config() {
			return array(
				'mobile'     => array(
					'value'      => 767,
					'direction'  => 'max',
					'is_enabled' => true,
				),
				'tablet'     => array(
					'value'      => 1024,
					'direction'  => 'max',
					'is_enabled' => true,
				),
				'widescreen' => array(
					'value'      => 1920,
					'direction'  => 'min',
					'is_enabled' => true,
				),
			);
		}

		public function get_device_min_breakpoint( $device ) {
			$devices = array(
				'mobile'  => 320,
				'tablet'  => 768,
				'desktop' => 1025,
			);
			return $devices[ $device ] ?? 0;
		}

		public function get_desktop_min_point() {
			return 1025;
		}
	}

	class Element_Base {
		protected $settings;

		public function __construct( $settings = array() ) {
			$this->settings = $settings;
		}

		public function get_settings_for_display() {
			return $this->settings;
		}
	}
}
