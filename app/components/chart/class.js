import ChartBaseFrequencyComponent from './base/frequency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChartClassComponent extends ChartBaseFrequencyComponent {
    @service dataLoader;

    label = "Class frequency";
    labels = this.dataLoader.constants.classes;
    backgroundColor = ["#FF7D0A", "#ABD473", "#69CCF0", "#F58CBA", "#FFFFFF", "#FFF569", "#0070DE", "#9482C9", "#C79C6E"];

    @action initialize() {
        this.data = [];
        for (let className of this.dataLoader.constants.classes) {
            let n = 0;
            for (let character of this.args.data) {
                if (character.class === className) {
                    n++;
                }
            }
            this.data.push(n);
        }
        super.initialize();
    }
}