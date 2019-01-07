(function ($, Drupal, window, document, undefined) {

  'use strict';

  var ANCESTORS = {};

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

  function display(current, display, callback) {
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
        next.style.display = display;
      }
    }

    callback();
  }

  function row(element, level, index) {
    var tr = document.createElement('tr');
    var button = document.createElement('button');
    var link = document.createElement('a');
    var name = document.createElement('td');
    var raw = document.createElement('td');
    var description = document.createElement('td');

    tr.setAttribute('role', 'row');
    tr.setAttribute('aria-level', level);
    tr.setAttribute('aria-posinset', index);
    tr.setAttribute('aria-expanded', 'false');
    tr.setAttribute('aria-busy', 'false');

    button.setAttribute('aria-label', 'Expand');
    button.addEventListener('click', expand);
    button.innerHTML = 'Expand';

    link.setAttribute('href', 'javascript:void(0);');
    link.setAttribute('title', 'Select the token ' + element.raw + '. Click in a text field to insert it.');
    link.setAttribute('class', 'token-key');
    link.addEventListener('click', select);

    name.setAttribute('role', 'gridcell');
    name.setAttribute('class', 'token-name');
    name.setAttribute('data-token', element.token);
    name.setAttribute('data-type', element.type);
    name.setAttribute('data-raw', element.raw);

    raw.setAttribute('role', 'gridcell');
    raw.setAttribute('class', 'token-raw');
    raw.appendChild(link);

    description.setAttribute('role', 'gridcell');
    description.setAttribute('class', 'token-description');

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

    var request = $.get(url, parameters, function (data) {
      var buffer = document.createDocumentFragment();
      var level = Number($row.attr('aria-level'));
      var size = getSize($cell);
      var position = 1;

      $.each(data, function (index, element) {
        buffer.appendChild(row(element, level + 1, position++));
        size += 1;
      });

      $row.after(buffer);
      $row.attr('aria-setsize', size);
      $row.data('fetched', true);
      callback();
    }, 'json');
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
        $button.attr('aria-label', 'Collapse');
        $button.bind('click', collapse);
      });
    }
    else {
      $button.text('Loading...');
      $button.attr('aria-label', 'Loading...');
      $row.attr('aria-busy', 'true');

      fetch($row, $cell, function () {
        $row.attr('aria-expanded', 'true');
        $row.attr('aria-busy', 'false');
        $button.text('Collapse');
        $button.attr('aria-label', 'Collapse');
        $button.bind('click', collapse);
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
      $button.attr('aria-label', 'Expand');
      $button.bind('click', expand);
    });
  }

  Drupal.behaviors.tokenBrowserTreegrid = {
    attach: function (context, settings) {
      var $treegrid = $('.tree-grid', context);
      var $buttons = $treegrid.find('button');

      $buttons.bind('click', expand);
    }
  };

  Drupal.behaviors.tokenBrowser = {
    attach: function (context, settings) {
      var $window = $(window, context);
      var $links = $('a.token-browser').once('token-browser');

      var data = {
        'ajax_page_state[theme]': settings.ajaxPageState.theme,
        'ajax_page_state[theme_token]': settings.ajaxPageState.theme_token
      };

      $links.click(function (event) {
        var $link = $(event.target);
        var $dialog = $('<div>').hide();
        var url = $link.attr('href');

        event.stopPropagation();
        event.preventDefault();

        if ($links.hasClass('token-browser-open')) {
          return false;
        }
        else {
          $links.addClass('token-browser-open');
        }

        $dialog.addClass('loading').appendTo('body');

        $dialog.dialog({
          title: Drupal.t('Token Browser'),
          classes: { 'ui-dialog': 'token-browser-dialog' },
          dialogClass: 'token-browser-dialog',
          width: $window.width() * 0.8,
          close: function () {
            $dialog.remove();
            $links.removeClass('token-browser-open');
          }
        });

        $dialog.load(url, data, function () { $dialog.removeClass('loading'); });

        return false;
      });
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
