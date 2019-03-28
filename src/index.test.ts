import { describe, it } from 'mocha'
import * as assert from 'power-assert'
import { runEffects, tap, until, at, take } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { interval, timer, bufferCount, bufferToggle, bufferTime} from './index'


describe('most-rx-utils', function(){
  it('Should produce a sequence of numbers according to a given time period', function(done) {
    this.timeout(11000);

    let expectedOutput = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let computedOutput: any[] = [];
    
    runEffects(until(at(10500, null),
      tap(val => computedOutput.push(val), interval(1000))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });

  it('Should emit one value(0) after a given time period', function(done){
    this.timeout(3500);

    runEffects(
      tap(val => assert.equal(val, 0), timer(1000, undefined)), newDefaultScheduler())
    .then(done);
  });

  it('Should emit one value(0) and a set of sequencial values during given time periods', function(done){
    this.timeout(11000);

    let expectedOutput = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let computedOutput: any[] = [];
    
    runEffects(until(at(10500, null),
      tap(val => computedOutput.push(val), timer(1000, 1000))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });

  it('Should emit buffers of size 3 containing sequential values', function(done){
    this.timeout(10000);

    let expectedOutput = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    let computedOutput: any[] = [];

    runEffects(take(3,
      tap(val => computedOutput.push(val),
      bufferCount(3, undefined, interval(1000)))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });

  it('Should emit buffers of size 3 containing overlapping sequential values', function(done){
    this.timeout(10000);

    let expectedOutput = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
    let computedOutput: any[] = [];

    runEffects(take(3,
      tap(val => computedOutput.push(val),
      bufferCount(3, 1, interval(1000)))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });

  it('Should emit buffers of sequential values gathered during a given time', function(done){
    this.timeout(10000);
    
    let expectedOutput = [[0, 1, 2],[3, 4, 5, 6],[7, 8, 9, 10]];
    let computedOutput: any[] = [];

    runEffects(take(3,
      tap(val => computedOutput.push(val),
      bufferTime(2000, undefined, interval(500)))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });


  it('Should emit buffers of overlapping sequential values gathered during a given time', function(done){
    this.timeout(12000);

    let expectedOutput = [[0, 1, 2], [1, 2, 3, 4, 5], [3, 4, 5, 6, 7]];
    let computedOutput: any[] = [];

    runEffects(take(3,
      tap(val => computedOutput.push(val),
      bufferTime(2000, 1000, interval(500)))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });

  it('Should emit buffers with sequential values controlled by two streams', function(done){
    this.timeout(16000);

    let expectedOutput = [[4, 5, 6, 7], [9, 10, 11, 12]];
    let computedOutput: any[] = [];

    runEffects(take(2,
      tap(val => computedOutput.push(val),
      bufferToggle(interval(5000), timer(3000, undefined), interval(1000)))), newDefaultScheduler())
    .then(()=>{
      assert.deepStrictEqual(computedOutput, expectedOutput);
      done();
    });
  });
});