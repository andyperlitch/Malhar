'use strict';

describe('Module: DtFormatters', function () {

  var f;

  // load the service's module
  beforeEach(module('dtConsoleApp.formatters'));

  describe('the byteFormatter', function() {

    beforeEach(inject(function(dtByteFilterFilter) {
      f = dtByteFilterFilter;
    }));

    it('should convert a string to a fixed tenths position number', function() {
      expect(f('2048')).to.equal('2.0 KB');
    });

    it('should throw if the second argument is not an available level', function() {
      var fn = function() {
        f(2048, {});
      }
      expect(fn).to.throw();
    });

  });

  describe('the cpusFormatter', function() {

    beforeEach(inject(function(dtCpuFilterFilter) {
      f = dtCpuFilterFilter;
    }));

    it('should take a percentage as a first argument and return a string', function() {
      expect(f(0.1)).to.be.a('string');
    });

    it('should convert to CPU count to .01 precision', function() {
      expect(f(1.1)).to.equal('1.10');
    });

    it('should convert percentage numerator to decimal if numerator flag is set', function() {
      expect(f(110, true)).to.equal('1.10');
    });

    it('should be able to take a string', function() {
      expect(f('1.1')).to.equal('1.10');
      expect(f('110', true)).to.equal('1.10');
    });

  });

});
