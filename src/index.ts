/** @license MIT License (c) copyright 2018 original author or authors */
/** @author YOU */

import { Stream } from '@most/types'

// _ :: Stream e -> Stream e
const _ = <T>(stream: Stream<T>) => stream

export { _ }
