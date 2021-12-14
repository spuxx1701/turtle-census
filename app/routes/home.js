import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class HomeRoute extends Route {
    @service dataLoader;

    async model() {
        await this.dataLoader.load();
        return RSVP.hash({
            guilds: this.dataLoader.data.guilds,
            characters: this.dataLoader.data.characters
        });
    }
}
