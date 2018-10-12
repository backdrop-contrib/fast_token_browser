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

  $form['token_browser_link'] = array(
    '#theme' => 'token_browser_link',
    '#text' => t('Browse available tokens.'),
    '#token_types' => array('node'),
    '#dialog' => TRUE,
  );

  return $form;
}
