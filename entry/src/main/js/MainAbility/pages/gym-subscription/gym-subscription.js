import Router from '@system.router';

export default {
    data: {
        status: '',
        daysLeft: '',
        expiresAt: ''
    },

    onInit() {
        // Mock expiry date
        const expiryYear = 2026;
        const expiryMonth = 7;
        const expiryDay = 25;
        const expiry = new Date(expiryYear, expiryMonth, expiryDay);
        const now = new Date();
        const diffMs = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            this.status = 'Active';
            this.daysLeft = diffDays.toString();
        } else {
            this.status = 'Expired';
            this.daysLeft = 0;
        }

        const pad = function (n) {
            return n < 10 ? `0${n}` : `${n}`
        };
        this.expiresAt = `${pad(expiryDay)}/${pad(expiryMonth + 1)}/${expiryYear}`;
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            Router.replace({
                uri: 'pages/index/index',
                params: {
                    index: 2
                }
            });
        }
    }
};
