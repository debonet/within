// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
function within( dtmMax, fp, ...vxArgsToFp ){
	// define the error here so that the call stack points to where
	// the promise is being issed, rather than somewhere inside the Promise
	// resolution stack
	const err = new within.TimeoutError(	dtmMax );
	const tmStart = Date.now();
	
	const p = new Promise(( fOk, fErr ) => {
		
		const timeout = setTimeout(
			() => {
				err.timeout = Date.now() - tmStart;
				err.message = (
					`within timeout of ${err.maxTime} exceeded with ${err.timeout}`
				);
				return fErr( err );
			},
			dtmMax
		);

		fp(...vxArgsToFp).then(
			( x ) => {
				clearTimeout(timeout);
				return fOk( x );
			},
			
			( x ) => {
				clearTimeout(timeout);
				return fErr( x );
			}
		);
	});

	p.timedout = ( fpHandleTimeout ) => {
		p.catch( ( err ) => {
			if ( err instanceof within.TimeoutError ){
				return fpHandleTimeout ( err );
			}
			
			return Promise.reject( err );
		});
	}

	return p;
}


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
within.TimeoutError = class TimeoutError extends Error {
	constructor (dtmMax, ...vx) {
		super(dtmMax, ...vx);
		this.name = "within.TimeoutError";
		this.maxTime = dtmMax;
	}
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
within.limit = function ( dtm, f ) {
	return ( ...vx ) => within( dtm, f, ...vx );
}


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
module.exports = within;
