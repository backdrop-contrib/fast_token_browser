(function ($, Drupal, window, document, undefined) {

  'use strict';

  Drupal.behaviors.tokenBrowser = {
    attach: function (context, settings) {
      var $window = $(window);

      var data = {
        'ajax_page_state[theme]': settings.ajaxPageState.theme,
        'ajax_page_state[theme_token]': settings.ajaxPageState.theme_token
      };

      $('a.token-browser').once('token-browser').click(function (event) {
        var $this = $(this);
        var $dialog = $('<div>').hide();
        var url = $this.attr('href');

        if ($this.hasClass('token-browser-open')) {
          return false;
        }
        else {
          $this.addClass('token-browser-open');
        }

        $dialog.addClass('loading').appendTo('body');

        $dialog.dialog({
          title: Drupal.t('Token Browser'),
          classes: { 'ui-dialog': 'token-browser-dialog' },
          dialogClass: 'token-browser-dialog',
          width: $window.width() * 0.8,
          close: function () {
            $dialog.remove();
            $this.removeClass('token-browser-open');
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
