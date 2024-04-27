# /v1

The first version of the public API

Note that this API is a work in progress and should be considered a draft.

It is subject to unannounced changes.

## /create

This endpoint will generate a .clap (story only) from a prompt

## /edit

This endpoint will edit a .clap to change models or storyboards

## /export

This endpoint will export a .clap to a static video

parameters:

### f: format (either "mp4" or "webm")

Example:

`POST <some_clap> /api/v1/export?f=webm`

