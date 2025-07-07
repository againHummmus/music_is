import api from './axios';

export interface MessageDto {
  id: number;
  dialogueId: number;
  userId: number;
  content: string;
  created_at: string;
  User: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  Track: Track
}

export default class MessageApi {
  static async createMessage({
    userId,
    dialogueId,
    content,
    track
  }: {
    userId: string
    dialogueId: number;
    content?: string;
    track?: any
  }): Promise<MessageDto> {
    const response = await api.post('/messages', { userId, dialogueId, content, track });
    return response.data;
  }

  static async getMessages({
    userId,
    dialogueId,
    limit = 50,
    offset = 0,
    id
  }: {
    userId: string,
    dialogueId: number;
    limit?: number;
    offset?: number;
    id?: any;
  }): Promise<MessageDto[]> {
    const response = await api.get('/messages', {
      params: { userId, dialogueId, limit, offset, id },
    });
    return response.data;
  }

  static async deleteMessage(messageId: number): Promise<{ success: boolean }> {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }
}
