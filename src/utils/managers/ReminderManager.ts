import { sequelize } from "../database/connection";
import { Snowflake } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	public async createReminder(reason: string, expireTime: number, userId: Snowflake, channelId: Snowflake, messageId: Snowflake): Promise<any> {
		const response: any = await sequelize.query(
			'INSERT INTO reminds (reason, "expireTime", "userId", "channelId", "messageId", "createdAt", "updatedAt" ) VALUES ($Reason, $ExpireTime, $UserId, $ChannelId, $MessageId, $CreatedAt, $UpdatedAt) RETURNING *;',
			{
				bind: {
					Reason: reason,
					ExpireTime: expireTime,
					UserId: userId,
					ChannelId: channelId,
					MessageId: messageId,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);

		return response[0][0];
	}

	public async getReminder(id: number): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "id" = $Id', {
			bind: { Id: id },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	public async deleteUserReminder(id: number, userId: Snowflake): Promise<boolean> {
		let response: Record<string, any>;

		try {
			response = await sequelize.query('SELECT * FROM reminds WHERE "id" = $Id AND "userId" = $UserId', {
				bind: { Id: id, UserId: userId },
				type: QueryTypes.SELECT,
			});
		} catch (_) {
			response = [];
		}

		if (response.length === 0) return false;

		await sequelize.query('DELETE FROM reminds WHERE "id" = $Id AND "userId" = $UserId', {
			bind: {
				Id: id,
				UserId: userId,
			},
			type: QueryTypes.DELETE,
		});

		return true;
	}

	public async deleteReminder(id: number): Promise<void> {
		await sequelize.query('DELETE FROM reminds WHERE "id" = $Id', {
			bind: {
				Id: id,
			},
			type: QueryTypes.DELETE,
		});
	}
	public async listUserReminders(userId: Snowflake): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "userId" = $UserId LIMIT 10', {
			bind: {
				UserId: userId,
			},
			type: QueryTypes.SELECT,
		});

		return response;
	}

	public async getAllReminders(): Promise<any> {
		const reminders: Record<string, any> = await sequelize.query("SELECT * FROM reminds", {
			type: QueryTypes.SELECT,
		});

		return reminders;
	}
}
