class Wheel {
    // Constants
    #FULL_ROTATIONS_MIN = 1;
    #FULL_ROTATIONS_MAX = 5;
    #ROTATION_INTERVAL = 2;
    #ACCELERATION_RATE = 0.05;
    #MAX_SPEED = 5;
    #DECELERATION_RATE = 0.02;

    // Private fields
    #wheelElement;
    #availableSelections;
    #rotationAngle;

    spin = async (selection, direct = false) => {
        const index = this.#availableSelections.findIndex(s => s === selection);
        const targetAngle = this.#targetAngle(index);
        const fullRotations = this.#FULL_ROTATIONS_MIN + Math.floor(Math.random() * (1 + this.#FULL_ROTATIONS_MAX - this.#FULL_ROTATIONS_MIN));
        const initialAngle = this.#rotationAngle;

        let fullRotationsLeft = fullRotations;
        let spinRate = this.#ACCELERATION_RATE;
        let phaseStart = initialAngle;

        const phase = async (phaseLength, step) => {

            const rotate = (degrees) => {
                if (this.#rotationAngle + degrees >= 360) {
                    fullRotationsLeft -= 1;
                }
                this.#rotateTo(this.#rotationAngle + degrees);
            }

            let phaseProgress = 0;
            return await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (Math.round(1000 * (phaseProgress + spinRate)) / 1000 >= phaseLength || spinRate <= 0) {
                        this.#rotateTo(phaseStart + phaseLength);
                        clearInterval(interval);
                        phaseStart = (phaseStart + phaseLength) % 360;
                        resolve();
                    }
                    rotate(spinRate);
                    phaseProgress += spinRate;
                    step();
                }, this.#ROTATION_INTERVAL);
            });
        }

        const accelLength = (rate) => {
            return this.#MAX_SPEED * (this.#MAX_SPEED + rate) / rate / 2;
        }

        const sustainLength = () => {
            return fullRotations * 360 + targetAngle - initialAngle - accelLength(this.#ACCELERATION_RATE) - accelLength(this.#DECELERATION_RATE);
        }

        if (direct) {
            return; // fix with buttons
        }

        await phase(accelLength(this.#ACCELERATION_RATE), () => {
            spinRate = spinRate + this.#ACCELERATION_RATE > this.#MAX_SPEED ? this.#MAX_SPEED : spinRate + this.#ACCELERATION_RATE;
        });
        await phase(sustainLength(), () => {});
        await phase(accelLength(this.#DECELERATION_RATE), () => {
            spinRate = spinRate - this.#DECELERATION_RATE < 0 ? 0 : spinRate - this.#DECELERATION_RATE;
        });
    }

    #rotateTo = (degrees) => {
        this.#rotationAngle = degrees;
        this.#rotationAngle %= 360;
        this.#wheelElement.style.transform = `rotate(${this.#rotationAngle}deg)`;
    }

    #targetAngle = (index) => {
        let angle = (180 - (360 * index)) / this.#availableSelections.length;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    constructor(wheelElement, availableSelections) {
        this.#wheelElement = wheelElement;
        this.#availableSelections = availableSelections;
        this.#rotationAngle = 0;
        this.#rotateTo(this.#targetAngle(0));
    }
}

export default Wheel;