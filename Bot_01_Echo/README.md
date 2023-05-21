# Overview

This is a simple Echo Bot that's created following Microsoft [Bot Framework SDK doc for Javascript](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-create-bot?view=azure-bot-service-4.0&tabs=javascript%2Cvs).
 It doesn't have any context of Microsoft Teams. The reason we include it here is to make it clearer
 how it's different from a bot built for Teams in later samples.

To get started, all you need to do is to follow the above mentioned Bot Framework SDK doc.
 However, there are a few concepts and gotchas that might be confusing to someone who's new to Bot development.

## Do I need an Azure subscription and ngrok to develop a bot running on localhost?

No, you don't need either. In fact, if you already registered the Bot in Azure AD,
 and if you test with the [Bot Framework Emulator](https://github.com/microsoft/BotFramework-Emulator/blob/master/README.md)
 also running on localhost, you need to leave the environment variables `MicrosoftAppType`, `MicrosoftAppId` and `MicrosoftAppPassword` empty.
 Otherwise the Emulator will get an authentication error.

## If I expose a public DNS or IP for my Bot endpoint, do I need ngrok?

Theoratically no. However, your endpoint must meet certain requirements:

1. It has to be `https` not `http`.
2. The SSL certificate can't be a self-signed certificate.

If you can't meet these requirements, use `ngrok` to test the bot outside localhost using Web Chat,
 or from a channel such as Microsoft Teams as described below.

## If my bot runs outside of Azure, can I still build it using Microsoft Bot Framework?

Yes, however, it might not be obvious how you register the bot. Assuming you don't have an Azure subscription,
 you can't go to Azure portal to create an Azure Bot Service. But if you go to the [Bot Framework dev portal](https://dev.botframework.com),
 __My bots__, and __Create a bot__, the only option is to create a bot in Azure Bot Service.
 To register a bot outside of Azure, go to this URL directly `https://dev.botframework.com/bots/new`.

Note that you still need Azure AD to register an app for your bot. It's completely fine to have a
 free Azure AD account without an Azure subscription.

Whether you register your bot in the Bot Framework dev portal or by creating an Azure Bot Service, the effect is the same.
 Where your bot actually runs is separate from where it's registered.

## How do I test my bot from outside localhost?

First of all, you need to run `ngrok`, or, expose a publicly reachable `https` endpoint with a publicly trusted certificate.

* If you registered the bot in Azure Bot Service, you can select your bot to [Test in Web Chat](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-troubleshoot-bot-configuration?view=azure-bot-service-4.0#test-in-web-chat) in the Azure portal.
* If you registered the bot in the Bot Framework dev portal, you can select your bot and click on __Test__.
* You can also add Microsoft Teams as a channel to your bot. You can [test the bot in Teams without registering a Teams app](https://learn.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0) in the Azure portal. The Bot Framework dev portal also provides the Teams url if you click on __Get bot embed codes__ for Teams.

## How to run the bot locally?

Go to `/repo_root/Bot_01_Echo`, run `npm start`.
