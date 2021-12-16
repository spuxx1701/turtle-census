import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Rainbow from 'rainbowvis.js';
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);
export default class ChartCharactersComponent extends Component {
    @service config;

    @tracked chartType = "pie";
    @tracked useFactionFilter;
    @tracked factionFilter;
    @tracked useGuildFilter;
    @tracked guildFilter = "";
    @tracked useRaceFilter;
    @tracked raceFilter;
    @tracked useClassFilter;
    @tracked classFilter;

    @action initialize() {
        this.label = this.args.label || "";
        this.chartType = this.args.chartType || "pie";
        this.useSpectrum = this.args.useSpectrum || false;
        this.spectrumStart = this.args.spectrumStart || "gray";
        this.spectrumMid = this.args.spectrumMid || undefined;
        this.spectrumEnd = this.args.spectrumEnd || "white";
        this.useFactionFilter = this.args.useFactionFilter || false;
        this.useGuildFilter = this.args.useGuildFilter || false;
        this.useRaceFilter = this.args.useRaceFilter || false;
        this.useClassFilter = this.args.useClassFilter || false;
        this.ctx = document.getElementById(this.args.chartId).getContext('2d');
        this.renderChart();
    }

    @action renderChart() {
        // Destroy the current chart if required
        if (this.chart) {
            this.chart.destroy();
        }

        // read arguments
        let characters = this.args.characters;
        let categories = this.args.categories;
        let key = this.args.key;

        // Prepare the dataset
        let labels = [];
        let data = [];
        let backgroundColor = [];
        for (let category of categories) {
            let n = 0;
            for (let character of characters) {
                // Apply filters if required
                if (this.useFactionFilter && this.factionFilter) {
                    if (character.faction !== this.factionFilter) {
                        continue;
                    }
                }
                if (this.useGuildFilter && this.guildFilter) {
                    if (character.guild !== this.guildFilter) {
                        continue;
                    }
                }
                if (this.useRaceFilter && this.raceFilter) {
                    if (character.race !== this.raceFilter) {
                        continue;
                    }
                }
                if (this.useClassFilter && this.classFilter) {
                    if (character.class !== this.classFilter) {
                        continue;
                    }
                }
                if (character[key] && character[key] === (category.name || category)) {
                    n++;
                }
            }
            labels.push(category.name || category);
            data.push(n);
            if (category.color) {
                backgroundColor.push(category.color);
            }
        }

        // If spectrum should be used for coloring
        if (this.useSpectrum) {
            backgroundColor = [];
            let rainbow = new Rainbow();
            if (this.spectrumMid) {
                rainbow.setSpectrum(this.spectrumStart, this.spectrumMid, this.spectrumEnd);
            } else {
                rainbow.setSpectrum(this.spectrumStart, this.spectrumEnd);
            }
            rainbow.setNumberRange(1, data.length);
            for (let i = 0; i < data.length; i++) {
                backgroundColor.push(`#${rainbow.colourAt(i + 1)}`);
            }
        }

        // Set border width depending on chart type
        let borderWidth = this.config.chartBorderWidth;
        if (this.chartType === "bar") {
            borderWidth = 0;
        }

        // adjust background colors depending on chart type
        if (this.chartType === "polarArea") {
            for (let i in backgroundColor) backgroundColor[i] += "80";
        }

        // Render the chart
        this.chart = new Chart(this.ctx, {
            type: this.chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: this.label,
                    data: data,
                    color: this.config.chartFontColor,
                    backgroundColor: backgroundColor,
                    borderColor: this.config.chartBorderColor,
                    borderWidth: borderWidth,
                    borderRadius: this.config.chartBorderRadius
                }]
            },
            options: this.config.getChartOptions(this.chartType)
        });
    }


    @action onTypeChange(type) {
        this.chartType = type;
        this.renderChart();
    }

    @action onFactionFilterChange(faction) {
        this.factionFilter = faction;
        this.renderChart();
    }

    @action onRaceFilterChange(race) {
        this.raceFilter = race;
        this.renderChart();
    }

    @action onClassFilterChange(className) {
        this.classFilter = className;
        this.renderChart();
    }

    @action onGuildFilterChange(event) {
        let value = event.srcElement.value;
        this.guildFilter = value;
        this.renderChart();
    }
}