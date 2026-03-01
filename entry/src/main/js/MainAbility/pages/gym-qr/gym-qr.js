import Router from '@system.router';

export default {
    data: {
        qrColor: '#64FF64',
        qrBackground: '#0c0c0c',
        qrValue: 'BEFIT-ENTRY-0001'
    },

    cycleQr() {
        const nextId = Math.floor(Math.random() * 9000) + 1000;
        this.qrValue = 'BEFIT-ENTRY-'.concat(nextId);
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
