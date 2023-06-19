const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete tracks")
    .addNumberOption((option) =>
      option
        .setName("tracknumber")
        .setDescription("The track to delete to")
        .setMinValue(1)
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply("There are no songs in the queue");

    const title = queue.tracks.map((song, i) => {
      return `\`[${i + 1}. ${song.title}]\``;
    });

    const trackNum = interaction.options.getNumber("track number");
    if (trackNum > queue.tracks.length)
      return await interaction.editReply("Invalid track number");
    queue.remove(trackNum - 1);
    const deleted = title[trackNum - 1];

    await interaction.editReply(`Track number ${deleted} has been deleted`);
  },
};
