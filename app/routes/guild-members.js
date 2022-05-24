import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GuildMembersRoute extends Route {
    @service dataLoader;

    async model() {
        return this.dataLoader.data.guilds;
    }
}
