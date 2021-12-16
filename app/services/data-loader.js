import Service from '@ember/service';
import LuaParse from 'luaparse';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DataLoaderService extends Service {
    @service config;

    rawDataUri = '/assets/raw/CensusPlus.lua';
    data = {
        players: [],
        gilds: []
    };

    async load() {
        let raw = await fetch(this.rawDataUri)
            .then(response => response.text());
        let json = this._parseLua(raw);
        return this._load(json);
    }

    @action _parseLua(input) {
        let result = LuaParse.parse(input, {
            comments: false,
        });
        return result;
    }

    @action _load(json) {
        // Census outputs all date for Alliance and Horde. Data can double since Turtle WoW allows checking members of the oppositie
        // faction in /who queries. Census also has two ways of finding players: Via scanning guilds as well as /who queries. As long as
        // the app does not support user-uploaded data, we can ignore the guild scanning (since it will only work on guilds the scanning
        // character belongs to).
        let servers = this._findNodeByKey(json, "Servers");
        let turtleWoW = this._findNodeByKey(servers, "Turtle WoW");
        if (!turtleWoW) {
            throw new Error("Unable to find Turtle WoW dataset.");
        }
        let horde = this._findNodeByKey(turtleWoW, "Horde");
        let alliance = this._findNodeByKey(turtleWoW, "Alliance");
        if (!horde && !alliance) {
            throw new Error("Unable to find neither Horde nor Alliance dataset.");
        }
        let factions = [horde, alliance];
        let guilds = [];
        let characters = [];
        let races = this.config.constants.races;
        // Loop over faction, race, class and character nodes
        for (let factionNode of factions) {
            for (let race of races) {
                let raceNode = this._findNodeByKey(factionNode, race.name);
                if (!raceNode) continue;
                for (let classObj of this.config.constants.classes) {
                    let classNode = this._findNodeByKey(raceNode, classObj.name);
                    if (!classNode) continue;
                    for (let characterNode of classNode.value.fields) {
                        // Build character record
                        let character = {
                            name: this._parseRawString(characterNode.key.raw),
                            faction: undefined,
                            race: race.name,
                            class: classObj.name,
                            level: characterNode.value.fields.find(element => element.key.raw === this.config.constants.characterPropertyKeys.level).value.value,
                            guild: this._parseRawString(characterNode.value.fields.find(element => element.key.raw === this.config.constants.characterPropertyKeys.guild).value.raw),
                            lastUpdated: this._parseRawDate(characterNode.value.fields.find(element => element.key.raw === this.config.constants.characterPropertyKeys.lastUpdated).value.raw),
                        };
                        this._determineFaction(character);
                        if (!character.guild) {
                            character.guild = this.config.noGuildText;
                        }
                        // Check for doubles in character list
                        let existingCharacter = characters.find(element => element.name === character.name);
                        if (existingCharacter) {
                            // If the character exists, keep newer state
                            if (existingCharacter.lastUpdated < character.lastUpdated) {
                                existingCharacter = character;
                            } else {
                                character = existingCharacter;
                            }
                        } else {
                            // If character does not exist, simply append
                            characters.push(character);
                        }
                        // Build guild record if required
                        if (character.guild) {
                            let guild = {
                                name: character.guild,
                                members: []
                            };
                            // Check for doubles in guild list
                            let existingGuild = guilds.find(element => element.name === character.guild);
                            if (existingGuild) {
                                // If the guild exists, check whether this character is already in the members list and add them if needed
                                let existingMember = existingGuild.members.find(element => element.name === character.name);
                                if (existingMember) {
                                    existingMember = character;
                                } else {
                                    existingGuild.members.push(character);
                                }
                            } else {
                                // If the guild does not, simply append
                                guilds.push(guild);
                            }
                        }
                    }
                }
            }
        }
        this.data = {
            guilds: guilds,
            characters: characters
        };
        return this.data;
        // GUILD SCANNING: CURRENTLY OBSOLETE
        // let allianceGuildsTable = json.body[0].init[0].fields[0].value.fields[0].value.fields[0];
        // let allianceGuilds = allianceGuildsTable.value.fields;
        // for (let allianceGuild of allianceGuilds) {
        //     let guildInfo = this._findFieldByKey(allianceGuild, "GuildInfo");
        //     let update = this._findFieldByKey(guildInfo, "Update");
        //     let members = this._findFieldByKey(allianceGuild, "Members").value.fields;
        //     let guild = {
        //         name: this._parseRawString(allianceGuild.key.raw),
        //         lastUpdated: this._parseRawDate(update.value.raw),
        //         members: [],
        //         memberCount: members.length
        //     };
        //     for (let member of members) {
        //         let character = {
        //             name: this._parseRawString(member.key.raw),
        //             rank: this._findFieldByKey(member, "RankIndex").value.value,
        //             level: this._findFieldByKey(member, "Level").value.value,
        //             class: this._parseRawString(this._findFieldByKey(member, "Class").value.raw),
        //             guild: guild.name,
        //             guildRank: this._parseRawString(this._findFieldByKey(member, "Rank").value.raw)
        //         };
        //         characters.push(character);
        //         guild.members.push(character);
        //     }
        //     guilds.push(guild);
        // }
        // Persist the data
    }

    _findNodeByKey(json, key) {
        let maxTries = 100;
        let nTries = 0;
        let result = this._checkNode(json, key, { maxTries: maxTries, nTries: nTries });
        return result;
    }

    _checkNode(node, key, { maxTries = 0, nTries = 0 } = {}) {
        // Skip irrelevant node keys
        if (node.key?.raw) {
            if (this.config.constants.ignoreNodeKeys.find(element => element === this._parseRawString(node.key.raw))) {
                return;
            }
        }
        for (let property of Object.keys(node)) {
            let currentNode = node[property];
            if (Array.isArray(currentNode)) {
                for (let element of currentNode) {
                    if (typeof element === "object" && element) {
                        let potentialNode = this._checkNode(element, key, { maxTries: maxTries, nTries: nTries });
                        if (potentialNode) {
                            return potentialNode;
                        }
                    }
                }
            } else if (!Array.isArray(currentNode) && typeof currentNode === "object" && currentNode) {
                if (currentNode.raw) {
                    let nodeKey = this._parseRawString(currentNode.raw);
                    if (nodeKey === key) {
                        return node;
                    }
                }
                let potentialNode = this._checkNode(currentNode, key, { maxTries: maxTries, nTries: nTries });
                if (potentialNode) {
                    return potentialNode;
                }
            }
            nTries++;
            if (maxTries && nTries >= maxTries) break;
        }
    }

    _findFieldByKey(json, key) {
        let fields = json.value.fields || json.fields || json;
        if (!Array.isArray(fields)) {
            throw new Error("Unable to find 'fields' array in the given argument.");
        }
        let result;
        result = fields.find(element => this._parseRawString(element.key.raw) === key);
        return result;
    }

    _parseRawString(input) {
        if (typeof input === "string") {
            return input.replaceAll("\"", "");
        } else {
            return undefined;
        }
    }

    _parseRawDate(input) {
        let [year, month, day] = this._parseRawString(input).split("-");
        let result = new Date(year, month - 1, day);
        return result;
    }

    _propertiesToArray(obj) {
        const isObject = val =>
            val && typeof val === 'object' && !Array.isArray(val);

        const addDelimiter = (a, b) =>
            a ? `${a}.${b}` : b;

        const paths = (obj = {}, head = '') => {
            return Object.entries(obj)
                .reduce((product, [key, value]) => {
                    let fullPath = addDelimiter(head, key);
                    return isObject(value) ?
                        product.concat(paths(value, fullPath))
                        : product.concat(fullPath);
                }, []);
        };
        return paths(obj);
    }

    _determineFaction(character) {
        for (let race of this.config.constants.races) {
            if (race.name === character.race) {
                character.faction = race.faction;
            }
        }
    }

}
