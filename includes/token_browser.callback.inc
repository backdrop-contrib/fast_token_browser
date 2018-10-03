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
