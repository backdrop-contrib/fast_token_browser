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

  return drupal_render($form);
}

/**
 * Token browser tree callback.
 */
function token_browser_tree() {
  module_load_include('inc', 'token_browser', 'includes/token_browser');

  $rows = token_browser_type_info();

  $tree = array(
    '#theme' => 'tree_grid',
    '#header' => array(
      t('Name'),
      t('Token'),
      t('Description'),
    ),
    '#rows' => $rows,
    '#attached' => array(
      'library' => array(
        array('token_browser', 'tree-grid'),
      ),
    ),
  );

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

  $ancestors = isset($_GET['ancestors']) ? drupal_json_decode($_GET['ancestors']) : array();

  return token_browser_build_level($type, $ancestors);
}

/**
 * Token Browser types endpoint callback.
 */
function token_browser_types_endpoint() {
  module_load_include('inc', 'token_browser', 'includes/token_browser');

  return token_browser_type_info();
}
