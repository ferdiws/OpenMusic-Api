const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name FROM playlists LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async getSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, title, performer FROM songs LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = PlaylistSongsService;
