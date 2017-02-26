'use strict';

import test from 'ava';
import moment from 'moment';
import isPlainObj from 'is-plain-obj';

import constants from '../lib/constants';
import get from '../lib/get-validated-options';

let options;

test.beforeEach(() => {
  options = {};
});

test('it should throw an error when origin airport is missing (type)', t => {
  options.from = {};

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Origin airport code is missing');
});

test('it should throw an error when origin airport is missing (blank)', t => {
  options.from = '';

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Origin airport code is missing');
});

test('it should throw and error when origin airport is invalid', t => {
  options.from = 'foo';

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Origin airport code is invalid');
});

test('it should throw an error when destination airport is missing (type)', t => {
  options.from = 'MEX';
  options.to = {};

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Destination airport code is missing');
});

test('it should throw an error when destination airport is missing (blank)', t => {
  options.from = 'MEX';
  options.to = '';

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Destination airport code is missing');
});

test('it should throw an error when destination airport is invalid', t => {
  options.from = 'MEX';
  options.to = 'foo';

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Destination airport code is invalid');
});

test('it should throw an error when departure date is missing (type)', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = {};

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Departure date is missing');
});

test('it should throw an error when departure date is missing (blank)', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = '';

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Departure date is missing');
});

test('it should throw an error when the departure date is in an invalid format', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format('YYYY/MM/DD');

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Departure date is invalid');
});

test('it should throw an error when the departure date is a past date', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().subtract(1, 'day').format(constants.DATETIME_DATE_FORMAT);

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Departure date is invalid');
});

test('it should throw an error when the return date is invalid', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format(constants.DATETIME_DATE_FORMAT);
  options.return = moment().format('YYYY/MM/DD');

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Return date is invalid');
});

test('it should throw an error when the return date is before departure date', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format(constants.DATETIME_DATE_FORMAT);
  options.return = moment().subtract(1, 'day').format(constants.DATETIME_DATE_FORMAT);

  let error = t.throws(() => {
    get(options);
  }, TypeError);

  t.is(error.message, 'Return date is invalid');
});

test('it should return a validated options object', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format(constants.DATETIME_DATE_FORMAT);
  options.return = moment().add(1, 'day').format(constants.DATETIME_DATE_FORMAT);

  let validated = get(options);

  t.true(isPlainObj(validated));
});

test('the options object should have certain members (with return date)', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format(constants.DATETIME_DATE_FORMAT);
  options.return = moment().add(1, 'day').format(constants.DATETIME_DATE_FORMAT);

  let validated = get(options);

  t.true(Object.prototype.hasOwnProperty.call(validated, 'originAirport'));
  t.true(Object.prototype.hasOwnProperty.call(validated, 'destinationAirport'));
  t.true(Object.prototype.hasOwnProperty.call(validated, 'departureDate'));
  t.true(Object.prototype.hasOwnProperty.call(validated, 'returnDate'));
});

test('the options object should have certain members (always present)', t => {
  options.from = 'MEX';
  options.to = 'TIJ';
  options.departure = moment().format(constants.DATETIME_DATE_FORMAT);

  let validated = get(options);

  t.true(Object.prototype.hasOwnProperty.call(validated, 'originAirport'));
  t.true(Object.prototype.hasOwnProperty.call(validated, 'destinationAirport'));
  t.true(Object.prototype.hasOwnProperty.call(validated, 'departureDate'));
});
