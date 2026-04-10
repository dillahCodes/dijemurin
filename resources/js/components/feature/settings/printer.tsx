import { ConnectedPrinter } from './connected-printer';
import { ConnectionType } from './connection-type';

export function PrinterSetting() {
    return (
        <div className="flex flex-col gap-4">
            <ConnectionType />
            <ConnectedPrinter />
        </div>
    );
}
