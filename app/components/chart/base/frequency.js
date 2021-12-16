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

export default class ChartBaseFrequencyComponent extends Component {
    @service config;

    keyProperty = undefined;

    data = [];
    labels = [];
    label = "";
    backgroundColor = [];
    borderColor = this.config.chartBorderColor;
    borderWidth = this.config.chartBorderWidth;
    borderRadius = this.config.chartBorderRadius;
    showThreshold = false;
    thresholdMin = 0;
    thresholdMax = 999;
    useSpectrum = false;
    spectrumStart = "gray";
    spectrumMid = undefined;
    spectrumEnd = "white";
    useFactionFilter = false;
    useGuildFilter = false;

    @tracked chartType = "pie";
    @tracked threshold = 0;
    @tracked factionFilter = undefined;
    @tracked guildFilter = "";

    @action initialize() {
        this.ctx = document.getElementById(this.args.chartId).getContext('2d');
        this.renderChart();
    }

    @action renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        let data = [];
        let labels = [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] >= this.threshold) {
                data.push(this.data[i]);
                labels.push(this.labels[i]);
            }
        }
        let borderWidth = this.borderWidth;
        if (this.chartType === "bar") {
            borderWidth = 0;
        }
        let backgroundColor = this.backgroundColor;
        if (this.useSpectrum) {
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
        let color = this.backgroundColor;
        this.chart = new Chart(this.ctx, {
            type: this.chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: this.label,
                    data: data,
                    color: color,
                    backgroundColor: backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: borderWidth,
                    borderRadius: this.borderRadius
                }]
            },
            options: this.config.getChartOptions(this.chartType)
        });
    }

    @action onTypeChange(type) {
        this.chartType = type;
        this.renderChart();
    }

    @action onThresholdChange(event) {
        let value = event.srcElement.value;
        let oldValue = this.threshold;
        let newValue = parseInt(value);
        if (isNaN(newValue)) {
            event.srcElement.value = oldValue;
        } else if (newValue < this.thresholdMin) {
            this.threshold = this.thresholdMin;
            this.renderChart();
        } else if (newValue > this.thresholdMax) {
            this.threshold = this.thresholdMax;
            this.renderChart();
        } else {
            this.threshold = newValue;
            this.renderChart();
        }
    }

    @action onFactionFilterChange(faction) {
        this.factionFilter = faction;
        this.renderChart();
    }

    @action onGuildFilterChange(event) {
        let value = event.srcElement.value;
        this.guildFilter = value;
        this.renderChart();
    }
}