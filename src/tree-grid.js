(function ($, Drupal, window, ducment, undefined) {

  'use strict';

  var settings = {};

  function expand(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();
    var type = $cell.data('type');
    var token = $cell.data('token');
    var level = Number($row.attr('aria-level'));
    var size = $cell.data('size') ? Number($cell.data('size')) : 0;

    $target.off('click', expand);

    if (!token) {
      token = type;
    }

    if ($row.data('tree-fetched')) {
      $row.nextAll().slice(0, size).fadeIn();
      $('html, body').scrollTop($row.offset().top);
    }
    else {
      var ancestors = $cell.data('ancestors') ? $cell.data('ancestors') : [];

      ancestors.push(token);

      var $jsonXHR = $.ajax({
        dataType: 'json',
        contentType: 'application/json',
        url: settings.basePath + 'token/browser/token/' + type,
        data: {
          'ancestors': JSON.stringify(ancestors)
        }
      });

      $jsonXHR.done(function (data) {
        $.each(data, function (index, element) {
          var $button = $('<button>Expand</button>').on('click', expand);

          var $tr = $('<tr>', {
            'role': 'row',
            'aria-level': level + 1,
            'aria-expanded': 'false'
          })
          .hide()
          .append(
            $('<td>', {'role': 'gridcell'}).text(element.name).data({
              'token': element.token,
              'type': element.type,
              'ancestors': element.ancestors
            }).prepend($button),
            $('<td>', {'role': 'gridcell'}).text(element.raw),
            $('<td>', {'role': 'gridcell'}).text(element.description)
          );

          if (!element.type) {
            $button.remove();
          }

          $row.after($tr);
          $tr.fadeIn();

          ++size;
        });

        $('html, body').scrollTop($row.offset().top);
        $row.attr('aria-setsize', size);
      });

      $row.data('tree-fetched', true);
    }

    $row.attr('aria-expanded', true);
    $target.html('Collapse');
    $target.on('click', collapse);
  }

  function collapse(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();
    var level = Number($row.attr('aria-level'));
    var size = Number($row.attr('aria-setsize));
    var $children = $row.nextAll().slice(0, size);

    $target.off('click', collapse);
    $children.fadeOut();
    $row.attr('aria-expanded', false);
    $target.html('Expand');
    $target.on('click', expand);
  }

  Drupal.behaviors.treeGrid = {
    attach: function (context, drupalSettings) {
      settings = drupalSettings;

      var $treegrid = $('.tree-grid', context);
      var $button_cells = $treegrid.find('td:first-child');
      var $button = $('<button>Expand</button>').on('click', expand);

      $button_cells.prepend($button);
    }
  };

})(jQuery, Drupal, this, this.document);
