(function ($, Drupal, window, document, undefined) {

  'use strict';

  function select(event) {
    var $target = $(event.target);

    if (window.selectedToken) {
      window.selectedToken.removeClass('selected-token');
      window.selectedToken.removeAttr('aira-selected');
    }

    if (window.selectedToken && $target[0] === window.selectedToken[0]) {
      window.selectedToken = null;
    }
    else {
      window.selectedToken = $target;
      window.selectedToken.addClass('selected-token');
      window.selectedToken.attr('aria-selected');
    }

    return false;
  }

  function getAncestors($cell) {
    var ancestors = $cell.data('ancestors');

    return ancestors ? ancestors : [];
  }

  function getSize($cell) {
    var size = $cell.data('size');

    return size ? Number(size) : 0;
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
    $(name).data('ancestors', element.ancestors);

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

    tr.appendChild(name);
    tr.appendChild(raw);
    tr.appendChild(description);

    return tr;
  }

  function fetch($row, $cell, callback) {
    var type = $cell.data('type');
    var token = $cell.data('token') ? $cell.data('token') : type;
    var ancestors = getAncestors($cell);
    var url = Drupal.settings.basePath + 'token-browser/token/' + type;
    var parameters = {};

    ancestors.push(token);

    parameters.ancestors = JSON.stringify(ancestors);
    parameters.token = Drupal.settings.fastTokenBrowser.token;

    $.get(url, parameters, function (data) {
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
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();

    $target.unbind('click', expand);

    if ($row.data('fetched')) {
      display($row[0], 'table-row', function () {
        $row.attr('aria-expanded', 'true');
        $target.text('Collapse');
        $target.attr('aria-label', 'Collapse');
        $target.bind('click', collapse);
      });
    }
    else {
      $target.text('Loading...');
      $target.attr('aria-label', 'Loading...');
      $row.attr('aria-busy', 'true');
      fetch($row, $cell, function () {
        $row.attr('aria-expanded', 'true');
        $row.attr('aria-busy', 'false');
        $target.text('Collapse');
        $target.attr('aria-label', 'Collapse');
        $target.bind('click', collapse);
      });
    }

    return false;
  }

  function collapse(event) {
    var $target = $(event.target);
    var $cell = $target.parent();
    var $row = $cell.parent();

    $target.unbind('click', collapse);
    display($row[0], 'none', function () {
      $row.attr('aria-expanded', 'false');
      $target.text('Expand');
      $target.attr('aria-label', 'Expand');
      $target.bind('click', expand);
    });

    return false;
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
      var $window = $(window);

      var data = {
        'ajax_page_state[theme]': settings.ajaxPageState.theme,
        'ajax_page_state[theme_token]': settings.ajaxPageState.theme_token
      };

      $('a.token-browser').once('token-browser').click(function (event) {
        var $target = $(event.target);
        var $dialog = $('<div>').hide();
        var url = $target.attr('href');

        if ($target.hasClass('token-browser-open')) {
          return false;
        }
        else {
          $target.addClass('token-browser-open');
        }

        $dialog.addClass('loading').appendTo('body');

        $dialog.dialog({
          title: Drupal.t('Token Browser'),
          classes: { 'ui-dialog': 'token-browser-dialog' },
          dialogClass: 'token-browser-dialog',
          width: $window.width() * 0.8,
          close: function () {
            $dialog.remove();
            $target.removeClass('token-browser-open');
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
        var $target = $(event.target);

        if (window.selectedToken) {
          $target.val($target.val() + window.selectedToken.text());
          window.selectedToken.removeClass('selected-token');
          window.selectedToken.removeAttr('aria-selected');

          window.selectedToken = null;
        }
      });
    }
  };

})(jQuery, Drupal, this, this.document);
