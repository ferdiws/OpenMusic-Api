class PlaylistSongsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongIdPayload(request.payload);
    await this._service.searchSongById(request.payload);
    const { id } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(request.params, id);
    await this._service.addSongToPlaylist(request.params, request.payload, id);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistExist(request.params);
    await this._playlistsService.verifyPlaylistAccess(request.params, credentialId);
    console.log(request.params);
    const playlist = await this._service.getPlaylistById(request.params);
    playlist.songs = await this._service.getPlaylistSongs(request.params);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateSongIdPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(request.params, credentialId);
    const deleteId = await this._service.getDeleteId(request.params, request.payload, credentialId);
    await this._service.deleteSongFromPlaylistById(deleteId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
