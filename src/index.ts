/** @license MIT License (c) copyright 2019 original author or authors */
/** @author Carlos Zimmerle */

import { Stream } from '@most/types';
import {
  filter, scan, constant, skip, periodic, continueWith, map,
  multicast, merge, chain, during, at, until, loop, now, tap, sample
} from '@most/core';
import { last } from 'most-last';
import { curry2, curry3 } from '@most/prelude';
import { createAdapter } from '@most/adapter';

const isDate = (value: any) => value instanceof Date;

// interval :: Number -> Stream Number
const interval = (period: number): Stream<number> =>
  filter(x => x !== -1, scan(x => x + 1, -1, skip(1, periodic(period))));

// timer :: Number | Date -> Number | Undefined | Null -> Stream Number
const timer = curry2(function (initialDelay: number | Date, period: number | undefined | null): Stream<number> {
  const delayTime: number = isDate(initialDelay) ?
    (initialDelay as Date).getTime() - new Date().getTime() : initialDelay as number;
  const mainStream = at(delayTime, 0);

  return period ? continueWith(() => map(val => val + 1, interval(period)), mainStream) : mainStream;
});

// bufferCount :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]
const bufferCount = curry3((bufferSize: number,
  startEvery: number | undefined | null, stream: Stream<any>): Stream<any[]> => {

  const startBufferEvery = startEvery ? Math.abs(startEvery) : bufferSize;
  const multicastedStream: Stream<any> = multicast(stream);

  const nextWindow = (slidingWindow: any[], x: any) =>
    slidingWindow.length >= bufferSize && slidingWindow.length % startBufferEvery === 0
      ? slidingWindow.slice(startBufferEvery).concat(x)
      : slidingWindow.concat(x);

  const checkLength = (x: any[]) => x.length === bufferSize && x.length !== 0;

  return filter(checkLength, scan(nextWindow, [], multicastedStream));
});

// bufferToggle :: Stream * -> Stream * -> Stream * -> Stream [*]
const bufferToggle = curry3((startSignal: Stream<any>,
  endSignal: Stream<any>, stream: Stream<any>): Stream<any[]> => {

  startSignal = multicast(startSignal);
  stream = multicast(stream);

  const timeWindow = constant(endSignal, startSignal);
  const accFn = (buffer: any[], elem: any) => buffer.concat(elem);
  const checkLength = (x: any[]) => x.length > 0;
  const mainStream = filter(checkLength, scan(accFn, [], during(timeWindow, stream)));

  return merge(
    last(mainStream),
    chain(_ => last(mainStream), startSignal)
  );
});

// bufferTime :: Number -> Number | Undefined | Null -> Stream * -> Stream [*]
const bufferTime = curry3((period: number,
  creationInterval: number | undefined | null, stream: Stream<any>): Stream<any[]> => {

  let mainStream: Stream<any>;

  const accFn = (buffer: any[], elem: any) => buffer.concat(elem);
  const checkLength = (x: any[]) => x.length > 0;

  if (creationInterval && period !== creationInterval) {
    stream = multicast(stream);

    mainStream = filter(checkLength, scan(accFn, [], until(at(period, null), stream)));

    return chain(_ => last(mainStream), periodic(creationInterval));
  } else {

    let bufferState = {
      streamClosed: false,
      buffer: [] as any
    };

    let stream2 = loop((acc, evt: any) => {
      acc.buffer.push(evt);
      return { seed: acc, value: acc.buffer };
    }, bufferState,
      continueWith(() => filter((x: any) => x,
        tap(_ => bufferState.streamClosed = true, now(undefined))), stream));

    const [induce, events] = createAdapter();

    let interval = setInterval(() => {
      induce({});
    }, period);

    return tap(_ => {
      if (bufferState.streamClosed) {
        clearInterval(interval);
      } else {
        bufferState.buffer = [];
      }
    }, sample(stream2, events));
  }
});

export { interval, timer, bufferCount, bufferToggle, bufferTime };
