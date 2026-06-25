export const EscPosStyling = {
    align: {
        left: new Uint8Array([0x1b, 0x61, 0x00]),
        center: new Uint8Array([0x1b, 0x61, 0x01]),
        right: new Uint8Array([0x1b, 0x61, 0x02]),
    },

    bold: {
        on: new Uint8Array([0x1b, 0x45, 0x01]),
        off: new Uint8Array([0x1b, 0x45, 0x00]),
    },

    size: {
        normal: new Uint8Array([0x1d, 0x21, 0x00]),
        double: new Uint8Array([0x1d, 0x21, 0x11]),
        h1: new Uint8Array([0x1d, 0x21, 0x11]), // Double height & width
        h2: new Uint8Array([0x1d, 0x21, 0x01]), // Double height
        h3: new Uint8Array([0x1d, 0x21, 0x10]), // Double width
    },

    line(width: number = 32): Uint8Array {
        return new TextEncoder().encode('-'.repeat(width) + '\n');
    },

    text(value: string): Uint8Array {
        return new TextEncoder().encode(value);
    },

    formatRupiah(amount: number): string {
        return 'Rp ' + amount.toLocaleString('id-ID');
    },

    createJustifiedRow(leftText: string, rightText: string, width: number): string {
        const availableSpace = width - leftText.length - rightText.length;

        if (availableSpace > 0) {
            return `${leftText}${' '.repeat(availableSpace)}${rightText}`;
        }

        const rightAligned = `${' '.repeat(Math.max(0, width - rightText.length))}${rightText}`;

        return `${leftText}\n${rightAligned}`;
    },

    summaryLine(label: string, amount: number, width: number = 32): Uint8Array {
        const formattedAmount = this.formatRupiah(amount);
        const rowString = this.createJustifiedRow(label, formattedAmount, width);

        return this.text(`${rowString}\n`);
    },

    itemLine(name: string, qty: number | string, price: number, width: number = 32): Uint8Array {
        const formattedPrice = this.formatRupiah(price);
        const qtyLabel = `(${qty})`;
        const detailsRow = this.createJustifiedRow(qtyLabel, formattedPrice, width);

        return this.text(`${name}\n${detailsRow}\n`);
    },

    legacyItemLine(name: string, qty: number | string | null, price: number, width: number = 32): Uint8Array {
        if (!qty) {
            return this.summaryLine(name, price, width);
        }

        return this.itemLine(name, qty, price, width);
    },
};
