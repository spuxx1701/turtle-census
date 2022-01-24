import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class HomeRoute extends Route {
    @service dataLoader;

    async model() {
        await this.dataLoader.load();
        let lastUpdated = this.dataLoader.lastUpdated;
        let lastUpdatedAsText = `${lastUpdated.toDateString()}`;
        // let lastUpdatedAsText = `${lastUpdated.getMonth() + 1}/${lastUpdated.getDate()}/${lastUpdated.getFullYear()}`;
        return RSVP.hash({
            lastUpdated: lastUpdatedAsText,
            maxLevelCharacters: this.dataLoader.data.maxLevelCharacterCount,
            scannedCharacters: this.dataLoader.data.characters.length,
            foundGuilds: this.dataLoader.data.guilds.length,
        });
    }
}
