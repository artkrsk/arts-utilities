<?php
/**
 * WordPress conditional functions mocks
 */

// WordPress conditionals
if ( ! function_exists( 'is_singular' ) ) {
	function is_singular() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_singular'] ?? false;
	}
}

if ( ! function_exists( 'is_single' ) ) {
	function is_single() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_single'] ?? false;
	}
}

if ( ! function_exists( 'is_home' ) ) {
	function is_home() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_home'] ?? false;
	}
}

if ( ! function_exists( 'is_search' ) ) {
	function is_search() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_search'] ?? false;
	}
}

if ( ! function_exists( 'is_404' ) ) {
	function is_404() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_404'] ?? false;
	}
}

if ( ! function_exists( 'is_day' ) ) {
	function is_day() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_day'] ?? false;
	}
}

if ( ! function_exists( 'is_month' ) ) {
	function is_month() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_month'] ?? false;
	}
}

if ( ! function_exists( 'is_year' ) ) {
	function is_year() {
		global $MOCK_DATA;
		return $MOCK_DATA['is_year'] ?? false;
	}
}

if ( ! function_exists( 'pings_open' ) ) {
	function pings_open( $post_id = null ) {
		global $MOCK_DATA;
		return $MOCK_DATA['pings_open'] ?? false;
	}
}
