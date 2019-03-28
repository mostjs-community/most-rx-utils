(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('most-last')) :
  typeof define === 'function' && define.amd ? define(['exports', 'most-last'], factory) :
  (factory((global.mostRxUtils = {}),global.mostLast));
}(this, (function (exports,mostLast) { 'use strict';

  /** @license MIT License (c) copyright 2010-2016 original author or authors */

  // append :: a -> [a] -> [a]
  // a with x appended
  function append(x, a) {
    var l = a.length;
    var b = new Array(l + 1);
    for (var i = 0; i < l; ++i) {
      b[i] = a[i];
    }

    b[l] = x;
    return b;
  }

  // map :: (a -> b) -> [a] -> [b]
  // transform each element with f
  function map(f, a) {
    var l = a.length;
    var b = new Array(l);
    for (var i = 0; i < l; ++i) {
      b[i] = f(a[i]);
    }
    return b;
  }

  // reduce :: (a -> b -> a) -> a -> [b] -> a
  // accumulate via left-fold
  function reduce(f, z, a) {
    var r = z;
    for (var i = 0, l = a.length; i < l; ++i) {
      r = f(r, a[i], i);
    }
    return r;
  }

  // remove :: Int -> [a] -> [a]
  // remove element at index
  function remove(i, a) {
    // eslint-disable-line complexity
    if (i < 0) {
      throw new TypeError('i must be >= 0');
    }

    var l = a.length;
    if (l === 0 || i >= l) {
      // exit early if index beyond end of array
      return a;
    }

    if (l === 1) {
      // exit early if index in bounds and length === 1
      return [];
    }

    return unsafeRemove(i, a, l - 1);
  }

  // unsafeRemove :: Int -> [a] -> Int -> [a]
  // Internal helper to remove element at index
  function unsafeRemove(i, a, l) {
    var b = new Array(l);
    var j = void 0;
    for (j = 0; j < i; ++j) {
      b[j] = a[j];
    }
    for (j = i; j < l; ++j) {
      b[j] = a[j + 1];
    }

    return b;
  }

  // findIndex :: a -> [a] -> Int
  // find index of x in a, from the left
  function findIndex(x, a) {
    for (var i = 0, l = a.length; i < l; ++i) {
      if (x === a[i]) {
        return i;
      }
    }
    return -1;
  }

  /** @license MIT License (c) copyright 2010-2016 original author or authors */

  // id :: a -> a
  var id = function id(x) {
    return x;
  };

  // compose :: (b -> c) -> (a -> b) -> (a -> c)
  var compose = function compose(f, g) {
    return function (x) {
      return f(g(x));
    };
  };

  // curry2 :: ((a, b) -> c) -> (a -> b -> c)
  function curry2(f) {
    function curried(a, b) {
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return function (b) {
            return f(a, b);
          };
        default:
          return f(a, b);
      }
    }
    return curried;
  }

  // curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
  function curry3(f) {
    function curried(a, b, c) {
      // eslint-disable-line complexity
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return curry2(function (b, c) {
            return f(a, b, c);
          });
        case 2:
          return function (c) {
            return f(a, b, c);
          };
        default:
          return f(a, b, c);
      }
    }
    return curried;
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var RelativeScheduler = /*#__PURE__*/function () {
    function RelativeScheduler(origin, scheduler) {
      classCallCheck(this, RelativeScheduler);

      this.origin = origin;
      this.scheduler = scheduler;
    }

    RelativeScheduler.prototype.currentTime = function currentTime() {
      return this.scheduler.currentTime() - this.origin;
    };

    RelativeScheduler.prototype.scheduleTask = function scheduleTask(localOffset, delay, period, task) {
      return this.scheduler.scheduleTask(localOffset + this.origin, delay, period, task);
    };

    RelativeScheduler.prototype.relative = function relative(origin) {
      return new RelativeScheduler(origin + this.origin, this.scheduler);
    };

    RelativeScheduler.prototype.cancel = function cancel(task) {
      return this.scheduler.cancel(task);
    };

    RelativeScheduler.prototype.cancelAll = function cancelAll(f) {
      return this.scheduler.cancelAll(f);
    };

    return RelativeScheduler;
  }();

  // Schedule a task to run as soon as possible, but
  // not in the current call stack
  var asap = /*#__PURE__*/curry2(function (task, scheduler) {
    return scheduler.scheduleTask(0, 0, -1, task);
  });

  // Schedule a task to run after a millisecond delay
  var delay = /*#__PURE__*/curry3(function (delay, task, scheduler) {
    return scheduler.scheduleTask(0, delay, -1, task);
  });

  // Schedule a task to run periodically, with the
  // first run starting asap
  var periodic = /*#__PURE__*/curry3(function (period, task, scheduler) {
    return scheduler.scheduleTask(0, 0, period, task);
  });

  // Cancel all ScheduledTasks for which a predicate
  // is true
  var cancelAllTasks = /*#__PURE__*/curry2(function (predicate, scheduler) {
    return scheduler.cancelAll(predicate);
  });

  var schedulerRelativeTo = /*#__PURE__*/curry2(function (offset, scheduler) {
    return new RelativeScheduler(offset, scheduler);
  });

  /** @license MIT License (c) copyright 2010-2016 original author or authors */

  // append :: a -> [a] -> [a]
  // a with x appended
  function append$1(x, a) {
    var l = a.length;
    var b = new Array(l + 1);
    for (var i = 0; i < l; ++i) {
      b[i] = a[i];
    }

    b[l] = x;
    return b;
  }

  // reduce :: (a -> b -> a) -> a -> [b] -> a
  // accumulate via left-fold
  function reduce$1(f, z, a) {
    var r = z;
    for (var i = 0, l = a.length; i < l; ++i) {
      r = f(r, a[i], i);
    }
    return r;
  }

  // curry2 :: ((a, b) -> c) -> (a -> b -> c)
  function curry2$1(f) {
    function curried(a, b) {
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return function (b) {
            return f(a, b);
          };
        default:
          return f(a, b);
      }
    }
    return curried;
  }

  // curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
  function curry3$1(f) {
    function curried(a, b, c) {
      // eslint-disable-line complexity
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return curry2$1(function (b, c) {
            return f(a, b, c);
          });
        case 2:
          return function (c) {
            return f(a, b, c);
          };
        default:
          return f(a, b, c);
      }
    }
    return curried;
  }

  var classCallCheck$1 = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  var disposeNone = function disposeNone() {
    return NONE;
  };
  var NONE = /*#__PURE__*/new (function () {
    function DisposeNone() {
      classCallCheck$1(this, DisposeNone);
    }

    DisposeNone.prototype.dispose = function dispose() {};

    return DisposeNone;
  }())();

  var isDisposeNone = function isDisposeNone(d) {
    return d === NONE;
  };

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  // Wrap an existing disposable (which may not already have been once()d)
  // so that it will only dispose its underlying resource at most once.
  var disposeOnce = function disposeOnce(disposable) {
    return new DisposeOnce(disposable);
  };

  var DisposeOnce = /*#__PURE__*/function () {
    function DisposeOnce(disposable) {
      classCallCheck$1(this, DisposeOnce);

      this.disposed = false;
      this.disposable = disposable;
    }

    DisposeOnce.prototype.dispose = function dispose() {
      if (!this.disposed) {
        this.disposed = true;
        this.disposable.dispose();
        this.disposable = undefined;
      }
    };

    return DisposeOnce;
  }();

  /** @license MIT License (c) copyright 2010 original author or authors */
  // Aggregate a list of disposables into a DisposeAll
  var disposeAll = function disposeAll(ds) {
    var merged = reduce$1(merge, [], ds);
    return merged.length === 0 ? disposeNone() : new DisposeAll(merged);
  };

  // Convenience to aggregate 2 disposables
  var disposeBoth = /*#__PURE__*/curry2$1(function (d1, d2) {
    return disposeAll([d1, d2]);
  });

  var merge = function merge(ds, d) {
    return isDisposeNone(d) ? ds : d instanceof DisposeAll ? ds.concat(d.disposables) : append$1(d, ds);
  };

  var DisposeAll = /*#__PURE__*/function () {
    function DisposeAll(disposables) {
      classCallCheck$1(this, DisposeAll);

      this.disposables = disposables;
    }

    DisposeAll.prototype.dispose = function dispose() {
      throwIfErrors(disposeCollectErrors(this.disposables));
    };

    return DisposeAll;
  }();

  // Dispose all, safely collecting errors into an array


  var disposeCollectErrors = function disposeCollectErrors(disposables) {
    return reduce$1(appendIfError, [], disposables);
  };

  // Call dispose and if throws, append thrown error to errors
  var appendIfError = function appendIfError(errors, d) {
    try {
      d.dispose();
    } catch (e) {
      errors.push(e);
    }
    return errors;
  };

  // Throw DisposeAllError if errors is non-empty
  var throwIfErrors = function throwIfErrors(errors) {
    if (errors.length > 0) {
      throw new DisposeAllError(errors.length + ' errors', errors);
    }
  };

  var DisposeAllError = /*#__PURE__*/function (Error) {
    function DisposeAllError(message, errors) {
      Error.call(this, message);
      this.message = message;
      this.name = DisposeAllError.name;
      this.errors = errors;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, DisposeAllError);
      }

      this.stack = '' + this.stack + formatErrorStacks(this.errors);
    }

    DisposeAllError.prototype = /*#__PURE__*/Object.create(Error.prototype);

    return DisposeAllError;
  }(Error);

  var formatErrorStacks = function formatErrorStacks(errors) {
    return reduce$1(formatErrorStack, '', errors);
  };

  var formatErrorStack = function formatErrorStack(s, e, i) {
    return s + ('\n[' + (i + 1) + '] ' + e.stack);
  };

  /** @license MIT License (c) copyright 2010-2017 original author or authors */
  // Try to dispose the disposable.  If it throws, send
  // the error to sink.error with the provided Time value
  var tryDispose = /*#__PURE__*/curry3$1(function (t, disposable, sink) {
    try {
      disposable.dispose();
    } catch (e) {
      sink.error(t, e);
    }
  });

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  function fatalError(e) {
    setTimeout(rethrow, 0, e);
  }

  function rethrow(e) {
    throw e;
  }





  var classCallCheck$2 = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };











  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var propagateTask$1 = function propagateTask(run, value, sink) {
    return new PropagateTask(run, value, sink);
  };

  var propagateEventTask$1 = function propagateEventTask(value, sink) {
    return propagateTask$1(runEvent, value, sink);
  };

  var propagateEndTask = function propagateEndTask(sink) {
    return propagateTask$1(runEnd, undefined, sink);
  };

  var PropagateTask = /*#__PURE__*/function () {
    function PropagateTask(run, value, sink) {
      classCallCheck$2(this, PropagateTask);

      this._run = run;
      this.value = value;
      this.sink = sink;
      this.active = true;
    }

    PropagateTask.prototype.dispose = function dispose$$1() {
      this.active = false;
    };

    PropagateTask.prototype.run = function run(t) {
      if (!this.active) {
        return;
      }
      var run = this._run;
      run(t, this.value, this.sink);
    };

    PropagateTask.prototype.error = function error(t, e) {
      // TODO: Remove this check and just do this.sink.error(t, e)?
      if (!this.active) {
        return fatalError(e);
      }
      this.sink.error(t, e);
    };

    return PropagateTask;
  }();

  var runEvent = function runEvent(t, x, sink) {
    return sink.event(t, x);
  };

  var runEnd = function runEnd(t, _, sink) {
    return sink.end(t);
  };

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  var empty = function empty() {
    return EMPTY;
  };

  var isCanonicalEmpty = function isCanonicalEmpty(stream) {
    return stream === EMPTY;
  };

  var Empty = /*#__PURE__*/function () {
    function Empty() {
      classCallCheck$2(this, Empty);
    }

    Empty.prototype.run = function run(sink, scheduler$$1) {
      return asap(propagateEndTask(sink), scheduler$$1);
    };

    return Empty;
  }();

  var EMPTY = /*#__PURE__*/new Empty();

  var Never = /*#__PURE__*/function () {
    function Never() {
      classCallCheck$2(this, Never);
    }

    Never.prototype.run = function run() {
      return disposeNone();
    };

    return Never;
  }();

  var NEVER = /*#__PURE__*/new Never();

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  var at = function at(t, x) {
    return new At(t, x);
  };

  var At = /*#__PURE__*/function () {
    function At(t, x) {
      classCallCheck$2(this, At);

      this.time = t;
      this.value = x;
    }

    At.prototype.run = function run(sink, scheduler$$1) {
      return delay(this.time, propagateTask$1(runAt, this.value, sink), scheduler$$1);
    };

    return At;
  }();

  function runAt(t, x, sink) {
    sink.event(t, x);
    sink.end(t);
  }

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * Create a stream of events that occur at a regular period
   * @param {Number} period periodicity of events
   * @returns {Stream} new stream of periodic events, the event value is undefined
   */
  var periodic$1 = function periodic$$1(period) {
    return new Periodic(period);
  };

  var Periodic = /*#__PURE__*/function () {
    function Periodic(period) {
      classCallCheck$2(this, Periodic);

      this.period = period;
    }

    Periodic.prototype.run = function run(sink, scheduler$$1) {
      return periodic(this.period, propagateEventTask$1(undefined, sink), scheduler$$1);
    };

    return Periodic;
  }();

  /** @license MIT License (c) copyright 2010-2017 original author or authors */
  /** @author Brian Cavalier */

  var Pipe = /*#__PURE__*/function () {
    function Pipe(sink) {
      classCallCheck$2(this, Pipe);

      this.sink = sink;
    }

    Pipe.prototype.event = function event(t, x) {
      return this.sink.event(t, x);
    };

    Pipe.prototype.end = function end(t) {
      return this.sink.end(t);
    };

    Pipe.prototype.error = function error(t, e) {
      return this.sink.error(t, e);
    };

    return Pipe;
  }();

  /** @license MIT License (c) copyright 2010 original author or authors */

  // A slice Bounds type that narrows min values via accumulation
  // and max values via Math.min.
  // type Bounds = { min: number, max: number }
  // Notes:
  // 0 <= min <= max
  // slice(min2, max2, slice(min1, max1, s)) ~ slice(min1 + min2, Math.min(max1, min1 + max2), s)
  // A bounds has a 1d coord system with origin 0, extending to Infinity.  Both min and max
  // are relative to the origin (0).  However, when merging bounds b1 and b2, we
  // *interpret* b2 as being relative to b1, hence adding min1 to *both* min2 and max2.
  // This essentially translates b2's coordinates back into origin coordinates
  // as bounds are merged.

  // Construct a constrained bounds
  var boundsFrom = function boundsFrom(unsafeMin, unsafeMax) {
    var min = Math.max(0, unsafeMin);
    var max = Math.max(min, unsafeMax);
    return { min: min, max: max };
  };

  var minBounds = function minBounds(min) {
    return boundsFrom(min, Infinity);
  };

  // Combine 2 bounds by narrowing min and max
  var mergeBounds = function mergeBounds(b1, b2) {
    return boundsFrom(b1.min + b2.min, Math.min(b1.max, b1.min + b2.max));
  };

  // Nil bounds excludes all slice indices
  var isNilBounds = function isNilBounds(b) {
    return b.min >= b.max;
  };

  // Infinite bounds includes all slice indices
  var isInfiniteBounds = function isInfiniteBounds(b) {
    return b.min <= 0 && b.max === Infinity;
  };

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var Filter = /*#__PURE__*/function () {
    function Filter(p, source) {
      classCallCheck$2(this, Filter);

      this.p = p;
      this.source = source;
    }

    Filter.prototype.run = function run(sink, scheduler$$1) {
      return this.source.run(new FilterSink(this.p, sink), scheduler$$1);
    };

    /**
     * Create a filtered source, fusing adjacent filter.filter if possible
     * @param {function(x:*):boolean} p filtering predicate
     * @param {{run:function}} source source to filter
     * @returns {Filter} filtered source
     */


    Filter.create = function create(p, source) {
      if (isCanonicalEmpty(source)) {
        return source;
      }

      if (source instanceof Filter) {
        return new Filter(and(source.p, p), source.source);
      }

      return new Filter(p, source);
    };

    return Filter;
  }();

  var FilterSink = /*#__PURE__*/function (_Pipe) {
    inherits(FilterSink, _Pipe);

    function FilterSink(p, sink) {
      classCallCheck$2(this, FilterSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.p = p;
      return _this;
    }

    FilterSink.prototype.event = function event(t, x) {
      var p = this.p;
      p(x) && this.sink.event(t, x);
    };

    return FilterSink;
  }(Pipe);

  var and = function and(p, q) {
    return function (x) {
      return p(x) && q(x);
    };
  };

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var FilterMap = /*#__PURE__*/function () {
    function FilterMap(p, f, source) {
      classCallCheck$2(this, FilterMap);

      this.p = p;
      this.f = f;
      this.source = source;
    }

    FilterMap.prototype.run = function run(sink, scheduler$$1) {
      return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler$$1);
    };

    return FilterMap;
  }();

  var FilterMapSink = /*#__PURE__*/function (_Pipe) {
    inherits(FilterMapSink, _Pipe);

    function FilterMapSink(p, f, sink) {
      classCallCheck$2(this, FilterMapSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.p = p;
      _this.f = f;
      return _this;
    }

    FilterMapSink.prototype.event = function event(t, x) {
      var f = this.f;
      var p = this.p;
      p(x) && this.sink.event(t, f(x));
    };

    return FilterMapSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var Map = /*#__PURE__*/function () {
    function Map(f, source) {
      classCallCheck$2(this, Map);

      this.f = f;
      this.source = source;
    }

    Map.prototype.run = function run(sink, scheduler$$1) {
      // eslint-disable-line no-extend-native
      return this.source.run(new MapSink(this.f, sink), scheduler$$1);
    };

    /**
     * Create a mapped source, fusing adjacent map.map, filter.map,
     * and filter.map.map if possible
     * @param {function(*):*} f mapping function
     * @param {{run:function}} source source to map
     * @returns {Map|FilterMap} mapped source, possibly fused
     */


    Map.create = function create(f, source) {
      if (isCanonicalEmpty(source)) {
        return empty();
      }

      if (source instanceof Map) {
        return new Map(compose(f, source.f), source.source);
      }

      if (source instanceof Filter) {
        return new FilterMap(source.p, f, source.source);
      }

      return new Map(f, source);
    };

    return Map;
  }();

  var MapSink = /*#__PURE__*/function (_Pipe) {
    inherits(MapSink, _Pipe);

    function MapSink(f, sink) {
      classCallCheck$2(this, MapSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      return _this;
    }

    MapSink.prototype.event = function event(t, x) {
      var f = this.f;
      this.sink.event(t, f(x));
    };

    return MapSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  var SettableDisposable = /*#__PURE__*/function () {
    function SettableDisposable() {
      classCallCheck$2(this, SettableDisposable);

      this.disposable = undefined;
      this.disposed = false;
    }

    SettableDisposable.prototype.setDisposable = function setDisposable(disposable$$1) {
      if (this.disposable !== void 0) {
        throw new Error('setDisposable called more than once');
      }

      this.disposable = disposable$$1;

      if (this.disposed) {
        disposable$$1.dispose();
      }
    };

    SettableDisposable.prototype.dispose = function dispose$$1() {
      if (this.disposed) {
        return;
      }

      this.disposed = true;

      if (this.disposable !== void 0) {
        this.disposable.dispose();
      }
    };

    return SettableDisposable;
  }();

  /**
   * @param {number} n
   * @param {Stream} stream
   * @returns {Stream} new stream with the first n items removed
   */
  var skip$1 = function skip(n, stream) {
    return sliceBounds(minBounds(n), stream);
  };

  var sliceBounds = function sliceBounds(bounds, stream) {
    return isSliceEmpty(bounds, stream) ? empty() : stream instanceof Map ? commuteMapSlice(bounds, stream) : stream instanceof Slice ? fuseSlice(bounds, stream) : createSlice(bounds, stream);
  };

  var isSliceEmpty = function isSliceEmpty(bounds, stream) {
    return isCanonicalEmpty(stream) || isNilBounds(bounds);
  };

  var createSlice = function createSlice(bounds, stream) {
    return isInfiniteBounds(bounds) ? stream : new Slice(bounds, stream);
  };

  var commuteMapSlice = function commuteMapSlice(bounds, mapStream) {
    return Map.create(mapStream.f, sliceBounds(bounds, mapStream.source));
  };

  var fuseSlice = function fuseSlice(bounds, sliceStream) {
    return sliceBounds(mergeBounds(bounds, sliceStream.bounds), sliceStream.source);
  };

  var Slice = /*#__PURE__*/function () {
    function Slice(bounds, source) {
      classCallCheck$2(this, Slice);

      this.source = source;
      this.bounds = bounds;
    }

    Slice.prototype.run = function run(sink, scheduler$$1) {
      var disposable$$1 = new SettableDisposable();
      var sliceSink = new SliceSink(this.bounds.min, this.bounds.max - this.bounds.min, sink, disposable$$1);

      disposable$$1.setDisposable(this.source.run(sliceSink, scheduler$$1));

      return disposable$$1;
    };

    return Slice;
  }();

  var SliceSink = /*#__PURE__*/function (_Pipe) {
    inherits(SliceSink, _Pipe);

    function SliceSink(skip, take, sink, disposable$$1) {
      classCallCheck$2(this, SliceSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.skip = skip;
      _this.take = take;
      _this.disposable = disposable$$1;
      return _this;
    }

    SliceSink.prototype.event = function event(t, x) {
      /* eslint complexity: [1, 4] */
      if (this.skip > 0) {
        this.skip -= 1;
        return;
      }

      if (this.take === 0) {
        return;
      }

      this.take -= 1;
      this.sink.event(t, x);
      if (this.take === 0) {
        this.disposable.dispose();
        this.sink.end(t);
      }
    };

    return SliceSink;
  }(Pipe);

  var TakeWhileSink = /*#__PURE__*/function (_Pipe2) {
    inherits(TakeWhileSink, _Pipe2);

    function TakeWhileSink(p, sink, disposable$$1) {
      classCallCheck$2(this, TakeWhileSink);

      var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

      _this2.p = p;
      _this2.active = true;
      _this2.disposable = disposable$$1;
      return _this2;
    }

    TakeWhileSink.prototype.event = function event(t, x) {
      if (!this.active) {
        return;
      }

      var p = this.p;
      this.active = p(x);

      if (this.active) {
        this.sink.event(t, x);
      } else {
        this.disposable.dispose();
        this.sink.end(t);
      }
    };

    return TakeWhileSink;
  }(Pipe);

  var SkipWhileSink = /*#__PURE__*/function (_Pipe3) {
    inherits(SkipWhileSink, _Pipe3);

    function SkipWhileSink(p, sink) {
      classCallCheck$2(this, SkipWhileSink);

      var _this3 = possibleConstructorReturn(this, _Pipe3.call(this, sink));

      _this3.p = p;
      _this3.skipping = true;
      return _this3;
    }

    SkipWhileSink.prototype.event = function event(t, x) {
      if (this.skipping) {
        var p = this.p;
        this.skipping = p(x);
        if (this.skipping) {
          return;
        }
      }

      this.sink.event(t, x);
    };

    return SkipWhileSink;
  }(Pipe);

  var SkipAfterSink = /*#__PURE__*/function (_Pipe4) {
    inherits(SkipAfterSink, _Pipe4);

    function SkipAfterSink(p, sink) {
      classCallCheck$2(this, SkipAfterSink);

      var _this4 = possibleConstructorReturn(this, _Pipe4.call(this, sink));

      _this4.p = p;
      _this4.skipping = false;
      return _this4;
    }

    SkipAfterSink.prototype.event = function event(t, x) {
      if (this.skipping) {
        return;
      }

      var p = this.p;
      this.skipping = p(x);
      this.sink.event(t, x);

      if (this.skipping) {
        this.sink.end(t);
      }
    };

    return SkipAfterSink;
  }(Pipe);

  var ZipItemsSink = /*#__PURE__*/function (_Pipe) {
    inherits(ZipItemsSink, _Pipe);

    function ZipItemsSink(f, items, sink) {
      classCallCheck$2(this, ZipItemsSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      _this.items = items;
      _this.index = 0;
      return _this;
    }

    ZipItemsSink.prototype.event = function event(t, b) {
      var f = this.f;
      this.sink.event(t, f(this.items[this.index], b));
      this.index += 1;
    };

    return ZipItemsSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2017 original author or authors */

  // Run a Stream, sending all its events to the
  // provided Sink.
  var run$1 = function run(sink, scheduler$$1, stream) {
      return stream.run(sink, scheduler$$1);
  };

  var RelativeSink = /*#__PURE__*/function () {
    function RelativeSink(offset, sink) {
      classCallCheck$2(this, RelativeSink);

      this.sink = sink;
      this.offset = offset;
    }

    RelativeSink.prototype.event = function event(t, x) {
      this.sink.event(t + this.offset, x);
    };

    RelativeSink.prototype.error = function error(t, e) {
      this.sink.error(t + this.offset, e);
    };

    RelativeSink.prototype.end = function end(t) {
      this.sink.end(t + this.offset);
    };

    return RelativeSink;
  }();

  // Create a stream with its own local clock
  // This transforms time from the provided scheduler's clock to a stream-local
  // clock (which starts at 0), and then *back* to the scheduler's clock before
  // propagating events to sink.  In other words, upstream sources will see local times,
  // and downstream sinks will see non-local (original) times.
  var withLocalTime$1 = function withLocalTime(origin, stream) {
    return new WithLocalTime(origin, stream);
  };

  var WithLocalTime = /*#__PURE__*/function () {
    function WithLocalTime(origin, source) {
      classCallCheck$2(this, WithLocalTime);

      this.origin = origin;
      this.source = source;
    }

    WithLocalTime.prototype.run = function run(sink, scheduler$$1) {
      return this.source.run(relativeSink(this.origin, sink), schedulerRelativeTo(this.origin, scheduler$$1));
    };

    return WithLocalTime;
  }();

  // Accumulate offsets instead of nesting RelativeSinks, which can happen
  // with higher-order stream and combinators like continueWith when they're
  // applied recursively.


  var relativeSink = function relativeSink(origin, sink) {
    return sink instanceof RelativeSink ? new RelativeSink(origin + sink.offset, sink.sink) : new RelativeSink(origin, sink);
  };

  var LoopSink = /*#__PURE__*/function (_Pipe) {
    inherits(LoopSink, _Pipe);

    function LoopSink(stepper, seed, sink) {
      classCallCheck$2(this, LoopSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.step = stepper;
      _this.seed = seed;
      return _this;
    }

    LoopSink.prototype.event = function event(t, x) {
      var result = this.step(this.seed, x);
      this.seed = result.seed;
      this.sink.event(t, result.value);
    };

    return LoopSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * Create a stream containing successive reduce results of applying f to
   * the previous reduce result and the current stream item.
   * @param {function(result:*, x:*):*} f reducer function
   * @param {*} initial initial value
   * @param {Stream} stream stream to scan
   * @returns {Stream} new stream containing successive reduce results
   */
  var scan$1 = function scan(f, initial, stream) {
    return new Scan(f, initial, stream);
  };

  var Scan = /*#__PURE__*/function () {
    function Scan(f, z, source) {
      classCallCheck$2(this, Scan);

      this.source = source;
      this.f = f;
      this.value = z;
    }

    Scan.prototype.run = function run(sink, scheduler$$1) {
      var d1 = asap(propagateEventTask$1(this.value, sink), scheduler$$1);
      var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler$$1);
      return disposeBoth(d1, d2);
    };

    return Scan;
  }();

  var ScanSink = /*#__PURE__*/function (_Pipe) {
    inherits(ScanSink, _Pipe);

    function ScanSink(f, z, sink) {
      classCallCheck$2(this, ScanSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      _this.value = z;
      return _this;
    }

    ScanSink.prototype.event = function event(t, x) {
      var f = this.f;
      this.value = f(this.value, x);
      this.sink.event(t, this.value);
    };

    return ScanSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var continueWith$1 = function continueWith(f, stream) {
    return new ContinueWith(f, stream);
  };

  var ContinueWith = /*#__PURE__*/function () {
    function ContinueWith(f, source) {
      classCallCheck$2(this, ContinueWith);

      this.f = f;
      this.source = source;
    }

    ContinueWith.prototype.run = function run(sink, scheduler$$1) {
      return new ContinueWithSink(this.f, this.source, sink, scheduler$$1);
    };

    return ContinueWith;
  }();

  var ContinueWithSink = /*#__PURE__*/function (_Pipe) {
    inherits(ContinueWithSink, _Pipe);

    function ContinueWithSink(f, source, sink, scheduler$$1) {
      classCallCheck$2(this, ContinueWithSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      _this.scheduler = scheduler$$1;
      _this.active = true;
      _this.disposable = disposeOnce(source.run(_this, scheduler$$1));
      return _this;
    }

    ContinueWithSink.prototype.event = function event(t, x) {
      if (!this.active) {
        return;
      }
      this.sink.event(t, x);
    };

    ContinueWithSink.prototype.end = function end(t) {
      if (!this.active) {
        return;
      }

      tryDispose(t, this.disposable, this.sink);

      this._startNext(t, this.sink);
    };

    ContinueWithSink.prototype._startNext = function _startNext(t, sink) {
      try {
        this.disposable = this._continue(this.f, t, sink);
      } catch (e) {
        sink.error(t, e);
      }
    };

    ContinueWithSink.prototype._continue = function _continue(f, t, sink) {
      return run$1(sink, this.scheduler, withLocalTime$1(t, f()));
    };

    ContinueWithSink.prototype.dispose = function dispose$$1() {
      this.active = false;
      return this.disposable.dispose();
    };

    return ContinueWithSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * Transform each value in the stream by applying f to each
   * @param {function(*):*} f mapping function
   * @param {Stream} stream stream to map
   * @returns {Stream} stream containing items transformed by f
   */
  var map$2 = function map$$1(f, stream) {
    return Map.create(f, stream);
  };

  /**
  * Replace each value in the stream with x
  * @param {*} x
  * @param {Stream} stream
  * @returns {Stream} stream containing items replaced with x
  */
  var constant$1 = function constant(x, stream) {
    return map$2(function () {
      return x;
    }, stream);
  };

  var TapSink = /*#__PURE__*/function (_Pipe) {
    inherits(TapSink, _Pipe);

    function TapSink(f, sink) {
      classCallCheck$2(this, TapSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      return _this;
    }

    TapSink.prototype.event = function event(t, x) {
      var f = this.f;
      f(x);
      this.sink.event(t, x);
    };

    return TapSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var IndexSink = /*#__PURE__*/function (_Sink) {
    inherits(IndexSink, _Sink);

    function IndexSink(i, sink) {
      classCallCheck$2(this, IndexSink);

      var _this = possibleConstructorReturn(this, _Sink.call(this, sink));

      _this.index = i;
      _this.active = true;
      _this.value = undefined;
      return _this;
    }

    IndexSink.prototype.event = function event(t, x) {
      if (!this.active) {
        return;
      }
      this.value = x;
      this.sink.event(t, this);
    };

    IndexSink.prototype.end = function end(t) {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.sink.event(t, this);
    };

    return IndexSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  function invoke(f, args) {
    /* eslint complexity: [2,7] */
    switch (args.length) {
      case 0:
        return f();
      case 1:
        return f(args[0]);
      case 2:
        return f(args[0], args[1]);
      case 3:
        return f(args[0], args[1], args[2]);
      case 4:
        return f(args[0], args[1], args[2], args[3]);
      case 5:
        return f(args[0], args[1], args[2], args[3], args[4]);
      default:
        return f.apply(void 0, args);
    }
  }

  var CombineSink = /*#__PURE__*/function (_Pipe) {
    inherits(CombineSink, _Pipe);

    function CombineSink(disposables, sinks, sink, f) {
      classCallCheck$2(this, CombineSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.disposables = disposables;
      _this.sinks = sinks;
      _this.f = f;

      var l = sinks.length;
      _this.awaiting = l;
      _this.values = new Array(l);
      _this.hasValue = new Array(l).fill(false);
      _this.activeCount = sinks.length;
      return _this;
    }

    CombineSink.prototype.event = function event(t, indexedValue) {
      if (!indexedValue.active) {
        this._dispose(t, indexedValue.index);
        return;
      }

      var i = indexedValue.index;
      var awaiting = this._updateReady(i);

      this.values[i] = indexedValue.value;
      if (awaiting === 0) {
        this.sink.event(t, invoke(this.f, this.values));
      }
    };

    CombineSink.prototype._updateReady = function _updateReady(index) {
      if (this.awaiting > 0) {
        if (!this.hasValue[index]) {
          this.hasValue[index] = true;
          this.awaiting -= 1;
        }
      }
      return this.awaiting;
    };

    CombineSink.prototype._dispose = function _dispose(t, index) {
      tryDispose(t, this.disposables[index], this.sink);
      if (--this.activeCount === 0) {
        this.sink.end(t);
      }
    };

    return CombineSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010 original author or authors */

  /**
   * Doubly linked list
   * @constructor
   */
  var LinkedList = /*#__PURE__*/function () {
    function LinkedList() {
      classCallCheck$2(this, LinkedList);

      this.head = null;
      this.length = 0;
    }

    /**
     * Add a node to the end of the list
     * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
     */


    LinkedList.prototype.add = function add(x) {
      if (this.head !== null) {
        this.head.prev = x;
        x.next = this.head;
      }
      this.head = x;
      ++this.length;
    };

    /**
     * Remove the provided node from the list
     * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
     */


    LinkedList.prototype.remove = function remove$$1(x) {
      // eslint-disable-line  complexity
      --this.length;
      if (x === this.head) {
        this.head = this.head.next;
      }
      if (x.next !== null) {
        x.next.prev = x.prev;
        x.next = null;
      }
      if (x.prev !== null) {
        x.prev.next = x.next;
        x.prev = null;
      }
    };

    /**
     * @returns {boolean} true iff there are no nodes in the list
     */


    LinkedList.prototype.isEmpty = function isEmpty() {
      return this.length === 0;
    };

    /**
     * Dispose all nodes
     * @returns {void}
     */


    LinkedList.prototype.dispose = function dispose$$1() {
      if (this.isEmpty()) {
        return;
      }

      var head = this.head;
      this.head = null;
      this.length = 0;

      while (head !== null) {
        head.dispose();
        head = head.next;
      }
    };

    return LinkedList;
  }();

  /** @license MIT License (c) copyright 2010 original author or authors */

  var mergeConcurrently$1 = function mergeConcurrently(concurrency, stream) {
    return mergeMapConcurrently$1(id, concurrency, stream);
  };

  var mergeMapConcurrently$1 = function mergeMapConcurrently(f, concurrency, stream) {
    return isCanonicalEmpty(stream) ? empty() : new MergeConcurrently(f, concurrency, stream);
  };

  var MergeConcurrently = /*#__PURE__*/function () {
    function MergeConcurrently(f, concurrency, source) {
      classCallCheck$2(this, MergeConcurrently);

      this.f = f;
      this.concurrency = concurrency;
      this.source = source;
    }

    MergeConcurrently.prototype.run = function run(sink, scheduler$$1) {
      return new Outer(this.f, this.concurrency, this.source, sink, scheduler$$1);
    };

    return MergeConcurrently;
  }();

  var Outer = /*#__PURE__*/function () {
    function Outer(f, concurrency, source, sink, scheduler$$1) {
      classCallCheck$2(this, Outer);

      this.f = f;
      this.concurrency = concurrency;
      this.sink = sink;
      this.scheduler = scheduler$$1;
      this.pending = [];
      this.current = new LinkedList();
      this.disposable = disposeOnce(source.run(this, scheduler$$1));
      this.active = true;
    }

    Outer.prototype.event = function event(t, x) {
      this._addInner(t, x);
    };

    Outer.prototype._addInner = function _addInner(t, x) {
      if (this.current.length < this.concurrency) {
        this._startInner(t, x);
      } else {
        this.pending.push(x);
      }
    };

    Outer.prototype._startInner = function _startInner(t, x) {
      try {
        this._initInner(t, x);
      } catch (e) {
        this.error(t, e);
      }
    };

    Outer.prototype._initInner = function _initInner(t, x) {
      var innerSink = new Inner(t, this, this.sink);
      innerSink.disposable = mapAndRun(this.f, t, x, innerSink, this.scheduler);
      this.current.add(innerSink);
    };

    Outer.prototype.end = function end(t) {
      this.active = false;
      tryDispose(t, this.disposable, this.sink);
      this._checkEnd(t);
    };

    Outer.prototype.error = function error(t, e) {
      this.active = false;
      this.sink.error(t, e);
    };

    Outer.prototype.dispose = function dispose$$1() {
      this.active = false;
      this.pending.length = 0;
      this.disposable.dispose();
      this.current.dispose();
    };

    Outer.prototype._endInner = function _endInner(t, inner) {
      this.current.remove(inner);
      tryDispose(t, inner, this);

      if (this.pending.length === 0) {
        this._checkEnd(t);
      } else {
        this._startInner(t, this.pending.shift());
      }
    };

    Outer.prototype._checkEnd = function _checkEnd(t) {
      if (!this.active && this.current.isEmpty()) {
        this.sink.end(t);
      }
    };

    return Outer;
  }();

  var mapAndRun = function mapAndRun(f, t, x, sink, scheduler$$1) {
    return f(x).run(sink, schedulerRelativeTo(t, scheduler$$1));
  };

  var Inner = /*#__PURE__*/function () {
    function Inner(time, outer, sink) {
      classCallCheck$2(this, Inner);

      this.prev = this.next = null;
      this.time = time;
      this.outer = outer;
      this.sink = sink;
      this.disposable = void 0;
    }

    Inner.prototype.event = function event(t, x) {
      this.sink.event(t + this.time, x);
    };

    Inner.prototype.end = function end(t) {
      this.outer._endInner(t + this.time, this);
    };

    Inner.prototype.error = function error(t, e) {
      this.outer.error(t + this.time, e);
    };

    Inner.prototype.dispose = function dispose$$1() {
      return this.disposable.dispose();
    };

    return Inner;
  }();

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * Map each value in the stream to a new stream, and merge it into the
   * returned outer stream. Event arrival times are preserved.
   * @param {function(x:*):Stream} f chaining function, must return a Stream
   * @param {Stream} stream
   * @returns {Stream} new stream containing all events from each stream returned by f
   */
  var chain$1 = function chain(f, stream) {
    return mergeMapConcurrently$1(f, Infinity, stream);
  };

  /**
   * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
   * streams to the outer. Event arrival times are preserved.
   * @param {Stream<Stream<X>>} stream stream of streams
   * @returns {Stream<X>} new stream containing all events of all inner streams
   */
  var join = function join(stream) {
    return mergeConcurrently$1(Infinity, stream);
  };

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * @returns {Stream} stream containing events from two streams in time order.
   * If two events are simultaneous they will be merged in arbitrary order.
   */
  function merge$1(stream1, stream2) {
    return mergeArray([stream1, stream2]);
  }

  /**
   * @param {Array} streams array of stream to merge
   * @returns {Stream} stream containing events from all input observables
   * in time order.  If two events are simultaneous they will be merged in
   * arbitrary order.
   */
  var mergeArray = function mergeArray(streams) {
    return mergeStreams(withoutCanonicalEmpty(streams));
  };

  /**
   * This implements fusion/flattening for merge.  It will
   * fuse adjacent merge operations.  For example:
   * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
   * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
   * It does this by concatenating the sources arrays of
   * any nested Merge sources, in effect "flattening" nested
   * merge operations into a single merge.
   */
  var mergeStreams = function mergeStreams(streams) {
    return streams.length === 0 ? empty() : streams.length === 1 ? streams[0] : new Merge(reduce(appendSources, [], streams));
  };

  var withoutCanonicalEmpty = function withoutCanonicalEmpty(streams) {
    return streams.filter(isNotCanonicalEmpty);
  };

  var isNotCanonicalEmpty = function isNotCanonicalEmpty(stream) {
    return !isCanonicalEmpty(stream);
  };

  var appendSources = function appendSources(sources, stream) {
    return sources.concat(stream instanceof Merge ? stream.sources : stream);
  };

  var Merge = /*#__PURE__*/function () {
    function Merge(sources) {
      classCallCheck$2(this, Merge);

      this.sources = sources;
    }

    Merge.prototype.run = function run(sink, scheduler$$1) {
      var l = this.sources.length;
      var disposables = new Array(l);
      var sinks = new Array(l);

      var mergeSink = new MergeSink(disposables, sinks, sink);

      for (var indexSink, i = 0; i < l; ++i) {
        indexSink = sinks[i] = new IndexSink(i, mergeSink);
        disposables[i] = this.sources[i].run(indexSink, scheduler$$1);
      }

      return disposeAll(disposables);
    };

    return Merge;
  }();

  var MergeSink = /*#__PURE__*/function (_Pipe) {
    inherits(MergeSink, _Pipe);

    function MergeSink(disposables, sinks, sink) {
      classCallCheck$2(this, MergeSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.disposables = disposables;
      _this.activeCount = sinks.length;
      return _this;
    }

    MergeSink.prototype.event = function event(t, indexValue) {
      if (!indexValue.active) {
        this._dispose(t, indexValue.index);
        return;
      }
      this.sink.event(t, indexValue.value);
    };

    MergeSink.prototype._dispose = function _dispose(t, index) {
      tryDispose(t, this.disposables[index], this.sink);
      if (--this.activeCount === 0) {
        this.sink.end(t);
      }
    };

    return MergeSink;
  }(Pipe);

  var SnapshotSink = /*#__PURE__*/function (_Pipe) {
    inherits(SnapshotSink, _Pipe);

    function SnapshotSink(f, sink) {
      classCallCheck$2(this, SnapshotSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      _this.latest = new LatestValueSink(_this);
      return _this;
    }

    SnapshotSink.prototype.event = function event(t, x) {
      if (this.latest.hasValue) {
        var f = this.f;
        this.sink.event(t, f(this.latest.value, x));
      }
    };

    return SnapshotSink;
  }(Pipe);

  var LatestValueSink = /*#__PURE__*/function (_Pipe2) {
    inherits(LatestValueSink, _Pipe2);

    function LatestValueSink(sink) {
      classCallCheck$2(this, LatestValueSink);

      var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

      _this2.hasValue = false;
      return _this2;
    }

    LatestValueSink.prototype.event = function event(t, x) {
      this.value = x;
      this.hasValue = true;
    };

    LatestValueSink.prototype.end = function end() {};

    return LatestValueSink;
  }(Pipe);

  var ZipSink = /*#__PURE__*/function (_Pipe) {
    inherits(ZipSink, _Pipe);

    function ZipSink(f, buffers, sinks, sink) {
      classCallCheck$2(this, ZipSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.f = f;
      _this.sinks = sinks;
      _this.buffers = buffers;
      return _this;
    }

    ZipSink.prototype.event = function event(t, indexedValue) {
      /* eslint complexity: [1, 5] */
      if (!indexedValue.active) {
        this._dispose(t, indexedValue.index);
        return;
      }

      var buffers = this.buffers;
      var buffer = buffers[indexedValue.index];

      buffer.push(indexedValue.value);

      if (buffer.length() === 1) {
        if (!ready(this.buffers)) {
          return;
        }

        emitZipped(this.f, t, buffers, this.sink);

        if (ended(this.buffers, this.sinks)) {
          this.sink.end(t);
        }
      }
    };

    ZipSink.prototype._dispose = function _dispose(t, index) {
      var buffer = this.buffers[index];
      if (buffer.isEmpty()) {
        this.sink.end(t);
      }
    };

    return ZipSink;
  }(Pipe);

  var emitZipped = function emitZipped(f, t, buffers, sink) {
    return sink.event(t, invoke(f, map(head, buffers)));
  };

  var head = function head(buffer) {
    return buffer.shift();
  };

  function ended(buffers, sinks) {
    for (var i = 0, l = buffers.length; i < l; ++i) {
      if (buffers[i].isEmpty() && !sinks[i].active) {
        return true;
      }
    }
    return false;
  }

  function ready(buffers) {
    for (var i = 0, l = buffers.length; i < l; ++i) {
      if (buffers[i].isEmpty()) {
        return false;
      }
    }
    return true;
  }

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  /**
   * Retain only items matching a predicate
   * @param {function(x:*):boolean} p filtering predicate called for each item
   * @param {Stream} stream stream to filter
   * @returns {Stream} stream containing only items for which predicate returns truthy
   */
  var filter$1 = function filter(p, stream) {
    return Filter.create(p, stream);
  };

  var SkipRepeatsSink = /*#__PURE__*/function (_Pipe) {
    inherits(SkipRepeatsSink, _Pipe);

    function SkipRepeatsSink(equals, sink) {
      classCallCheck$2(this, SkipRepeatsSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.equals = equals;
      _this.value = void 0;
      _this.init = true;
      return _this;
    }

    SkipRepeatsSink.prototype.event = function event(t, x) {
      if (this.init) {
        this.init = false;
        this.value = x;
        this.sink.event(t, x);
      } else if (!this.equals(this.value, x)) {
        this.value = x;
        this.sink.event(t, x);
      }
    };

    return SkipRepeatsSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  var until$1 = function until(signal, stream) {
    return new Until(signal, stream);
  };

  var since$1 = function since(signal, stream) {
    return new Since(signal, stream);
  };

  var during$1 = function during(timeWindow, stream) {
    return until$1(join(timeWindow), since$1(timeWindow, stream));
  };

  var Until = /*#__PURE__*/function () {
    function Until(maxSignal, source) {
      classCallCheck$2(this, Until);

      this.maxSignal = maxSignal;
      this.source = source;
    }

    Until.prototype.run = function run(sink, scheduler$$1) {
      var min = new Bound(-Infinity, sink);
      var max = new UpperBound(this.maxSignal, sink, scheduler$$1);
      var disposable$$1 = this.source.run(new TimeWindowSink(min, max, sink), scheduler$$1);

      return disposeAll([min, max, disposable$$1]);
    };

    return Until;
  }();

  var Since = /*#__PURE__*/function () {
    function Since(minSignal, source) {
      classCallCheck$2(this, Since);

      this.minSignal = minSignal;
      this.source = source;
    }

    Since.prototype.run = function run(sink, scheduler$$1) {
      var min = new LowerBound(this.minSignal, sink, scheduler$$1);
      var max = new Bound(Infinity, sink);
      var disposable$$1 = this.source.run(new TimeWindowSink(min, max, sink), scheduler$$1);

      return disposeAll([min, max, disposable$$1]);
    };

    return Since;
  }();

  var Bound = /*#__PURE__*/function (_Pipe) {
    inherits(Bound, _Pipe);

    function Bound(value, sink) {
      classCallCheck$2(this, Bound);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.value = value;
      return _this;
    }

    Bound.prototype.event = function event() {};

    Bound.prototype.end = function end() {};

    Bound.prototype.dispose = function dispose$$1() {};

    return Bound;
  }(Pipe);

  var TimeWindowSink = /*#__PURE__*/function (_Pipe2) {
    inherits(TimeWindowSink, _Pipe2);

    function TimeWindowSink(min, max, sink) {
      classCallCheck$2(this, TimeWindowSink);

      var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

      _this2.min = min;
      _this2.max = max;
      return _this2;
    }

    TimeWindowSink.prototype.event = function event(t, x) {
      if (t >= this.min.value && t < this.max.value) {
        this.sink.event(t, x);
      }
    };

    return TimeWindowSink;
  }(Pipe);

  var LowerBound = /*#__PURE__*/function (_Pipe3) {
    inherits(LowerBound, _Pipe3);

    function LowerBound(signal, sink, scheduler$$1) {
      classCallCheck$2(this, LowerBound);

      var _this3 = possibleConstructorReturn(this, _Pipe3.call(this, sink));

      _this3.value = Infinity;
      _this3.disposable = signal.run(_this3, scheduler$$1);
      return _this3;
    }

    LowerBound.prototype.event = function event(t /*, x */) {
      if (t < this.value) {
        this.value = t;
      }
    };

    LowerBound.prototype.end = function end() {};

    LowerBound.prototype.dispose = function dispose$$1() {
      return this.disposable.dispose();
    };

    return LowerBound;
  }(Pipe);

  var UpperBound = /*#__PURE__*/function (_Pipe4) {
    inherits(UpperBound, _Pipe4);

    function UpperBound(signal, sink, scheduler$$1) {
      classCallCheck$2(this, UpperBound);

      var _this4 = possibleConstructorReturn(this, _Pipe4.call(this, sink));

      _this4.value = Infinity;
      _this4.disposable = signal.run(_this4, scheduler$$1);
      return _this4;
    }

    UpperBound.prototype.event = function event(t, x) {
      if (t < this.value) {
        this.value = t;
        this.sink.end(t);
      }
    };

    UpperBound.prototype.end = function end() {};

    UpperBound.prototype.dispose = function dispose$$1() {
      return this.disposable.dispose();
    };

    return UpperBound;
  }(Pipe);

  var DelaySink = /*#__PURE__*/function (_Pipe) {
    inherits(DelaySink, _Pipe);

    function DelaySink(dt, sink, scheduler$$1) {
      classCallCheck$2(this, DelaySink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.dt = dt;
      _this.scheduler = scheduler$$1;
      return _this;
    }

    DelaySink.prototype.dispose = function dispose$$1() {
      var _this2 = this;

      cancelAllTasks(function (task) {
        return task.sink === _this2.sink;
      }, this.scheduler);
    };

    DelaySink.prototype.event = function event(t, x) {
      delay(this.dt, propagateEventTask$1(x, this.sink), this.scheduler);
    };

    DelaySink.prototype.end = function end(t) {
      delay(this.dt, propagateEndTask(this.sink), this.scheduler);
    };

    return DelaySink;
  }(Pipe);

  var ThrottleSink = /*#__PURE__*/function (_Pipe) {
    inherits(ThrottleSink, _Pipe);

    function ThrottleSink(period, sink) {
      classCallCheck$2(this, ThrottleSink);

      var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

      _this.time = 0;
      _this.period = period;
      return _this;
    }

    ThrottleSink.prototype.event = function event(t, x) {
      if (t >= this.time) {
        this.time = t + this.period;
        this.sink.event(t, x);
      }
    };

    return ThrottleSink;
  }(Pipe);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */
  /** @author Brian Cavalier */
  /** @author John Hann */

  function tryEvent(t, x, sink) {
    try {
      sink.event(t, x);
    } catch (e) {
      sink.error(t, e);
    }
  }

  function tryEnd(t, sink) {
    try {
      sink.end(t);
    } catch (e) {
      sink.error(t, e);
    }
  }

  var multicast = function multicast(stream) {
    return stream instanceof Multicast || isCanonicalEmpty(stream) ? stream : new Multicast(stream);
  };

  var Multicast = /*#__PURE__*/function () {
    function Multicast(source) {
      classCallCheck$2(this, Multicast);

      this.source = new MulticastSource(source);
    }

    Multicast.prototype.run = function run(sink, scheduler$$1) {
      return this.source.run(sink, scheduler$$1);
    };

    return Multicast;
  }();

  var MulticastSource = /*#__PURE__*/function () {
    function MulticastSource(source) {
      classCallCheck$2(this, MulticastSource);

      this.source = source;
      this.sinks = [];
      this.disposable = disposeNone();
    }

    MulticastSource.prototype.run = function run(sink, scheduler$$1) {
      var n = this.add(sink);
      if (n === 1) {
        this.disposable = this.source.run(this, scheduler$$1);
      }
      return disposeOnce(new MulticastDisposable(this, sink));
    };

    MulticastSource.prototype.dispose = function dispose$$1() {
      var disposable$$1 = this.disposable;
      this.disposable = disposeNone();
      return disposable$$1.dispose();
    };

    MulticastSource.prototype.add = function add(sink) {
      this.sinks = append(sink, this.sinks);
      return this.sinks.length;
    };

    MulticastSource.prototype.remove = function remove$$1(sink) {
      var i = findIndex(sink, this.sinks);
      // istanbul ignore next
      if (i >= 0) {
        this.sinks = remove(i, this.sinks);
      }

      return this.sinks.length;
    };

    MulticastSource.prototype.event = function event(time, value) {
      var s = this.sinks;
      if (s.length === 1) {
        return s[0].event(time, value);
      }
      for (var i = 0; i < s.length; ++i) {
        tryEvent(time, value, s[i]);
      }
    };

    MulticastSource.prototype.end = function end(time) {
      var s = this.sinks;
      for (var i = 0; i < s.length; ++i) {
        tryEnd(time, s[i]);
      }
    };

    MulticastSource.prototype.error = function error(time, err) {
      var s = this.sinks;
      for (var i = 0; i < s.length; ++i) {
        s[i].error(time, err);
      }
    };

    return MulticastSource;
  }();

  var MulticastDisposable = /*#__PURE__*/function () {
    function MulticastDisposable(source, sink) {
      classCallCheck$2(this, MulticastDisposable);

      this.source = source;
      this.sink = sink;
    }

    MulticastDisposable.prototype.dispose = function dispose$$1() {
      if (this.source.remove(this.sink) === 0) {
        this.source.dispose();
      }
    };

    return MulticastDisposable;
  }();

  // -------------------------------------------------------

  var scan$$1 = /*#__PURE__*/curry3(scan$1);

  // -----------------------------------------------------------------------
  // Transforming

  var map$1$1 = /*#__PURE__*/curry2(map$2);
  var constant$$1 = /*#__PURE__*/curry2(constant$1);

  // -----------------------------------------------------------------------
  // FlatMapping

  var chain$$1 = /*#__PURE__*/curry2(chain$1);
  var continueWith$$1 = /*#__PURE__*/curry2(continueWith$1);

  // -----------------------------------------------------------------------
  // Merging

  var merge$$1 = /*#__PURE__*/curry2(merge$1);

  // -----------------------------------------------------------------------
  // Filtering

  var filter$$1 = /*#__PURE__*/curry2(filter$1);
  var skip$$1 = /*#__PURE__*/curry2(skip$1);

  // -----------------------------------------------------------------------
  // Time slicing

  var until$$1 = /*#__PURE__*/curry2(until$1);
  var during$$1 = /*#__PURE__*/curry2(during$1);

  /** @license MIT License (c) copyright 2010-2016 original author or authors */

  // curry2 :: ((a, b) -> c) -> (a -> b -> c)
  function curry2$2(f) {
    function curried(a, b) {
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return function (b) {
            return f(a, b);
          };
        default:
          return f(a, b);
      }
    }
    return curried;
  }

  // curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
  function curry3$2(f) {
    function curried(a, b, c) {
      // eslint-disable-line complexity
      switch (arguments.length) {
        case 0:
          return curried;
        case 1:
          return curry2$2(function (b, c) {
            return f(a, b, c);
          });
        case 2:
          return function (c) {
            return f(a, b, c);
          };
        default:
          return f(a, b, c);
      }
    }
    return curried;
  }

  /** @license MIT License (c) copyright 2019 original author or authors */
  var isDate = function (value) { return value instanceof Date; };
  // interval :: Number -> Stream Number
  var interval = function (period) {
      return filter$$1(function (x) { return x !== -1; }, scan$$1(function (x) { return x + 1; }, -1, skip$$1(1, periodic$1(period))));
  };
  // timer :: Number | Date -> Number | Undefined | Null -> Stream Number
  var timer = curry2$2(function (initialDelay, period) {
      var delayTime = isDate(initialDelay) ?
          initialDelay.getTime() - new Date().getTime() : initialDelay;
      var mainStream = at(delayTime, 0);
      return period ? continueWith$$1(function () { return map$1$1(function (val) { return val + 1; }, interval(period)); }, mainStream) : mainStream;
  });
  // bufferCount :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]
  var bufferCount = curry3$2(function (bufferSize, startEvery, stream) {
      var startBufferEvery = startEvery ? Math.abs(startEvery) : bufferSize;
      var multicastedStream = multicast(stream);
      var nextWindow = function (slidingWindow, x) {
          return slidingWindow.length >= bufferSize && slidingWindow.length % startBufferEvery === 0
              ? slidingWindow.slice(startBufferEvery).concat(x)
              : slidingWindow.concat(x);
      };
      var checkLength = function (x) { return x.length === bufferSize && x.length !== 0; };
      return filter$$1(checkLength, scan$$1(nextWindow, [], multicastedStream));
  });
  // bufferToggle :: Stream * -> Stream * -> Stream * -> Stream [*]
  var bufferToggle = curry3$2(function (startSignal, endSignal, stream) {
      startSignal = multicast(startSignal);
      stream = multicast(stream);
      var timeWindow = constant$$1(endSignal, startSignal);
      var accFn = function (buffer, elem) { return buffer.concat(elem); };
      var checkLength = function (x) { return x.length > 0; };
      var mainStream = filter$$1(checkLength, scan$$1(accFn, [], during$$1(timeWindow, stream)));
      return merge$$1(mostLast.last(mainStream), chain$$1(function (_) { return mostLast.last(mainStream); }, startSignal));
  });
  // bufferTime :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]
  var bufferTime = curry3$2(function (period, creationInterval, stream) {
      stream = multicast(stream);
      var mainStream;
      var accFn = function (buffer, elem) { return buffer.concat(elem); };
      var checkLength = function (x) { return x.length > 0; };
      if (creationInterval && period !== creationInterval) {
          mainStream = filter$$1(checkLength, scan$$1(accFn, [], until$$1(at(period, null), stream)));
          return chain$$1(function (_) { return mostLast.last(mainStream); }, periodic$1(creationInterval));
      }
      else {
          var startSignal = void 0, endSignal = void 0;
          startSignal = endSignal = multicast(periodic$1(period));
          var timeWindow = constant$$1(endSignal, startSignal);
          mainStream = filter$$1(checkLength, scan$$1(accFn, [], during$$1(timeWindow, stream)));
          return merge$$1(mostLast.last(mainStream), chain$$1(function (_) { return mostLast.last(mainStream); }, startSignal));
      }
  });

  exports.interval = interval;
  exports.timer = timer;
  exports.bufferCount = bufferCount;
  exports.bufferToggle = bufferToggle;
  exports.bufferTime = bufferTime;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
