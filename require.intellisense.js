/// <reference path="require.js" />

!function (window) {
    var defines = [],
        moduleMap = {},
        loadTimeId = 0,
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
        intellisense.logMessage('requirejs.load called: ' + moduleName + ': ' + url);
        moduleMap[url] = moduleName;
        oldLoad.call(requirejs, context, moduleName, url);
    }

    window.define = function (name, deps, callback) {
        oldDefine.apply(window, arguments);
        intellisense.logMessage('In define: ' + name);
        if (!loadTimeId) {
            //Wait for current script to finish executing, then
            //call script load event handler for anything that has
            //been waiting.
            loadTimeId = setTimeout(function () {
                loadTimeId = 0;
                var scriptElements = document.getElementsByTagName("script");
                intellisense.logMessage('in loadTimeout');
                for (var i = 0; i < scriptElements.length; i++) {
                    var script = scriptElements[i];
                    var moduleName = moduleMap[script.src];
                    intellisense.logMessage('SCRIPT: ' + script.src + ': ' + moduleName);
                    if (moduleName) {
                        intellisense.logMessage('herelTI');
                        intellisense.logMessage(moduleName + '->' + script.src + ' has state: ' + script.readyState.toString());
                        delete moduleMap[script.src];
                        loadEvent.currentTarget = script;
                        requirejs.onScriptLoad(loadEvent);
                        //force the define to be active
                        requirejs([moduleName]);
                    }
                }
            }, 0);
        }
    }
    
    window.define.amd = {
        jQuery: true
    };

    // Redirect all of the patched methods back to their originals
    // so Intellisense will use the previously defined annotations
    intellisense.redirectDefinition(requirejs.load, oldLoad);
    intellisense.redirectDefinition(window.define, oldDefine);
    intellisense.redirectDefinition(window.require, oldRequire);
}(this);