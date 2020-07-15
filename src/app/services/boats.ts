export type Boat = {
  name: string,
  code: string,
  use: 'any' | 'competition' | 'youth' | 'none',
  users: number,
  type: 'scull' | 'sweep',
  steer: boolean,
  permissions: {
    scull: number,
    sweep: number,
    steer: number,
  }
};

export const boats: Boat[] = [
  {
    name: 'Aalscholver',
    code: '2x',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Alk',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Barbeel',
    code: '1x',
    use: 'none',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Barracuda',
    code: '1x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Bokje',
    code: 'C1x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Brasem',
    code: '1x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Buizerd',
    code: '4x+',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'C-Arend',
    code: 'C4x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Carassius Ciuratus',
    code: '1x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Casarca',
    code: '1x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'de 100 halen',
    code: '4x+',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Dodaars',
    code: 'C2+',
    use: 'any',
    permissions: {scull: 0, sweep: 1, steer: 1},
    users: 2,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Eveline',
    code: 'W2x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 1},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Frodo',
    code: '1x',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Fugo',
    code: '1x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Gans',
    code: 'C4+',
    use: 'any',
    permissions: {scull: 0, sweep: 1, steer: 2},
    users: 4,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Geep',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Giebel',
    code: '1x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Griend',
    code: '1x',
    use: 'youth',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Gudsekop',
    code: 'C4x+',
    use: 'youth',
    permissions: {scull: 1, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Harder',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Havik',
    code: '2-',
    use: 'any',
    permissions: {scull: 0, sweep: 3, steer: 3},
    users: 2,
    type: 'sweep',
    steer: false
  },
  {
    name: 'Ibis',
    code: '8+',
    use: 'any',
    permissions: {scull: 0, sweep: 2, steer: 3},
    users: 8,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Ijsvogel',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Jager',
    code: '2x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Kiekendief',
    code: '4x+',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Kievit',
    code: 'C2x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Klauwier',
    code: '2x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Koi',
    code: '1x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Kraanvogel',
    code: 'C4x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Kwak',
    code: 'W2x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 1},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Kwikstaart',
    code: '2x',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Lepelaar',
    code: 'C4x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Meermin',
    code: '1x',
    use: 'none',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Meerval',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Narwal',
    code: '1x',
    use: 'youth',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Oehoe',
    code: '4x+',
    use: 'none',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Orka',
    code: '1x',
    use: 'youth',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Parelduiker',
    code: 'C4x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: false
  },
  {
    name: 'Pellikaan',
    code: 'C1x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Pelser',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Poon',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Putter',
    code: '2x',
    use: 'any',
    permissions: {scull: 3, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Ral',
    code: 'C1x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Roerdomp',
    code: 'W2x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 1},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Ruiter',
    code: '2x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Rus-roeiboot',
    code: '4-',
    use: 'any',
    permissions: {scull: 0, sweep: 3, steer: 0},
    users: 4,
    type: 'sweep',
    steer: false
  },
  {
    name: 'Serpeling',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Slechtvalk',
    code: '4x+',
    use: 'competition',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Smelleken',
    code: '2x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Smient',
    code: 'C1x',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Sperwer',
    code: '4+',
    use: 'any',
    permissions: {scull: 0, sweep: 2, steer: 3},
    users: 4,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Steur',
    code: '1x',
    use: 'any',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Stormvogel',
    code: '2x',
    use: 'any',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Suzanne',
    code: '1x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Taling',
    code: 'C2x+',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 2},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Topper',
    code: '2x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'VolM8cht',
    code: '8+',
    use: 'competition',
    permissions: {scull: 0, sweep: 2, steer: 3},
    users: 8,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Vondeling',
    code: 'W1x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 1},
    users: 1,
    type: 'scull',
    steer: true
  },
  {
    name: 'Waterhoen',
    code: 'C2x+',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 2},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Wespendief',
    code: '8+',
    use: 'competition',
    permissions: {scull: 0, sweep: 3, steer: 3},
    users: 8,
    type: 'sweep',
    steer: true
  },
  {
    name: 'Wouw',
    code: '4x+',
    use: 'competition',
    permissions: {scull: 3, sweep: 0, steer: 3},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Zaagbek',
    code: 'C2x+',
    use: 'any',
    permissions: {scull: 2, sweep: 0, steer: 2},
    users: 2,
    type: 'scull',
    steer: true
  },
  {
    name: 'Zwaan',
    code: 'C4x+',
    use: 'any',
    permissions: {scull: 1, sweep: 0, steer: 2},
    users: 4,
    type: 'scull',
    steer: true
  },
  {
    name: 'Zwaardvis',
    code: '1x',
    use: 'youth',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  },
  {
    name: 'Zwaluw',
    code: '2x',
    use: 'competition',
    permissions: {scull: 4, sweep: 0, steer: 3},
    users: 2,
    type: 'scull',
    steer: false
  },
  {
    name: 'Zwitserleven',
    code: '1x',
    use: 'none',
    permissions: {scull: 0, sweep: 0, steer: 0},
    users: 1,
    type: 'scull',
    steer: false
  }
];
