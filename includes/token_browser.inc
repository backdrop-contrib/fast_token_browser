<?php

/**
 * @file
 * Utility functions for Token Browser.
 */

/**
 * Build an array of all available token types.
 *
 * @return array
 *   The constructed array of types keyed by type.
 */
function token_browser_type_info() {
  $data = array();
  $info = token_get_info();

  foreach ($info['types'] as $type => $type_info) {
    $data[$type] = array(
      'name' => array(
        'data' => $type_info['name'],
        'attributes' => array(
          'data-type' => $type,
          'class' => array('token-name'),
        ),
      ),
      'token' => array(
        'data' => $type,
        'attributes' => array(
          'class' => array('token-raw'),
        ),
      ),
      'description' => array(
        'data' => isset($type_info['description']) ? $type_info['description'] : '',
        'attributes' => array(
          'class' => array('token-description'),
        ),
      ),
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
 * @return array
 *   The constructed level of tokens as an array keyed by token.
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
    $level[$child]['description'] = filter_xss($child_info['description']);
    $level[$child]['token'] = $child;

    if (isset($info['types'][$child_info['type']])) {
      $level[$child]['type'] = $child_info['type'];
    }

    $level[$child]['raw'] = $raw_token;
    $level[$child]['ancestors'] = $ancestors;
  }

  return $level;
}
