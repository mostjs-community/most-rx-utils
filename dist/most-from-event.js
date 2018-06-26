(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['from-event'] = {})));
}(this, (function (exports) { 'use strict';

	/** @license MIT License (c) copyright 2018 original author or authors */
	/** @author YOU */
	// _ :: Stream e -> Stream e
	var _ = function (stream) { return stream; };

	exports._ = _;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
