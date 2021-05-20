const within = require( "../src/within" );


expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

function wait( dtm ){
	return new Promise(( fOk ) => setTimeout( fOk, dtm ));
}

async function timeIt( f, ...vx ){
	const tm = Date.now();
	await f( ...vx );
	return Date.now() - tm;
}

test('test our testers:  wait and timeIt functionality', async  () => {
  return expect(await timeIt( wait, 100) )
		.toBeWithinRange( 100, 110 );
});

test("test within doesn't break anthing", async  () => {
  return expect( await timeIt( within, 400, wait, 100 ) )
		.toBeWithinRange( 100, 110 );
});


test('within successfullly times out', async  () => {
	try {
		await within( 50, wait, 100 );
	}
	catch (err ){
		expect( err.name ).toMatch("Timeout");
	}

});

test("limit function creator doesn't interfere", async  () => {
	const waitUpTo50 = within.limit( 50, wait );
	
	try {
		await waitUpTo50( 20 );
	}
	catch ( err ){
		expect( err.name ).not.toMatch("Timeout");
	}

});

test("limit function creator will timeout", async  () => {
	const waitUpTo50 = within.limit( 50, wait );
	
	try {
		await waitUpTo50( 100 );
	}
	catch (err ){
		expect( err.name ).toMatch("Timeout");
	}

});

