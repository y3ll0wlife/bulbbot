import { Snowflake, ColorResolvable, ActivityType, PresenceStatusData } from "discord.js";
import * as Emotes from "./emotes.json";

export const name: string = "Bulbbot";
export const developers: string[] = ["190160914765316096", "439396770695479297", "193160566334947340"];
export const subDevelopers: string[] = [];
export const version: string = "1.0.0";
export const lib: string = "Discord.JS";

// Configs
export const prefix: string = "!";
export const embedColor: ColorResolvable = "#5865F2";
export const massCommandSleep: number = 850;

// pm2 configs
export const pm2Name: string = "bulbbot";

// Client
export const tag: string = "Bulbbot#1439";
export const id: Snowflake = "868821693571932191";
export const activityName: string = "the light shine";
export const type: ActivityType = "WATCHING";
export const status: PresenceStatusData = "online";
export const supportInvite: string = "https://bulbbot.mrphilip.xyz/discord";
export const botInvite: string = "https://bulbbot.mrphilip.xyz/invite";

// Server
export const prometheusHost: string = "localhost";
export const prometheusPort: number = 7070;

// Logs
export const botDM: Snowflake = "822864336028565534";
export const invite: Snowflake = "822864350603640842";
export const error: Snowflake = "822864327303757874";
export const debug: Snowflake = "822864498251005952";
export const translation: Snowflake = "820689105854660699";

export const translatorEmojis: Record<string, string> = {
	emote_warn: Emotes.actions.WARN,
	emote_lock: Emotes.other.LOCK,
	emote_fail: Emotes.other.FAIL,
	emote_wrench: Emotes.actions.WRENCH,
	emote_github: Emotes.other.GITHUB,
	emote_owner: Emotes.other.GUILD_OWNER,
	emote_online: Emotes.status.ONLINE,
	emote_idle: Emotes.status.IDLE,
	emote_dnd: Emotes.status.DND,
	emote_offline: Emotes.status.OFFLINE,
	emote_loading: Emotes.other.LOADING,
	emote_join: Emotes.other.JOIN,
	emote_leave: Emotes.other.LEAVE,
	emote_success: Emotes.other.SUCCESS,
	emote_trash: Emotes.other.TRASH,
	emote_edit: Emotes.other.EDIT,
	emote_add: Emotes.other.ADD,
	emote_remove: Emotes.other.REMOVE,

	emote_ban: Emotes.actions.BAN,
	emote_kick: Emotes.actions.KICK,
	emote_unban: Emotes.actions.UNBAN,
	emote_mute: Emotes.actions.MUTE,
};

export const translatorConfig: Record<string, any> = {
	interpolation: {
		escapeValue: false,
	},
};