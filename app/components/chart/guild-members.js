import ChartBaseFrequencyComponent from './base/frequency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ChartGuildMembersComponent extends ChartBaseFrequencyComponent {
    @service dataLoader;
    @service config;

    showThreshold = true;
    @tracked threshold = 10;
    @tracked chartType = "doughnut";
    labels = [];
    useSpectrum = true;
    spectrumStart = "orange";
    spectrumEnd = "green";

    @action initialize() {
        this.data = [];
        this.labels = [];
        for (let guild of this.args.data) {
            this.labels.push(guild.name);
            this.data.push(guild.members.length);
        }
        super.initialize();
    }
}