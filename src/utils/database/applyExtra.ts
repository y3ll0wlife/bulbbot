import { Sequelize } from "sequelize";

export default function (sequelize: Sequelize) {
	const { guild, guildConfiguration, guildLogging, guildModerationRoles, guildOverrideCommands, infraction, tempban, automod, tempmute } = sequelize.models;

	guild.belongsTo(guildConfiguration, {});
	guild.belongsTo(guildLogging, {});

	guild.belongsTo(automod, {});

	guild.hasMany(infraction, {});
	guild.hasMany(guildModerationRoles, {});
	guild.hasMany(guildOverrideCommands, {});

	guild.hasMany(tempban, {});
	guild.hasMany(tempmute, {});
}