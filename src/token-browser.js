(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.tokenBrowserDialog = {
    attach: function (context, settings) {
      $('a.token-browser', context).once('token-dialog').click(function (event) {
        var $this = $(this);
        var dialog = $('<div>').addClass('loading').css({ display: 'none' }).appendTo('body');
        var url = $this.attr('href');
        var data = {};

        data['ajax_page_state[theme]'] = settings.ajaxPageState.theme;
        data['ajax_page_state[theme_token]'] = settings.ajaxPageState.theme_token;

        dialog.dialog({
          title: Drupal.t('Token Browser'),
          width: 700,
          close: function (event, ui) {
            dialog.remove();
          }
        });

        dialog.load(
          url,
          data,
          function (responseText, textStatus, XMLHttpRequest) {
            dialog.removeClass('loading');
          }
        );

        event.preventDefault();
      });
    }
  };

})(jQuery, Drupal, this, this.document);
