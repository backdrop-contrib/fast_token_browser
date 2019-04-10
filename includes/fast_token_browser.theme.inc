<?php

/**
 * @file
 * Token Browser theme functions.
 */

/**
 * Token Browser Link theme.
 */
function theme_fast_token_browser_link($variables) {
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
    drupal_add_library('fast_token_browser', 'fast-token-browser');
    drupal_add_library('fast_token_browser', 'fast-token-browser-dialog');

    $options['attributes']['class'][] = 'token-browser';
  }
  else {
    $options['attributes']['target'] = '_blank';
  }

  return l($variables['text'], 'token-browser/tree', $options);
}

/**
 * Token Browser theme.
 */
function theme_fast_token_browser($variables) {
  if (!empty($variables['dialog'])) {
    return theme_fast_token_browser_link($variables);
  }

  $content = fast_token_browser_tree_build_content($variables['token_types'], $variables['global_types']);

  return fast_token_browser_render($content);
}
