/**
 * Jeu de la vie de Conway sur une grille torique.
 *
 * « Aina » signifie « la vie » en malgache : cet automate cellulaire est la
 * signature du site. Le moteur garde la génération précédente et l'âge de
 * chaque cellule pour que le rendu puisse animer naissances et disparitions.
 */
export class Life {
  readonly cols: number;
  readonly rows: number;
  /** Génération courante : 1 = vivante. */
  cur: Uint8Array;
  /** Génération précédente, pour interpoler le rendu. */
  prev: Uint8Array;
  /** Nombre de générations vécues par chaque cellule. */
  age: Uint16Array;
  /** Rémanence laissée par une cellule qui vient de mourir (1 → 0). */
  heat: Float32Array;
  generation = 0;
  population = 0;
  private next: Uint8Array;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    const size = cols * rows;
    this.cur = new Uint8Array(size);
    this.prev = new Uint8Array(size);
    this.next = new Uint8Array(size);
    this.age = new Uint16Array(size);
    this.heat = new Float32Array(size);
  }

  get density(): number {
    return this.population / (this.cols * this.rows);
  }

  /** Calcule la génération suivante (règle B3/S23). */
  step(): void {
    const {cols, rows, cur, next} = this;
    let population = 0;

    for (let y = 0; y < rows; y++) {
      const up = (y === 0 ? rows - 1 : y - 1) * cols;
      const mid = y * cols;
      const down = (y === rows - 1 ? 0 : y + 1) * cols;
      for (let x = 0; x < cols; x++) {
        const l = x === 0 ? cols - 1 : x - 1;
        const r = x === cols - 1 ? 0 : x + 1;
        const neighbours =
          cur[up + l] + cur[up + x] + cur[up + r] +
          cur[mid + l] + cur[mid + r] +
          cur[down + l] + cur[down + x] + cur[down + r];
        const alive = neighbours === 3 || (cur[mid + x] === 1 && neighbours === 2) ? 1 : 0;
        next[mid + x] = alive;
        population += alive;
      }
    }

    const recycled = this.prev;
    this.prev = this.cur;
    this.cur = this.next;
    this.next = recycled;

    const {age, heat, prev} = this;
    const now = this.cur;
    for (let i = 0; i < now.length; i++) {
      if (now[i]) {
        if (age[i] < 65535) age[i]++;
      } else {
        if (prev[i]) heat[i] = 1;
        age[i] = 0;
      }
    }

    this.population = population;
    this.generation++;
  }

  /** Donne vie à une cellule (coordonnées repliées sur la grille). */
  spawn(x: number, y: number): void {
    const cx = ((x % this.cols) + this.cols) % this.cols;
    const cy = ((y % this.rows) + this.rows) % this.rows;
    const index = cy * this.cols + cx;
    if (!this.cur[index]) {
      this.cur[index] = 1;
      this.age[index] = 0;
      this.population++;
    }
  }

  /** Sème un nuage aléatoire de cellules autour d'un point. */
  soup(cx: number, cy: number, radius: number, density: number): void {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius && Math.random() < density) this.spawn(cx + dx, cy + dy);
      }
    }
  }

  /** Lance un planeur, la plus petite structure qui se déplace toute seule. */
  glider(x: number, y: number, flipX: boolean, flipY: boolean): void {
    const shape = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (const [dx, dy] of shape) this.spawn(x + (flipX ? 2 - dx : dx), y + (flipY ? 2 - dy : dy));
  }

  /** Fige l'état courant comme s'il avait toujours été là (pas d'animation de naissance). */
  settle(): void {
    this.prev.set(this.cur);
  }
}
