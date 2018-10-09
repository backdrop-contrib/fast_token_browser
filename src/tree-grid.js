(function ($, Drupal, window, ducment, undefined) {

  'use strict';

  var $HTML;

  var SETTINGS = {};

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

  function showRow($row, $elements) {
    $elements.velocity({
      opacity: 1, display: 'table-row'
    },
    {
      complete: function () { $HTML.animate({ scrollTop: $row.offset().top }); }
    });
  }

  function hideRow($row, $elements) {
    $elements.velocity({
      opacity: 0, display: 'none'
    },
    {
      complete: function () { $HTML.animate({ scrollTop: $row.offset().top }); }
    });
  }

  function toggle($current, level) {
    var $elements = $();
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
        $elements = $elements.add($next);
      }
    });

    if (expanded) {
      hideRow($current, $elements);
    }
    else {
      showRow($current, $elements);
    }
  }

  function row(element, level) {
    var $tr = $('<tr>', {
      'role': 'row',
      'aria-level': level,
      'aria-expanded': 'false'
    });

    var $name =  $('<td>', {
      'role': 'gridcell'
    });

    var $raw = $('<td>', {
      'role': 'gridcell'
    });

    var $description = $('<td>', {
      'role': 'gridcell'
    });

    var $button = $('<button>Expand</button>').on('click', expand);

    $name.text(element.name);
    $raw.text(element.raw);
    $description.text(element.description);

    $name.data({
      'token': element.token,
      'type': element.type,
      'ancestors': element.ancestors
    });

    if (element.type) {
      $name.prepend($button);
    }

    $tr.css({
      opacity: 0,
      display: 'none'
    });

    $tr.append($name, $raw, $description);

    return $tr;
  }

  function fetch($row, $cell, level) {
    var $elements = $();
    var size = getSize($cell);
    var type = $cell.data('type');
    var token = $cell.data('token') ? $cell.data('token') : type;
    var ancestors = getAncestors($cell);

    ancestors.push(token);

    var $jsonXHR = $.ajax({
      dataType: 'json',
      contentType: 'application/json',
      url: SETTINGS.basePath + 'token/browser/token/' + type,
      data: { 'ancestors': JSON.stringify(ancestors) }
    });

    $jsonXHR.done(function (data) {
      $.each(data, function (index, element) {
        size += 1;
        $elements = $elements.add(row(element, level + 1));
      });

      $row.after($elements);
      $row.attr('aria-setsize', size);
      $row.data('fetched', true);
      showRow($row, $elements);
    });
  }

  function expand(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();
    var level = getLevel($row);

    $target.off('click', expand);

    if ($row.data('fetched')) {
      toggle($row, level);
    }
    else {
      fetch($row, $cell, level);
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
      $HTML = $('html');
      SETTINGS = drupalSettings;

      var $treegrid = $('.tree-grid', context);
      var $button_cells = $treegrid.find('td:first-child');
      var $button = $('<button>Expand</button>').on('click', expand);

      $button_cells.prepend($button);
    }
  };

})(jQuery, Drupal, this, this.document);
