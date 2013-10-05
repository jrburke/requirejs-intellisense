/// <reference path="require.js" />
// in this file i have a call to requirejs.config to set baseUrl, paths, shim etc
// this must be loaded now but, it'll be corrected to absBaseUrl whenever this file needs it
/// <reference path="requirejs-conf.js" />
// having added those to references the load order will be 
//   require.js
//   require.intellisense.js
//   requirejs-conf.js
// so anything that needs overridding from requirejs-conf needs overridding
// when define/require/requirejs are called (not now).

// ALL defines must have a name e.g. a_name as below, otherwise things will go wrong
// because visual studio won't tell be where a script was loaded from
// define('a_name', ['depends'], function(){... return {'hello':'world'});

// if you are debugging intellisense you should put a line like this in all your files
////intellisense.logMessage('require.intellisense.js');

// absolute url to Scripts, because intellisense doesn't know where it's coming from
// so relative paths to scripts will all go wrong
// to set this automatically my current best solution would be to use a T4 template to 
// generate this file, I've not tried this yet though.
var absBaseUrl = 'C:/Projects/MyProject/Scripts';

!function (window) {
    // convert arguments from object to array
    // usage, argsToArray(arguments)
    var argsToArray = function (obj) {
        return Array.prototype.slice.call(obj, 0);
    };

    // better log method than intellisense.logMessage
    // and it can be disable easily in one place
    var ilog = function () {
        ////intellisense.logMessage(JSON.stringify(argsToArray(arguments, 0)));
    };

    var defines = [],
        oldDefine = window.define,
        tracking = 0;

    var requireDoc = function () {
        /// <signature>
        ///     <summary>Defines a callback function that will be triggered after a set of dependency modules have been evaluated</summary>
        ///     <param name="deps" type="Array" elementType="String"></param>
        ///     <param name="callback" type="Function"></param>
        /// </signature>
    };

    intellisense.annotate(window, {
        define: function () {
            /// <signature>
            ///     <summary>Defines a named module, with optional dependencies, whose value is determined by executing a callback.</summary>
            ///     <param name="name" type="String">The name of the module</param>
            ///     <param name="deps" type="Array" elementType="String" optional="true">An array of modules that this module depends on</param>
            ///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
            /// </signature>
            /// <signature>
            ///     <summary>Defines an anonymous module, with no dependencies, whose value is determined by executing a callback.</summary>
            ///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
            /// </signature>
            /// <signature>
            ///     <summary>Defines an anonymous module, with no dependencies, whose value is an object literal.</summary>
            ///     <param name="value" type="Object">The object literal that represents the value of this module</param>
            /// </signature>
        },
        require: requireDoc,
        requirejs: requireDoc
    });

    var fixBaseUrl = function () {
        requirejs.config({
            baseUrl: absBaseUrl
        });
    };
    
    window.define = function (name, deps, callback) {
        fixBaseUrl();
        
        defines.push([name, deps, callback]);
        var track = '_@t' + (++tracking + 1);
        ilog('define', track, argsToArray(arguments));
    
        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
        }
    
        ilog('calling require', track, deps);
        window.require.call(window, deps, function () {
            ilog('require callback', track, argsToArray(arguments));
            callback.apply(this, argsToArray(arguments));
        });
    
        defines.forEach(function (define) {
            oldDefine.apply(window, define);
        });
    };

    window.define.amd = {
        multiversion: true,
        plugins: true,
        jQuery: true
    };

    // Redirect all of the patched methods back to their originals
    // so Intellisense will use the previously defined annotations
    intellisense.redirectDefinition(window.define, oldDefine);
}(this);
