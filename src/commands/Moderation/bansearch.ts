import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Collection, GuildBan, Message, MessageEmbed, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import { embedColor } from "../../Config";

// <3 https://stackoverflow.com/a/36566052
function similarity(s1: any, s2: any) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1: any, s2: any) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Searches the banlist for a user",
			category: "Moderation",
			usage: "<user>",
			examples: ["bansearch @mrphilip", "bansearch 190160914765316096", "bansearch Wumpus"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const SIMILARE_PERCENTAGE = 0.5;
		let query: string = args.join(" ");

		const banList: Collection<string, GuildBan> | undefined = await context.guild?.bans.fetch();
		let list: (GuildBan | undefined)[] | undefined = banList?.map(ban => {
			if (similarity(ban.user.username, query) >= SIMILARE_PERCENTAGE) return ban;
			if (similarity(ban.user.id, query) >= SIMILARE_PERCENTAGE) return ban;
			if (similarity(ban.user.tag, query) >= SIMILARE_PERCENTAGE) return ban;

			return;
		});

		list = list!.filter(n => n);
		list = [...new Set(list)];
		let desc: string[] = [];

		list.forEach(ban => {
			desc.push(`**${ban!.user?.tag}** \`(${ban!.user?.id})\` \`\`\`${ban?.reason}\`\`\``);
		});

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setAuthor(`Query: ${query} | Results: ${list.length}`)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		context.channel.send({ embeds: [embed] });
	}
}
