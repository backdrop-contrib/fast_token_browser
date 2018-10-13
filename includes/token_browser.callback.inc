<?php

/**
 * @file
 * Token Browser callback functions.
 */

/**
 * Token browser tree page callback.
 */
function token_browser_tree() {
  $types = isset($_GET['token_types']) ? drupal_json_decode($_GET['token_types']) : array();
  $globals = isset($_GET['global_types']) ? drupal_json_decode($_GET['global_types']) : TRUE;

  return token_browser_tree_view($types, $globals);
}

/**
 * Token browser output delivery callback.
 *
 * @param array $page_callback_result
 *   A Token Browser tree render array.
 */
function token_browser_tree_output($page_callback_result) {
  $content = drupal_render($page_callback_result);

  drupal_send_headers();

  $html = drupal_get_css() . drupal_get_js('header') . $content . drupal_get_js('footer');

  print $html;

  drupal_page_footer();
}

/**
 * Token browser json endpoint callback.
 *
 * @param string $type
 *   The token type.
 */
function token_browser_endpoint($type) {
  $ancestors = isset($_GET['ancestors']) ? drupal_json_decode($_GET['ancestors']) : array();

  return token_browser_build_level($type, $ancestors);
}
