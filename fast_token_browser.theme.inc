<?php
/**
 * @file
 * Token Browser theme functions.
 */

 /**
  * Token Browser link theme. 
  */
function theme_fast_token_browser_link($variables) {
  $options = array(
    'attributes' => array(),
    'query' => array(
      'token' => backdrop_get_token('token-browser'),
      'show_restricted' => $variables['show_restricted'] ? 1 : 0,
    ),
  );

  if (!empty($variables['token_types'])) {
    $options['query']['token_types'] = backdrop_json_encode($variables['token_types']);
    $options['query']['global_types'] = backdrop_json_encode($variables['global_types']);
  }

  if (!empty($variables['dialog'])) {
    backdrop_add_library('fast_token_browser', 'fast-token-browser');
    backdrop_add_library('system', 'backdrop.ajax');

    $options['attributes']['class'][] = 'use-ajax token-browser-link';
  }
  else {
    $options['attributes']['target'] = '_blank';
  }

  // Pass show_restricted and click_insert flags.
  $settings['tokenBrowser'] = array(
    'restricted' => $variables['show_restricted'],
    'click_insert' => $variables['click_insert'],
  );
  backdrop_add_js($settings, 'setting');

  return l($variables['text'], 'token-browser/tree', $options);
}

/**
 * Token Browser theme.
 */
function theme_fast_token_browser($variables) {
  if (!empty($variables['dialog'])) {
    return theme_fast_token_browser_link($variables);
  }

  $content = fast_token_browser_tree_build_content($variables['token_types'], $variables['global_types'], $variables['show_restricted']);

  // Pass show_restricted and click_insert flags.
  $settings['tokenBrowser'] = array(
    'restricted' => $variables['show_restricted'],
    'click_insert' => $variables['click_insert'],
  );
  backdrop_add_js($settings, 'setting');

  return fast_token_browser_render($content);
}
