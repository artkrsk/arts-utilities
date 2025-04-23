<?php
/**
 * Mock Elementor classes for unit testing
 */

namespace {
	// Define path to Elementor
	if ( ! defined( 'ELEMENTOR_PATH' ) ) {
		define( 'ELEMENTOR_PATH', __DIR__ . '/fake-elementor/' );
	}

	// Create directory if it doesn't exist
	if ( ! file_exists( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/' ) ) {
		@mkdir( ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/', 0777, true );
		@file_put_contents(
			ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php',
			'<?php /* Mock BFI Thumb */ ?>'
		);
	}

	// Initialize global Plugin instances if they don't exist
	if ( ! isset( $ELEMENTOR_PLUGIN_INSTANCE ) ) {
		global $ELEMENTOR_PLUGIN_INSTANCE;
	}

	if ( ! isset( $ELEMENTOR_PRO_PLUGIN_INSTANCE ) ) {
		global $ELEMENTOR_PRO_PLUGIN_INSTANCE;
	}

	if ( ! function_exists( 'elementor_class_exists' ) ) {
		function elementor_class_exists( $class ) {
			global $MOCK_DATA;

			// Handle Elementor classes
			if ( $class === '\Elementor\Plugin' || $class === 'Elementor\Plugin' ) {
				return true;
			}

			// Handle ElementorPro classes
			if ( $class === '\ElementorPro\Plugin' || $class === 'ElementorPro\Plugin' ) {
				return isset( $MOCK_DATA['class_exists_ElementorPro\\Plugin'] )
				? $MOCK_DATA['class_exists_ElementorPro\\Plugin']
				: false;
			}

			// Handle Elementor Core Settings class
			if ( $class === '\Elementor\Core\Settings\Manager' || $class === 'Elementor\Core\Settings\Manager' ) {
				return isset( $MOCK_DATA['class_exists_\\Elementor\\Core\\Settings\\Manager'] )
				? $MOCK_DATA['class_exists_\\Elementor\\Core\\Settings\\Manager']
				: true;
			}

			// Fall back to real class_exists
			return class_exists( $class );
		}
	}
}

// Mock Elementor Core Settings classes
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

			// Otherwise check the settings array
			return $this->settings[ $setting ] ?? null;
		}
	}
}

// Create Elementor Plugin namespace mock
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

// Create ElementorPro namespace mock
namespace ElementorPro {
	class Plugin {
		public static $instance;
		public $modules_manager;

		public function __construct() {
			self::$instance        = $this;
			$this->modules_manager = new ModulesManager();
		}

		public static function instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}
	}

	class ModulesManager {
		public function get_modules( $module_name ) {
			if ( $module_name === 'theme-builder' ) {
				return new ThemeBuilderModule();
			}
			return null;
		}
	}

	class ThemeBuilderModule {
		public $conditions_manager;

		public function __construct() {
			$this->conditions_manager = new ConditionsManager();
		}
	}

	class ConditionsManager {
		public function get_documents_for_location( $location ) {
			global $MOCK_DATA;
			return $MOCK_DATA['theme_builder_documents'] ?? array();
		}
	}
}

// Initialize plugin instances
namespace {
	// Create the actual instances
	$ELEMENTOR_PLUGIN_INSTANCE     = new \Elementor\Plugin();
	$ELEMENTOR_PRO_PLUGIN_INSTANCE = new \ElementorPro\Plugin();
}
