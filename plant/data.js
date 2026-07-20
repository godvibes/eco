/* ecoc.app/plant — CharacterProfile records
   One controlled botanical vocabulary that keys the plant, describes it, and draws it.
   Adding a plant = adding a record here. No new code, no new art.
   Every claim carries a sourceId; where we have no cited record, we leave it out. */

export const SOURCES = {
  gbif:   { title: 'GBIF',                       note: 'taxonomic backbone',        url: 'https://www.gbif.org' },
  usda:   { title: 'USDA PLANTS',                note: 'habit, status, wildlife',   url: 'https://plants.usda.gov' },
  lbj:    { title: 'Lady Bird Johnson Wildflower Center', note: 'native plant profiles', url: 'https://www.wildflower.org' },
  fna:    { title: 'Flora of North America',     note: 'morphological descriptions', url: 'http://floranorthamerica.org' },
  fnae:   { title: 'Flora Novae Angliae (Haines, 2011)', note: 'the New England key — cited, never copied', url: 'https://www.nativeplanttrust.org' },
  wotw:   { title: 'Weed of the Week (E. Sherry)', note: 'field notes, Long Island', url: '' }
};

/* Plain-language readings for the locked vocabulary.
   Botanical term -> what a person actually looks for. */
export const TERMS = {
  habit: { forb:'upright herb', branched:'branching herb', shrub:'woody, arching', rosette:'leaves in a ground rosette', mat:'low sprawling mat', creeping:'creeping stems', vine:'climbing', graminoid:'grass-like' },
  duration: { annual:'one season', biennial:'two seasons', perennial:'comes back yearly' },
  heightClass: { short:'ankle height', medium:'knee to waist', tall:'waist high or more' },
  stemColor: { green:'green', red:'red', 'purple-spotted':'purple-spotted', glaucous:'waxy blue-grey', woody:'woody brown' },
  stemSection: { terete:'round', square:'square', ridged:'ridged', winged:'winged' },
  stemSurface: { glabrous:'smooth', pubescent:'hairy', setose:'bristly / prickly', glandular:'sticky-haired' },
  leafArrangement: { alternate:'staggered, one per node', opposite:'in facing pairs', whorled:'in rings', basal:'all at the base' },
  leafType: { simple:'one blade', pinnate:'leaflets along a stalk', palmate:'leaflets from one point', bipinnate:'twice-divided' },
  leafShape: { ovate:'oval', elliptic:'elliptic', lanceolate:'lance-shaped', linear:'narrow', cordate:'heart-shaped', reniform:'kidney-shaped', lobed:'lobed', dissected:'feathery, finely cut' },
  leafMargin: { entire:'smooth-edged', serrate:'saw-toothed', dentate:'toothed', crenate:'scalloped', ciliate:'fringed with hairs', lobed:'lobed' },
  leafSize: { small:'small', medium:'medium', large:'large' },
  symmetry: { actinomorphic:'radial, like a daisy', zygomorphic:'bilateral, like a pea or mint' },
  flowerForm: { capitulum:'a daisy-like head', star5:'5 petals', cross4:'4 petals', campanulate:'bell-shaped', papilionaceous:'pea-shaped', spurred:'spurred, hanging', tubular:'tubular', ligulate:'strap-shaped' },
  inflorescence: { solitary:'single blooms', cyme:'a loose cluster', umbel:'a flat-topped cluster', raceme:'a stalked spike', spike:'a spike', panicle:'a branched spray', capitulum:'a single head' },
  petalColor: { orange:'orange', yellow:'yellow', white:'white', blue:'blue', pink:'pink', purple:'purple', red:'red' },
  flowerCenter: { concolorous:'the same colour throughout', yellow:'a yellow centre', white:'a white eye', dark:'a dark centre' },
  markings: { none:'unmarked', spotted:'spotted', striped:'striped', 'nectar-guides':'with nectar guides' },
  fruitType: { achene:'a dry one-seeded fruit', capsule:'a capsule', berry:'a berry', drupe:'a stone fruit', pome:'an apple-type fruit', legume:'a pod', samara:'a winged key', nutlet:'a nutlet', follicle:'a follicle' }
};

/* Which trait each keying question asks about, in plain language. */
export const QUESTIONS = {
  petalColor:      'What colour are the flowers?',
  flowerForm:      'What shape is a single flower?',
  inflorescence:   'How are the flowers arranged?',
  habit:           'What is the plant’s overall form?',
  leafArrangement: 'How do the leaves sit on the stem?',
  leafShape:       'What shape are the leaves?',
  leafMargin:      'Look at a leaf edge — what is it like?',
  stemColor:       'What colour is the stem?',
  stemSurface:     'Feel the stem — what is the surface like?',
  heightClass:     'How tall is it?',
  leafSize:        'How big are the leaves?',
  flowerCenter:    'What is the centre of the flower like?',
  markings:        'Are the petals marked?'
};

/* Traits the key may ask about, roughly easiest-to-see first. */
export const KEYABLE = [
  'petalColor','flowerForm','habit','inflorescence','leafArrangement',
  'leafShape','leafMargin','stemColor','stemSurface','heightClass','leafSize','flowerCenter','markings'
];

export const SPECIES = [
  {
    id: 'impatiens-capensis',
    common: 'Jewelweed',
    scientific: 'Impatiens capensis',
    authority: 'Meerb.',
    family: 'Balsaminaceae',
    gbifKey: 2891774,
    alsoKnown: ['spotted touch-me-not', 'orange balsam'],
    status: 'native',
    difficulty: 'green',
    essence: 'The remedy that grows where the rash does.',
    habitat: 'Moist, shaded ground — streambanks, floodplains, damp woodland edges.',
    bloomMonths: [7, 8, 9, 10],
    traits: {
      habit: 'forb', duration: 'annual', heightClass: 'tall',
      stemColor: 'green', stemSection: 'terete', stemSurface: 'glabrous',
      leafArrangement: 'alternate', leafType: 'simple', leafShape: 'ovate', leafMargin: 'crenate', leafSize: 'medium',
      symmetry: 'zygomorphic', flowerForm: 'spurred', inflorescence: 'solitary',
      petalColor: 'orange', flowerCenter: 'concolorous', markings: 'spotted',
      fruitType: 'capsule'
    },
    notes: [
      { text: 'Ripe seed capsules burst at a touch, flinging their seeds — hence "touch-me-not".', sourceId: 'fna' },
      { text: 'Rain beads like silver jewels on the water-repellent leaves.', sourceId: 'wotw' }
    ],
    confusedWith: [
      { name: 'Pale jewelweed', scientific: 'Impatiens pallida', tell: 'Its flowers are clear yellow, with no orange spots.', sourceId: 'fna' }
    ],
    uses: [
      { category: 'medicine · folk', text: 'The crushed, juicy stem is a long-standing folk topical for poison-ivy rash and minor skin irritation — it often grows right beside the poison ivy it is said to soothe.', sourceId: 'lbj', caution: true },
      { category: 'wildlife', text: 'Special value to bumblebees and a favourite of ruby-throated hummingbirds; a rich late-season nectar source.', sourceId: 'usda' },
      { category: 'food · folklore', text: 'The ripe seeds are edible and taste faintly of walnut. The epithet capensis — "of the Cape" — came from a mistaken belief it hailed from South Africa.', sourceId: 'wotw' }
    ],
    sourceIds: ['gbif', 'usda', 'lbj', 'fna', 'wotw']
  },

  {
    id: 'lactuca-canadensis',
    common: 'Canada wild lettuce',
    scientific: 'Lactuca canadensis',
    authority: 'L.',
    family: 'Asteraceae',
    gbifKey: null,
    alsoKnown: ['tall lettuce'],
    status: 'native',
    difficulty: 'red',
    essence: 'A roadside giant whose leaves refuse to settle on one shape.',
    habitat: 'Moist, disturbed, sunny ground — field edges, roadsides, clearings.',
    bloomMonths: [7, 8, 9],
    traits: {
      habit: 'branched', duration: 'biennial', heightClass: 'tall',
      stemColor: 'green', stemSection: 'terete', stemSurface: 'glabrous',
      leafArrangement: 'alternate', leafType: 'simple', leafShape: 'lobed', leafMargin: 'entire', leafSize: 'large',
      symmetry: 'actinomorphic', flowerForm: 'capitulum', inflorescence: 'panicle',
      petalColor: 'yellow', flowerCenter: 'yellow', markings: 'none',
      fruitType: 'achene'
    },
    notes: [
      { text: 'Leaf shape varies enormously on a single plant — do not key on one leaf alone.', sourceId: 'fna' },
      { text: 'Broken stems and leaves release a milky white latex.', sourceId: 'wotw' }
    ],
    confusedWith: [
      { name: 'Prickly lettuce', scientific: 'Lactuca serriola', tell: 'A row of small prickles runs along the underside of the leaf midrib.', sourceId: 'fnae' },
      { name: 'Tall blue lettuce', scientific: 'Lactuca biennis', tell: 'Its flowers are blue to lilac, not yellow.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'wildlife', text: 'High food-web value; seeds and foliage feed birds and insects.', sourceId: 'usda' }
    ],
    sourceIds: ['usda', 'fna', 'fnae', 'wotw']
  },

  {
    id: 'achillea-millefolium',
    common: 'Common yarrow',
    scientific: 'Achillea millefolium',
    authority: 'L.',
    family: 'Asteraceae',
    gbifKey: null,
    alsoKnown: ['milfoil', 'soldier’s woundwort'],
    status: 'native',
    difficulty: 'green',
    essence: 'Feathery leaves under a flat white plate of flowers.',
    habitat: 'Dry, open ground — fields, roadsides, lawns.',
    bloomMonths: [6, 7, 8, 9],
    traits: {
      habit: 'forb', duration: 'perennial', heightClass: 'medium',
      stemColor: 'green', stemSection: 'terete', stemSurface: 'pubescent',
      leafArrangement: 'alternate', leafType: 'bipinnate', leafShape: 'dissected', leafMargin: 'entire', leafSize: 'small',
      symmetry: 'actinomorphic', flowerForm: 'capitulum', inflorescence: 'umbel',
      petalColor: 'white', flowerCenter: 'yellow', markings: 'none',
      fruitType: 'achene'
    },
    notes: [
      { text: 'The finely divided, almost fern-like leaves smell aromatic when crushed.', sourceId: 'fna' }
    ],
    confusedWith: [
      { name: 'Wild carrot', scientific: 'Daucus carota', tell: 'Wild carrot’s umbel is lacier and its leaves are carrot-like, not feather-fine; it often has one dark central floret.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'medicine · folk', text: 'Long used in folk practice to staunch bleeding — the genus honours Achilles, said to have carried it for soldiers’ wounds.', sourceId: 'lbj', caution: true },
      { category: 'wildlife', text: 'Draws a wide range of small pollinators over a long season.', sourceId: 'usda' }
    ],
    sourceIds: ['usda', 'lbj', 'fna', 'fnae']
  },

  {
    id: 'taraxacum-officinale',
    common: 'Common dandelion',
    scientific: 'Taraxacum officinale',
    authority: 'F.H. Wigg.',
    family: 'Asteraceae',
    gbifKey: null,
    alsoKnown: ['blowball'],
    status: 'introduced',
    difficulty: 'green',
    essence: 'The one everyone knows, and almost no one looks at.',
    habitat: 'Lawns, roadsides, disturbed ground — nearly everywhere.',
    bloomMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    traits: {
      habit: 'rosette', duration: 'perennial', heightClass: 'short',
      stemColor: 'green', stemSection: 'terete', stemSurface: 'glabrous',
      leafArrangement: 'basal', leafType: 'simple', leafShape: 'lobed', leafMargin: 'dentate', leafSize: 'large',
      symmetry: 'actinomorphic', flowerForm: 'capitulum', inflorescence: 'capitulum',
      petalColor: 'yellow', flowerCenter: 'yellow', markings: 'none',
      fruitType: 'achene'
    },
    notes: [
      { text: 'A single head sits on a hollow, leafless stalk that bleeds milky latex when snapped.', sourceId: 'fna' }
    ],
    confusedWith: [
      { name: 'Cat’s-ear', scientific: 'Hypochaeris radicata', tell: 'Cat’s-ear has hairy leaves and a branched, solid flower stalk; dandelion’s stalk is hollow and unbranched.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'food', text: 'Young leaves are eaten as a bitter green, and the flowers have long been used in country wines.', sourceId: 'lbj' },
      { category: 'wildlife', text: 'An important early-season nectar source when little else is open.', sourceId: 'usda' }
    ],
    sourceIds: ['usda', 'lbj', 'fna', 'fnae']
  },

  {
    id: 'veronica-chamaedrys',
    common: 'Bird’s-eye speedwell',
    scientific: 'Veronica chamaedrys',
    authority: 'L.',
    family: 'Plantaginaceae',
    gbifKey: null,
    alsoKnown: ['germander speedwell'],
    status: 'introduced',
    difficulty: 'amber',
    essence: 'A creeping scatter of small blue eyes in spring grass.',
    habitat: 'Lawns, grassy banks, woodland edges.',
    bloomMonths: [4, 5, 6, 7],
    traits: {
      habit: 'creeping', duration: 'perennial', heightClass: 'short',
      stemColor: 'green', stemSection: 'terete', stemSurface: 'pubescent',
      leafArrangement: 'opposite', leafType: 'simple', leafShape: 'ovate', leafMargin: 'serrate', leafSize: 'small',
      symmetry: 'zygomorphic', flowerForm: 'cross4', inflorescence: 'raceme',
      petalColor: 'blue', flowerCenter: 'white', markings: 'nectar-guides',
      fruitType: 'capsule'
    },
    notes: [
      { text: 'Four blue lobes with a pale eye; the lowest lobe is noticeably narrower than the rest.', sourceId: 'fna' }
    ],
    confusedWith: [
      { name: 'Other speedwells', scientific: 'Veronica spp.', tell: 'Bird’s-eye has two lines of hairs running down opposite sides of the stem.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'wildlife', text: 'An early nectar source for small bees and hoverflies.', sourceId: 'usda' }
    ],
    sourceIds: ['usda', 'fna', 'fnae']
  },

  {
    id: 'euphorbia-maculata',
    common: 'Spotted spurge',
    scientific: 'Euphorbia maculata',
    authority: 'L.',
    family: 'Euphorbiaceae',
    gbifKey: null,
    alsoKnown: ['prostrate spurge'],
    status: 'native',
    difficulty: 'amber',
    essence: 'A red-stemmed mat pressed flat into hot pavement cracks.',
    habitat: 'Sandy, disturbed, sun-baked ground — paths, drives, pavement edges.',
    bloomMonths: [6, 7, 8, 9, 10],
    traits: {
      habit: 'mat', duration: 'annual', heightClass: 'short',
      stemColor: 'red', stemSection: 'terete', stemSurface: 'pubescent',
      leafArrangement: 'opposite', leafType: 'simple', leafShape: 'elliptic', leafMargin: 'serrate', leafSize: 'small',
      symmetry: 'actinomorphic', flowerForm: 'star5', inflorescence: 'cyme',
      petalColor: 'white', flowerCenter: 'concolorous', markings: 'none',
      fruitType: 'capsule'
    },
    notes: [
      { text: 'Leaves usually carry a dark reddish blotch in the middle — the "spot".', sourceId: 'fna' },
      { text: 'Broken stems bleed a milky latex that can irritate skin.', sourceId: 'wotw' }
    ],
    confusedWith: [
      { name: 'Other prostrate spurges', scientific: 'Euphorbia spp.', tell: 'Look for the dark leaf blotch and hairy stems; several relatives are hairless or unspotted.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'caution', text: 'The milky latex is an irritant and can cause contact dermatitis — handle with care and keep it away from eyes.', sourceId: 'wotw', caution: true }
    ],
    sourceIds: ['usda', 'fna', 'fnae', 'wotw']
  },

  {
    id: 'rubus-allegheniensis',
    common: 'Common blackberry',
    scientific: 'Rubus allegheniensis',
    authority: 'Porter',
    family: 'Rosaceae',
    gbifKey: null,
    alsoKnown: ['bramble', 'Allegheny blackberry'],
    status: 'native',
    difficulty: 'amber',
    essence: 'Arching armed canes — the bane of gardeners, the feast of everything else.',
    habitat: 'Thickets, clearings, old fields, woodland edges.',
    bloomMonths: [5, 6, 7],
    traits: {
      habit: 'shrub', duration: 'perennial', heightClass: 'tall',
      stemColor: 'woody', stemSection: 'ridged', stemSurface: 'setose',
      leafArrangement: 'alternate', leafType: 'palmate', leafShape: 'ovate', leafMargin: 'serrate', leafSize: 'medium',
      symmetry: 'actinomorphic', flowerForm: 'star5', inflorescence: 'raceme',
      petalColor: 'white', flowerCenter: 'yellow', markings: 'none',
      fruitType: 'drupe'
    },
    notes: [
      { text: 'Canes are armed with stout prickles and live two years — leafy the first, fruiting the second.', sourceId: 'fna' }
    ],
    confusedWith: [
      { name: 'Black raspberry', scientific: 'Rubus occidentalis', tell: 'Raspberry fruit pulls free of its core leaving a hollow cup; blackberry keeps its core.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'food', text: 'The aggregate fruit is a well-known edible, eaten fresh and preserved.', sourceId: 'lbj' },
      { category: 'wildlife', text: 'Thickets give heavy cover and fruit for birds and mammals.', sourceId: 'usda' }
    ],
    sourceIds: ['usda', 'lbj', 'fna', 'fnae']
  },

  {
    id: 'silene-vulgaris',
    common: 'Bladder campion',
    scientific: 'Silene vulgaris',
    authority: '(Moench) Garcke',
    family: 'Caryophyllaceae',
    gbifKey: null,
    alsoKnown: ['maidenstears'],
    status: 'introduced',
    difficulty: 'green',
    essence: 'White petals over an inflated, veined balloon.',
    habitat: 'Roadsides, field edges, waste ground.',
    bloomMonths: [5, 6, 7, 8],
    traits: {
      habit: 'forb', duration: 'perennial', heightClass: 'medium',
      stemColor: 'glaucous', stemSection: 'terete', stemSurface: 'glabrous',
      leafArrangement: 'opposite', leafType: 'simple', leafShape: 'ovate', leafMargin: 'entire', leafSize: 'medium',
      symmetry: 'actinomorphic', flowerForm: 'star5', inflorescence: 'cyme',
      petalColor: 'white', flowerCenter: 'concolorous', markings: 'none',
      fruitType: 'capsule'
    },
    notes: [
      { text: 'The calyx swells into a papery, net-veined bladder behind each flower — unmistakable once seen.', sourceId: 'fna' }
    ],
    confusedWith: [
      { name: 'White campion', scientific: 'Silene latifolia', tell: 'White campion is softly hairy and sticky; bladder campion is smooth and waxy blue-green.', sourceId: 'fnae' }
    ],
    uses: [
      { category: 'food', text: 'Young shoots are gathered and cooked as a green in parts of the Mediterranean.', sourceId: 'lbj' }
    ],
    sourceIds: ['usda', 'lbj', 'fna', 'fnae']
  }
];
