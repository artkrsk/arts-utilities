<?php

namespace Arts\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

trait Elementor {
	/**
	 * Check if a post is built with Elementor.
	 *
	 * @param int|null $post_id The ID of the post to check. Defaults to null.
	 * @return bool True if the post is built with Elementor, false otherwise.
	 */
	public function is_built_with_elementor( $post_id = null ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}

		// Blog page
		if ( is_home() ) {
			$post_id = get_option( 'page_for_posts' );
		}

		// WooCommerce Shop page
		if ( self::is_shop() ) {
			$post_id = get_option( 'woocommerce_shop_page_id' );
		}

		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		if ( is_singular() ) {
			$document = \Elementor\Plugin::$instance->documents->get( $post_id );

			return $document && $document->is_built_with_elementor();
		}

		return false;
	}

	/**
	 * Checks if the Elementor editor is active and in preview mode.
	 *
	 * @return bool True if Elementor editor is active and in preview mode, false otherwise.
	 */
	public function is_elementor_editor_active() {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}

		$preview = \Elementor\Plugin::$instance->preview;

		return $preview && $preview->is_preview_mode();
	}

	/**
	 * Check if a specific Elementor feature is active.
	 *
	 * @param string $feature_name The name of the Elementor feature to check.
	 * @return bool True if the feature is active, false otherwise.
	 */
	public function is_elementor_feature_active( $feature_name ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}

		$experiments = \Elementor\Plugin::instance();

		return $experiments && $experiments->experiments->is_feature_active( $feature_name );
	}

	/**
	 * Retrieve a specific document option for a given post.
	 *
	 * @param string   $option_name    The name of the option to retrieve.
	 * @param int|null $post_id      The ID of the post. Defaults to null.
	 * @param mixed    $fallback_value  The value to return if the option is not found. Defaults to an empty string.
	 * @return mixed                 The value of the option, or the fallback value if not found.
	 */
	public static function get_document_option( $option_name = '', $post_id = null, $fallback_value = '' ) {
		if ( ! $option_name || empty( $option_name ) || ! class_exists( '\Elementor\Core\Settings\Manager' ) ) {
			return $fallback_value;
		}

		if ( ! $post_id ) {
			$post_id = self::get_theme_builder_location_id();
		}

		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		// Get the page settings manager
		$page_settings_manager = \Elementor\Core\Settings\Manager::get_settings_managers( 'page' );

		// Get the settings model for current post
		$page_settings_model = $page_settings_manager->get_model( $post_id );

		// Retrieve the settings we added before
		return $page_settings_model->get_settings( $option_name );
	}

	/**
	 * Retrieve the body document option for a given post.
	 *
	 * @param string   $option_name The name of the option to retrieve. Default is 'background_color'.
	 * @param int|null $post_id The ID of the post. Default is null.
	 * @param string   $fallback_value The fallback value if the option is not found. Default is '#ffffff'.
	 * @return string The value of the document option or the fallback value.
	 */
	public static function get_body_document_option( $option_name = 'background_color', $post_id = null, $fallback_value = '#ffffff' ) {
		if ( ! $post_id ) {
			$post_id = self::get_theme_builder_location_id();
		}

		$document_background_type = self::get_document_option( 'background_background', $post_id );

		if ( $document_background_type ) {
			if ( $document_background_type === 'classic' ) { // Doesn't support 'gradient' type yet
				$document_background_color = self::get_document_option( $option_name, $post_id );

				// Return the actual background color
				if ( ! empty( $document_background_color ) ) {
					return $document_background_color;
				} else { // Look for color in global colors
					return self::get_global_color_value( $option_name, $post_id, $fallback_value );
				}
			}

			return $fallback_value;
		} else {
			return $fallback_value;
		}
	}

	/**
	 * Retrieve the body styles model based on document options.
	 *
	 * @return array The body styles model including background, padding, and margin properties.
	 */
	public static function get_body_styles_model() {
		$model = array();

		$background_color = self::get_body_document_option( 'background_color' );
		if ( $background_color ) {
			$model['backgroundColor'] = $background_color;
		}

		$background_image = self::get_body_document_option( 'background_image' );
		if ( $background_image && is_array( $background_image ) && array_key_exists( 'url', $background_image ) && ! empty( $background_image['url'] ) ) {
			$model['backgroundImage'] = "url({$background_image['url']})";

			$background_position = self::get_body_document_option( 'background_position' );
			if ( $background_position ) {
				$model['backgroundPosition'] = $background_position;
			}

			$background_attachment = self::get_body_document_option( 'background_attachment' );
			if ( $background_attachment ) {
				$model['backgroundAttachment'] = $background_attachment;
			}

			$background_repeat = self::get_body_document_option( 'background_repeat' );
			if ( $background_repeat ) {
				$model['backgroundRepeat'] = $background_repeat;
			}

			$background_size = self::get_body_document_option( 'background_size' );
			if ( $background_size ) {
				$model['backgroundSize'] = $background_size;
			}
		} else {
			$model['backgroundImage'] = 'none';
		}

		$padding = self::get_body_document_option( 'padding' );
		if ( $padding && is_array( $padding ) ) {
			if ( ! empty( $padding['top'] ) ) {
				$model['paddingTop'] = $padding['top'] . $padding['unit'];
			}

			if ( ! empty( $padding['right'] ) ) {
				$model['paddingRight'] = $padding['right'] . $padding['unit'];
			}

			if ( ! empty( $padding['bottom'] ) ) {
				$model['paddingBottom'] = $padding['bottom'] . $padding['unit'];
			}

			if ( ! empty( $padding['left'] ) ) {
				$model['paddingLeft'] = $padding['left'] . $padding['unit'];
			}
		}

		$margin = self::get_body_document_option( 'margin' );
		if ( $margin && is_array( $margin ) ) {
			if ( ! empty( $margin['top'] ) ) {
				$model['marginTop'] = $margin['top'] . $margin['unit'];
			}

			if ( ! empty( $margin['right'] ) ) {
				$model['marginRight'] = $margin['right'] . $margin['unit'];
			}

			if ( ! empty( $margin['bottom'] ) ) {
				$model['marginBottom'] = $margin['bottom'] . $margin['unit'];
			}

			if ( ! empty( $margin['left'] ) ) {
				$model['marginLeft'] = $margin['left'] . $margin['unit'];
			}
		}

		return $model;
	}

	/**
	 * Retrieve the global color value from Elementor settings.
	 *
	 * @param string   $option_name The name of the color option.
	 * @param int|null $post_id The ID of the post to retrieve settings for. Defaults to null.
	 * @param string   $fallback_value The fallback color value if the option is not found. Defaults to '#ffffff'.
	 *
	 * @return string The color value.
	 */
	public static function get_global_color_value( $option_name = '', $post_id = null, $fallback_value = '#ffffff' ) {
		if ( ! class_exists( '\Elementor\Core\Settings\Manager' ) ) {
			return $fallback_value;
		}

		if ( ! $post_id ) {
			$post_id = self::get_theme_builder_location_id();
		}

		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		// Get the page settings manager
		$page_settings_manager = \Elementor\Core\Settings\Manager::get_settings_managers( 'page' );

		// Get the settings model for current post
		$page_settings_model = $page_settings_manager->get_model( $post_id );
		$settings            = $page_settings_model->get_settings();

		if ( array_key_exists( '__globals__', $settings ) ) {
			$settings = $settings['__globals__'];
		}

		if ( is_array( $settings ) && array_key_exists( $option_name, $settings ) ) {
			$color_control_id = self::get_global_color_control_id( $settings[ $option_name ] );

			if ( $color_control_id ) {
				$kit_manager = \Elementor\Plugin::$instance->kits_manager;

				$settings = array_merge(
					$kit_manager->get_current_settings( 'system_colors' ),
					$kit_manager->get_current_settings( 'custom_colors' )
				);

				$index = array_search( $color_control_id, array_column( $settings, '_id' ) );

				if ( is_int( $index ) && array_key_exists( $index, $settings ) && $settings[ $index ]['color'] ) {
					return $settings[ $index ]['color'];
				} else {
					return $fallback_value;
				}
			} else {
				return $fallback_value;
			}
		} else {
			return $fallback_value;
		}
	}

	/**
	 * Retrieve kit settings from Elementor.
	 *
	 * @param string|null $option_name    The name of the option to retrieve.
	 * @param mixed       $fallback_value The value to return if the option is not found.
	 * @param bool        $return_size    Whether to return the 'size' or 'url' if the value is an array.
	 *
	 * @return mixed The kit setting value or the fallback value.
	 */
	public static function get_kit_settings( $option_name = null, $fallback_value = null, $return_size = true ) {
		if ( ! class_exists( '\Elementor\Plugin' ) || ! \Elementor\Plugin::$instance->kits_manager ) {
			return $fallback_value;
		}

		$value = \Elementor\Plugin::$instance->kits_manager->get_current_settings( $option_name );

		if ( isset( $value ) ) {
			if ( $return_size && is_array( $value ) ) {
				if ( array_key_exists( 'size', $value ) ) {
					return $value['size'];
				}

				if ( array_key_exists( 'url', $value ) ) {
					return $value['url'];
				}
			}

			return $value;
		}

		return $fallback_value;
	}

	/**
	 * Retrieve the theme builder location ID.
	 *
	 * This method determines the appropriate theme builder location ID based on the current
	 * page context. Identifies the location type (archive, single, etc.). If a matching
	 * location is found, it retrieves the corresponding document ID.
	 *
	 * @return int|null The post ID of the theme builder document, or null if not found.
	 */
	private static function get_theme_builder_location_id() {
		$post_id = null;

		if ( class_exists( '\ElementorPro\Plugin' ) ) {
			$location = '';

			if ( self::is_shop() ) {
				$location = 'archive';
			} elseif ( is_archive() || is_tax() || is_home() || is_search() ) {
				$location = 'archive';
			} elseif ( is_single() ) {
				$location = 'single';
			} elseif ( is_singular() || is_404() ) {
				return get_the_ID();
			}

			if ( $location ) {
				$theme_builder_module = \ElementorPro\Plugin::instance()->modules_manager->get_modules( 'theme-builder' );
				/** @disregard P1013 The method exists */
				$document = $theme_builder_module->get_conditions_manager()->get_documents_for_location( $location );
				$IDs      = array_keys( $document );

				if ( ! empty( $IDs ) && $IDs[0] ) {
					$post_id = $IDs[0];
				}
			}
		}

		return $post_id;
	}

	/**
	 * Extract the global color control ID from the given input string.
	 *
	 * @param string $input The input string containing the global color control ID.
	 *
	 * @return string The extracted global color control ID, or an empty string if not found.
	 */
	private static function get_global_color_control_id( $input ) {
		$regex = '/(?<=globals\/colors\?id=)[a-z0-9]+/i';
		preg_match( $regex, $input, $match );

		return $match && $match[0] ? $match[0] : '';
	}
}
