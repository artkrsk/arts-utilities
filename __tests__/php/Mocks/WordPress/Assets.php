<?php
/**
 * WordPress Scripts and Styles mock functions
 */

// WordPress script and style functions
function wp_register_script( $handle, $src, $deps = array(), $ver = false, $in_footer = false ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_register_script_handle'] = $handle;
	$MOCK_DATA['wp_register_script_src']    = $src;
	$MOCK_DATA['wp_register_script_deps']   = $deps;
	$MOCK_DATA['wp_register_script_ver']    = $ver;
	$MOCK_DATA['wp_register_script_args']   = $in_footer;

	// For component test that registers multiple scripts
	if ( ! isset( $MOCK_DATA['wp_register_script_calls'] ) ) {
		$MOCK_DATA['wp_register_script_calls'] = array();
	}
	$MOCK_DATA['wp_register_script_calls'][] = array(
		'handle'    => $handle,
		'src'       => $src,
		'deps'      => $deps,
		'ver'       => $ver,
		'in_footer' => $in_footer,
	);
}

function wp_register_script_module( $handle, $src, $deps = array(), $ver = false, $in_footer = false ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_register_script_module_handle'] = $handle;
	$MOCK_DATA['wp_register_script_module_src']    = $src;
	$MOCK_DATA['wp_register_script_module_deps']   = $deps;
	$MOCK_DATA['wp_register_script_module_ver']    = $ver;
	$MOCK_DATA['wp_register_script_module_args']   = $in_footer;
}

function wp_register_style( $handle, $src, $deps = array(), $ver = false, $media = 'all' ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_register_style_handle'] = $handle;
	$MOCK_DATA['wp_register_style_src']    = $src;
	$MOCK_DATA['wp_register_style_deps']   = $deps;
	$MOCK_DATA['wp_register_style_ver']    = $ver;
	$MOCK_DATA['wp_register_style_media']  = $media;
}

function wp_script_add_data( $handle, $key, $value ) {
	global $MOCK_DATA;
	if ( ! isset( $MOCK_DATA['wp_script_add_data'] ) ) {
		$MOCK_DATA['wp_script_add_data'] = array();
	}
	if ( ! isset( $MOCK_DATA['wp_script_add_data'][ $handle ] ) ) {
		$MOCK_DATA['wp_script_add_data'][ $handle ] = array();
	}
	$MOCK_DATA['wp_script_add_data'][ $handle ][ $key ] = $value;
}

function wp_style_add_data( $handle, $key, $value ) {
	global $MOCK_DATA;
	if ( ! isset( $MOCK_DATA['wp_style_add_data'] ) ) {
		$MOCK_DATA['wp_style_add_data'] = array();
	}
	if ( ! isset( $MOCK_DATA['wp_style_add_data'][ $handle ] ) ) {
		$MOCK_DATA['wp_style_add_data'][ $handle ] = array();
	}
	$MOCK_DATA['wp_style_add_data'][ $handle ][ $key ] = $value;
}

function wp_enqueue_script( $handle ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_enqueue_script'] = $handle;
}

function wp_enqueue_script_module( $handle ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_enqueue_script_module'] = $handle;
}

function wp_enqueue_style( $handle ) {
	global $MOCK_DATA;
	$MOCK_DATA['wp_enqueue_style'] = $handle;
}

// WordPress script and style classes
class WP_Scripts {
	public $registered = array();

	public function get_data( $handle, $key ) {
		global $MOCK_DATA;
		return isset( $MOCK_DATA['wp_scripts_data'][ $handle ][ $key ] ) ?
			$MOCK_DATA['wp_scripts_data'][ $handle ][ $key ] : false;
	}
}

class WP_Styles {
	public $registered = array();

	public function get_data( $handle, $key ) {
		global $MOCK_DATA;
		return isset( $MOCK_DATA['wp_styles_data'][ $handle ][ $key ] ) ?
			$MOCK_DATA['wp_styles_data'][ $handle ][ $key ] : false;
	}
}

function wp_scripts() {
	global $MOCK_DATA;
	$scripts = new WP_Scripts();

	// Set up registered scripts based on mock data
	if ( isset( $MOCK_DATA['wp_scripts_data'] ) ) {
		foreach ( $MOCK_DATA['wp_scripts_data'] as $handle => $data ) {
			$scripts->registered[ $handle ] = (object) array(
				'handle' => $handle,
				'src'    => $data['src'] ?? '',
			);
		}
	}

	return $scripts;
}

function wp_styles() {
	global $MOCK_DATA;
	$styles = new WP_Styles();

	// Set up registered styles based on mock data
	if ( isset( $MOCK_DATA['wp_styles_data'] ) ) {
		foreach ( $MOCK_DATA['wp_styles_data'] as $handle => $data ) {
			$styles->registered[ $handle ] = (object) array(
				'handle' => $handle,
				'src'    => $data['src'] ?? '',
			);
		}
	}

	return $styles;
}

// WordPress image functions
function wp_get_attachment_image_src( $image_id, $size = 'full' ) {
	global $MOCK_DATA;
	return $MOCK_DATA['image_src'][ $image_id ] ?? null;
}

// Only define if it doesn't exist already
if ( ! function_exists( 'wp_get_attachment_url' ) ) {
	function wp_get_attachment_url( $attachment_id ) {
		global $MOCK_DATA;
		return $MOCK_DATA['attachment_url'] ?? null;
	}
}

function get_intermediate_image_sizes() {
	global $MOCK_DATA;
	return $MOCK_DATA['image_sizes'] ?? array();
}

function get_image_aspect_ratio( $image_id ) {
	global $MOCK_DATA;
	return $MOCK_DATA['image_aspect_ratios'][ $image_id ] ?? 1.5; // Default 3:2 ratio
}