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
    'attributes' => array(
      'target' => '_blank',
    ),
  );

  if (!empty($variables['token_types'])) {
    $options['query'] = array(
      'token_types' => drupal_json_encode($variables['token_types']),
      'global_types' => drupal_json_encode($variables['global_types']),
    );
  }

  if (!empty($variables['dialog'])) {
    drupal_add_library('token_browser', 'token-browser');

    $options['attributes']['class'][] = 'token-browser';
  }

  return l($variables['text'], 'token/browser/tree', $options);
}
