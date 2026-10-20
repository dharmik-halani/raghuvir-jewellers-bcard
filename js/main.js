(function () {
    'use strict';

    // ---- Contact data (single source of truth) ----
    var CARD = {
        name: 'Raghuvir Jewellers',
        phones: [
            { label: 'Darshan Halani', tel: '+919426622691', type: 'WORK,VOICE' },
            { label: 'Dharmik Halani', tel: '+917096222691', type: 'CELL,VOICE' }
        ],
        email: 'raghuvirjew@gmail.com',
        address: 'Hiravan Complex, Viththal Press Road, Surendranagar, Gujarat 363001',
        url: 'https://dharmik-halani.github.io/raghuvir-jewellers-bcard/'
    };

    var toastEl = document.getElementById('toast');
    var toastTimer;

    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
    }

    // ---- Save contact (.vcf) ----
    function saveContact() {
        var lines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'FN:' + CARD.name,
            'ORG:' + CARD.name
        ];
        CARD.phones.forEach(function (p) {
            lines.push('TEL;TYPE=' + p.type + ':' + p.tel);
        });
        lines.push('EMAIL:' + CARD.email);
        lines.push('ADR;TYPE=WORK:;;' + CARD.address.replace(/,/g, '\\,') + ';;;;');
        lines.push('URL:' + CARD.url);
        lines.push('END:VCARD');

        var blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'raghuvir_jewellers.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        toast('Contact file downloaded');
    }

    // ---- Share (native sheet, else copy-link dialog) ----
    function share() {
        if (navigator.share) {
            navigator.share({
                title: CARD.name,
                text: CARD.name + ' - Where Purity Sparkles with Trust & Service',
                url: CARD.url
            }).catch(function () { /* user cancelled */ });
        } else {
            document.getElementById('share-dialog').showModal();
        }
    }

    function copyLink() {
        var input = document.getElementById('share-link');
        var done = function () { toast('Link copied'); };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(CARD.url).then(done, function () {
                input.select();
                document.execCommand('copy');
                done();
            });
        } else {
            input.select();
            document.execCommand('copy');
            done();
        }
    }

    var actions = {
        save: saveContact,
        qr: function () { document.getElementById('qr-dialog').showModal(); },
        share: share,
        copy: copyLink
    };

    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-action]');
        if (el && actions[el.dataset.action]) {
            actions[el.dataset.action]();
            return;
        }
        // Click on a dialog backdrop closes it
        if (e.target.tagName === 'DIALOG') e.target.close();
    });

    document.getElementById('year').textContent = new Date().getFullYear();
})();
