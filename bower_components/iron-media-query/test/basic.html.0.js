

      suite('basic', function() {
        var mq;

        suite('set query with different values', function() {
          setup(function () {
            mq = fixture('basic');
          });

          test('small min-width value', function() {
            mq.query = '(min-width: 1px)';
            assert.equal(mq.queryMatches, true);
          });

          test('large min-width value', function() {
            mq.query = '(min-width: 10000px)';
            assert.equal(mq.queryMatches, false);
          });

          test('small max-width value', function() {
            mq.query = '(max-width: 1px)';
            assert.equal(mq.queryMatches, false);
          });

          test('large max-width value', function() {
            mq.query = '(max-width: 10000px)';
            assert.equal(mq.queryMatches, true);
          });

        });

      });

    