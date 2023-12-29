class Display {
    #drinks;
    #selectedDrinks;
    #parentElement;

    update = (liquor, profile) => {
        this.#getDrinks(liquor, profile);
        this.#createDisplay();
    }

    #getDrinks = (liquor, profile) => {
        if (!liquor && !profile) {
            this.#selectedDrinks = [];
            return;
        }
        this.#selectedDrinks = this.#drinks.filter(d => d.Liquors.includes(liquor) && d.Profiles.includes(profile));
    }

    #createDrinkName = (name) => {
        const drinkName = document.createElement('div');
        drinkName.classList.add('name');
        drinkName.appendChild(document.createTextNode(name));
        return drinkName;
    }

    #createDrinkIngredient = (ingredient) => {
        const drinkIngredient = document.createElement('li');
        drinkIngredient.classList.add('ingredient');
        drinkIngredient.appendChild(document.createTextNode(ingredient));
        return drinkIngredient;
    }

    #createIngredientList = (ingredients) => {
        const drinkIngredients = document.createElement('ul');
        drinkIngredients.classList.add('ingredients');
        for (const ingredient of ingredients) {
            drinkIngredients.appendChild(this.#createDrinkIngredient(ingredient));
        }
        return drinkIngredients;
    }

    #createDrink = (drink) => {
        const drinkElement = document.createElement('div');
        drinkElement.classList.add('drink');
        drinkElement.appendChild(this.#createDrinkName(drink.Name));
        drinkElement.appendChild(this.#createIngredientList(drink.Ingredients));
        return drinkElement;
    }

    #createDrinks = () => {
        const drinks = document.createElement('div');
        drinks.id = 'drinks';
        for (const drink of this.#selectedDrinks) {
            drinks.appendChild(this.#createDrink(drink));
        }
        return drinks;
    }
    
    #createDisplay = () => {
        const display = document.createElement('div');
        display.id = 'display';
        display.appendChild(this.#createDrinks());
        const oldDisplay = document.getElementById('display');
        if (oldDisplay) {
            this.#parentElement.replaceChild(display, oldDisplay);
        } else {
            this.#parentElement.appendChild(display);
        }
    }

    constructor(parent, drinks) {
        this.#drinks = drinks;
        this.#selectedDrinks = [];
        this.#parentElement = parent;
        this.#createDisplay();
    }
}

export default Display;