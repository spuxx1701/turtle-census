import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
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

    data = [];
    labels = [];
    label = "";
    backgroundOpacity = "90";
    backgroundColor = [];
    borderColor = this.config.chartBorderColor;
    borderWidth = this.config.chartBorderWidth;
    borderRadius = this.config.chartBorderRadius;

    @tracked chartType = "pie";

    @action initialize() {
        for (let i = 0; i < this.backgroundColor.length; i++) {
            this.backgroundColor[i] += this.backgroundOpacity;
        }
        this.ctx = document.getElementById(this.args.chartId).getContext('2d');
        this.renderChart();
    }

    @action renderChart() {
        let options = {
            scales: undefined
        };
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new Chart(this.ctx, {
            type: this.chartType,
            data: {
                labels: this.labels,
                datasets: [{
                    label: this.label,
                    data: this.data,
                    backgroundColor: this.backgroundColor,
                    borderColor: this.borderColor,
                    borderWidth: this.borderWidth,
                    borderRadius: this.borderRadius
                }]
            },
            options: options
        });
    }

    @action onTypeChange(type) {
        this.chartType = type;
        this.renderChart();
    }
}