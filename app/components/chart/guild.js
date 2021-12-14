import ChartBaseFrequencyComponent from './base/frequency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChartGuildComponent extends ChartBaseFrequencyComponent {
    @service dataLoader;
    @service config;

    label = "Guild member counts";
    labels = [];
    backgroundColor = [];

    @action initialize() {
        this.data = [];
        this.labels = [];
        // for (let i = 0; i < 30; i++) {
        //     this.labels.push(this.args.data[0].name);
        //     this.data.push(this.args.data[0].memberCount);
        //     this.backgroundColor.push(this.config.generateRandomColor());
        // }
        for (let guild of this.args.data) {
            this.labels.push(guild.name);
            this.data.push(guild.memberCount);
            this.backgroundColor.push(this.config.generateRandomColor());
        }
        super.initialize();
    }
}