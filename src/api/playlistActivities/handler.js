class ActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    this.getActivities = this.getActivities.bind(this);
  }

  async getActivities(request, h) {
    const { id: owner } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(request.params, owner);
    const { id: playlistId } = request.params;
    const activities = await this._service.getActivities(request.params);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ActivitiesHandler;
