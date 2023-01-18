class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id } = request.auth.credentials;
    let response;

    await this._service.isAlbumAvailable(request.params);

    const isLike = await this._service.check(id, request.params);
    if (isLike === 0) {
      await this._service.likeAlbum(id, request.params);
      response = h.response({
        status: 'success',
        message: 'Album disukai',
      });
    } else if (isLike === 1) {
      await this._service.unlikeAlbum(id, request.params);
      response = h.response({
        status: 'success',
        message: 'Album batal disukai',
      });
    }
    response.code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    await this._service.isAlbumAvailable(request.params);

    const likes = await this._service.getLikeCount(request.params);
    const response = h.response({
      status: 'success',
      data: {
        likes: likes.like,
      },
    }).header('X-Data-Source', likes.header);
    return response;
  }
}

module.exports = AlbumLikesHandler;
