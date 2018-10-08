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

function token_browser_tree() {
  $rows = token_browser_type_info();

  $element = array(
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
        array('token_browser', 'velocity'),
      ),
    ),
  );

  return drupal_render($element);
}

/**
 * Token browser json endpoint callback.
 */
function token_browser_endpoint($type) {
  $ancestors = isset($_GET['ancestors']) ? drupal_json_decode($_GET['ancestors']) : array();

  return token_browser_build_level($type, $ancestors);
}

/**
 * Token Browser types endpoint callback.
 */
function token_browser_types_endpoint() {
  return token_browser_type_info();
}

function token_browser_type_info() {
  $data = array();
  $info = token_get_info();

  foreach ($info['types'] as $type => $type_info) {
    $data[$type] = array(
      'name' => array(
        'data' => $type_info['name'],
        'attributes' => array(
          'data-type' => $type,
        ),
      ),
      'token' => '',
      'description' => isset($type_info['description']) ? $type_info['description'] : '',
    );
  }

  return $data;
}

/**
 * Build a level of the token heirarchy.
 *
 * @param $type
 *   The type to build a level for.
 * @param array $ancestors
 *   The ancestors of the given type. This allows the complete token to be
 *   constructed.
 */
function token_browser_build_level($type, array $ancestors = array()) {
  $level = array();
  $info = token_get_info();

  if (!isset($info['types'][$type]) || !isset($info['tokens'][$type])) {
    return $level;
  }

  if ($entity_token = token_get_entity_mapping('entity', $type)) {
    $type = $entity_token;
  }

  foreach ($info['tokens'][$type] as $child => $child_info) {
    $raw_token_parts = $ancestors;

    if (in_array($child, array_slice($raw_token_parts, 1), TRUE)) {
      continue;
    }

    $raw_token_parts[] = $child;

    if (!empty($child_info['dynamic'])) {
      $raw_token_parts[] = '?';
    }

    $raw_token = '[' . implode(':', $raw_token_parts) . ']';
    $level[$child]['name'] = $child_info['name'];
    $level[$child]['description'] = $child_info['description'];
    $level[$child]['token'] = $child;

    if (isset($info['types'][$child_info['type']])) {
      $level[$child]['type'] = $child_info['type'];
    }

    $level[$child]['raw'] = $raw_token;
    $level[$child]['ancestors'] = $ancestors;
  }

  return $level;
}
