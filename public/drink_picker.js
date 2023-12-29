import ChristmasDrinks from './Data/christmas_drinks.js';
import Spinner from './Spinner/spinner.js';

const init = () => {
    const spinner = new Spinner(document.body, ChristmasDrinks);
}

init();