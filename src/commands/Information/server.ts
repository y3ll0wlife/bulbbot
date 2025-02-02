import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Emoji, Guild, GuildChannel, MessageEmbed, Role } from "discord.js";
import { embedColor, supportInvite } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful information about the current Guild",
			category: "Information",
			aliases: ["server"],
			clearance: 50,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(context: CommandContext): Promise<void> {
		const guild: Guild | null = context.guild;

		if (!guild) {
			context.channel.send(await this.client.bulbutils.translate("global_error.unknown", undefined, { discord_invite: supportInvite }));
			return;
		}

		let description = "";
		description += await this.client.bulbutils.translate("serverinfo_embed_owner", guild.id, { guild });
		description += await this.client.bulbutils.translate("serverinfo_embed_features", guild.id, { guild_features: this.client.bulbutils.guildFeatures(guild.features) });
		description += await this.client.bulbutils.translate("serverinfo_embed_verification", guild.id, { guild });
		description += await this.client.bulbutils.translate("serverinfo_embed_created", guild.id, { guild_age: Math.floor(guild.createdTimestamp / 1000) });

		let serverStats = "";
		serverStats += await this.client.bulbutils.translate("serverinfo_server_stats_total", guild.id, { guild });

		let channelStats = "";
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_voice", guild.id, {
			// @ts-ignore
			guild_voice: guild.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_VOICE").size,
		}); // @ts-ignore
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_text", guild.id, { guild_text: guild.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_TEXT").size });
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_category", guild.id, {
			// @ts-ignore
			guild_category: guild.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_CATEGORY").size,
		});

		let boosterStats = "";
		boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier", guild.id, { guild });
		boosterStats += await this.client.bulbutils.translate("serverinfo_booster_boosters", guild.id, { guild });
		if (guild.premiumTier === "TIER_1") boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_1", guild.id, { guild });
		else if (guild.premiumTier === "TIER_2") boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_2", guild.id, { guild });
		else if (guild.premiumTier === "TIER_3") boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_3", guild.id, { guild });

		let guildRoles: Role[] = [];
		let guildEmotes: Emoji[] = [];
		let rolesLeft: number = 0;
		let amountOfRoles: number = 0;
		let emotesLeft: number = 0;
		let amountOfEmotes: number = 0;
		guild.roles.cache.forEach(role => {
			amountOfRoles++;
			if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
			else rolesLeft++;
		});
		guild.emojis.cache.forEach(emote => {
			amountOfEmotes++;
			if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
			else emotesLeft++;
		});

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setThumbnail(<string>context.guild?.iconURL({ dynamic: true }))
			.setAuthor(context.guild!?.name, <string>context.guild?.iconURL({ dynamic: true }))
			.addField(await this.client.bulbutils.translate("serverinfo_server_stats", guild.id, {}), serverStats, true)
			.addField(await this.client.bulbutils.translate("serverinfo_channel_stats", guild.id, {}), channelStats, true)
			.addField(await this.client.bulbutils.translate("serverinfo_booster_stats", guild.id, {}), boosterStats, true)
			.addField(
				await this.client.bulbutils.translate("serverinfo_roles", guild.id, { guild_amount_roles: amountOfRoles }),
				`${guildRoles.join(" ")} ${rolesLeft !== 0 ? await this.client.bulbutils.translate("serverinfo_roles_too_many", guild.id, { guild_roles_left: rolesLeft }) : ""}`,
				true,
			)
			.addField(
				await this.client.bulbutils.translate("serverinfo_emotes", guild.id, { guild_amount_emotes: amountOfEmotes }),
				amountOfEmotes !== 0
					? `${guildEmotes.join(" ")} ${emotesLeft !== 0 ? await this.client.bulbutils.translate("serverinfo_emotes_too_many", guild.id, { guild_emotes_left: emotesLeft }) : ""}`
					: await this.client.bulbutils.translate("serverinfo_emotes_none", guild.id, {}),
				true,
			)
			.setDescription(description)
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", guild.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}
