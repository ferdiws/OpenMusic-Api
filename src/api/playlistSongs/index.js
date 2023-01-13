const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(service, playlistsService, validator);
    server.route(routes(playlistSongsHandler));
  },
};
