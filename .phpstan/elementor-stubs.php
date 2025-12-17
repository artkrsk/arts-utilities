<?php
/**
 * PHPStan Stubs for Elementor
 *
 * Minimal type definitions for Elementor classes used by ArtsUtilities.
 * Based on Elementor 3.x API.
 *
 * @package Arts\Utilities
 */

namespace Elementor {

	if ( ! class_exists( 'Plugin' ) ) {
		/**
		 * Elementor Plugin class stub
		 */
		class Plugin {
			/**
			 * @var Plugin|null
			 */
			public static $instance = null;

			/**
			 * @var \Elementor\Core\DocumentsManager
			 */
			public $documents;

			/**
			 * @var \Elementor\Core\Preview\Preview
			 */
			public $preview;

			/**
			 * @var \Elementor\Core\Experiments\Manager
			 */
			public $experiments;

			/**
			 * @var \Elementor\Core\Kits\Manager
			 */
			public $kits_manager;

			/**
			 * @return Plugin
			 */
			public static function instance() {
				return self::$instance;
			}
		}
	}

	if ( ! class_exists( 'Utils' ) ) {
		/**
		 * Elementor Utils class stub
		 */
		class Utils {
			/**
			 * @param array<string, mixed> $args
			 * @return \WP_Query
			 */
			public static function get_recently_edited_posts_query( $args = array() ) {
				return new \WP_Query();
			}
		}
	}
}

namespace Elementor\Core\DocumentsManager {
	if ( ! class_exists( 'DocumentsManager' ) ) {
		/**
		 * Elementor Documents Manager stub
		 */
		class DocumentsManager {
			/**
			 * @param int|null $post_id
			 * @return \Elementor\Core\Base\Document|false
			 */
			public function get( $post_id = null ) {
				return false;
			}
		}
	}
}

namespace Elementor\Core\Preview {
	if ( ! class_exists( 'Preview' ) ) {
		/**
		 * Elementor Preview class stub
		 */
		class Preview {
			/**
			 * @return bool
			 */
			public function is_preview_mode() {
				return false;
			}
		}
	}
}

namespace Elementor\Core\Experiments {
	if ( ! class_exists( 'Manager' ) ) {
		/**
		 * Elementor Experiments Manager stub
		 */
		class Manager {
			/**
			 * @param string $feature_name
			 * @return bool
			 */
			public function is_feature_active( $feature_name ) {
				return false;
			}
		}
	}
}

namespace Elementor\Core\Kits {
	if ( ! class_exists( 'Manager' ) ) {
		/**
		 * Elementor Kits Manager stub
		 */
		class Manager {
			/**
			 * @param string|null $setting
			 * @return mixed
			 */
			public function get_current_settings( $setting = null ) {
				return array();
			}

			/**
			 * @return int
			 */
			public function get_active_id() {
				return 0;
			}

			/**
			 * @param string $option_elementor
			 * @param mixed  $value
			 * @return void
			 */
			public function update_kit_settings_based_on_option( $option_elementor, $value ) {}
		}
	}
}

namespace Elementor\Core\Base {
	if ( ! class_exists( 'Document' ) ) {
		/**
		 * Elementor Document base class stub
		 */
		abstract class Document {
			/**
			 * @return bool
			 */
			public function is_built_with_elementor() {
				return false;
			}
		}
	}
}

namespace Elementor\Core\Settings {
	if ( ! class_exists( 'Manager' ) ) {
		/**
		 * Elementor Settings Manager stub
		 */
		class Manager {
			/**
			 * Get settings managers.
			 *
			 * @param string|null $manager_name Optional. Settings manager name.
			 * @return \Elementor\Core\Settings\Base\Manager|\Elementor\Core\Settings\Base\Manager[]|null
			 */
			public static function get_settings_managers( $manager_name = null ) {
				return null;
			}

			/**
			 * @param string $setting
			 * @return mixed
			 */
			public function get_setting( $setting ) {
				return null;
			}
		}
	}
}

namespace Elementor\Core\Settings\Base {
	if ( ! class_exists( 'Manager' ) ) {
		/**
		 * Elementor Settings Base Manager stub
		 */
		abstract class Manager {
			/**
			 * @return string
			 */
			abstract public function get_name();

			/**
			 * @param int $id
			 * @return \Elementor\Core\Settings\Base\Model|null
			 */
			public function get_model( $id = 0 ) {
				return null;
			}
		}
	}

	if ( ! class_exists( 'Model' ) ) {
		/**
		 * Elementor Settings Base Model stub
		 */
		abstract class Model {
			/**
			 * @param string|null $setting
			 * @return mixed
			 */
			public function get_settings( $setting = null ) {
				return null;
			}
		}
	}
}

namespace Elementor {
	if ( ! class_exists( 'Controls_Stack' ) ) {
		/**
		 * Elementor Controls Stack class stub
		 */
		abstract class Controls_Stack {
			/**
			 * @param string|null $setting
			 * @return array<mixed>|mixed
			 */
			public function get_settings( $setting = null ) {
				return array();
			}

			/**
			 * @param string|null $setting_key
			 * @return array<mixed>|mixed
			 */
			public function get_settings_for_display( $setting_key = null ) {
				return array();
			}

			/**
			 * @param string $element
			 * @param string $key
			 * @return array<string, mixed>
			 */
			public function get_render_attributes( $element = '', $key = '' ) {
				return array();
			}

			/**
			 * @param string|null $control_id
			 * @return array<mixed>|mixed
			 */
			public function get_controls( $control_id = null ) {
				return array();
			}

			/**
			 * @param string                      $element
			 * @param array<string, mixed>|string $key
			 * @param mixed                       $value
			 * @return void
			 */
			public function add_render_attribute( $element, $key = null, $value = null ) {}

			/**
			 * @param string               $element
			 * @param array<string, mixed> $key
			 * @param mixed                $value
			 * @return void
			 */
			public function set_render_attribute( $element, $key = null, $value = null ) {}

			/**
			 * @param string $element
			 * @return void
			 */
			public function print_render_attribute_string( $element ) {}

			/**
			 * @param string               $id
			 * @param array<string, mixed> $args
			 * @return void
			 */
			public function start_controls_section( $id, $args = array() ) {}
		}
	}

	if ( ! class_exists( 'Element_Base' ) ) {
		/**
		 * Elementor Element Base class stub
		 */
		abstract class Element_Base extends Controls_Stack {
			/**
			 * @return Element_Base[]
			 */
			public function get_children() {
				return array();
			}

			/**
			 * @param array<string, mixed> $child_data
			 * @param array<string, mixed> $child_args
			 * @return Element_Base|false
			 */
			public function add_child( array $child_data, array $child_args = array() ) {
				return false;
			}

			/**
			 * @return void
			 */
			public function print_element() {}

			/**
			 * @return string
			 */
			public function get_unique_selector() {
				return '';
			}

			/**
			 * @param string               $element
			 * @param array<string, mixed> $url_control
			 * @param bool                 $overwrite
			 * @return Element_Base
			 */
			public function add_link_attributes( $element, array $url_control, $overwrite = false ) {
				return $this;
			}
		}
	}
}
