#requirejs-intellisense

If you are using [RequireJS](http://requirejs.org), include this file to get Visual Studio Intellisense completion for your AMD modules.

Place require.intellisense.js next to your require.js file to enable the magic.

**NOTE**: This is still under development. If you try it, you will likely be disappointed. It does some autocomplete, but still some rough edges.

## Requirements

* Visual Studio 2012. Does not work with other VS versions
* RequireJS 2.0.6+
* **Be sure** to keep the file named **require.intellisense.js**, and requirejs to as **require.js**, otherwise it will not work.

## Demo

To try it out:

* clone this repo
* copy require.intellisense.js to the test directory
* open up the test directory as part of a Visual Studio project.

