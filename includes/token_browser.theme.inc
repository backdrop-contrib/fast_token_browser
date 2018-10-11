<?php

/**
 * @file
 * Token Browser theme functions.
 */

/**
 * Token Browser Link theme.
 */
function theme_token_browser_link($variables) {
  // Add library here as jQuery Dialog does not always reliably execute
  // associated scripts.
  drupal_add_library('token_browser', 'token-browser');

  $options = array('attributes' => array('class' => array('token-browser')));

  return l($variables['text'], 'token/browser/tree', $options);
}
