class Listener {
  constructor(service, mailSender) {
    this._service = service;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlist = await this._service.getPlaylist(playlistId);
      const songs = await this._service.getSongs(playlistId);
      const content = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs,
        },
      };
      await this._mailSender.sendEmail(targetEmail, JSON.stringify(content));
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
