(function ($, Drupal, window, ducment, undefined) {

  'use strict';

  var $html;
  var settings = {};

  function getLevel($row) {
    return Number($row.attr('aria-level'));
  }

  function isExpanded($row) {
    return $row.attr('aria-expanded') === 'true';
  }

  function getAncestors($cell) {
    var ancestors = $cell.data('ancestors');

    return ancestors ? ancestors : [];
  }

  function getSize($cell) {
    var size = $cell.data('size');

    return size ? Number(size) : 0;
  }

  function toggle($current, level) {
    var expand = [];
    var expanded = isExpanded($current);

    expand[level + 1] = true;

    $current.nextAll().each(function (index, next) {
      var $next = $(next);
      var next_level = getLevel($next);

      if (next_level <= level) {
        return false;
      }

      expand[next_level + 1] = expand[next_level] && isExpanded($next);

      if (expand[next_level]) {
        if (expanded) {
          $next.velocity({opacity: 0, display: 'none'});
        }
        else {
          $next.velocity({opacity: 1, display: 'table-row'});
        }
      }
    });
  }

  function buildRow(element, level) {
    var $button = $('<button>Expand</button>').on('click', expand);

    var $tr = $('<tr>', {
      'role': 'row',
      'aria-level': level,
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

    return $tr;
  }

  function expand(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();
    var level = getLevel($row);
    var size = getSize($cell);
    var type = $cell.data('type');
    var token = $cell.data('token') ? $cell.data('token') : type;

    $target.off('click', expand);

    if ($row.data('fetched')) {
      toggle($row, level);
    }
    else {
      var ancestors = getAncestors($cell);

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
          var $tr = buildRow(element, level + 1);

          $row.after($tr);
          $tr.fadeIn();

          ++size;
        });

        $row.attr('aria-setsize', size);
      });

      $row.data('fetched', true);
    }

    $row.attr('aria-expanded', 'true');
    $target.html('Collapse');
    $target.on('click', collapse);
  }

  function collapse(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();
    var level = getLevel($row);

    $target.off('click', collapse);
    toggle($row, level);
    $row.attr('aria-expanded', 'false');
    $target.html('Expand');
    $target.on('click', expand);
  }

  Drupal.behaviors.treeGrid = {
    attach: function (context, drupalSettings) {
      $html = $('html, body');
      settings = drupalSettings;

      var $treegrid = $('.tree-grid', context);
      var $button_cells = $treegrid.find('td:first-child');
      var $button = $('<button>Expand</button>').on('click', expand);

      $button_cells.prepend($button);
    }
  };

})(jQuery, Drupal, this, this.document);
