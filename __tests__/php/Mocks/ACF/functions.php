<?php
/**
 * ACF Functions mocks
 */

// ACF functions
function get_field( $field_name, $post_id = null, $format_value = true, $escape_html = false ) {
	global $MOCK_DATA;

	// Check if ACF is explicitly set as not existing
	if ( isset( $MOCK_DATA['acf_exists'] ) && $MOCK_DATA['acf_exists'] === false ) {
		// This should cause the trait's function_exists() check to fail
		// Return a value that will make PHP throw an error if used directly
		return null;
	}

	// For the acf_get_field test
	if ( isset( $MOCK_DATA['acf_field_value'] ) ) {
		return $MOCK_DATA['acf_field_value'];
	}

	return $MOCK_DATA['acf_fields'][ $field_name ] ?? null;
}

function have_rows( $selector, $post_id = false ) {
	global $MOCK_DATA;

	// For the acf_have_rows test
	if ( isset( $MOCK_DATA['acf_have_rows'] ) ) {
		return $MOCK_DATA['acf_have_rows'];
	}

	return $MOCK_DATA['have_rows'][ $selector ] ?? false;
}

function get_field_objects( $post_id = false, $format_value = true, $load_value = true, $escape_html = false ) {
	global $MOCK_DATA;

	// Check if ACF is explicitly set as not existing
	if ( isset( $MOCK_DATA['acf_exists'] ) && $MOCK_DATA['acf_exists'] === false ) {
		// This should cause the trait's function_exists() check to fail
		// But it doesn't matter what we return since function_exists() should return false
		return null;
	}

	// For the acf_get_field_objects tests
	if ( isset( $MOCK_DATA['acf_field_objects'] ) ) {
		return $MOCK_DATA['acf_field_objects'];
	}

	return $MOCK_DATA['field_objects'] ?? array();
}

function acf_get_field( $field_name, $post_id = null ) {
	global $MOCK_DATA;
	return $MOCK_DATA['acf_fields'][ $field_name ] ?? '';
}
