import { loadAllMovements } from '../../common/storage/workout-storage';
import Router from '@system.router';
import { VibratorUtil } from '../../common/utils/vibrator';
import { getMuscles } from '../../common/models/movement-data';

export default {
    data: {
        items: [],
        movementsAlreadySelected: ''
    },

    onInit(){
        loadAllMovements((records) => {
            this.items = records.map((movementName) => {
                return {
                    name: movementName,
                    selected: false,
                    setCount: 1,
                    muscles: getMuscles(movementName).join(', ')
                };
            });
        });

        if (this.movementsAlreadySelected) {
            let movements = JSON.parse(this.movementsAlreadySelected);

            movements.forEach((movement) => {
                this.items.map((item) => {
                    if (item.name === movement.name) {
                        item.selected = true;
                        item.setCount = movement.setCount;
                    }
                });
            });
        }

    },

    getSelectedItems() {
        return this.items
            .filter(item => item.selected);
    },

    toggleMovement(index) {
        const item = this.items[index];
        item.selected = !item.selected;
        this.items = this.items.slice();
    },

    select(){
        VibratorUtil.vibrateLong();
        Router.replace({
            uri: 'pages/custom-routine/custom-routine',
            params: {
                selectedMovements: JSON.stringify(this.getSelectedItems())
            }
        });
    },

    onSwipe(e){
        if(e.direction === 'right'){
            Router.replace({
                uri: 'pages/custom-routine/custom-routine'
            });
        }
    }
}