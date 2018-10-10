(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.tokenBrowser = {
    attach: function (context, settings) {
      $('a.token-browser').once('token-dialog').click(function (event) {
        var $this = $(this);
        var $window = $(window);
        var $dialog = $('<div>').addClass('loading').css({ display: 'none' }).appendTo('body');
        var url = $this.attr('href');
        var data = {};

        data['ajax_page_state[theme]'] = settings.ajaxPageState.theme;
        data['ajax_page_state[theme_token]'] = settings.ajaxPageState.theme_token;

        $dialog.dialog({
          title: Drupal.t('Token Browser'),
          classes: { 'ui-dialog': 'token-browser-dialog' },
          dialogClass: 'token-browser-dialog',
          width: $window.width() * 0.8,
          close: function () { $dialog.remove(); }
        });

        $dialog.load(
          url,
          data,
          function () { $dialog.removeClass('loading'); }
        );

        event.preventDefault();
      });
    }
  };

})(jQuery, Drupal, this, this.document);
