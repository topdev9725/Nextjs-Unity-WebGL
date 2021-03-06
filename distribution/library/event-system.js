"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = void 0;
/**
 * An array of all instanciated Event Systems.
 */
var eventSystems = new Array();
/**
 * Dispatches an event that has been registered to all event systems.
 * @global
 * @param {string} eventName the event's name
 * @param {any} parameters the event's parameters
 * @example window.dispatchReactUnityEvent("gameOver", 180);
 */
var dispatchReactUnityEvent = function (eventName) {
    var parameters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        parameters[_i - 1] = arguments[_i];
    }
    // This made should be made available to the global scope. When invoked, it
    // will dispatch the given event to all event systems.
    for (var _a = 0, eventSystems_1 = eventSystems; _a < eventSystems_1.length; _a++) {
        var eventSystem = eventSystems_1[_a];
        if (eventSystem !== undefined) {
            eventSystem.dispatchEvent.apply(eventSystem, __spreadArray([eventName], parameters));
        }
    }
};
/**
 * An event system.
 */
var EventSystem = /** @class */ (function () {
    function EventSystem() {
        /**
         * The event map contains all the events that have been registered to the
         * event system as a key-value pair of event name and event listener.
         * @private
         * @readonly
         */
        this.eventMap = new Map();
        // The event system will be pushed to the global list of event system
        // instances.
        eventSystems.push(this);
        // If we're running inside of a browser environment, some global properties
        // will be made available on the window allowing for Unity to communicate.
        if (typeof window !== 'undefined') {
            // Register the global dispatch method.
            if (window.dispatchReactUnityEvent === undefined) {
                window.dispatchReactUnityEvent = dispatchReactUnityEvent;
            }
            // Create object for legacy bindings on the window.
            if (window.ReactUnityWebGL === undefined) {
                window.ReactUnityWebGL = {};
            }
        }
    }
    /**
     * Registers an event to the system.
     * @public
     * @param {string} eventName the event's name
     * @param {Function} eventListener the event's function
     */
    EventSystem.prototype.on = function (eventName, eventListener) {
        // Adds the event to the event map.
        this.eventMap.set(eventName, eventListener);
        // Add legacy binding to the window.
        if (window !== undefined) {
            window.ReactUnityWebGL[eventName] = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                return eventListener.apply(void 0, parameters);
            };
        }
    };
    /**
     * Removes all the Event Listeners with a specific Event Name.
     * @public
     * @param {string} eventName the event's name
     * @example unityContext.removeEventListener("progress");
     */
    EventSystem.prototype.removeEventListener = function (eventName) {
        // Remove the event from the event map.
        this.eventMap.delete(eventName);
        // Remove legacy binding from the window.
        if (window !== undefined) {
            delete window.ReactUnityWebGL[eventName];
        }
    };
    /**
     * Removes all the Event Listeners.
     * @public
     * @example unityContext.removeAllEventListeners();
     */
    EventSystem.prototype.removeAllEventListeners = function () {
        // Remove legacy bindings from the window.
        if (window !== undefined) {
            this.eventMap.forEach(function (_value, key) {
                delete window.ReactUnityWebGL[key];
            });
        }
        // Clear the event map.
        this.eventMap.clear();
    };
    /**
     * Dispatches an event that has been registered to the event system.
     * @public
     * @param {string} eventName the event's name
     * @param {any} parameters the event's parameters
     * @example unityContext.dispatchEventListener("gameOver", 180);
     */
    EventSystem.prototype.dispatchEvent = function (eventName) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        var event = this.eventMap.get(eventName);
        if (event !== undefined) {
            event.apply(void 0, parameters);
        }
    };
    return EventSystem;
}());
exports.EventSystem = EventSystem;
//# sourceMappingURL=event-system.js.map