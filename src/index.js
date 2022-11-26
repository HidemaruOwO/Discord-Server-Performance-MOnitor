const os = require("os");
const { Client, Intents } = require('discord.js')
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
})

client.once('ready', () => {
  console.log('Ready!')
})

client.on('messageCreate', (message) => {
  if (message.content=="!monitor") {
    const emojis = ["🟢", "🟡", "🔴"];
    var memory = {};
    var cpu = {};
    var payload = {};

    memory.free = os.freemem() / 1024 / 1024 / 1024;
    memory.total = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    memory.used = memory.total - memory.free;
    memory.used = parseFloat(memory.used.toFixed(1))
    memory.percent = 100 - Math.round(memory.free / memory.total * 100);

    cpu.name = os.cpus()[0].model;
    cpu.core = os.cpus().length;

    if (memory.percent < 25) {
      payload.memory = `${emojis[0]} 快適 ${memory.used}GiB`;
    } else if (memory.percent > 25 && memory.percent < 75) {
      payload.memory = `${emojis[1]} 普通 ${memory.used}GiB`;
    } else if (memory.percent > 75) {
      payload.memory = `${emojis[2]} ストレス ${memory.used}GiB`
    }

    function calcCPU() {
      var cpus = os.cpus();
      var total_all = 0;
      var total_idle = 0;

      for (var i = 0, len = cpus.length; i < len; i++) {
        var _cpu = cpus[i], total = 0;

        for (var type in _cpu.times) {
          total += _cpu.times[type];
        }

        total_all += total;
        total_idle += _cpu.times.idle;
      }

      return Math.round(100 * total_idle / total_all);
    }
    cpu.used = 100 - calcCPU();

    if (cpu.used < 25) {
      payload.cpu = `${emojis[0]} 快適 ${cpu.used}%`;
    } else if (cpu.used > 25 && cpu.used < 75) {
      payload.cpu = `${emojis[1]} 普通 ${cpu.used}%`;
    } else if (cpu.used > 75) {
      payload.cpu = `${emojis[2]} ストレス ${cpu.used}%`
    }

    if (payload.memory === undefined) payload.memory = "⚠️測定エラー";
    if (payload.cpu === undefined) payload.cpu = "⚠️測定エラー";
    var embed = {
        title: "Botの状態",
        description: "現在のBotのサーバーの状態です",
        fields: [
          { name: "OS", value: `${os.type()} ${os.release()} ${process.env.PROCESSOR_ARCHITEW6432 || process.arch}` },
          { name: "🧠CPU", value: `Name: ${cpu.name}\nCore: ${cpu.core}\nUsed: ${payload.cpu}` },
          { name: "🪑RAM", value: `Max: ${memory.total}GiB\nUsed: ${payload.memory}` },
          { name: "⚙Nodejs", value: `Node ${process.version} ${process.arch}` }
	]
    };
    message.channel.send({embeds: [embed]})
  }
})

client.login('MTA0NjE0NjUyMDU0Nzg1NjQ2NQ.GIktpz.UCRnKvJ_7Ta9rWNj1RbZT29_D1Xxvm9v88ZWw8')
  .catch(console.error)
