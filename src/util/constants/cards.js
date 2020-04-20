

function getCard(id) {

    const cards = {};

cards['1'] =
    {
        'text': 'this is some cool ass dino',
        'name': 'bulbasaur',
        'image': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.kEC9oBgUMnkdcHJNA4be-QHaG8%26pid%3DApi&f=1',
        'rarity': 'epic',

    }
cards['2'] =
    {
        'text': 'even cooler dino',
        'name': 'paul',
        'image': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.O0gRMLwY-Dr_1IZa1xmwngAAAA%26pid%3DApi&f=1',
        'rarity': 'legendary',

    }

    return cards[id];
}
export default getCard