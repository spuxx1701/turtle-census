import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class FactionBalanceRoute extends Route {
    @service dataLoader;
    @service config;

    async model() {
        await this.dataLoader.load();
        return RSVP.hash({
            characters: this.dataLoader.data.characters,
            categories: this.config.constants.factions,
            property: "Faction"
        });
    }
}