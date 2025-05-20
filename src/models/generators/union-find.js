/*
  1. нет валидации у методов
  2. этот файл должен быть где-то в другом месте
*/

export default class UnionFind {
  #parent = {};
  #rank = {};

  add(elem) {
    const parent = this.#parent;
    const rank = this.#rank;
    parent[elem] = elem;
    rank[elem] = 1;
  }

  find(elem) {
    const parent = this.#parent;
    while (parent[elem] !== elem) {
      const p = parent[elem];
      parent[elem] = parent[p];
      elem = p;
    }
    return elem;
  }

  union(a, b) {
    const parent = this.#parent;
    const rank = this.#rank;
    const arep = this.find(a);
    const brep = this.find(b);

    if (arep === brep) return;

    if (rank[arep] < rank[brep]) {
      parent[arep] = brep;
    } else {
      parent[brep] = arep;

      if (rank[arep] === rank[brep]) rank[arep]++;

      // possible optimization: this.#rank[arep] += Number(this.#rank[arep] === this.#rank[brep]);
      // вместо Number можно использовать | 0
    }
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
