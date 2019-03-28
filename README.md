# most-rx-utils

A helpful library that provides some utility functions based on [RxJS](https://github.com/ReactiveX/rxjs) for Most.js ([@most/core](https://github.com/mostjs/core)).

## Install
```sh
npm install --save most-rx-utils
```

## Differences between RxJS and most-rx-utils Operations

To follow the characteristics of Most.js ([@most/core](https://github.com/mostjs/core)), all operators available are curried. Hence, operations like bufferCount or bufferTime, that are overloaded in RxJS, are set to receive all possible parameters, so, for those parameters that should be optional, a proper value or either ```undefined``` or ```null``` are expected.

## API
**interval :: Number -> Stream Number**

```interval(period: number) : Stream<number>```

Emits an infinite stream of numbers (starting at 0) according to a time interval (milliseconds).

Example:
```typescript
// 0, 1, 2
runEffects(tap(console.log, take(3, interval(2000))));
```
---
**timer :: Number | Date -> Number | Undefined | Null -> Stream Number**

```timer(delay: number | Date, period: number | undefined | null): Stream<number>```

Emits a single event containing value 0 after a delay. If the second argument is different from ```undefined``` or ```null```, subsequent values are then emitted according to the time period (milliseconds) passed in.

Examples:
```typescript
// emit 0 after 2 seconds
runEffects(tap(console.log, take(3, timer(2000, undefined))), newDefaultScheduler());

// emit 0 after 2 seconds and then, every 1 second, subsequent values are emitted, i.e. 1, 2, 3, 4, ...
runEffects(tap(console.log, take(3, timer(2000, 1000))), newDefaultScheduler());
```
---
**bufferCount :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]**

```bufferCount(bufferSize: number, startEvery: number | undefined | null, stream: Stream<any>): Stream<any[]>```

Buffers stream elements while the informed buffer size is not reached. If the second argument is not ```undefined``` or ```null```, the next buffer starts according to the value passed in.

Examples:
```typescript
// [0, 1, 2] [3, 4, 5] [6, 7, 8]
runEffects(tap(console.log, take(3, bufferCount(3, undefined, interval(2000)))), newDefaultScheduler());

// [0, 1, 2] [1, 2, 3] [2, 3, 4]
runEffects(tap(console.log, take(3, bufferCount(3, 1, interval(2000)))), newDefaultScheduler());
```
---
**bufferTime :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]**

```bufferTime(period: number, creationInterval: number | undefined | null, stream: Stream<any>): Stream<any[]>```

Buffers stream elements during a given time period (milliseconds). If the second argument is is not ```undefined``` or ```null```, the next buffer starts according to the time interval passed in.

Examples:
```typescript
// [0, 1, 2] [3, 4, 5, 6] [7, 8, 9, 10]
runEffects(tap(console.log, take(3, bufferTime(2000, undefined, interval(500)))), newDefaultScheduler());

// [0, 1, 2] [1, 2, 3, 4, 5] [3, 4, 5, 6, 7]
runEffects(tap(console.log, take(3, bufferTime(2000, 1000, interval(500)))), newDefaultScheduler());
```
---
**bufferToggle :: Stream * -> Stream * -> Stream * -> Stream [*]**

```bufferToggle(startSignal: Stream<any>, endSignal: Stream<any>, stream: Stream<any>): Stream<any[]>```

Uses streams to control when to start collecting elements (startSignal) and to emit the collected elements as array (endSignal).

Example:
```typescript
// [4, 5, 6, 7] [9, 10, 11, 12] [14, 15, 16, 17]
runEffects(tap(console.log, take(3, bufferToggle(interval(5000), timer(3000, undefined), interval(1000)))), newDefaultScheduler());
```
## Made with

[package-seed](https://github.com/mostjs-community/package-seed)

## License

most-rx-utils is available under the MIT license. See the [LICENSE file](https://github.com/mostjs-community/most-rx-utils/blob/master/LICENSE) for more info.