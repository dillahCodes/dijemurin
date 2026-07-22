import { Activity } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { OrderDetail } from '@/types/feature/order/order';

interface OrderItemsProps {
    items: OrderDetail['order_items'];
}

export function OrderItems({ items }: OrderItemsProps) {
    return (
        <Card className="pt-0">
            <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-base font-semibold">Daftar Item</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Item</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Kuantitas</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <Activity mode={!items.length ? 'visible' : 'hidden'}>
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Tidak ada item
                                </TableCell>
                            </TableRow>
                        </Activity>
                        <Activity mode={items.length ? 'visible' : 'hidden'}>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.item_name}</TableCell>
                                    <TableCell>Rp {item.item_price.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell className="text-right">Rp {item.subtotal.toLocaleString('id-ID')}</TableCell>
                                </TableRow>
                            ))}
                        </Activity>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
