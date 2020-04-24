export class Cocktail {
    constructor(json) {
        this.name = json.strDrink;
        this.category = json.strCategory;
        this.isAlcholic = json.strAlcohlic;
        this.glassType = json.strGlass;
        this.image = json.strDrinkThumb;
        this.id = json.idDrink;
        this.instructions = json.strInstructions;
        this.ingredients = [];
        this.ingredients.push({ ingredient: json.strIngredient1, measurement: json.strMeasure1 });
        this.ingredients.push({ ingredient: json.strIngredient2, measurement: json.strMeasure2 });
        this.ingredients.push({ ingredient: json.strIngredient3, measurement: json.strMeasure3 });
        this.ingredients.push({ ingredient: json.strIngredient4, measurement: json.strMeasure4 });
        this.ingredients.push({ ingredient: json.strIngredient5, measurement: json.strMeasure5 });
        this.ingredients.push({ ingredient: json.strIngredient6, measurement: json.strMeasure6 });
        this.ingredients.push({ ingredient: json.strIngredient7, measurement: json.strMeasure7 });
        this.ingredients.push({ ingredient: json.strIngredient8, measurement: json.strMeasure8 });
        this.ingredients.push({ ingredient: json.strIngredient9, measurement: json.strMeasure9 });
        this.ingredients.push({ ingredient: json.strIngredient10, measurement: json.strMeasure10 });
        this.ingredients.push({ ingredient: json.strIngredient11, measurement: json.strMeasure11 });
        this.ingredients.push({ ingredient: json.strIngredient12, measurement: json.strMeasure12 });
        this.ingredients.push({ ingredient: json.strIngredient13, measurement: json.strMeasure13 });
        this.ingredients.push({ ingredient: json.strIngredient14, measurement: json.strMeasure14 });
        this.ingredients.push({ ingredient: json.strIngredient15, measurement: json.strMeasure15 });


    }



    getIngredients() {
        let str = '';
        for (let i = 0; i < this.ingredients.length; i++) {

            if (this.ingredients[i].measurement != null && this.ingredients[i].measurement.length > 0) {
                str += `${this.ingredients[i].measurement}`;
            }

            if (this.ingredients[i].ingredient != null && this.ingredients[i].ingredient.length > 0) {
                str += ` ${this.ingredients[i].ingredient}\n`;
            } else {
                break;
            }
        }
        return str;
    }

    getGlassString() {
        return `You would typically enjoy this drink in a ${this.glassType.toLowerCase()}`.replace('\n','')
    }

    getCategoryString() {
        return `Category: ${this.category}`.replace('\n','');
    }



}