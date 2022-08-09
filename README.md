INTRODUCTION
------------

Fast Token Browser extends the Token module to provide an improved interface for
browsing and inserting Tokens. It resolves the excessive memory usage and
unresponsive interface when using the token browser on a site with a large
number of tokens. It also allows the token browser to work with a very low PHP
memory limit without needing to constrain the maximum token depth.

You do not need Token Tweaks if you install this module, though having both
installed will not cause any conflicts.

USAGE
-----

This module is a drop-in replacement to the default browser provided by Token.
However, the mechanics of inserting a token work a little differnetly. Instead
of clicking in a text field then clicking a token to insert, first click the
token, then click in a text field where it will be inserted. This is designed to
provide for better keyboard accessibility in a future release.

DEPENDENCIES
------------

- Token

INSTALLATION
------------

Add the module to your site and enable it. There is no configuration.

UNINSTALLATION
--------------

Disable, uninstall the module, and remove the module files. This module makes no
changes to the database or other configuration, so you can safely remove it at
any time. The default behavior of the Token module will be restored
automatically after clearing the site cache.

MAINTAINERS
-----------

Current maintainers:

- Nigel Packer (https://www.drupal.org/u/npacker)



Fast Token Browser
========
Fast Token Browser provides an improved interface for browsing and inserting 
Tokens. It resolves excessive memory usage and unresponsive interface when using
the token browser on a site with a large number of tokens, for example, when
using Entity Tokens. 

Installation
------------

- Install this module using the official Backdrop CMS instructions at
  https://docs.backdropcms.org/documentation/extend-with-modules.

Usage
-----

Fast Token Browser is a drop-in replacement to the default browser provided by
Backdrop.

However, the mechanics of inserting a token work a little differnetly. Instead
of clicking in a text field then clicking a token to insert, first click the
token, then click in a text field where it will be inserted. This is designed to
provide for better keyboard accessibility in a future release.

Fast Token Browser will also replace the token browser provided by Token Help
at admin/reports/tokens.

Issues
------

Bugs and Feature Requests should be reported in the Issue Queue:
https://github.com/backdrop-contrib/fast_token_browser/issues.

Current Maintainers
-------------------

- [Martin Price](https://github.com/yorkshire-pudding) - [System Horizons](https://www.systemhorizons.co.uk)

Credits
-------

- Ported to Backdrop CMS by [Martin Price](https://github.com/yorkshire-pudding).
- Originally written for Drupal by [Nigel Packer](https://www.drupal.org/u/npacker).
- Port sponsored by [System Horizons](https://www.systemhorizons.co.uk).

License
-------

This project is GPL v2 software.
See the LICENSE.txt file in this directory for complete text.