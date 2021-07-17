import { sequelize } from "../database/connection";
import * as Config from "../../Config";
import { Guild, Snowflake } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";
import { AutoModConfiguration } from "../types/AutoModConfiguration";
import { LoggingConfiguration } from "../types/LoggingConfiguration";

export default class {
	async createGuild(guild: Guild): Promise<void> {
		const config = await sequelize.models.guildConfiguration.create({ prefix: Config.prefix });
		const logging = await sequelize.models.guildLogging.create({});
		const automod = await sequelize.models.automod.create({});

		await sequelize.models.guild.create({
			name: guild.name,
			guildId: guild.id,
			guildConfigurationId: config["id"],
			guildLoggingId: logging["id"],
			automodId: automod["id"],
		});
	}

	async deleteGuild(guildID: Snowflake): Promise<void> {
		await sequelize.query('DELETE FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM automods WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "guildLoggings" WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM guilds WHERE "guildId" = $GuildID', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});
	}

	async getConfig(guildID: Snowflake): Promise<Record<string, any>> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async getAutoModConfig(guildID: Snowflake): Promise<AutoModConfiguration> {
		const response: AutoModConfiguration[] = await sequelize.query('SELECT * FROM automods WHERE id = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	/**
	 * @deprecated
	 */
	async getFullGuildConfig(guildId: Snowflake) {
		return await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{ model: sequelize.models.guildConfiguration },
				{ model: sequelize.models.guildLogging },
				//	{ model: sequelize.models.guildOverrideCommands },
				//	{ model: sequelize.models.guildModerationRoles },
			],
		});
	}

	/**
	 * @deprecated
	 */
	async getPrefix(guildId: Snowflake) {
		const response: Record<string, any> = await sequelize.query('SELECT "prefix" FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuilID)', {
			bind: { GuildID: guildId },
			type: QueryTypes.SELECT,
		});

		return response[0]["prefix"];
	}

	async setPrefix(guildId: Snowflake, prefix: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET prefix = $Prefix WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Prefix: prefix, GuildID: guildId },
			type: QueryTypes.UPDATE,
		});
	}

	async getPremium(guildID: Snowflake): Promise<boolean> {
		const response: Record<string, any> = await sequelize.query('SELECT "premiumGuild" FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0]["premiumGuild"];
	}

	async setPremium(guildID: Snowflake, premium: boolean): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "premiumGuild" = $Premium WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Premium: premium, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getMuteRole(guildID: Snowflake): Promise<Snowflake | null> {
		const response: Record<string, any> = await sequelize.query('SELECT "muteRole" FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0]["muteRole"];
	}

	async setMuteRole(guildID: Snowflake, muteRoleID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "muteRole" = $MuteRole WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { MuteRole: muteRoleID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getAutoRole(guildID: Snowflake): Promise<Snowflake | null> {
		const response: Record<string, any> = await sequelize.query('SELECT "autorole" FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0]["muteRole"];
	}

	async setAutoRole(guildID: Snowflake, autoRoleID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "autorole" = $AutoRole WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { AutoRole: autoRoleID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setLanguage(guildID: Snowflake, language: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET language = $Lang WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Lang: language, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getTimezone(guildID: Snowflake): Promise<string> {
		const response: Record<string, any> = await sequelize.query('SELECT timezone FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0]["timezone"];
	}

	async setTimezone(guildID: Snowflake, timezone: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET timezone = $TZ WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { TZ: timezone, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setModAction(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "modAction" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setAutoMod(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET automod = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setMessage(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET message = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setRole(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET role = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setMember(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET member = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setChannel(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET channel = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setInvite(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET invite = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setJoinLeave(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "joinLeave" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setOther(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "other" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getLoggingConfig(guildID: Snowflake): Promise<LoggingConfiguration> {
		const response: LoggingConfiguration[] = await sequelize.query('SELECT * FROM "guildLoggings" WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async enableAutomod(guildID: Snowflake, enabled: boolean): Promise<void> {
		await sequelize.query('UPDATE automods SET enabled = $Enabled WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	async getAllBlacklisted(): Promise<Record<string, any>> {
		const response: Record<string, any> = await sequelize.query("SELECT * FROM blacklists", {});
		return response[0];
	}

	async infoBlacklist(snowflakeId: Snowflake): Promise<Record<string, any>> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM "blacklists" WHERE ("snowflakeId" = $snowflakeId)', {
			bind: { snowflakeId },
			type: QueryTypes.SELECT,
		});
		return response[0];
	}

	async addBlacklist(isGuild: boolean, name: String, snowflakeId: Snowflake, reason: String, developerId: Snowflake): Promise<void> {
		await sequelize.query(
			'INSERT INTO blacklists ("isGuild", name, "snowflakeId", reason, "developerId", "createdAt", "updatedAt") VALUES ($isGuild, $name, $snowflakeId, $reason, $developerId, $createdAt, $updatedAt)',
			{
				bind: {
					isGuild,
					name,
					snowflakeId,
					reason,
					developerId,
					createdAt: moment().format(),
					updatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async removeBlacklist(snowflakeId: Snowflake): Promise<void> {
		await sequelize.query('DELETE FROM "blacklists" WHERE ("snowflakeId" = $snowflakeId)', {
			bind: { snowflakeId },
			type: QueryTypes.DELETE,
		});
	}
}
