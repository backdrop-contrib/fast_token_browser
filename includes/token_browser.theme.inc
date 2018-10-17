<?php

/**
 * @file
 * Token Browser theme functions.
 */

/**
 * Token Browser Link theme.
 */
function theme_token_browser_link($variables) {
  $options = array(
    'attributes' => array(),
  );

  if (!empty($variables['token_types'])) {
    $options['query'] = array(
      'token_types' => drupal_json_encode($variables['token_types']),
      'global_types' => drupal_json_encode($variables['global_types']),
      'token' => drupal_get_token('token-browser'),
    );
  }

  if (!empty($variables['dialog'])) {
    drupal_add_library('token_browser', 'token-browser-link');
    // drupal_add_library('token_browser', 'token-browser');
    // drupal_add_js(array('tokenBrowser' => array('token' => drupal_get_token('token-browser-endpoint'))), 'setting');

    $options['attributes']['class'][] = 'token-browser';
  }
  else {
    $options['attributes']['target'] = '_blank';
  }

  return l($variables['text'], 'token/browser/tree', $options);
}
