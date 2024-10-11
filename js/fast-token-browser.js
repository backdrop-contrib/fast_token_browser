(function ($, Backdrop, window, document, undefined) {

  'use strict';

  Backdrop.ANCESTORS = {};

  Backdrop.buffer;
  Backdrop.tr_template;
  Backdrop.button_template;
  Backdrop.link_template;
  Backdrop.name_template;
  Backdrop.raw_template;
  Backdrop.description_template;

  Backdrop.select = function (event) {
    var $token = $(event.target);

    event.preventDefault();
    event.stopPropagation();

    if (window.Backdrop.selectedToken) {
      window.Backdrop.selectedToken.removeClass('selected-token');
      window.Backdrop.selectedToken.removeAttr('aria-selected');
    }

    if (window.Backdrop.selectedToken && $token[0] === window.Backdrop.selectedToken[0]) {
      window.Backdrop.selectedToken = null;
    }
    else {
      window.Backdrop.selectedToken = $token;
      window.Backdrop.selectedToken.addClass('selected-token');
      window.Backdrop.selectedToken.attr('aria-selected');
    }
    // If we have a focused field, insert the selected token.
    if (typeof Backdrop.settings.tokenBrowserFocusedField !== 'undefined' && window.Backdrop.selectedToken) {
      Backdrop.insert(Backdrop.settings.tokenBrowserFocusedField);
    }
  }

  Backdrop.insert = function (myField) {
    if (window.Backdrop.selectedToken) {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      var myValue  = window.Backdrop.selectedToken.text();
      myField.value =
        myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length)
      ;
      window.Backdrop.selectedToken.removeClass('selected-token');
      window.Backdrop.selectedToken.removeAttr('aria-selected');
      window.Backdrop.selectedToken = null;
    }
  }

  Backdrop.getAncestors = function ($cell) {
    var ancestors = Backdrop.ANCESTORS[$cell.data('raw')];

    return ancestors ? ancestors : [];
  }

  Backdrop.getToken = function ($cell, type) {
    var token = $cell.data('token');

    return token ? token : type;
  }

  Backdrop.display = function (parent, value, callback) {
    var current = parent;
    var level, top = Number(parent.getAttribute('aria-level'));
    var expand = [];

    expand[top + 1] = true;

    while (current = current.nextElementSibling) {
      level = Number(current.getAttribute('aria-level'));

      if (level <= top) {
        break;
      }

      expand[level + 1] = expand[level] && current.getAttribute('aria-expanded') === 'true';

      if (expand[level]) {
        current.style.display = value;
      }
    }

    callback();
  }

  Backdrop.setup = function () {
    Backdrop.buffer = document.createDocumentFragment();
    Backdrop.tr_template = document.createElement('tr');
    Backdrop.button_template = document.createElement('button');
    Backdrop.link_template = document.createElement('a');
    Backdrop.name_template = document.createElement('td');
    Backdrop.raw_template = document.createElement('td');
    Backdrop.description_template = document.createElement('td');

    Backdrop.tr_template.setAttribute('role', 'row');
    Backdrop.tr_template.setAttribute('aria-expanded', 'false');
    Backdrop.tr_template.setAttribute('aria-busy', 'false');

    Backdrop.link_template.setAttribute('href', 'javascript:void(0);');
    Backdrop.link_template.setAttribute('class', 'token-key');

    Backdrop.name_template.setAttribute('role', 'gridcell');
    Backdrop.name_template.setAttribute('class', 'token-name');

    Backdrop.raw_template.setAttribute('role', 'gridcell');
    Backdrop.raw_template.setAttribute('class', 'token-raw');

    Backdrop.description_template.setAttribute('role', 'gridcell');
    Backdrop.description_template.setAttribute('class', 'token-description');
  }

  Backdrop.row = function (element, level, index) {
    var tr = Backdrop.tr_template.cloneNode(false);
    var button = Backdrop.button_template.cloneNode(false);
    var link = Backdrop.link_template.cloneNode(false);
    var name = Backdrop.name_template.cloneNode(false);
    var raw = Backdrop.raw_template.cloneNode(false);
    var description = Backdrop.description_template.cloneNode(false);

    tr.setAttribute('aria-level', level);
    tr.setAttribute('aria-posinset', index);

    button.addEventListener('click', Backdrop.expand);
    button.innerHTML = 'Expand';

    link.setAttribute('title', 'Select the token ' + element.raw + '. Click in a text field to insert it.');
    link.addEventListener('click', Backdrop.select);

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

    Backdrop.ANCESTORS[element.raw] = element.ancestors;

    tr.appendChild(name);
    tr.appendChild(raw);
    tr.appendChild(description);

    return tr;
  }

  Backdrop.fetch = function ($row, $cell, callback) {
    var type = $cell.data('type');
    var token = Backdrop.getToken($cell, type);
    var ancestors = Backdrop.getAncestors($cell);
    var url = Backdrop.settings.basePath + 'token-browser/token/' + type;
    var parameters = {};

    ancestors.push(token);

    parameters.ancestors = JSON.stringify(ancestors);
    parameters.token = Backdrop.settings.fastTokenBrowser.token;

    $.ajax({
      'url': url,
      'data': parameters,
      'success': function (data) {
        var level = Number($row.attr('aria-level')) + 1;
        var position = 1;

        for (var key in data) {
          Backdrop.buffer.appendChild(Backdrop.row(data[key], level, position++));
        }

        $row.attr('aria-setsize', Backdrop.buffer.childElementCount);
        $row.after(Backdrop.buffer);
        callback(true);
      },
      'error': function (request) {
        callback(false);
      },
      'dataType': 'json'
    });
  }

  Backdrop.expand = function (event) {
    var $button = $(event.target);
    var $cell = $button.parent();
    var $row = $cell.parent();

    event.preventDefault();
    event.stopPropagation();

    $button.off('click', Backdrop.expand);

    if ($row.data('fetched')) {
      Backdrop.display($row[0], 'table-row', function () {
        $row.attr('aria-expanded', 'true');
        $button.text('Collapse');
        $button.on('click', Backdrop.collapse);
      });
    }
    else {
      $row.attr('aria-busy', 'true');
      $button.text('Loading...');

      Backdrop.fetch($row, $cell, function (success) {
        if (success) {
          $row.data('fetched', true);
          $row.attr('aria-expanded', 'true');
          $button.text('Collapse');
          $button.on('click', Backdrop.collapse);
        }
        else {
          $button.text('Expand');
          $button.on('click', Backdrop.expand);
        }

        $row.attr('aria-busy', 'false');
      });
    }
  }

  Backdrop.collapse = function (event) {
    var $button = $(event.target);
    var $cell = $button.parent();
    var $row = $cell.parent();

    event.preventDefault();
    event.stopPropagation();

    $button.off('click', Backdrop.collapse);

    Backdrop.display($row[0], 'none', function () {
      $row.attr('aria-expanded', 'false');
      $button.text('Expand');
      $button.on('click', Backdrop.expand);
    });
  }

  Backdrop.behaviors.tokenBrowserSetup = {
    attach: function (context, settings) {
      Backdrop.setup();
    }
  };

  Backdrop.behaviors.tokenBrowserTreegrid = {
    attach: function (context, settings) {
      $(context).find('button').on('click', Backdrop.expand);
    }
  };

  Backdrop.behaviors.tokenBrowserFocusedField = {
    attach: function (context, settings) {
      // Keep track of which textfield was last selected/focused.
      $(context).find('textarea, input[type="text"]').once('fast-token-browser-field-focus').on('focus', function() {
        Backdrop.settings.tokenBrowserFocusedField = this;
      });
    }
  };

  Backdrop.behaviors.tokenBrowserInsert = {
    attach: function (context, settings) {
      var $input = $('textarea, input[type="text"]', context);

      if ($input.length) {
        $input.once('token-browser-insert').on('click', function (event) {
          Backdrop.insert(event.target);
        });
      }
    }
  };

})(jQuery, Backdrop, this, this.document);
