# Data migrations

Before doing anything here with Firebase, it's probably a good idea to load up
the Firebase project in question and smack the _Export Data_ button in the top
right.

## Setup

```sh
$ cd bfm/migrations
$ npm install
```

## Deck Image URL

Adds an `imageUrl` property to each deck in Firebase. Chooses the card with the
longest name as the representative image.

### To Run

#### Development

```sh
$ cd bfm/migrations
$ node deck-image-url.js
```

#### Production

```sh
$ cd bfm/migrations
$ env NODE_ENV='production' node deck-image-url.js
```
