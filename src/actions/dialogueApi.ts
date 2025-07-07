import api from './axios';

export default class DialogueApi {

  static async createDialogue({userId, otherUserId}:{userId: string, otherUserId: string}): Promise<{
    dialogueId: number;
    isNew: boolean;
  }> {
    const response = await api.post('/dialogues', { userId, otherUserId });
    return response.data;
  }

  static async getUserDialogues({userId}:{userId: string}): Promise<
    Array<any>
  > {
    const response = await api.get(`/dialogues/${userId}`,);
    return response.data;
  }

  static async getParticipants(dialogueId: number): Promise<
    Array<{
      userId: number;
      is_creator: boolean;
      User: { id: number; username: string; avatar_url?: string };
    }>
  > {
    const response = await api.get('/dialogues/participants', { params: { dialogueId } });
    return response.data;
  }
}
