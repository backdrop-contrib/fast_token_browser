(function ($, Drupal, window, document, undefined) {

  'use strict';

  var ANCESTORS = {};

  var tr_template;
  var button_template;
  var link_template;
  var name_template;
  var raw_template;
  var description_template;

  function select(event) {
    var $token = $(event.target);

    event.preventDefault();
    event.stopPropagation();

    if (window.selectedToken) {
      window.selectedToken.removeClass('selected-token');
      window.selectedToken.removeAttr('aira-selected');
    }

    if (window.selectedToken && $token[0] === window.selectedToken[0]) {
      window.selectedToken = null;
    }
    else {
      window.selectedToken = $token;
      window.selectedToken.addClass('selected-token');
      window.selectedToken.attr('aria-selected');
    }
  }

  function getAncestors($cell) {
    var ancestors = ANCESTORS[$cell.data('raw')];

    return ancestors ? ancestors : [];
  }

  function getSize($cell) {
    var size = $cell.data('size');

    return size ? Number(size) : 0;
  }

  function getToken($cell, type) {
    var token = $cell.data('token');

    return token ? token : type;
  }

  function display(current, value, callback) {
    var next = current;
    var level = Number(current.getAttribute('aria-level'));
    var expand = [];

    expand[level + 1] = true;

    while (next = next.nextElementSibling) {
      var next_level = Number(next.getAttribute('aria-level'));

      if (next_level <= level) {
        break;
      }

      expand[next_level + 1] = expand[next_level] && next.getAttribute('aria-expanded') === 'true';

      if (expand[next_level]) {
        next.style.display = value;
      }
    }

    callback();
  }

  function setup() {
    tr_template = document.createElement('tr');
    button_template = document.createElement('button');
    link_template = document.createElement('a');
    name_template = document.createElement('td');
    raw_template = document.createElement('td');
    description_template = document.createElement('td');

    tr_template.setAttribute('role', 'row');
    tr_template.setAttribute('aria-expanded', 'false');
    tr_template.setAttribute('aria-busy', 'false');

    link_template.setAttribute('href', 'javascript:void(0);');
    link_template.setAttribute('class', 'token-key');

    name_template.setAttribute('role', 'gridcell');
    name_template.setAttribute('class', 'token-name');

    raw_template.setAttribute('role', 'gridcell');
    raw_template.setAttribute('class', 'token-raw');

    description_template.setAttribute('role', 'gridcell');
    description_template.setAttribute('class', 'token-description');
  }

  function row(element, level, index) {
    var tr = tr_template.cloneNode(false);
    var button = button_template.cloneNode(false);
    var link = link_template.cloneNode(false);
    var name = name_template.cloneNode(false);
    var raw = raw_template.cloneNode(false);
    var description = description_template.cloneNode(false);

    tr.setAttribute('aria-level', level);
    tr.setAttribute('aria-posinset', index);

    button.addEventListener('click', expand);
    button.innerHTML = 'Expand';

    link.setAttribute('title', 'Select the token ' + element.raw + '. Click in a text field to insert it.');
    link.addEventListener('click', select);

    name.setAttribute('data-token', element.token);
    name.setAttribute('data-type', element.type);
    name.setAttribute('data-raw', element.raw);

    raw.appendChild(link);

    name.innerHTML = element.name;
    link.innerHTML = element.raw;
    description.innerHTML = element.description;

    if (element.type) {
      name.insertBefore(button, name.firstChild);
      tr.classList.add('tree-grid-parent');
    }
    else {
      tr.classList.add('tree-grid-leaf');
    }

    ANCESTORS[element.raw] = element.ancestors;

    tr.appendChild(name);
    tr.appendChild(raw);
    tr.appendChild(description);

    return tr;
  }

  function fetch($row, $cell, callback) {
    var type = $cell.data('type');
    var token = getToken($cell, type);
    var ancestors = getAncestors($cell);
    var url = Drupal.settings.basePath + 'token-browser/token/' + type;
    var parameters = {};

    ancestors.push(token);

    parameters.ancestors = JSON.stringify(ancestors);
    parameters.token = Drupal.settings.fastTokenBrowser.token;

    $.ajax({
      'url': url,
      'data': parameters,
      'success': function (data) {
        var buffer = document.createDocumentFragment();
        var level = Number($row.attr('aria-level'));
        var size = getSize($cell);
        var position = 1;

       for (var key in data) {
         buffer.appendChild(row(data[key], level + 1, position++));
         size += 1;
       }

        $row.after(buffer);
        $row.attr('aria-setsize', size);
        $row.data('fetched', true);
        callback(true);
      },
      'error': function (request) {
        callback(false);
      },
      'dataType': 'json'
    });
  }

  function expand(event) {
    var $button = $(event.target);
    var $cell = $button.parent();
    var $row = $cell.parent();

    event.preventDefault();
    event.stopPropagation();

    $button.unbind('click', expand);

    if ($row.data('fetched')) {
      display($row[0], 'table-row', function () {
        $row.attr('aria-expanded', 'true');
        $button.text('Collapse');
        $button.bind('click', collapse);
      });
    }
    else {
      $row.attr('aria-busy', 'true');
      $button.text('Loading...');

      fetch($row, $cell, function (success) {
        if (success) {
          $row.attr('aria-expanded', 'true');
          $button.text('Collapse');
          $button.bind('click', collapse);
        }
        else {
          $button.text('Expand');
          $button.bind('click', expand);
        }

        $row.attr('aria-busy', 'false');
      });
    }
  }

  function collapse(event) {
    var $button = $(event.target);
    var $cell = $button.parent();
    var $row = $cell.parent();

    event.preventDefault();
    event.stopPropagation();

    $button.unbind('click', collapse);

    display($row[0], 'none', function () {
      $row.attr('aria-expanded', 'false');
      $button.text('Expand');
      $button.bind('click', expand);
    });
  }

  Drupal.behaviors.tokenBrowserTreegrid = {
    attach: function (context, settings) {
      var $treegrid = $('.tree-grid', context);
      var $buttons = $treegrid.find('button');

      setup();
      $buttons.bind('click', expand);
    }
  };

  Drupal.behaviors.tokenBrowserInsert = {
    attach: function (context, settings) {
      $('textarea, input[type="text"]').once('token-browser-insert').click(function (event) {
        var $input = $(event.target);

        if (window.selectedToken) {
          $input.val($input.val() + window.selectedToken.text());
          window.selectedToken.removeClass('selected-token');
          window.selectedToken.removeAttr('aria-selected');
          window.selectedToken = null;
        }
      });
    }
  };

})(jQuery, Drupal, this, this.document);
