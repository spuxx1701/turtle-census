import Service from '@ember/service';

export default class ConfigService extends Service {
    chartBorderWidth = 4;
    chartBorderRadius = 5;
    chartBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--colorPanelBackground');

    generateRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}