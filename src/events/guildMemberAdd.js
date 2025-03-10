const { AttachmentBuilder } = require('discord.js');
const { generateWelcomeImage } = require('../services/welcomeImageService');
const config = require('../config.json');

// Lista de mensagens de boas-vindas
const welcomeMessages = [
    `Olá, {member}! Bem-vindo(a) ao servidor! Esperamos que você se divirta aqui.`,
    `E aí, {member}! Seja bem-vindo(a) ao nosso servidor! Divirta-se!`,
    `Fala, {member}! Que bom ter você aqui. Bem-vindo(a) ao servidor!`,
    `Oi, {member}! Bem-vindo(a) à nossa comunidade! Esperamos que você curta o lugar.`,
    `Hey, {member}! Bem-vindo(a) ao servidor!`,
];

module.exports = {
    name: 'guildMemberAdd', // Evento de entrada de membros
    async execute(member) {
        // Pega o canal de boas-vindas
        const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);

        if (!welcomeChannel) {
            console.error('Canal de boas-vindas não encontrado. Verifique o ID no config.json.');
            return;
        }

        try {
            // Gera a imagem de boas-vindas
            const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
            const displayName = member.displayName;
            const memberCount = member.guild.memberCount;
            const buffer = await generateWelcomeImage(avatarURL, displayName, memberCount);

            // Cria o anexo com a imagem
            const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });

            // Escolhe uma mensagem aleatória e substitui o placeholder
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            const welcomeMessage = randomMessage.replace('{member}', member.toString());

            // Envia a mensagem com a imagem
            await welcomeChannel.send({
                content: welcomeMessage,
                files: [attachment],
            });
        } catch (error) {
            console.error('Erro ao processar a imagem de boas-vindas:', error);
        }
    },
};