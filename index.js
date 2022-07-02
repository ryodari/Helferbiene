/**
 * @type {import('discord-api-types/v10').ActivityType}
 */
require('dotenv').config()

const Query = require('minecraft-query')
const { Client, GatewayIntentBits, ActivityFlags } = require('discord.js')

const discordClient = new Client({
  intents: [256]
})

const mcServer = new Query({
  host: process.env.MC_HOST,
  port: process.env.MC_PORT
})

/**
 * Returns the number of players which are currently connected to the minecraft server
 */
async function getPlayerCount() {
  try {
    const { online_players } = await mcServer.basicStat()
    console.debug(`${online_players} player(s) online`)
    return Number(online_players) || 0
  } catch (e) {
    console.error(e)
  }

  return 0
}

/**
 * Builds a string with the player count.
 * Example: "One player online",
 * ""
 * @param playerCount Number of players
 * @returns string
 */
function getPlayerCountString(playerCount) {
  if (playerCount === 1) {
    return `1 player online`
  } else if (playerCount > 1) {
    return `${playerCount} players online`
  }

  return `No one online :(`
}

/**
 * Sets an activity for discord
 */
async function main() {
  const playerCount = await getPlayerCount()

  const str = getPlayerCountString(playerCount)
  console.log(str)
  try {
    console.log('Updating discord activity')
    await discordClient.user.setActivity(str, {
      type: 'WATCHING'
    })
    console.log('Updated discord activity successfully')
  } catch (e) {
    console.err(e)
  }
}


discordClient.on('ready', () => {
  setInterval(main, 5000)
  main()
})


// Login
discordClient.login(process.env.DISCORD_TOKEN)

