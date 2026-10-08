<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date'   => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $query = Order::with([
            'package',
            'user',
            'payments.documents',
        ]);

        if (!$request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        //for filters
         $query
        ->when($filters['start_date'] ?? null, fn ($q, $date) => $q->whereDate('date', '>=', $date))
        ->when($filters['end_date'] ?? null, fn ($q, $date) => $q->whereDate('date', '<=', $date));

        return response()->json(
            $query->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'location' => ['required', 'string'],
            'email' => ['required', 'email'],
            'detail' => ['nullable', 'string'],
            'package_id' => ['required', 'numeric'],
            'amount' => ['required', 'numeric', 'min:0'],
            'date' => ['required'],
            'status' => ['nullable']
        ]);

        $data['user_id'] = $request->user()?->id;

        $order = Order::create($data);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json(
            $order->load([
                'user',
                'payments.documents',
                'package'
            ])
        );
    }


    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:30'],
            'location' => ['sometimes', 'string'],
            'email' => ['sometimes', 'email'],
            'detail' => ['sometimes', 'string'],
            'package_id' => ['nullable', 'numeric'],
            'amount' => ['required', 'numeric', 'min:0'],
            'date' => ['required'],
            'status' => ['sometimes']
        ]);

        $order->update($data);

        return response()->json($order);
    }

    public function destroy(Request $request, Order $order)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Admins only can delete.');

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }
}