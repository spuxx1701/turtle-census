import Service from '@ember/service';
import LuaParse from 'luaparse';
import { action } from '@ember/object';
import { format, parse } from 'lua-json';

export default class DataLoaderService extends Service {
    rawDataUri = '/assets/raw/CensusPlus.lua.bak';
    constants = {
        classes: ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"]
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
        let guilds = [];
        let characters = [];
        let allianceGuildsTable = json.body[0].init[0].fields[0].value.fields[0].value.fields[0];
        let allianceGuilds = allianceGuildsTable.value.fields;
        for (let allianceGuild of allianceGuilds) {
            let guildInfo = this._findFieldByKey(allianceGuild, "GuildInfo");
            let update = this._findFieldByKey(guildInfo, "Update");
            let members = this._findFieldByKey(allianceGuild, "Members").value.fields;
            let guild = {
                name: this._parseRawString(allianceGuild.key.raw),
                lastUpdated: this._parseRawDate(update.value.raw),
                members: [],
                memberCount: members.length
            };
            for (let member of members) {
                let character = {
                    name: this._parseRawString(member.key.raw),
                    rank: this._findFieldByKey(member, "RankIndex").value.value,
                    level: this._findFieldByKey(member, "Level").value.value,
                    class: this._parseRawString(this._findFieldByKey(member, "Class").value.raw),
                    guild: guild.name,
                    guildRank: this._parseRawString(this._findFieldByKey(member, "Rank").value.raw)
                };
                characters.push(character);
                guild.members.push(character);
            }
            guilds.push(guild);
        }
        // Persist the data
        this.data = {
            guilds: guilds,
            characters: characters
        };
        return this.data;
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
        let result = input.replaceAll("\"", "");
        return result;
    }

    _parseRawDate(input) {
        let [month, day, year] = this._parseRawString(input).split("-");
        let result = new Date(year, month - 1, day);
        return result;
    }
}
