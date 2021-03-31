const { Discord, MessageEmbed } = require("discord.js")
const { Database } = require("wio.db");
const db = new Database("database");
const Settings = require("../Settings/Settings.json")
exports.run = async(client, message, args) => {
   const dikkat = new MessageEmbed().setColor(Settings.Colors.Red).setAuthor("Dikkat", message.author.avatarURL({dynamic:true}))
   const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0])
   const isim = args[1]
   const yaş = args[2]
   if(!kullanıcı) return message.channel.send(dikkat.setDescription(`${message.author}, Lütfen Bir Kullanıcı Belirt.`)).then(x => x.delete({timeout:4000}))
   if(!isim) return message.channel.send(dikkat.setDescription(`${message.author}, Lütfen Bir İsim Belirt.`)).then(x => x.delete({timeout:4000}))
   if(!yaş) return message.channel.send(dikkat.setDescription(`${message.author}, Lütfen Bir Yaş Belirt.`)).then(x => x.delete({timeout:4000}))
   if(yaş < 13 ) return message.channel.send(dikkat.setDescription(`${message.author}, Kayıt Ediceğin Kişinin Yaşı 13'ten Küçük Olamaz.`)).then(x => x.delete({timeout:4000}))

   kullanıcı.setNickname(`${Settings.ServerSettings.Tag} ${isim} | ${yaş}`)
   kullanıcı.roles.add(Settings.Roles.BoyRole1)
   kullanıcı.roles.add(Settings.Roles.BoyRole2)
   kullanıcı.roles.remove(Settings.Roles.Unregister)

   const toplam = await db.get(`${message.author.id}.toplam`)
   db.add(`${message.author.id}.toplam`, +1)
   db.add(`${message.author.id}.erkek`, +1)

   await db.push(`isimler.${kullanıcı.id}`, {
    Yetkili: message.author.id,
    İsim: isim,
    yaş: yaş,
    Rol: Settings.Roles.BoyRole1
  })
 
  const embed = new MessageEmbed()
  .setAuthor("Kayıt İşlemi Başarılı", message.author.avatarURL({dynamic:true}))
  .setDescription(`${kullanıcı}, ${message.author} Tarafından Kaydedildi :tada:
  Kullanıcıya <@&${Settings.Roles.BoyRole1}>,<@&${Settings.Roles.BoyRole2}> Rolleri Verildi.
  Kullanıcının İsmi \`${Settings.ServerSettings.Tag} ${isim} | ${yaş}\` Olarak Değiştirildi.`)
  .setFooter(`${message.author.username} Yetkilisinin Toplam ${toplam || "1"} Kaydı Oldu.`)
  .setColor(Settings.Colors.Green)
  message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["erkek", "e", "man", "boy"],
    permLevel: 0
};

exports.help = {
    name: "erkek"
}