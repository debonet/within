# within

Simple library to add timeouts to ES6 Promieses


# Installation

```
npm install @debonet/within
```

# Usage

Take a normal Promise call and give it a timeout by going from

```javascript
	const within = require( '@debonet/within' );

	// this could take a very long time
	let myPromise = somePromiseFunction( arg1, arg2, ... );

	// this will timeout
	let myPromise = within(2000, somePromiseFunction, arg1, arg2, ...);
```

# Promise Chains

When the within times out, it rejects the promise with a within.TimeoutError.  Within introduces .timedout() which operates like a .catch() statement that catch only within.TimeoutError's

```javascript
	within( 1000, func)
		.timedout(( err ) => /* handle a timeout */ )
		.catch (( err ) => /* handle other errors */ );
		
```


Timeouts can also be handled using a regular .catch() handler:


```javascript
	within( 1000, func)
		.catch( ( err ) => {
			if ( err instanceof within.TimeoutError ) {
				/* handle a timeout */
			}
			else {
				/* handle other errors */
			}
		});
```

# Time limited functions

Create a version of a function that will timeout if it exceeds the specified duration

```javascript

	const waitUpTo1Second = within.limit( 1000, wait );

	try {
		waitUpTo1Second( 2000 );
	}
	catch {
		// will get here after 1000 ms
	}
```


# API

## within( maxTime, func [, arguments] * )

### Parameters

`maxTime`
the maximum duration (in microseconds) to wait before rejecting the promise with a within.TimeoutError.

`func`
a function whose duration is going to be limited.

`arguments | optional`
arguments which will be passed to `func`. This allows one to save the sytax overhead of wrapping a call to func in a  capturing lambda `() => func( arguments )`

### Returns

a Promise that resolves with the result of `func(...arguments)` or Promise.reject(Within.TimeoutError) in the event that that the call to `func`does not complete within the indicaed `maxTime`.



## within.limit( maxTime, func )

### Parameters

`maxTime`
the maximum duration (in microseconds) to wait before rejecting the promise with a within.TimeoutError.

`func`
a function that will be timelimited

### Returns

a function that returns a promise Promise that resolves with the result of `func(...arguments)` or Promise.reject(Within.TimeoutError) in the event that that the call to `func` does not complete within the indicaed `maxTime`.

