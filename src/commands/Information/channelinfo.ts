import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import BulbBotClient from "../../structures/BulbBotClient";
import { NonDigits } from "../../utils/Regex";
import { GuildChannel, MessageActionRow, MessageButton, MessageEmbed, ThreadChannel } from "discord.js";
import { embedColor } from "../../Config";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a channel",
			category: "Information",
			usage: "[channel]",
			examples: ["channelinfo", "channelinfo 742095521962786858", "channelinfo #rules"],
			clearance: 50,
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		let channelId: string;
		if (args[0] === undefined) channelId = context.channel.id;
		else channelId = args[0].replace(NonDigits, "");

		const channel: GuildChannel | ThreadChannel | undefined = context.guild?.channels.cache.get(channelId);
		if (!channel?.permissionsFor(context.member!)?.has("VIEW_CHANNEL", true)) {
			context.channel.send(":(");
			return;
		}
		const desc: string[] = [`**ID:** ${channel.id}`, `**Name:** ${channel.name}`, `**Mention:** <#${channel.id}>`];
		channel.parentId !== null ? desc.push(`**Parent:** ${channel.parent?.name}`) : "";
		let buttons: MessageButton[] = [];

		if (channel.isText()) {
			channel.lastMessageId !== null
				? buttons.push(new MessageButton().setStyle("LINK").setLabel("Latest message").setURL(`https://discord.com/channels/${context.guild?.id}/${channel.id}/${channel.lastMessageId}`))
				: null;

			channel.rateLimitPerUser! > 0 ? desc.push(`**Slowmode:** ${channel.rateLimitPerUser} seconds`) : null;
			if (channel.type !== "GUILD_NEWS_THREAD" && channel.type !== "GUILD_PRIVATE_THREAD" && channel.type !== "GUILD_PUBLIC_THREAD") {
				// @ts-ignore
				channel.topic !== null ? desc.push(`**Topic:** ${channel.topic}`) : null; // @ts-ignore
				desc.push(`**NSFW:** ${channel.nsfw}`);
			}
		} else if (channel.isVoice()) {
			desc.push(`**RTC region:** ${channel.rtcRegion === null ? "Automatic" : channel.rtcRegion}`);
			desc.push(`**User limit:** ${channel.userLimit === 0 ? "Unlimited" : channel.userLimit}`);
			desc.push(`**Bitrate:** ${channel.bitrate}`);
		} else if (channel.isThread()) {
			console.log(channel);
		}

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		buttons.length > 0 ? context.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(buttons)] }) : context.channel.send({ embeds: [embed] });
	}
}
