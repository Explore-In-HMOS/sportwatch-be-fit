import Router from '@system.router';
import { VibratorUtil } from '../../common/utils/vibrator';

export default {
    data: {
        items: [],
        selectedMovements: '',
        popupVisible: false
    },

    onInit() {

        if (this.selectedMovements) {
            let movements = JSON.parse(this.selectedMovements);
            this.items = movements.map((movement) => {
                return {
                    name: movement.name,
                    selected: true,
                    setCount: movement.setCount
                };
            });
        }
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            Router.replace({ uri: 'pages/index/index' });
        }
    },

    getSelectedItems() {
        return this.items
            .filter(item => item.selected);
    },

    addMovement() {
        Router.replace(
            {
                uri: 'pages/routine-selection/routine-selection',
                params: {
                    movementsAlreadySelected: JSON.stringify(this.getSelectedItems())
                }
            }
        );
    },

    increaseSetCount(name, increaseCount, e) {
        this.items = this.items.filter((item) => {
            if (item.name === name) {
                item.setCount += increaseCount;
                return item.setCount > 0; // keep only if count > 0
            }
            return true;
        });
    },

    done() {
        VibratorUtil.vibrateLong();
        Router.replace(
            {
                uri: 'pages/routine-name-keyboard/routine-name-keyboard',
                params: {
                    selectedMovements: JSON.stringify(this.getSelectedItems())
                }
            }
        );
    }
}