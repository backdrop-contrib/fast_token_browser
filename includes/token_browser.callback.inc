<?php

/**
 * @file
 * Token Browser callback functions.
 */

/**
 * Token browser test page callback.
 */
function token_browser_test() {
  module_load_include('inc', 'token_browser', 'includes/token_browser.form');

  return drupal_get_form('token_browser_test_form');;
}

/**
 * Token browser tree callback.
 */
function token_browser_tree() {
  module_load_include('inc', 'token_browser', 'includes/token_browser');

  $types = isset($_GET['token_types']) ? drupal_json_decode($_GET['token_types']) : array();

  return token_browser_tree_view($types);
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

  $ancestors = isset($_GET['ancestors']) ? drupal_json_decode($_GET['ancestors']) : array();

  return token_browser_build_level($type, $ancestors);
}
