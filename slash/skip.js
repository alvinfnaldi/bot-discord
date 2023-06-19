const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply("There are no songs in the queue");

    const queueNext = queue.tracks
      .slice(0, 1)
      .map((song, i) => {
        return `**Track currently playing : \n${i + 1}.** \`[${
          song.duration
        }]\` ${song.title}`;
      })
      .join("\n");

    const currentSong = queue.current;

    let embed = new MessageEmbed();
    embed.setDescription(`${currentSong.title} has been **skipped!**`),
      embed.setDescription(`\n\n${queueNext}`);

    queue.skip();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
