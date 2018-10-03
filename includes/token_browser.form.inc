<?php
/**
 * @file
 * Token Browser forms.
 */

/**
 * Token browser test form.
 */
function token_browser_test_form($form, &$form_state) {
  $form['token'] = array(
    '#type' => 'textfield',
    '#title' => t('Token'),
  );

  $form['token_tree_link'] = array(
    '#theme' => 'token_tree_link',
    '#token_types' => 'all',
    '#show_restricted' => TRUE,
  );

  return $form;
}
