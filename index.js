// import { Client as NotionClient } from "@notionhq/client"

const { Client: NotionClient, LogLevel } = require( '@notionhq/client' )
const { Client, GatewayIntentBits } = require( 'discord.js' );
const { token } = require( './config.json' );

const client = new Client( {
      intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
      ]
} );

const notion = new NotionClient( { auth: process.env.NOTION_KEY, logLevel: LogLevel.DEBUG, } )
const databaseId = process.env.NOTION_DATABASE_ID


const request = require( 'request' );

const options = {
      method: 'POST',
      url: 'https://api.notion.com/v1/databases/e61330c2-d667-4be8-90be-85db92072bb8/query',
      headers: {
            Accept: 'application/json',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
            Authorization: 'Bearer secret_x5WI6QRHPXK89YNegyShnFtSd43Y1zkrc2B6s2Aj7Fv'
      },
      body: { page_size: 100 },
      json: true
};
console.log( 'berhasil get database' )



async function addItem( text ) {
      try {

            const response = await notion.pages.create( {
                  parent: { database_id: databaseId },
                  properties: {
                        title: {
                              title: [
                                    {
                                          "text": {
                                                "content": text,

                                          },

                                    }
                              ],

                        },
                  },
            } )
            console.log( response )
            console.log( "Success! Entry added." )
           
      } catch ( error ) {
            console.error( error.body )
      }
}

let kalimat = [
      'hello',
      'hai',
      'yo',
      'pakabar',
      'ada apa',
      'yo wassap'
]

client.once( 'ready', () => {
      console.log( 'Ready!' );
      console.log( `Logged in as ${client.user.tag}!` );
} );

client.on( 'messageCreate', ( message ) => {
      

      let index = Math.floor( Math.random() * kalimat.length );
      if ( message.content === 'hai' ) {
            message.reply( kalimat[index] + " " + message.author.username );
      } else if ( message.content === 'ping' ) {
            message.reply( 'pong!' );
      } else if ( message.content === 'server' ) {
            message.reply( `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}` );
      } else if ( message.content === 'user' ) {
            message.reply( `Your tag: ${client.user.tag}\nYour id: ${client.user.id}` );
      } else if ( message.content.includes( '/issue' ) ) {
            const indexOfCommand = message.content.indexOf( ' ' )
            const issue = message.content.substring( indexOfCommand + 1 );
            message.reply( 'Issue has ben created' );

            addItem( issue );
            // addDesc("add desc")
      } else if ( message.content === '/stats' ) {
            // message.reply( bodoh.substring )

            request( options, function ( error, response, body ) {
                  if ( error ) throw new Error( error );
                  const bodys = body
                  const results = []

                  bodys.results.forEach( ( item, index ) => {

                        const total = item.properties.Name.title[0].text.content
                        // console.log( total )
                        results.push( total )
                  } )
                  // console.log( bodys );
                  let issueLists = ''
                  results.reverse().forEach( ( item ) => {
                        issueLists += ' - ' + item + "\n"
                  })
                  message.reply( 'Total issue ada '+ results.length +' : \n' + issueLists)
            } );
      }

} );

client.login( token );