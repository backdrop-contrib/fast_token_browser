<?php

/**
 * @file
 * Token Browser callback functions.
 */

/**
 * Token browser test page callback.
 */
function token_browser_page() {
  module_load_include('inc', 'token_browser', 'includes/token_browser.form');

  $form = drupal_get_form('token_browser_test_form');

  return $form;
}

/**
 * Token browser tree callback.
 */
function token_browser_tree() {
  module_load_include('inc', 'token_browser', 'includes/token_browser');

  $definition = array(
    'types' => array(
      'filter' => FILTER_SANITIZE_FULL_SPECIAL_CHARS,
      'flags' => FILTER_FLAG_NO_ENCODE_QUOTES,
    ),
  );


  $input = filter_input_array(INPUT_GET, $definition);
  $types = isset($input['types']) ? drupal_json_decode($input['types']) : array();
  $tree = token_browser_tree_view($types);

  return $tree;
}

function token_browser_tree_output($page_callback_result) {
  $content = drupal_render($page_callback_result);

  drupal_send_headers();

  $html = drupal_get_css() . drupal_get_js('header') . $content . drupal_get_js('footer');

  print $html;

  drupal_page_footer();
}

/**
 * Token browser json endpoint callback.
 */
function token_browser_endpoint($type) {
  module_load_include('inc', 'token_browser', 'includes/token_browser');

  $definition = array(
    'ancestors' => array(
      'filter' => FILTER_SANITIZE_FULL_SPECIAL_CHARS,
      'flags' => FILTER_FLAG_NO_ENCODE_QUOTES,
    ),
  );

  $input = filter_input_array(INPUT_GET, $definition);
  $type = filter_var($type, FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
  $ancestors = isset($input['ancestors']) ? drupal_json_decode($input['ancestors']) : array();

  return token_browser_build_level($type, $ancestors);
}
