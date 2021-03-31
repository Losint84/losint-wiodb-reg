const { Discord, MessageEmbed } = require("discord.js")
const { Database } = require("wio.db");
const db = new Database("database");
const Settings = require("../Settings/Settings.json")
module.exports.run = async (client, message, args) => {

  let yetkili = Settings.Roles.Registerer
  if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(cezarolu)) {
    return message.channel.send(new MessageEmbed().setAuthor("Yetersiz Yetki").setDescription(`**\`»\`** Bu komutu kullanabilmek için \`Admin\` veya \`Kayıt Sorumlusu\` yetkisine sahip olman gerekmekte.`).setColor(Settings.Colors.Red)).then(x => x.delete({ timeout: 4000 }));
  }
 
  const embedx = new MessageEmbed().setColor(Settings.Colors.Red).setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
  if (!user) return message.channel.send(embedx.setDescription("Bir Üye Etiketlemen Gerek."))
  let check = await db.has(`isimler.${user.id}`)
  if (check === false) return message.channel.send(embedx.setDescription("Bu üyenin herhangi bir isim verisine ulaşamadım."))

  let fetch = await db.get(`isimler.${user.id}`)
  let isimler = fetch.length > 0 ? fetch.map((value, index) => `**${index + 1}:**\n Yetkili: <@${value.Yetkili}>\n İsim: \`${Settings.ServerSettings.Tag} ${value.İsim} | ${value.yaş}\`\n Rol: <@&${value.Rol}>`).join(`\n\n`) : "Bu üyenin geçmiş isimleri bulunamadı!";

  const embed = new MessageEmbed()
  .setAuthor(user.user.username, user.user.avatarURL({ dynamic: true}))
  .setDescription(`${isimler}`)
  .setColor(Settings.Colors.Magenta)
  .setFooter(`Losint ♥ Raviwen`)
  .setTimestamp()
  message.channel.send(embed)


}

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["isimler", "eski-isimler"]
};

module.exports.help = {
  name: 'isimler'
};