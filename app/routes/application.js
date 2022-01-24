import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
    @service dataLoader;

    async model() {
        this.dataLoader.load();
    }

    @action
    loading() {
        //   let controller = this.controllerFor('foo');
        //   controller.set('currentlyLoading', true);
        return true; // allows the loading template to be shown
    }
}
