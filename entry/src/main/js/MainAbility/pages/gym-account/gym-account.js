import Router from '@system.router';

export default {
    data: {
        firstName: 'George',
        lastName: 'Michael',
        weightDisplay: '79 kg',
        heightDisplay: '188 cm'
    },

    goBack() {
        Router.replace({
            uri: 'pages/index/index',
            params: {
                index: 2
            }
        });
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            this.goBack();
        }
    }
};
