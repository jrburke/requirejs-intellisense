/// <reference path="require.js" />

!function (window) {
    var defines = [],
        moduleUrls = [],
        oldDefine = window.define,
        oldRequire = window.require,
        oldLoad = requirejs.load;

    var loadEvent = document.createEvent("event");
    loadEvent.type = "load";

    // Ensure that we're only patching require/define
    // if RequireJS is the current AMD implementation
    if (window.require !== window.requirejs)
        return;

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
        require: function () {
            /// <signature>
            ///     <summary>Defines a callback function that will be triggered after a set of dependency modules have been evaluated</summary>
            ///     <param name="deps" type="Array" elementType="String"></param>
            ///     <param name="callback" type="Function"></param>
            /// </signature>
        }
    });

    requirejs.load = function (context, moduleName, url) {
        moduleUrls.push(url);
        oldLoad.call(requirejs, context, moduleName, url);
    }

    window.define = function (name, deps, callback) {
        defines.push([name, deps, callback]);
    }
    
    window.define.amd = {
        multiversion: true,
        plugins: true,
        jQuery: true
    };

    window.require = function (deps, callback) {
        setTimeout(function () {
            // #1. Call the original require
            oldRequire.call(window, deps, callback);
            
            defines.forEach(function (define, index) {
                oldDefine.apply(window, define);

                var scriptElements = document.getElementsByTagName("script");

                for (var i = 0; i < scriptElements.length; i++) {
                    var script = scriptElements[i];
                    if (script.src == moduleUrls[index]) {
                        loadEvent.currentTarget = script;
                        requirejs.onScriptLoad(loadEvent);
                    }
                }
            });            
        }, 0);
    }

    // Redirect all of the patched methods back to their originals
    intellisense.redirectDefinition(requirejs.load, oldLoad);
    intellisense.redirectDefinition(window.define, oldDefine);
    intellisense.redirectDefinition(window.require, oldRequire);
}(this);