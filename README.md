# DiscordEmojiWebhook

A simple Discord bot, allowing users to use emotes in other servers, from a set of whitelist servers. This allows animated emotes as well as regular emotes.






## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Set `TOKEN` to the Discord bot token



## Usage/Examples

Typing an emoji such as `:hello:` will search through whitelisted servers to find the hello emote.
If the emote exists, the message is deleted and replaced with a Webhook generated message containing the actual emote. 

`NOTE: Bot must be a member of whitelisted server`
