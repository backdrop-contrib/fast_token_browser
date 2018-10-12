<?php

/**
 * @file
 * Utility functions for Token Browser.
 */

/**
 * Genereate a render array of token types.
 * @param array $types
 *   An array of token types to display in the tree.
 * @param bool $global_types
 *   Whether or not to include global types in the tree.
 * @return array
 *   The constructed array of types keyed by type.
 */
function token_browser_tree_view(array $types = array(), $global_types = TRUE) {
  $info = token_get_info();
  $rows = array();
  $posinset = 1;

  if (empty($types)) {
    $types = array_keys($info['types']);
  }
  elseif ($global_types) {
    $types = array_merge($types, token_get_global_token_types());
  }

  foreach ($info['types'] as $type => $type_info) {
    if (!in_array($type, $types) || substr($type, 0, 4) === 'list') {
      continue;
    }

    $rows[] = array(
      'data' => array(
        array(
          'data' => '<button>Expand</button>' . $type_info['name'],
          'data-type' => $type,
          'role' => 'gridcell',
          'class' => array('token-name'),
        ),
        array(
          'data' => $type,
          'role' => 'gridcell',
          'class' => array('token-raw'),
        ),
        array(
          'data' => isset($type_info['description']) ? $type_info['description'] : '',
          'role' => 'gridcell',
          'class' => array('token-description'),
        ),
      ),
      'role' => 'row',
      'aria-level' => '1',
      'aria-posinset' => $posinset++,
      'aria-expanded' => 'false',
      'aria-busy' => 'false',
    );
  }

  $build = array(
    '#theme' => 'table',
    '#header' => array(
      t('Name'),
      t('Token'),
      t('Description'),
    ),
    '#rows' => $rows,
    '#attributes' => array(
      'role' => 'treetable',
      'aria-label' => 'Token Browser',
      'class' => array(
        'tree-grid',
      ),
    ),
    '#attached' => array(
      'library' => array(
        array('token_browser', 'token-browser'),
      ),
    ),
  );

  return $build;
}

/**
 * Build a level of the token heirarchy.
 *
 * @param string $type
 *   The type to build a level for.
 * @param array $ancestors
 *   The ancestors of the given type. This allows the complete token to be
 *   constructed.
 * @return array
 *   The constructed level of tokens as an array keyed by token.
 */
function token_browser_build_level(string $type, array $ancestors = array()) {
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
