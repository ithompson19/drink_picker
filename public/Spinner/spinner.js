import Wheel from './wheel.js';
import Display from './display.js';
import Liquors from '../Data/liquors.js';
import Profiles from '../Data/profiles.js';
import Drinks from '../Data/drinks.js';

class Spinner {
    // Private fields
    #profiles;
    #combinations;
    #liquors;
    #display;

    // Public fields
    Liquor;
    Profile;

    #spin = async (event) => {
        const selection = this.#combinations[Math.floor(Math.random() * this.#combinations.length)];
        await Promise.all([this.Liquor.spin(selection.Liquor), this.Profile.spin(selection.Profile)]);
        this.#display.update(selection.Liquor, selection.Profile);
    }

    #createBody = () => {
        const body = document.createElement('div');
        body.classList.add('body');
        return body;
    }

    #createName = (name) => {
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name');
        nameDiv.appendChild(document.createTextNode(name));
        return nameDiv;
    }

    #createWedge = (count, index, name) => {
        const wedge = document.createElement('div');
        wedge.classList.add('wedge');
        wedge.style.cssText = `--i:${index};--count:${count}`;
        wedge.appendChild(this.#createBody());
        wedge.appendChild(this.#createName(name));
        return wedge;
    }

    #createWheel = (wheelId, wedges) => {
        const wheel = document.createElement('div');
        const wedgeCount = Object.entries(wedges).length;
        wheel.id = wheelId;
        const body = this.#createBody();
        for (const [i, wedgeName] of wedges.entries()) {
            body.appendChild(this.#createWedge(wedgeCount, i, wedgeName));
        }
        wheel.appendChild(body);
        return wheel;
    }

    #createSpinButton = () => {
        const spinButton = document.createElement('button');
        spinButton.id = 'spinButton';
        spinButton.onclick = this.#spin;
        const body = this.#createBody();
        body.appendChild(document.createTextNode('Spin'));
        spinButton.appendChild(body);
        return spinButton;
    }

    #createPointer = () => {
        const pointer = document.createElement('div');
        pointer.id = 'pointer';
        return pointer;
    }

    #createSpinner = () => {
        const spinner = document.createElement('div');
        spinner.id = 'spinner';

        const outerWheel = this.#createWheel('outerWheel', this.#profiles);
        this.Profile = new Wheel(outerWheel, this.#profiles);

        const innerWheel = this.#createWheel('innerWheel', this.#liquors);
        this.Liquor = new Wheel(innerWheel, this.#liquors);

        spinner.appendChild(outerWheel);
        spinner.appendChild(innerWheel);
        spinner.appendChild(this.#createSpinButton());
        spinner.appendChild(this.#createPointer());
        return spinner;
    }

    #findCombinations = (drinks) => {
        let combinations = [];
        for (const drink of drinks) {
            for (const liquor of drink.Liquors) {
                for (const profile of drink.Profiles) {
                    if (combinations.findIndex(c => c.Liquor === liquor && c.Profile === profile) === -1) {
                        combinations.push({
                            Liquor: liquor,
                            Profile: profile
                        });
                    }
                }
            }
        }
        return combinations;
    }

    constructor(parent = document.body, drinks = Drinks) {
        this.#liquors = Object.values(Liquors).filter(l => drinks.some(d => d.Liquors.includes(l)));
        this.#profiles = Object.values(Profiles).filter(p => drinks.some(d => d.Profiles.includes(p)));
        this.#combinations = this.#findCombinations(drinks);
        this.#display = new Display(parent, drinks);
        parent.appendChild(this.#createSpinner());
    }
}

export default Spinner;