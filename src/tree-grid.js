(function ($, Drupal, window, ducment, undefined) {

  'use strict';

  var types = {};

  function click_button(event) {
  }

  Drupal.behaviors.treeGrid = {
    attach: function (context, settings) {
      var $jsonXHR = $.getJSON(settings.basePath + '/token/browser/types');
      var $tg = $('.tree-grid', context);
      var $button_cells = $tg.find('td:first-child');
      var $button = $('<button>Expand</button>');

      $jsonXHR.done(function (data) {
        types = data;
        $button_cells.prepend($button);
      });

      $button.on('click', click_button);
    }
  };


})(jQuery, Drupal, this, this.document);
