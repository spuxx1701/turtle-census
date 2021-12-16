import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | class-composition', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:class-composition');
    assert.ok(route);
  });
});
