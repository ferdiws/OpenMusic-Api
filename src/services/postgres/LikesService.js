const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async likeAlbum(userId, { id }) {
    const newId = `likes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [newId, userId, id],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`albums:${id}`);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal ditambahkan');
    }
  }

  async unlikeAlbum(userId, { id }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [id, userId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`albums:${id}`);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal dihapus');
    }
  }

  async check(userId, { id }) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, id],
    };
    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async isAlbumAvailable({ id }) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async getLikeCount({ id }) {
    try {
      const result = await this._cacheService.get(`albums:${id}`);
      const jsonResult = JSON.parse(result);
      const response = {
        like: jsonResult,
        header: 'cache',
      };
      return response;
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);
      const mappedResult = result.rowCount;
      const response = {
        like: mappedResult,
        header: 'no-cache',
      };
      await this._cacheService.set(`albums:${id}`, JSON.stringify(mappedResult));
      return response;
    }
  }
}

module.exports = LikesService;
