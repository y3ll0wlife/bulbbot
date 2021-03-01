const RemoveCommandOverride = require("../../../utils/clearance/commands/RemoveCommandOverride");
const RemoveModOverride = require("../../../utils/clearance/user/RemoveModOverride");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];

	if (!["role", "command"].includes(part)) return message.channel.send(await client.bulbutils.translate("override_create_invalid_part"));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name"));

	switch (part) {
		case "role":
			if (!(await RemoveModOverride(message.guild.id, name.replace(NonDigits, ""))))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_role"));
			break;

		case "command":
			if (!(await RemoveCommandOverride(message.guild.id, name)))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_command"));
			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_remove_success"));
};