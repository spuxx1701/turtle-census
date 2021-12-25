import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class RaceCompositionRoute extends Route {
    @service dataLoader;
    @service config;

    async model() {
        return RSVP.hash({
            characters: this.dataLoader.data.characters,
            categories: this.config.constants.races,
            property: "Race"
        });
    }
}
