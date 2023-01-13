const { Pool } = require('pg');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities({ id }) {
    const query = {
      text: `SELECT username, title, action, time FROM users, songs, playlist_song_activities WHERE 
        users.id = playlist_song_activities.user_id AND songs.id = playlist_song_activities.song_id
        AND playlist_song_activities.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;
