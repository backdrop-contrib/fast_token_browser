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
      'class' => array('token-browser'),
    ),
  );

  return l($variables['text'], 'token/browser/tree', $options);
}

/**
 * Tree Grid theme.
 */
function theme_tree_grid($variables) {
  $header = $variables['header'];
  $rows = $variables['rows'];
  $attributes = $variables['attributes'];

  $attributes['role'] = 'treetable';
  $attributes['class'][] = 'tree-grid';

  $output = '<table' . drupal_attributes($attributes) .">\n";
  $output .= "<thead>\n<tr>\n";

  foreach ($header as $cell) {
    $output .= '<th scope="col">' . $cell . "</th>\n";
  }

  $output .= "</tr>\n</thead>\n";

  if (!empty($rows)) {
    $output .= "<tbody>\n";

    foreach ($rows as $number => $row) {
      $row_attributes = array(
        'role' => 'row',
        'aria-level' => '1',
        'aria-expanded' => 'false',
      );

      $output .= '<tr' . drupal_attributes($row_attributes) . ">\n";

      foreach ($row as $cell) {
        $cell_attributes = array();

        if (is_array($cell)) {
          $cell_attributes = $cell['attributes'];
          $cell_data = $cell['data'];
        }
        else {
          $cell_data = $cell;
        }

        $cell_attributes['role'] = 'gridcell';
        $output .= '<td' . drupal_attributes($cell_attributes) . '>' . $cell_data . "</td>\n";
      }

      $output .= "</tr>\n";
    }

    $output .= "</tbody>\n";
  }

  $output .= "</table>\n";

  return $output;
}
