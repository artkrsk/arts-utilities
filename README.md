# ArtsUtilities

A comprehensive collection of utility methods for WordPress theme and plugin development, with a focus on Elementor integration.

[![Latest Version on Packagist](https://img.shields.io/packagist/v/arts/utilities.svg?style=flat-square)](https://packagist.org/packages/arts/utilities)
[![Total Downloads](https://img.shields.io/packagist/dt/arts/utilities.svg?style=flat-square)](https://packagist.org/packages/arts/utilities)
[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/artemsemkin)

## Installation

You can install the package via Composer:

```bash
composer require arts/utilities
```

## Basic Usage

The package provides a main `Utilities` class that incorporates all traits:

```php
use Arts\Utilities\Utilities;

// Use any of the methods directly
$aspectRatio = Utilities::get_image_aspect_ratio($imageId);
```

Or you can use individual traits in your own classes:

```php
use Arts\Utilities\Traits\Images;

class MyClass {
    use Images;

    public function myMethod() {
        $aspectRatio = self::get_image_aspect_ratio($imageId);
    }
}
```

## Documentation

### Elementor Utilities

#### Controls

Methods for working with Elementor controls and settings.

```php
// Get thumbnail size from Elementor image control settings
$settings = $widget->get_settings_for_display();
$thumbnailSize = Utilities::get_settings_thumbnail_size($settings, $imageId, 'image');

// Get group control value
$value = Utilities::get_group_control_value($settings, 'image', 'size', 'full');
```

#### Document

Working with Elementor documents and document settings.

```php
// Get a document option
$backgroundColor = Utilities::get_document_option('background_color', $postId, '#ffffff');

// Get an overridden document option
$headerHeight = Utilities::get_overridden_document_option('header_height', 'override_header', '100px');

// Get body styles model based on document options
$bodyStyles = Utilities::get_body_styles_model();
```

#### Kit

Work with Elementor kits and global settings.

```php
// Get a color value from global colors
$colorValue = Utilities::get_color_value($settings, 'button_color', '#000000');

// Get kit settings
$typographySettings = Utilities::get_kit_settings('typography_body');

// Get kit setting or theme mod
$primaryColor = Utilities::get_kit_setting_or_theme_mod('primary_color', '#default');

// Update kit settings
Utilities::update_kit_settings('primary_color', '#newcolor');
```

#### Responsive Controls

Handle Elementor responsive controls and breakpoints.

```php
// Get media query string for a responsive option
$mediaQuery = Utilities::get_media_query_string_for_responsive_option($element, 'show_title');

// Check if responsive option is enabled
$isEnabled = Utilities::has_responsive_enabled_option($element, 'show_title');
```

#### Theme Builder

Work with Elementor Theme Builder templates.

```php
// Check if Theme Builder is active
$isActive = Utilities::is_theme_builder_active();

// Get the Theme Builder location ID
$locationId = Utilities::get_theme_builder_location_id();

// Check if a location has a template
$hasTemplate = Utilities::location_has_template('single');
```

#### Plugin

Check Elementor plugin status and settings.

```php
// Check if Elementor is active
$isActive = Utilities::is_elementor_plugin_active();

// Check if a post is built with Elementor
$isBuiltWithElementor = Utilities::is_built_with_elementor($postId);

// Check if Elementor editor is active
$isEditorActive = Utilities::is_elementor_editor_active();
```

### WordPress Utilities

#### ACF

Work with Advanced Custom Fields.

```php
// Get field value
$fieldValue = Utilities::acf_get_field('field_name', $postId);

// Check if repeater has rows
$hasRows = Utilities::acf_have_rows('repeater_field', $postId);

// Get all ACF fields for a post
$fields = Utilities::acf_get_post_fields($postId);
```

#### Blog

Blog-related utilities.

```php
// Output pingback link markup
Utilities::get_link_rel_pingback_markup();

// Get pagination link attributes
$attributes = Utilities::get_pagination_link_attributes(['class' => 'nav-link'], 'next');
```

#### Conditions

Check various WordPress conditions.

```php
// Check if current page is an archive
$isArchive = Utilities::is_archive();
```

#### Fonts

Font-related utilities.

```php
// Register custom font MIME types (add to upload_mimes filter)
add_filter('upload_mimes', [Utilities::class, 'get_fonts_mime_types']);

// Handle custom font file types (add to wp_check_filetype_and_ext filter)
add_filter('wp_check_filetype_and_ext', [Utilities::class, 'get_fonts_custom_file_extensions'], 10, 4);
```

#### Frontend

Frontend asset management utilities.

```php
// Enqueue a script with dynamic loading
Utilities::enqueue_dynamic_load_script('asset', [
    'handle' => 'my-script',
    'src' => 'path/to/script.js',
    'deps' => ['jquery'],
]);

// Enqueue a stylesheet with dynamic loading
Utilities::enqueue_dynamic_load_style([
    'handle' => 'my-style',
    'src' => 'path/to/style.css',
]);

// Check if a script is eligible for dynamic loading
$isEligible = Utilities::is_script_eligible_for_dynamic_load('my-script');
```

#### Images

Image utilities.

```php
// Get image aspect ratio
$aspectRatio = Utilities::get_image_aspect_ratio($imageId);

// Get available image sizes
$sizes = Utilities::get_available_image_sizes();
```

#### LoopedPosts

Work with post loops with automatic looping back to the beginning.

```php
// Get previous and next posts in a loop
$prevNextPosts = Utilities::get_prev_next_posts_looped([
    'post_type' => 'post',
    'in_same_term' => true,
    'taxonomy' => 'category',
]);

// Setup and iterate through a custom loop
$posts = get_posts(['post_type' => 'product', 'posts_per_page' => 10]);
Utilities::setup_looped_posts($posts);

while (Utilities::have_looped_posts()) {
    $post = Utilities::the_looped_post();
    // Use $post data...
}

Utilities::reset_looped_posts();
```

#### Markup

Generate HTML markup and handle attributes.

```php
// Generate component attributes
$attrs = Utilities::get_component_attributes(
    ['class' => ['existing-class']],
    ['name' => 'MyComponent', 'hasAnimation' => true]
);

// Print HTML attributes
Utilities::print_attributes($attrs);

// Get post terms as CSS classes
$classes = Utilities::get_post_terms_classes($post);

// Validate and print HTML tag
Utilities::print_html_tag('h2');

// Add classes to the HTML element
add_filter('language_attributes', function($attributes) {
    return Utilities::add_root_html_classes($attributes, ['dark-mode', 'custom-theme']);
});
```

#### Query

WordPress query utilities.

```php
// Get a page by title
$page = Utilities::get_page_by_title('About Us');

// Get page titles for the current context
$titles = Utilities::get_page_titles();

// Get uploaded fonts
$fonts = Utilities::get_uploaded_fonts();

// Get categories of posts
$categories = Utilities::get_posts_categories('current_page', [
    'post_type' => 'post',
    'posts_per_page' => 10,
]);

// Get post author information
$author = Utilities::get_post_author($postId);
```

#### Shortcodes

Custom shortcode utilities.

```php
// Register current year shortcode
add_shortcode('current_year', [Utilities::class, 'get_shortcode_current_year']);
```

#### Strings

String manipulation utilities.

```php
// Convert camelCase to kebab-case
$kebabCase = Utilities::convert_camel_to_kebab_case('myVariableName'); // my-variable-name

// Convert camelCase to snake_case
$snakeCase = Utilities::convert_camel_to_snake_case('myVariableName'); // my_variable_name

// Convert kebab-case to camelCase
$camelCase = Utilities::convert_kebab_case_to_camel('my-kebab-string'); // myKebabString

// Get slug from string
$slug = Utilities::get_slug_from_string('My String & Stuff'); // my_string_stuff

// Get file extension from URL
$ext = Utilities::get_asset_url_file_extension('https://example.com/file.pdf'); // pdf
```

#### Taxonomies

Taxonomy and term utilities.

```php
// Get taxonomy term names for a post
$terms = Utilities::get_taxonomy_term_names($postId, 'category');

// Get all post terms across taxonomies
$postTerms = Utilities::get_post_terms(get_object_taxonomies('post', 'objects'), $postId);

// Generate a tax query array from term IDs
$taxQuery = Utilities::get_tax_query([1, 2, 3], 'IN');

// Get term ancestors
$ancestors = Utilities::get_term_ancestors_list($termId, 'category');

// Build hierarchical taxonomy tree
$hierarchy = Utilities::get_taxonomy_hierarchy('category');

// Get a term by field
$term = Utilities::get_term_by('slug', 'news', 'category');
```

#### Theme

Theme utilities.

```php
// Get parent theme version
$version = Utilities::get_parent_theme_version();
```

#### URL

URL utilities.

```php
// Check if referer is from same domain
$isSameDomain = Utilities::is_referer_from_same_domain();

// Get license arguments URL for EDD
$url = Utilities::get_license_args_url('https://example.com/api', 'license_key_option');
```

#### WooCommerce

WooCommerce utilities.

```php
// Check if current page is shop
$isShop = Utilities::is_shop();

// Check if current page is WooCommerce
$isWooCommerce = Utilities::is_woocommerce();

// Get WooCommerce URLs
$urls = Utilities::get_woocommerce_urls();

// Get WooCommerce page title
$title = Utilities::get_woocommerce_page_title();

// Get a product
$product = Utilities::get_product($productId);

// Check if product is in stock
$inStock = Utilities::is_product_in_stock($productId);

// Get cart contents
$cartContents = Utilities::get_cart_contents();

// Get cart total
$total = Utilities::get_cart_total();
```

## License

GPL-3.0-or-later - Compatible with WordPress. Please see [License File](LICENSE) for more information.

This library is licensed under GPL-3.0-or-later to ensure compatibility with WordPress and GPL-licensed plugins.

## 💖 Support

If you find this package useful, consider buying me a coffee:

<a href="https://buymeacoffee.com/artemsemkin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

---

Made with ❤️ by [Artem Semkin](https://artemsemkin.com)
