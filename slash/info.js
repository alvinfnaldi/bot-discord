const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays info about the currently playing song"),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply("There are no songs in the queue");

    let bar = queue.createProgressBar({
      queue: false,
      length: 19,
    });

    const song = queue.current;
    const playbackRunning =
      queue.connection.audioResource.audioPlayer._state.playbackDuration; // milliseconds

    const hms = song.duration;
    const a = hms.split(":");
    const length = a.length;

    const toMS = () => {
      if (length == 4) {
        // days to hours
        return a[0] * 86400000 + a[1] * 3600000 + a[2] * 60000 + a[3] * 1000;
      } else if (length == 3) {
        // hours
        return a[0] * 3600000 + a[1] * 60000 + a[2] * 1000;
      } else if (length == 2) {
        // minutes
        return a[0] * 60000 + a[1] * 1000;
      } else if (length == 1) {
        //seconds
        return a[0] * 1000;
      }
    };
    const ms = toMS(); // milliseconds

    const tosec = () => {
      // ms to seconds
      return toMS() / 1000;
    };
    tosec();

    const toHMS = (ms) => {
      let seconds = addZero(Math.floor(ms / 1000));
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = addZero(seconds % 60);
      minutes = addZero(minutes % 60);

      if (hours > 0) {
        return `${hours}:${minutes}:${seconds}`;
      } else if (hours < 1) {
        return `${minutes}:${seconds}`;
      }
    };
    const playback = toHMS(playbackRunning);

    // var timestamp = tosec();

    // const toTime = () => {
    //   let x = setInterval(function () {
    //     var hours = addZero(Math.floor(timestamp / 60 / 60));
    //     var minutes = addZero(Math.floor(timestamp / 60) - hours * 60);
    //     var seconds = addZero(timestamp % 60);

    //     timestamp--;

    //     if (hours > 0) {
    //       console.log(`${hours}:${minutes}:${seconds}`);
    //     } else if (hours < 1) {
    //       console.log(`${minutes}:${seconds}`);
    //     }

    //     if (timestamp < 0) {
    //       console.log("Song Finished");
    //       clearInterval(x);
    //     }
    //   }, 1000);
    // };
    // const countdown = toTime();

    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    const subtract = (ms, playbackRunning) => {
      return toHMS(ms + 1000 - playbackRunning); // youtube length always add 1 second more so yeah
    };
    const difference = subtract(ms, playbackRunning); // calculate remaining time

    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setThumbnail(song.thumbnail)
          .setDescription(
            `Currently Playing [${song.title}](${song.url})\n\n` +
              `${playback} ` +
              bar +
              ` -${difference}`
          ),
      ],
    });
  },
};
