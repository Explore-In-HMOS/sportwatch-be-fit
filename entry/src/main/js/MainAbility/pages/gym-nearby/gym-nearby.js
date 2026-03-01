import Router from '@system.router';

export default {
    data: {
        items: []
    },

    onInit() {
        this.items = [
            {
                id: 1,
                name: 'BeFit Atasehir',
                distance: '1.2 km',
                area: 'Atasehir, Istanbul'
            },
            {
                id: 2,
                name: 'BeFit Kadikoy',
                distance: '3.8 km',
                area: 'Kadikoy, Istanbul'
            },
            {
                id: 3,
                name: 'BeFit Maltepe',
                distance: '6.4 km',
                area: 'Maltepe, Istanbul'
            }
        ];
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
