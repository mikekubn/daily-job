const pt = require('puppeteer');

const allOffers = [
    'Aminess Bellevue Casa',
    'MARKO POLO Hotel by Aminess',
    'Holiday Resort ANTONIJA,OLIVA,TRITON',
    'Hotel MARINA',
    'Hotel BLUESUN ALGA',
    'Hotel MEDITERAN PLAVA LAGUNA',
    'Hotel HORIZONT',
    'Vila TOMISLAV',
    'Hotel ZORNA PLAVA LAGUNA',
    'Hotel OMORIKA',
    'BAYSIDE PARK & FONTANA RESORT',
    'MORENIA all inclusive RESORT',
    'Hotel PINIJA',
    'Orsan Hotel by Aminess',
    'Apartmány AMARIN',
    'Hotel ADRIA',
    'SUNNY BAŠKA HOTEL',
    'LOPAR SUNNY HOTEL',
    'Hotel ZORA',
    'Penzion MARIS',
    'Apartmány VILLAS RUBIN',
    'Promajna Sunny RESORT',
    'Hotel MEDENA',
    'Pavilony SLAVEN',
    'Depandance ALEM ',
    'Hotel FARAON',
    'Hotel BRZET',
    'Hotel PLAVI PLAVA LAGUNA',
    'Hotel DELFIN PLAVA LAGUNA',
    'Apartmány ZATON HOLIDAY RESORT',
    'Hotel AMINESS VEYA',
    'Aminess Bellevue Hotel',
    'AMINESS LIŠANJ FAMILY HOTEL',
    'LA LUNA HOTEL',
    'Naturist Park KOVERSADA',
    'Apartmány URLIĆ',
    'Mobilní domky CAMPING PAKLENICA'
];


const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const isCI = process.env.CI === 'true';
pt.launch({
    args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
  }).then(async (browser) => {
    const page = await browser.newPage();

    await page.goto('https://www.chorvatsko.cz/', { waitUntil: 'domcontentloaded' });
    await page.setViewport({ width: 1080, height: 1024 });
    const targetElement = await page.$('#destinations');
    await targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const selectedOffers = getRandomItems(allOffers, 5);
    console.log('selectedOffers', selectedOffers);

    for (const offer of selectedOffers) {
        const selector = `[data-test="${offer}"]`;
        console.log('Selector offer', offer);
    
        await page.waitForSelector(selector, { visible: true });
    
        const [newPage] = await Promise.all([
            new Promise(resolve => {
                browser.once('targetcreated', async target => {
                    const page = await target.page();
                    await page.waitForNavigation({ waitUntil: 'load' }).catch(() => {});
                    resolve(page);
                });
            }),
            page.click(selector)
        ]);
    
        await newPage.close();
    }

    console.log('Close job!')
    await browser.close();
});