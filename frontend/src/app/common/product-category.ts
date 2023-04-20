export class ProductCategory {

    constructor(
        public id: string,
        public categoryName: string,
        public parent: ProductCategory | null,
        public subcategories: ProductCategory[]
    ) {}
}
