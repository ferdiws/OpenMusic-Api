class CollaborationsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollabPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId: id } = request.payload;

    await this._playlistsService.verifyPlaylistOwner({ id }, owner);
    await this._service.verifyAvailableUser(request.payload);
    const collaborationId = await this._service.addCollaboration(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollabPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId: id } = request.payload;

    await this._playlistsService.verifyPlaylistOwner({ id }, owner);
    await this._service.deleteCollaboration(request.payload);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
