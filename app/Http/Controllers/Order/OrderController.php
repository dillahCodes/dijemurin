<?php

namespace App\Http\Controllers\Order;

use App\DTOs\Order\OrderFilterDTO;
use App\Enums\Order\OrderStatus;
use App\Enums\Payment\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\OrderStoreRequest;
use App\Http\Requests\Order\OrderUpdateRequest;
use App\Models\Order\Order;
use App\Services\Order\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\Printer;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterOrder = OrderFilterDTO::fromRequest($request);
        $orders = OrderService::getOrdersData($filterOrder);
        $filters = $filterOrder->toArray();

        $paymentMethodOptions = PaymentMethod::options();
        $orderStatusOptions = OrderStatus::options();

        $orderTransitionRules = OrderStatus::allowedTransitions();

        return Inertia::render('order/order', [
            'orderStatusOptions' => $orderStatusOptions,
            'paymentMethodOptions' => $paymentMethodOptions,
            'orderTransitionRules' => $orderTransitionRules,
            'filters' => $filters,
            'orders' => $orders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderStoreRequest $request)
    {
        $data = $request->validated();

        OrderService::createOrder($data);

        return redirect()->route('order.index')->with(['success' => 'Pesanan berhasil dibuat']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $orderDetail = OrderService::getOrderDetail($order);

        return Inertia::render('order/order-detail', [
            'detailOrder' => $orderDetail,
        ]);
    }

    /**
     * Print the specified resource.
     */
    public function print(Order $order)
    {
        $orderDetail = OrderService::getOrderDetail($order);

        return $orderDetail;

        // try {
        //     // "Eppos_Thermal" adalah nama printer Anda di sistem Linux/CUPS
        //     $connector = new CupsPrintConnector('Eppos_Thermal');
        //     $printer = new Printer($connector);

        //     // --- Mulai Desain Struk ---
        //     $printer->setJustification(Printer::JUSTIFY_CENTER);
        //     $printer->text("NAMA TOKO ANDA\n");
        //     $printer->text("Jl. Contoh Alamat No. 123\n");
        //     $printer->text("--------------------------------\n");

        //     $printer->setJustification(Printer::JUSTIFY_LEFT);
        //     $printer->text("Pesanan: ORD-J-20260406-4PQ\n");
        //     $printer->text("Pelanggan: Joko\n");
        //     $printer->text("--------------------------------\n");

        //     // Contoh item
        //     $printer->text("Cuci Sepatu Kulit       Rp 260.000\n");
        //     $printer->text("--------------------------------\n");
        //     $printer->text("TOTAL                   Rp 260.000\n");
        //     $printer->text("\n");

        //     $printer->setJustification(Printer::JUSTIFY_CENTER);
        //     $printer->text("Terima Kasih!\n");

        //     // Perintah potong kertas (jika printer support)
        //     $printer->cut();

        //     // Tutup koneksi
        //     $printer->close();

        //     return response()->json(['message' => 'Struk berhasil dicetak']);

        // } catch (\Exception $e) {
        //     return response()->json(['error' => $e->getMessage()], 500);
        // }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrderUpdateRequest $request, Order $order)
    {
        $data = $request->validated();

        OrderService::updateOrder($data, $order);

        return redirect()->back()->with(['success' => 'Pesanan berhasil diupdate']);
    }
}
