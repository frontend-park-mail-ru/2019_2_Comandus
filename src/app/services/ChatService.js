import Socket from '@modules/socket';
import { formatDateNum } from '@modules/utils';

const dayInMilliseconds = 1000 * 60 * 60 * 24;

export default class ChatService {
	static initChat(proposalId, userId) {
		Socket.send({
			transaction: 'init',
			chat: { userId: userId, proposalId: proposalId },
		});
	}

	static sendMessage(proposalId, message) {
		Socket.send({
			transaction: 'mes',
			message: { proposalId: proposalId, body: message },
		});
	}

	static formatTime(dateString) {
		const d = new Date(dateString);
		let h = d.getHours();
		let m = d.getMinutes();

		h = formatDateNum(h);
		m = formatDateNum(m);

		return `${h}:${m}`;
	}

	static dateDifference(date1, date2) {
		return Math.floor((date2 - date1) / dayInMilliseconds);
	}
}
