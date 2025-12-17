<?php

namespace Arts\Utilities\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Frontend Trait
 *
 * Provides methods for handling frontend assets like scripts and stylesheets
 * with support for dynamic loading and other optimizations.
 *
 * @package Arts\Utilities\Traits
 * @since 1.0.0
 */
trait Frontend {
	/**
	 * Registers and enqueues a script with dynamic loading metadata.
	 *
	 * @param string                $type Type of the script. Either 'asset' or 'component'.
	 * @param array<string, mixed>  $args {
	 *     An array of arguments for the script.
	 *
	 *     @type string       $handle    Name of the script. Should be unique.
	 *     @type string|false $src       Full URL of the script, or path of the script relative to the WordPress root directory.
	 *                                   If source is set to false, script is an alias of other scripts it depends on.
	 *     @type string[]     $deps      Optional. An array of registered script handles this script depends on. Default empty array.
	 *     @type array        $files     Optional. 'component' type only. An array of files this script depends on. Default empty array.
	 *     @type string|bool  $ver       Optional. String specifying script version number, if it has one, which is added to the URL
	 *                                   as a query string for cache busting purposes. If version is set to false, a version
	 *                                   number is automatically added equal to current installed WordPress version.
	 *                                   If set to null, no version is added.
	 *     @type array|bool   $args      Optional. An array of additional script loading strategies. Default empty array.
	 *                                   Otherwise, it may be a boolean in which case it determines whether the script is printed in the footer. Default false.
	 *                                   @type string $strategy Optional. If provided, may be either 'defer' or 'async'.
	 *                                   @type bool   $in_footer Optional. Whether to print the script in the footer. Default 'false'.
	 * }
	 *
	 * @return void
	 */
	public static function enqueue_dynamic_load_script( $type, $args ) {
		$allowed_types = array(
			'asset',
			'component',
		);

		if ( ! $type || ! in_array( $type, $allowed_types, true ) ) {
			return;
		}

		$defaults = array(
			'handle'                        => '',
			'dynamic_load_handle'           => '',
			'dynamic_load_prevent_autoload' => false,
			'preload_type'                  => false,
			'src'                           => false,
			'deps'                          => array(),
			'files'                         => array(), // Dependencies for component type.
			'ver'                           => null,
			'args'                          => true,
		);

		$args = wp_parse_args( $args, $defaults );

		if ( ! $args['handle'] || ! $args['src'] ) {
			return;
		}

		$files_deps            = array();
		$deps                  = is_array( $args['deps'] ) ? $args['deps'] : array();
		$allowed_preload_types = array(
			'preload',
			'modulepreload',
			'prefetch',
		);

		// Enqueue Component files
		if ( $type === 'component' && ! empty( $args['files'] ) ) {
			foreach ( $args['files'] as $file ) {
				if ( ! isset( $file['type'] ) || ! isset( $file['src'] ) ) {
					continue;
				}
				$file_src    = $file['src'];
				$file_handle = $file['id'];

				if ( $file['type'] === 'script' ) {
					self::enqueue_dynamic_load_script(
						'asset',
						array(
							'handle'              => $file_handle,
							'dynamic_load_handle' => $args['handle'],
							'dynamic_load_prevent_autoload' => isset( $file['lazy'] ) ? $file['lazy'] : $args['dynamic_load_prevent_autoload'],
							'preload_type'        => $args['preload_type'],
							'src'                 => $file_src,
							'deps'                => $args['deps'],
							'ver'                 => $args['ver'],
							'args'                => $args['args'],
						)
					);

				} elseif ( $file['type'] === 'style' ) {
					self::enqueue_dynamic_load_style(
						array(
							'handle'       => $file_handle,
							'src'          => $file_src,
							'dynamic_load_prevent_autoload' => isset( $file['lazy'] ) ? $file['lazy'] : $args['dynamic_load_prevent_autoload'],
							'preload_type' => $args['preload_type'],
						)
					);
				}

				$files_deps[] = $file_handle;
			}

			$deps = array_merge( $deps, $files_deps );
		}

		if ( $type === 'component' ) {
			// WordPress 6.9+ requires array for $args in wp_register_script_module()
			$script_module_args = $args['args'];
			if ( ! is_array( $script_module_args ) ) {
				$script_module_args = $script_module_args ? array( 'in_footer' => true ) : array();
			}
			wp_register_script_module( $args['handle'], $args['src'], $deps, $args['ver'], $script_module_args );
			wp_register_script( $args['handle'], $args['src'], $deps, $args['ver'], $args['args'] );
		} else {
			wp_register_script( $args['handle'], $args['src'], $deps, $args['ver'], $args['args'] );
		}

		wp_script_add_data( $args['handle'], 'dynamic_load_enabled', true );
		wp_script_add_data( $args['handle'], 'dynamic_load_prevent_autoload', boolval( $args['dynamic_load_prevent_autoload'] ) );
		wp_script_add_data( $args['handle'], 'dynamic_load_type', $type );

		if ( $args['dynamic_load_handle'] ) {
			wp_style_add_data( $args['handle'], 'dynamic_load_handle', $args['dynamic_load_handle'] );
		}

		if ( $args['preload_type'] && in_array( $args['preload_type'], $allowed_preload_types, true ) ) {
			wp_script_add_data( $args['handle'], 'preload_type', $args['preload_type'] );
		}

		if ( $type === 'component' ) {
			wp_enqueue_script_module( $args['handle'] );
		} else {
			wp_enqueue_script( $args['handle'] );
		}
	}

	/**
	 * Enqueue a dynamically loaded stylesheet.
	 *
	 * @param array<string, mixed> $args {
	 *   Arguments for enqueuing the stylesheet.
	 *
	 *   @type string $handle Name of the stylesheet. Should be unique.
	 *   @type string $src    Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory. If source is set to false, stylesheet is an alias of other stylesheets it depends on.
	 *   @type array  $deps   Optional. An array of registered stylesheet handles this stylesheet depends on. Default empty array.
	 *   @type string $ver    Optional. String specifying stylesheet version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 *   @type string $media  Optional. The media for which this stylesheet has been defined. Default 'all'. Accepts media types like 'all', 'print' and 'screen', or media queries like '(orientation: portrait)' and '(max-width: 640px)'.
	 * }
	 *
	 * @return void
	 */
	public static function enqueue_dynamic_load_style( $args ) {
		$defaults = array(
			'handle'                        => '',
			'dynamic_load_handle'           => '',
			'dynamic_load_prevent_autoload' => false,
			'preload_type'                  => false,
			'src'                           => false,
			'deps'                          => array(),
			'ver'                           => null,
			'media'                         => 'all',
		);

		$args = wp_parse_args( $args, $defaults );

		if ( ! $args['handle'] || ! $args['src'] ) {
			return;
		}

		$allowed_preload_types = array(
			'preload',
			'prefetch',
		);

		wp_register_style( $args['handle'], $args['src'], $args['deps'], $args['ver'], $args['media'] );
		wp_style_add_data( $args['handle'], 'dynamic_load_enabled', true );

		if ( $args['dynamic_load_handle'] ) {
			wp_style_add_data( $args['handle'], 'dynamic_load_handle', $args['dynamic_load_handle'] );
		}

		if ( $args['preload_type'] && in_array( $args['preload_type'], $allowed_preload_types, true ) ) {
			wp_style_add_data( $args['handle'], 'preload_type', $args['preload_type'] );
		}

		wp_style_add_data( $args['handle'], 'dynamic_load_prevent_autoload', boolval( $args['dynamic_load_prevent_autoload'] ) );

		wp_enqueue_style( $args['handle'] );
	}

	/**
	 * Checks if a script is eligible for dynamic loading.
	 *
	 * Determines whether a registered script has the necessary attributes
	 * to be dynamically loaded.
	 *
	 * @since 1.0.0
	 *
	 * @param string $handle The script handle to check.
	 * @return bool True if the script is eligible for dynamic loading, false otherwise.
	 */
	public static function is_script_eligible_for_dynamic_load( $handle ) {
		$wp_scripts = wp_scripts();

		if ( ! $wp_scripts->get_data( $handle, 'dynamic_load_enabled' ) ) {
			return false;
		}

		if ( ! $wp_scripts->get_data( $handle, 'dynamic_load_type' ) ) {
			return false;
		}

		if ( ! isset( $wp_scripts->registered[ $handle ] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if a stylesheet is eligible for dynamic loading.
	 *
	 * Determines whether a registered stylesheet has the necessary attributes
	 * to be dynamically loaded.
	 *
	 * @since 1.0.0
	 *
	 * @param string $handle The stylesheet handle to check.
	 * @return bool True if the stylesheet is eligible for dynamic loading, false otherwise.
	 */
	public static function is_style_eligible_for_dynamic_load( $handle ) {
		$wp_styles = wp_styles();

		if ( ! $wp_styles->get_data( $handle, 'dynamic_load_enabled' ) ) {
			return false;
		}

		if ( ! isset( $wp_styles->registered[ $handle ] ) ) {
			return false;
		}

		return true;
	}
}