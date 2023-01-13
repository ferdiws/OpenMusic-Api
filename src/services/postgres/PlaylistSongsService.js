const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ id }, { songId }, credentialId) {
    const newId = nanoid(16);
    const activityId = nanoid(16);

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [newId, id, songId],
    };

    const activitiesQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, NOW()) RETURNING id',
      values: [activityId, id, songId, credentialId, 'add'],
    };

    const result = await this._pool.query(query);
    await this._pool.query(activitiesQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async searchSongById({ songId }) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async getPlaylistById({ id }) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getPlaylistSongs({ id }) {
    const query = {
      text: `SELECT songs.id, title, performer FROM songs
      LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getDeleteId({ id }, { songId }, credentialId) {
    const activityId = nanoid(16);

    const query = {
      text: 'SELECT id FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [id, songId],
    };

    const activitiesQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, NOW()) RETURNING id',
      values: [activityId, id, songId, credentialId, 'delete'],
    };

    const result = await this._pool.query(query);
    await this._pool.query(activitiesQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async deleteSongFromPlaylistById(deleteId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE id = $1 RETURNING id',
      values: [deleteId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
