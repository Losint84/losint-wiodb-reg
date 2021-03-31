const { Discord, MessageEmbed } = require("discord.js")
const { Database } = require("wio.db");
const db = new Database("database");
const Settings = require("../Settings/Settings.json")
exports.run = async(client, message, args) => {
    let yetkili = Settings.Roles.Registerer
    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(yetkili)) return message.channel.send(new MessageEmbed().setAuthor("Yetersiz Yetki").setDescription(`**\`»\`** Bu komutu kullanabilmek için \`Admin\` veya \`Kayıt Sorumlusu\` yetkisine sahip olman gerekmekte.`).setColor(Settings.Colors.Red)).then(x => x.delete({ timeout: 6500 }));
  
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    if (!user) return message.channel.send(new MessageEmbed().setDescription("Bir Yetkili Etiketlemelisin.").setAuthor("Dikkat", message.author.avatarURL({dynamic:true})))
    let doğrulama = await db.has(`${message.author.id}.toplam`)
    if (doğrulama === false) return message.channel.send(new MessageEmbed().setDescription("Bu Yetkilinin Teyit Bilgisine Ulaşamadım.").setAuthor("Dikkat", message.author.avatarURL({dynamic:true})))
  
    let kadın = await db.get(`${user.id}.kadın`)
    let erkek = await db.get(`${user.id}.erkek`)
    let toplam = await db.get(`${user.id}.toplam`)
  
    const embed = new MessageEmbed()
     .setAuthor(`${user.user.username}'in Teyit Bilgisi`, user.user.avatarURL({ dynamic: true }))
    .setDescription(`Toplam Kaydettiği Kişi: \`${toplam || "0"}\`
    Toplam Kaydettiği Erkek Kişi: \`${erkek || "0"}\`
    Toplam Kaydettiği Kadın Kişi: \`${kadın || "0"}\``)
    .setTimestamp()
    .setColor(Settings.Colors.Gold)
    .setFooter(`Losint ♥ Raviwen`)
    message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["stat", "stats"],
    permLevel: 0
};

exports.help = {
    name: "stat"
}