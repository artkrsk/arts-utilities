<?php
/**
 * Mock Breakpoints class for Elementor
 */

class MockBreakpoints {
	const BREAKPOINT_KEY_WIDESCREEN = 'widescreen';

	protected $breakpoints_config = array();

	public function __construct() {
		$this->breakpoints_config = array(
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

	public function get_breakpoints_config() {
		return $this->breakpoints_config;
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
