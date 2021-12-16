import Service from '@ember/service';

export default class ConfigService extends Service {
    chartBorderWidth = 4;
    chartBorderRadius = 5;
    chartBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--colorPanelBackground');
    noGuildText = "(guildless)";
    constants = {
        ignoreNodeKeys: ["Guilds", "Info", "TimesPlus"],
        characterPropertyKeys: {
            level: "1",
            guild: "2",
            lastUpdated: "3"
        },
        classes: [
            { name: "Druid", color: "#FF7D0A" },
            { name: "Hunter", color: "#ABD473" },
            { name: "Mage", color: "#69CCF0" },
            { name: "Paladin", color: "#F58CBA" },
            { name: "Priest", color: "#FFFFFF" },
            { name: "Rogue", color: "#FFF569" },
            { name: "Shaman", color: "#0070DE" },
            { name: "Warlock", color: "#9482C9" },
            { name: "Warrior", color: "#C79C6E" },
        ],
        races: [
            { name: "Goblin", faction: "Horde", color: "#2b792d" },
            { name: "Orc", faction: "Horde", color: "#ab2929" },
            { name: "Tauren", faction: "Horde", color: "#794b2b" },
            { name: "Troll", faction: "Horde", color: "#41add2" },
            { name: "Undead", faction: "Horde", color: "#462859" },
            { name: "Dwarf", faction: "Alliance", color: "#ababab" },
            { name: "Gnome", faction: "Alliance", color: "#dc45e9" },
            { name: "High Elf", faction: "Alliance", color: "#b3dfff" },
            { name: "Human", faction: "Alliance", color: "#0055ff" },
            { name: "Night Elf", faction: "Alliance", color: "#097578" }
        ],
        factions: [
            { name: "Horde", color: "#C62424" },
            { name: "Alliance", color: "#2431C6" }
        ],
        levels: Array.from({ length: 60 }, (_, i) => i + 1)
    };

    generateRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getChartOptions(chartType) {
        // build default options
        let options = {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14,
                        },
                        fontColor: getComputedStyle(document.documentElement).getPropertyValue('--colorTextLabel')
                    }
                }
            }
        };
        // adjust options depending on chart type
        if (chartType === "bar") {
            options.plugins.legend.display = false;
            options.scales = {
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--colorTextLabel')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--colorPanelBorder')
                    }
                },
                y: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--colorTextLabel')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--colorPanelBorder')
                    }
                }
            };
        }
        return options;
    }
}