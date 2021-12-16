import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | faction-balance', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:faction-balance');
    assert.ok(route);
  });
});
