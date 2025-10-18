  require('dotenv').config()
  const mineflayer = require('mineflayer')
  const express = require('express')
  const cors = require('cors')

  // Leggi config da env
  const HOST = process.env.MINECRAFT_HOST || 'localhost'
  const PORT_M = parseInt(process.env.MINECRAFT_PORT || '25565')
  const USERNAME = process.env.MINECRAFT_USERNAME || 'BotName'
  const EMAIL = process.env.MINECRAFT_EMAIL || ''
  const PASSWORD = process.env.MINECRAFT_PASSWORD || ''

  // funzione per creare il bot (gestisce credenziali se presenti)
  function createBot() {
    const options = {
      host: HOST,
      port: PORT_M,
      username: EMAIL ? EMAIL : USERNAME
    }

    // se hai messo password (account premium) la aggiungiamo
    if (PASSWORD) options.password = PASSWORD

    const bot = mineflayer.createBot(options)

    bot.on('spawn', () => {
      console.log('✅ Bot spawn — connesso al server Minecraft')
      bot.chat('Ciao! Sono un bot attivo su Replit.')
    })

    bot.on('chat', (username, message) => {
      if (username === bot.username) return
      console.log(`<${username}> ${message}`)
      // rispondi a "ciao bot"
      if (message.toLowerCase() === 'ciao bot') {
        bot.chat(`Ciao ${username}!`)
      }
    })

    bot.on('kicked', (reason) => console.log('⚠️ Kicked:', reason))
    bot.on('error', (err) => console.error('❌ Bot error:', err))
    bot.on('end', () => {
      console.log('🔁 Bot disconnesso — provo a riconnettermi in 10s')
      setTimeout(createBot, 10000)
    })

    return bot
  }

  // Avvia il bot
  createBot()

  // --- Express server per keepalive e diagnostica ---
  const app = express()
  app.use(cors())

  app.get('/', (req, res) => {
    res.send('Bot Minecraft online — visita /keepalive per il ping')
  })

  app.get('/keepalive', (req, res) => {
    res.send('ok')
  })

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`🌐 Server HTTP in ascolto su porta ${PORT}`))
