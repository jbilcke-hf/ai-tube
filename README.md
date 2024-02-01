---
title: AI Tube
header: mini
emoji: 🍿
colorFrom: red
colorTo: red
sdk: docker
pinned: true
app_port: 3000
disable_embedding: false
---

# 🍿 AI Tube

## FAQ

### I don't like having to manually create a Hugging Face Dataset and edit files

There will be a UI to edit them in the future

### How often videos are generated?

There is a script (called the AI Tube Robot - code is also available, see my profile) which checks the Hugging Face platform every 5 minutes for new content.

However, once it starts generating a video, the bot will be kept busy for an hour or so (sometimes more),
and during this time the other videos will wait patiently.

### My video failed to generate! Is it lost?

That's the beauty of the dataset system: as long as you keep your video in your dataset,
and it is not published yet (is not visible on the AI Tube home page), then for the AI Tube Robot it will still be marked as "TODO".

So.. you normally have nothing to do (unless your video config or channel config is really damaged or invalid).

Things should repair themselves automatically at some point,
although it can take a couple of days if the issue is more complex than it looks
(eg. a server is down, there is a bug somewhere, disk is full etc)

### I created a channel, but I don't see it in the list

It can take multiple hours for a channel to be made publicly visible.
This delay will be reduced in the future.

### Videos are taking too long to generate

AI Tube is about generating videos in the background, slowly.

It's the whole concept: to generate multi-minutes videos, with lot of stuff like audio, speech etc
(if you are only interested in generate a 2 to 4 sec silent video, I suggest you use ComfyUI, Automatic1111 stable-diffusion-webui, or RunwayML or Pika Labs if your prefer commercial services).

Moreover, currently there are only a few servers available:

- text to speech: 1 server
- sdxl: multi servers (hugging face cloud inference api)
- stable video diffusion: 1 server
- lavie: 1 server
- hotshot xl: 1 server
- musicgen: 1 server

Which is why sometimes there is a longue queue of videos waiting to be generated, one after one.

If this project become popular or a billionaire comes in and say "hey hugging face let's discuss" then we can expect more resources will be allocated. 

### I don't hear any music in my videos

Could be two reasons, either you are missing a "# Music" paragraph block in your Channel config file or Video config file, or there just was a network/computing issue when your video was generated.

This is all new technology based on research tools, so sometimes they can crash, be out of memory etc.. and not always restart automatically. I'm a team of one and I don't have the resources to look into it right now, but I understand it can be a pain.

### There are large gaps of silence between speech / commentary / dialogue

This is a bug, it will be fixed in the future but I haven't had the opportunity to take a look yet (the cause is that I don't generate the video based on audio length yet).

### Can I clone AI Tube or download it to run on my machine?

AI Tube is designed to be a unique community and platform, not a downloadable tool or app.
Maybe one day there will be an offline version (similar to how my latent browser project worked), but for the moment the focus is on developing it as a community rather than a tool that can be cloned, rebranded, wrapped into ads by someone else etc.

### My video has been generated, but I don't see it anymore

- There might have been a technical constraint which made it necessary to remove your video form the index (if this is the reason, then it will be re-generated).
- Your content may have been flagged (see the guidelines: https://huggingface.co/content-guidelines)

### My content is not illegal and meet HF guidelines, so why don't I see it?

In order to guarantee a high-level of quality on the platform, the most engaging content will be shown in priority, while low-quality content will be hidden. 

The methods to apply this curation will evolve through time (manual, volumetric, algorithmic, AI-based etc).

Here are some tips to ensure the highest level of featuring for your content:

- Create a thumbnail for your channel
- Use engaging or interesting names and titles
- Avoid typos (make sure you finish sentences etc)
- Be original: if you copy someone else's prompt (eg. you only replaced a few words) and your content is burried, try instead to be creative and come up with your own ideas