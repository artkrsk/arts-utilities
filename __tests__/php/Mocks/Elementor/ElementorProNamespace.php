<?php
/**
 * Mock ElementorPro classes for unit testing
 */

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
