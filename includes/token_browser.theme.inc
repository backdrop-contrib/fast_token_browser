<?php

/**
 * @file
 * Token Browser theme functions.
 */

/**
 * Tree Grid theme.
 */
function theme_tree_grid($variables) {
  $header = $variables['header'];
  $rows = $variables['rows'];
  $attributes = $variables['attributes'];

  $attributes['role'] = 'treetable';

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
        $output .= '<td role="gridcell">' . $cell . "</td>\n";
      }

      $output .= "</tr>\n";
    }

    $output .= "</tbody>\n";
  }

  $output .= "</table>\n";

  return $output;
}
